import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { jsonResponse } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import { AIConversation } from "@/models/AIConversation";
import { VIX_SYSTEM_PROMPT, OPENING_MESSAGE, type AIResponse } from "@/lib/aiPrompt";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    const body = await request.json();
    const { sessionId, userMessage, conversationHistory = [], collectedData = {} } = body;

    if (!sessionId) return jsonResponse({ error: "sessionId required" }, 400);

    // Opening message — no API call needed
    if (!userMessage) {
      return jsonResponse({ ...OPENING_MESSAGE, sessionId });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    let aiResponse: AIResponse;

    if (!apiKey) {
      // Graceful fallback when API key not configured
      aiResponse = getFallbackResponse(userMessage, collectedData, conversationHistory.length);
    } else {
      const client = new Anthropic({ apiKey });

      const messages: Anthropic.MessageParam[] = [
        ...conversationHistory.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        {
          role: "user",
          content: `User said: "${userMessage}"\n\nCollected data so far: ${JSON.stringify(collectedData)}\n\nRespond naturally and update the collectedData with any new information from the user's message.`,
        },
      ];

      const response = await client.messages.create({
        model:      "claude-sonnet-4-5",
        max_tokens: 1024,
        system:     VIX_SYSTEM_PROMPT,
        messages,
      });

      const rawText = response.content[0].type === "text" ? response.content[0].text : "";

      try {
        aiResponse = JSON.parse(rawText) as AIResponse;
      } catch {
        // If JSON parse fails, wrap in a message
        aiResponse = {
          message:       rawText,
          collectedData: collectedData as AIResponse["collectedData"],
          isComplete:    false,
        };
      }
    }

    // Persist to DB
    try {
      await connectDB();
      await AIConversation.findOneAndUpdate(
        { sessionId },
        {
          $setOnInsert: { clientId: payload.userId, sessionId },
          $push: {
            messages: [
              { role: "user",      content: userMessage,          timestamp: new Date() },
              { role: "assistant", content: aiResponse.message,   timestamp: new Date() },
            ],
          },
          $set: {
            collectedData: aiResponse.collectedData,
            isComplete:    aiResponse.isComplete ?? false,
          },
        },
        { upsert: true }
      );
    } catch (dbErr) {
      console.error("[ai/consult] DB error:", dbErr);
    }

    return jsonResponse({ ...aiResponse, sessionId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/consult]", msg);
    return jsonResponse({ error: "AI service unavailable. Please try again." }, 500);
  }
}

function getFallbackResponse(
  userMessage: string,
  collectedData: Record<string, unknown>,
  msgCount: number
): AIResponse {
  const step = getNextStep(collectedData, msgCount);

  const responses: Record<string, AIResponse> = {
    project_type: {
      message: "Love it! Tell me more about it. What should it do? Who will be using it? Don't worry about being technical — just describe it like you'd explain it to a friend.",
      collectedData: { ...collectedData as AIResponse["collectedData"], projectType: userMessage },
      currentStep: "description",
      isComplete: false,
    },
    description: {
      message: "Great overview! Based on what you've told me, here are some features that would make sense for your project. Pick the ones you need:",
      collectedData: { ...collectedData as AIResponse["collectedData"], description: userMessage },
      showCheckboxes: ["User Login & Accounts", "Payment Gateway", "Admin Dashboard", "Blog / CMS", "WhatsApp Integration", "SEO Optimization", "Mobile Responsive", "Analytics & Reports", "Contact Forms", "Multi-language"],
      currentStep: "features",
      isComplete: false,
    },
    features: {
      message: "Nice choices! Now — what vibe are you going for? What kind of look and feel do you want?",
      collectedData: { ...collectedData as AIResponse["collectedData"], features: [userMessage] },
      showChips: ["🎨 Modern & Minimal", "🌟 Bold & Colorful", "💼 Corporate / Professional", "🛍️ E-commerce Feel", "🎮 Fun & Playful", "💻 Tech / Startup"],
      currentStep: "design",
      isComplete: false,
    },
    design: {
      message: "Perfect choice! Now let's talk budget. What range works for you?",
      collectedData: { ...collectedData as AIResponse["collectedData"], designStyle: userMessage },
      showChips: ["₹5,000 - ₹15,000", "₹15,000 - ₹35,000", "₹35,000 - ₹75,000", "₹75,000+"],
      currentStep: "budget",
      isComplete: false,
    },
    budget: {
      message: "Sounds good! When do you need this ready?",
      collectedData: { ...collectedData as AIResponse["collectedData"], budget: userMessage },
      showChips: ["ASAP (Rush)", "2-4 Weeks", "1-2 Months", "Flexible / No Rush"],
      currentStep: "timeline",
      isComplete: false,
    },
    timeline: {
      message: "Almost done! Any websites you love the look of? Share links or names — totally optional but super helpful for our designers.",
      collectedData: { ...collectedData as AIResponse["collectedData"], timeline: userMessage },
      currentStep: "references",
      isComplete: false,
    },
    references: {
      message: buildSummaryMessage({ ...collectedData as AIResponse["collectedData"], references: [userMessage] }),
      collectedData: { ...collectedData as AIResponse["collectedData"], references: [userMessage] },
      showChips: ["Edit Something", "Looks Perfect! Proceed →"],
      currentStep: "summary",
      isComplete: false,
    },
    summary: {
      message: "Awesome! Your project brief is ready. Click 'Place Order' to confirm your slot with our team — we'll review it and get back to you within 24 hours! 🚀",
      collectedData: collectedData as AIResponse["collectedData"],
      isComplete: true,
    },
  };

  return responses[step] ?? responses["project_type"];
}

function getNextStep(data: Record<string, unknown>, msgCount: number): string {
  if (!data.projectType) return "project_type";
  if (!data.description)  return "description";
  if (!data.features || (data.features as string[]).length === 0) return "features";
  if (!data.designStyle)  return "design";
  if (!data.budget)       return "budget";
  if (!data.timeline)     return "timeline";
  if (msgCount < 8)       return "references";
  return "summary";
}

function buildSummaryMessage(data: Partial<AIResponse["collectedData"]>): string {
  return `Perfect! Here's your project summary:\n\n📋 **Project:** ${data.projectType ?? "—"}\n✨ **Key Features:** ${(data.features ?? []).join(", ") || "—"}\n🎨 **Design Style:** ${data.designStyle ?? "—"}\n💰 **Budget:** ${data.budget ?? "—"}\n⏰ **Timeline:** ${data.timeline ?? "—"}\n\nDoes this look right? I can adjust anything before you place the order!`;
}
