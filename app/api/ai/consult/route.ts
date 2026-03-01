import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { jsonResponse } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import { AIConversation } from "@/models/AIConversation";
import {
  VIX_SYSTEM_PROMPT,
  OPENING_MESSAGE,
  type AIResponse,
  type ProjectCategory,
  detectCategory,
  getBudgetAdvice,
  FEATURES_BY_CATEGORY,
  DESIGN_BY_CATEGORY,
} from "@/lib/aiPrompt";
import { verifyAccessToken } from "@/lib/jwt";

// Strip leading emoji from chip labels like "📚 Educational / Coaching" → "Educational / Coaching"
function stripEmoji(text: string): string {
  // Walk chars and find where real text starts (skip surrogate pairs and spaces)
  let i = 0;
  while (i < text.length) {
    const code = text.charCodeAt(i);
    // Surrogate pair (emoji) or variation selector or space
    if ((code >= 0xD800 && code <= 0xDFFF) || code === 0xFE0F || code === 0x20) {
      i++;
    } else if (code <= 0x7F && !/[a-zA-Z0-9(₹]/.test(text[i])) {
      // ASCII non-alphanumeric (punctuation, symbols) at start
      i++;
    } else {
      break;
    }
  }
  const result = text.slice(i).trim();
  return result || text.trim();
}

// ── Main handler ──────────────────────────────────────────────────

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

    if (apiKey) {
      aiResponse = await callClaude(apiKey, userMessage, conversationHistory, collectedData);
    } else {
      aiResponse = getSmartFallback(userMessage, collectedData as AIResponse["collectedData"], conversationHistory.length);
    }

    // Merge existing collectedData to avoid losing already-gathered info
    aiResponse.collectedData = { ...collectedData, ...aiResponse.collectedData };

    // Persist to DB
    try {
      await connectDB();
      await AIConversation.findOneAndUpdate(
        { sessionId },
        {
          $setOnInsert: { clientId: payload.userId, sessionId },
          $push: {
            messages: [
              { role: "user",      content: userMessage,        timestamp: new Date() },
              { role: "assistant", content: aiResponse.message, timestamp: new Date() },
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

// ── Claude API call ───────────────────────────────────────────────

async function callClaude(
  apiKey: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  collectedData: Record<string, unknown>
): Promise<AIResponse> {
  try {
    const client = new Anthropic({ apiKey });

    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      {
        role: "user",
        content: [
          `User message: "${userMessage}"`,
          ``,
          `Collected data so far: ${JSON.stringify(collectedData, null, 2)}`,
          ``,
          `IMPORTANT INSTRUCTIONS:`,
          `1. Determine what step we're on based on collectedData`,
          `2. Update collectedData with new info from this message`,
          `3. If we're on the features step, analyze the projectType and description to suggest ONLY RELEVANT features`,
          `4. Return ONLY valid JSON as per the format — no extra text`,
        ].join("\n"),
      },
    ];

    const response = await client.messages.create({
      model:      "claude-sonnet-4-5",
      max_tokens: 1024,
      system:     VIX_SYSTEM_PROMPT,
      messages,
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text.trim() : "";

    // Strip markdown code blocks if Claude returns them
    const cleaned = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

    const parsed = JSON.parse(cleaned) as AIResponse;

    // Safety: merge collectedData
    parsed.collectedData = { ...collectedData as AIResponse["collectedData"], ...parsed.collectedData };

    return parsed;
  } catch (e) {
    console.error("[Claude error]", e);
    // Fall back to smart fallback if Claude fails
    return getSmartFallback(userMessage, collectedData as AIResponse["collectedData"], 0);
  }
}

// ── Smart context-aware fallback (no API key) ─────────────────────

function getSmartFallback(
  userMessage: string,
  collectedData: AIResponse["collectedData"],
  historyLen: number,
): AIResponse {
  const step = getCurrentStep(collectedData);

  switch (step) {

    // ── Step 1: Collect project type ──────────────────────────────
    case "project_type": {
      // Strip leading emoji (if user clicked a chip like "📚 Educational / Coaching")
      const cleaned = stripEmoji(userMessage);
      return {
        message: `Got it — ${cleaned}! 🙌\n\nTell me a bit more about it. What should it do? Who will be using it? Don't worry about technical details — just describe it in plain language, like you're explaining it to a friend.`,
        collectedData: { ...collectedData, projectType: cleaned },
        currentStep: "description",
        isComplete: false,
      };
    }

    // ── Step 2: Collect description → suggest relevant features ───
    case "description": {
      const projectContext = `${collectedData.projectType ?? ""} ${userMessage}`;
      const category       = detectCategory(projectContext);
      const features       = FEATURES_BY_CATEGORY[category] ?? FEATURES_BY_CATEGORY.other;
      const topFeatures    = features.slice(0, Math.min(10, features.length));

      const categoryMessages: Record<ProjectCategory, string> = {
        educational: `Nice! An educational platform — great idea! 📚\n\nBased on what you've described, here are features that make sense for this type of project. Pick the ones you need:`,
        ecommerce:   `An online store — exciting! 🛍️\n\nHere are features that work best for e-commerce. Pick what fits your store:`,
        restaurant:  `A restaurant website — sounds delicious! 🍽️\n\nHere are the most useful features for restaurants and food businesses:`,
        medical:     `A healthcare website — very important work! 🏥\n\nHere are features that work best for medical/health projects:`,
        portfolio:   `A personal portfolio — let's make you shine! ✨\n\nHere are features that make portfolios stand out. Pick what you need:`,
        real_estate: `Real estate — great market! 🏠\n\nHere are features that work best for property platforms:`,
        saas:        `A web app / SaaS platform — interesting! 💻\n\nHere are features that most web apps need. Pick what applies:`,
        business:    `A business website — perfect for getting found online! 🏢\n\nHere are features that work great for businesses:`,
        blog:        `A blog / content site — great for building an audience! 📰\n\nHere are features that make blogs successful:`,
        ngo:         `An NGO / charity website — wonderful cause! 💚\n\nHere are features that work great for non-profits:`,
        event:       `An event website — sounds exciting! 🎉\n\nHere are features for event and booking sites:`,
        travel:      `A travel website — love it! ✈️\n\nHere are features that work great for travel & tourism:`,
        fitness:     `A fitness website — let's get moving! 💪\n\nHere are features for gym and fitness businesses:`,
        other:       `Interesting project! 🙌\n\nHere are some features that might be useful. Pick what fits your needs:`,
      };

      return {
        message: categoryMessages[category] ?? categoryMessages.other,
        collectedData: { ...collectedData, description: userMessage },
        showCheckboxes: topFeatures,
        currentStep: "features",
        isComplete: false,
      };
    }

    // ── Step 3: Features selected → ask design ───────────────────
    case "features": {
      const projectContext = `${collectedData.projectType ?? ""} ${collectedData.description ?? ""}`;
      const category       = detectCategory(projectContext);
      const designOptions  = DESIGN_BY_CATEGORY[category] ?? DESIGN_BY_CATEGORY.other;

      const featureList = userMessage.includes(",")
        ? userMessage.split(",").map(f => f.trim()).filter(Boolean)
        : [userMessage];

      return {
        message: `Great picks! 👍 Those features will make your project really useful.\n\nNow — what kind of look and feel do you want? What vibe should your ${collectedData.projectType ?? "website"} have?`,
        collectedData: { ...collectedData, features: featureList },
        showChips: designOptions,
        currentStep: "design",
        isComplete: false,
      };
    }

    // ── Step 4: Design → ask budget ───────────────────────────────
    case "design": {
      return {
        message: `Love that style! ✨ That'll look really sharp.\n\nNow let's talk budget — what range works for you? Be honest, and I'll tell you exactly what we can build!`,
        collectedData: { ...collectedData, designStyle: userMessage },
        showChips: ["₹5,000 – ₹15,000", "₹15,000 – ₹35,000", "₹35,000 – ₹75,000", "₹75,000+"],
        currentStep: "budget",
        isComplete: false,
      };
    }

    // ── Step 5: Budget → give advice + ask timeline ───────────────
    case "budget": {
      const projectContext = `${collectedData.projectType ?? ""} ${collectedData.description ?? ""}`;
      const category       = detectCategory(projectContext);
      const advice         = getBudgetAdvice(userMessage, category);

      return {
        message: `${advice}\n\nWhen do you need this ready?`,
        collectedData: { ...collectedData, budget: userMessage },
        showChips: ["ASAP (Rush — within 1 week)", "2–4 Weeks", "1–2 Months", "Flexible / No Rush"],
        currentStep: "timeline",
        isComplete: false,
      };
    }

    // ── Step 6: Timeline → ask references ────────────────────────
    case "timeline": {
      return {
        message: `Perfect! We'll plan accordingly. ⏰\n\nAlmost done — any websites you've seen and liked the look of? Share a link or name — totally optional but it really helps our designers!`,
        collectedData: { ...collectedData, timeline: userMessage },
        showChips: ["Skip this step"],
        currentStep: "references",
        isComplete: false,
      };
    }

    // ── Step 7: References → show summary ────────────────────────
    case "references": {
      const refs = userMessage.toLowerCase() === "skip this step" || userMessage.toLowerCase() === "skip"
        ? []
        : [userMessage];

      const updatedData: AIResponse["collectedData"] = { ...collectedData, references: refs };
      const summary = buildSummary(updatedData);

      return {
        message: summary,
        collectedData: updatedData,
        showChips: ["✏️ Edit Something", "✅ Looks Perfect! Proceed →"],
        currentStep: "summary",
        isComplete: false,
      };
    }

    // ── Step 8: Summary confirmation → complete ───────────────────
    case "summary": {
      if (userMessage.includes("Edit") || userMessage.toLowerCase().includes("change") || userMessage.toLowerCase().includes("edit")) {
        return {
          message: "Sure! What would you like to change? You can tell me — like 'Change budget to ₹50,000' or 'Add video lessons feature' — I'll update your summary.",
          collectedData,
          currentStep: "summary",
          isComplete: false,
        };
      }

      return {
        message: `Your project brief is all set! 🚀\n\nOur team will review it and get in touch within 24 hours with a detailed quote and plan. Ready to confirm your slot?`,
        collectedData,
        currentStep: "done",
        isComplete: true,
      };
    }

    // ── Edit during summary ───────────────────────────────────────
    case "done": {
      return {
        message: `Your order is ready to place! 🎯 Click the "Place Order" button below to confirm your project slot with our team.`,
        collectedData,
        currentStep: "done",
        isComplete: true,
      };
    }

    default: {
      return {
        message: "I didn't quite get that — could you rephrase? Or if you're ready, click 'Place Order' to proceed! 😊",
        collectedData,
        isComplete: false,
      };
    }
  }
}

// ── Determine current step from collectedData ─────────────────────

function getCurrentStep(data: AIResponse["collectedData"]): string {
  if (!data.projectType) return "project_type";
  if (!data.description)  return "description";
  if (!data.features || data.features.length === 0) return "features";
  if (!data.designStyle)  return "design";
  if (!data.budget)       return "budget";
  if (!data.timeline)     return "timeline";
  if (!("references" in data)) return "references";
  if (!data.description?.includes("__done__")) return "summary";
  return "done";
}

// ── Summary builder ───────────────────────────────────────────────

function buildSummary(data: AIResponse["collectedData"]): string {
  const features = (data.features ?? []).slice(0, 6);
  const refs     = (data.references ?? []).filter(r => r && r !== "skip");

  return [
    `Here's your complete project brief — looks great! 🎉`,
    ``,
    `📋 **Project Type:** ${data.projectType ?? "—"}`,
    `📝 **Description:** ${(data.description ?? "—").slice(0, 120)}${(data.description?.length ?? 0) > 120 ? "…" : ""}`,
    `✨ **Key Features:** ${features.length > 0 ? features.join(", ") : "—"}`,
    `🎨 **Design Style:** ${data.designStyle ?? "—"}`,
    `💰 **Budget:** ${data.budget ?? "—"}`,
    `⏰ **Timeline:** ${data.timeline ?? "—"}`,
    refs.length > 0 ? `🔗 **References:** ${refs.join(", ")}` : null,
    ``,
    `Does everything look right? You can edit anything or proceed to place your order!`,
  ].filter(Boolean).join("\n");
}
