import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { jsonResponse } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import { AIConversation } from "@/models/AIConversation";
import {
  VIX_SYSTEM_PROMPT, OPENING_MESSAGE,
  type AIResponse, type ProjectCategory,
  detectCategory, getBudgetAdvice, extractContext,
  FEATURES, DESIGNS,
} from "@/lib/aiPrompt";
import { verifyAccessToken } from "@/lib/jwt";

// ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    const body = await request.json();
    const { sessionId, userMessage, conversationHistory = [], collectedData = {} } = body;
    if (!sessionId) return jsonResponse({ error: "sessionId required" }, 400);

    if (!userMessage) return jsonResponse({ ...OPENING_MESSAGE, sessionId });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    let aiResponse: AIResponse;

    if (apiKey) {
      aiResponse = await callClaude(apiKey, userMessage, conversationHistory, collectedData);
    } else {
      aiResponse = smartFallback(userMessage, collectedData as AIResponse["collectedData"], conversationHistory.length);
    }

    // Always carry forward previously collected data
    aiResponse.collectedData = { ...(collectedData as AIResponse["collectedData"]), ...aiResponse.collectedData };

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
          $set: { collectedData: aiResponse.collectedData, isComplete: aiResponse.isComplete ?? false },
        },
        { upsert: true }
      );
    } catch (e) { console.error("[ai/consult] DB:", e); }

    return jsonResponse({ ...aiResponse, sessionId });
  } catch (e) {
    console.error("[ai/consult]", e);
    return jsonResponse({ error: "AI service unavailable." }, 500);
  }
}

// ─────────────────────────────────────────────────────────────────
// CLAUDE CALL
// ─────────────────────────────────────────────────────────────────

async function callClaude(
  apiKey: string,
  userMessage: string,
  history: Array<{ role: string; content: string }>,
  collectedData: Record<string, unknown>
): Promise<AIResponse> {
  try {
    const client = new Anthropic({ apiKey });

    const messages: Anthropic.MessageParam[] = [
      ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      {
        role: "user",
        content: `User message: "${userMessage}"\n\nCurrent collected data: ${JSON.stringify(collectedData, null, 2)}\n\nInstructions:\n1. Detect what step we're on from collectedData\n2. Process user's message intelligently\n3. If features step: suggest ONLY domain-relevant features for their project type\n4. Return ONLY valid JSON per format`,
      },
    ];

    const resp = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: VIX_SYSTEM_PROMPT,
      messages,
    });

    const raw = resp.content[0].type === "text" ? resp.content[0].text.trim() : "";
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed  = JSON.parse(cleaned) as AIResponse;
    parsed.collectedData = { ...collectedData as AIResponse["collectedData"], ...parsed.collectedData };
    return parsed;
  } catch (e) {
    console.error("[Claude error, using fallback]", e);
    return smartFallback(userMessage, collectedData as AIResponse["collectedData"], history.length);
  }
}

// ─────────────────────────────────────────────────────────────────
// INTELLIGENT FALLBACK ENGINE
// ─────────────────────────────────────────────────────────────────

function smartFallback(
  userMessage: string,
  data: AIResponse["collectedData"],
  historyLen: number
): AIResponse {
  const step = getStep(data, historyLen);

  switch (step) {

    // ── PROJECT TYPE ────────────────────────────────────────────
    case "project_type": {
      const raw = cleanChipLabel(userMessage);
      const cat = detectCategory(`${raw} ${userMessage}`);
      const catPerson = getCategoryAudience(cat);
      return {
        message: buildDescriptionPrompt(raw, cat, catPerson),
        collectedData: { ...data, projectType: raw },
        currentStep: "description",
        isComplete: false,
      };
    }

    // ── DESCRIPTION → Smart acknowledgment + relevant features ──
    case "description": {
      const combinedText = `${data.projectType ?? ""} ${userMessage}`;
      const cat          = detectCategory(combinedText);
      const ctx          = extractContext(userMessage, data.projectType);
      const features     = getTopFeatures(cat, userMessage, 10);
      const ack          = buildSmartAck(userMessage, data.projectType ?? "", ctx, cat);

      return {
        message: ack,
        collectedData: { ...data, description: userMessage },
        showCheckboxes: features,
        currentStep: "features",
        isComplete: false,
      };
    }

    // ── FEATURES → Acknowledge + design ─────────────────────────
    case "features": {
      const combinedText  = `${data.projectType ?? ""} ${data.description ?? ""}`;
      const cat           = detectCategory(combinedText);
      const featureList   = parseFeatureList(userMessage);
      const designs       = DESIGNS[cat] ?? DESIGNS.other;
      const projectLabel  = data.projectType ?? "project";

      return {
        message: buildFeatureAck(featureList, projectLabel, cat),
        collectedData: { ...data, features: featureList },
        showChips: designs,
        currentStep: "design",
        isComplete: false,
      };
    }

    // ── DESIGN ───────────────────────────────────────────────────
    case "design": {
      return {
        message: `${getDesignAck(userMessage)} Now let's talk budget — what range works for you?`,
        collectedData: { ...data, designStyle: userMessage },
        showChips: ["₹5,000 – ₹15,000", "₹15,000 – ₹35,000", "₹35,000 – ₹75,000", "₹75,000+"],
        currentStep: "budget",
        isComplete: false,
      };
    }

    // ── BUDGET ───────────────────────────────────────────────────
    case "budget": {
      const combinedText = `${data.projectType ?? ""} ${data.description ?? ""}`;
      const cat          = detectCategory(combinedText);
      const advice       = getBudgetAdvice(userMessage, cat);
      return {
        message: `${advice}\n\nWhen do you need this ready?`,
        collectedData: { ...data, budget: userMessage },
        showChips: ["ASAP (Rush — within 1 week)", "2–4 Weeks", "1–2 Months", "Flexible / No Rush"],
        currentStep: "timeline",
        isComplete: false,
      };
    }

    // ── TIMELINE ─────────────────────────────────────────────────
    case "timeline": {
      return {
        message: `Got it — ${userMessage.toLowerCase()} ⏰\n\nOne last thing — any website you've seen and liked the design of? Sharing a name or link really helps our designers. (Optional!)`,
        collectedData: { ...data, timeline: userMessage },
        showChips: ["Skip — no reference"],
        currentStep: "references",
        isComplete: false,
      };
    }

    // ── REFERENCES ───────────────────────────────────────────────
    case "references": {
      const refs = isSkip(userMessage) ? [] : [userMessage];
      const updated: AIResponse["collectedData"] = { ...data, references: refs };
      return {
        message: buildSummary(updated),
        collectedData: updated,
        showChips: ["✏️ Edit Something", "✅ Looks Perfect! Proceed →"],
        currentStep: "summary",
        isComplete: false,
      };
    }

    // ── SUMMARY ──────────────────────────────────────────────────
    case "summary": {
      if (isEditRequest(userMessage)) {
        return {
          message: "Sure! Just tell me what you'd like to change — like \"change budget to ₹50,000\" or \"add payment gateway feature\". I'll update your brief.",
          collectedData: data,
          currentStep: "summary",
          isComplete: false,
        };
      }
      return {
        message: `Your project brief is locked in! 🎯\n\nOur team will review it and get back to you within 24 hours with a detailed plan and quote. Ready to confirm your slot?`,
        collectedData: data,
        currentStep: "done",
        isComplete: true,
      };
    }

    default:
      return {
        message: "Your brief is ready! Click \"Place Order\" to confirm your project slot. 🚀",
        collectedData: data,
        isComplete: true,
      };
  }
}

// ─────────────────────────────────────────────────────────────────
// STEP DETECTION
// ─────────────────────────────────────────────────────────────────

function getStep(data: AIResponse["collectedData"], historyLen: number): string {
  if (!data.projectType)                              return "project_type";
  if (!data.description)                              return "description";
  if (!data.features || data.features.length === 0)  return "features";
  if (!data.designStyle)                              return "design";
  if (!data.budget)                                   return "budget";
  if (!data.timeline)                                 return "timeline";
  if (!("references" in data))                        return "references";
  return "summary";
}

// ─────────────────────────────────────────────────────────────────
// INTELLIGENT MESSAGE BUILDERS
// ─────────────────────────────────────────────────────────────────

function buildDescriptionPrompt(projectType: string, cat: ProjectCategory, audience: string): string {
  const prompts: Partial<Record<ProjectCategory, string>> = {
    educational: `A ${projectType} — great! 📚 Tell me more about it — like, who are your students? What subjects or courses will you offer? Will there be live classes or pre-recorded videos?`,
    ecommerce:   `An online store — nice! 🛍️ What kind of products will you sell? And who's your target customer? Knowing this helps us build the right shopping experience.`,
    restaurant:  `A restaurant website — sounds delicious! 🍽️ Tell me about your restaurant — what type of food, where you're located, and what you mainly want the website to do (orders, reservations, just menu)?`,
    medical:     `A healthcare website — important work! 🏥 Tell me more — is this for a clinic, hospital, or individual doctor? What's the main goal — appointment booking, information, or something else?`,
    portfolio:   `A personal portfolio — let's make you stand out! ✨ What kind of work do you want to showcase? And what's your goal — getting freelance clients, a job, or just an online presence?`,
    real_estate: `Real estate — big opportunity! 🏠 Tell me about it — is this for selling your own properties, or a platform for multiple agents/builders? What area/city are you targeting?`,
    saas:        `A web app — exciting! 💻 Tell me more about what it does. What problem does it solve? Who will be using it daily? Even rough ideas are totally fine!`,
    business:    `A business website — let's get you found online! 🏢 Tell me about your business — what services do you offer? Who are your clients? What do you want visitors to do on the site?`,
    fitness:     `A fitness website — love the energy! 💪 Tell me about your gym/studio — do you have multiple branches? What services (gym, yoga, personal training)? Any existing members to migrate?`,
    travel:      `A travel website — exciting! ✈️ Tell me more — are you a tour operator, travel agent, or building a booking platform? What destinations or packages are you focusing on?`,
    ngo:         `An NGO website — wonderful! 💚 Tell me about your organization — what cause do you work for? Do you need online donations? Any ongoing campaigns?`,
  };
  return prompts[cat] ?? `Got it — a ${projectType}! Tell me more about it. What should it do, and who will be using it? Just describe it naturally.`;
}

function buildSmartAck(
  desc: string,
  projectType: string,
  ctx: ReturnType<typeof extractContext>,
  cat: ProjectCategory
): string {
  const lower = desc.toLowerCase();

  // Build a specific acknowledgment based on what they actually said
  const parts: string[] = [];

  // Opening based on category + what they said
  const openers: Partial<Record<ProjectCategory, string>> = {
    educational: "Sounds like a great learning platform!",
    ecommerce:   "A solid e-commerce setup!",
    restaurant:  "A proper restaurant solution!",
    medical:     "Got it — a complete healthcare platform!",
    real_estate: "A full real estate platform!",
    saas:        "Interesting — a custom web application!",
    fitness:     "A complete fitness hub!",
    travel:      "An exciting travel platform!",
  };
  parts.push(openers[cat] ?? "Got it — I have a good picture of your project!");

  // Reference specific things they mentioned
  if (ctx.audience) parts.push(`Built for ${ctx.audience} — perfect.`);
  if (lower.includes("certif"))   parts.push("Certificates definitely make sense here.");
  if (lower.includes("payment") || lower.includes("razorpay") || lower.includes("upi")) {
    parts.push("Payments are on the list.");
  }
  if (lower.includes("mobile") || lower.includes("phone")) {
    parts.push("We'll make it mobile-first of course.");
  }
  if (lower.includes("admin")) parts.push("Admin panel noted.");

  parts.push("\n\nHere are the features that make the most sense for this. Pick what you need:");

  return parts.join(" ");
}

function buildFeatureAck(features: string[], projectType: string, cat: ProjectCategory): string {
  const count = features.length;
  if (count === 0) {
    return `No worries! We'll keep it simple. Now — what kind of look and feel should your ${projectType} have?`;
  }

  const highlights = features.slice(0, 2).join(" and ");
  const catTones: Partial<Record<ProjectCategory, string>> = {
    educational: `${highlights} will make the learning experience much better! 👏`,
    ecommerce:   `${highlights} are key for a great shopping experience! 🛍️`,
    restaurant:  `${highlights} will make ordering super easy for your customers! 🍽️`,
    medical:     `${highlights} are essential for a smooth healthcare experience! 🏥`,
  };

  const tone = catTones[cat] ?? `${highlights} ${count > 2 ? `+ ${count - 2} more` : ""} — great choices!`;
  return `${tone}\n\nNow — what vibe / design style should your ${projectType} have?`;
}

function buildSummary(data: AIResponse["collectedData"]): string {
  const features = (data.features ?? []).slice(0, 6);
  const refs     = (data.references ?? []).filter(r => r && !isSkip(r));
  const lines = [
    `Here's your complete project brief! 🎉`,
    ``,
    `📋 **Project:** ${data.projectType ?? "—"}`,
    data.description ? `📝 **What it does:** ${data.description.slice(0, 100)}${(data.description?.length ?? 0) > 100 ? "…" : ""}` : null,
    features.length > 0 ? `✨ **Key Features:** ${features.join(", ")}` : null,
    `🎨 **Design Style:** ${data.designStyle ?? "—"}`,
    `💰 **Budget:** ${data.budget ?? "—"}`,
    `⏰ **Timeline:** ${data.timeline ?? "—"}`,
    refs.length > 0 ? `🔗 **References:** ${refs.join(", ")}` : null,
    ``,
    `Does this look right? You can edit anything or proceed to confirm your slot!`,
  ];
  return lines.filter(l => l !== null).join("\n");
}

// ─────────────────────────────────────────────────────────────────
// SMART FEATURE SELECTION — picks most relevant features
// ─────────────────────────────────────────────────────────────────

function getTopFeatures(cat: ProjectCategory, description: string, limit: number): string[] {
  const allFeatures = FEATURES[cat] ?? FEATURES.other;
  const lower = description.toLowerCase();

  // Score each feature by relevance to description
  const scored = allFeatures.map(f => {
    const fLower  = f.toLowerCase();
    const words   = fLower.split(/[\s/&]+/);
    const matches = words.filter(w => w.length > 3 && lower.includes(w)).length;
    return { feature: f, score: matches };
  });

  // Put description-matched features first, then fill with defaults
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.feature);
}

function parseFeatureList(msg: string): string[] {
  if (msg.includes(",")) return msg.split(",").map(f => f.trim()).filter(Boolean);
  if (msg.length < 80)   return [msg.trim()];
  return msg.split(/\n|;/).map(f => f.trim()).filter(Boolean);
}

function getCategoryAudience(cat: ProjectCategory): string {
  const map: Partial<Record<ProjectCategory, string>> = {
    educational: "students and learners",
    ecommerce:   "shoppers and buyers",
    restaurant:  "diners and food lovers",
    medical:     "patients and families",
    real_estate: "property buyers and sellers",
    fitness:     "gym members and fitness enthusiasts",
    travel:      "travellers and tourists",
    ngo:         "donors and volunteers",
    event:       "attendees and guests",
  };
  return map[cat] ?? "your target users";
}

function getDesignAck(style: string): string {
  const acks: Record<string, string> = {
    "minimal":     "Minimal and clean — timeless choice! ✨",
    "bold":        "Bold and vibrant — that'll grab attention! 🌟",
    "corporate":   "Corporate and professional — builds trust! 💼",
    "dark":        "Dark and premium — very sleek! 🌙",
    "colorful":    "Colorful and engaging — users will love it! 🌈",
    "elegant":     "Elegant — perfect for a premium feel! ✨",
    "energetic":   "Energetic and bold — perfect for fitness! 💪",
    "warm":        "Warm and inviting — that's great! 💚",
    "tech":        "Tech-forward look — spot on for this! 💻",
    "academic":    "Clean and academic — very appropriate! 🎓",
  };
  const lower = style.toLowerCase();
  for (const [kw, ack] of Object.entries(acks)) {
    if (lower.includes(kw)) return ack;
  }
  return `${style} — solid choice! 🎨`;
}

function isSkip(msg: string): boolean {
  const lower = msg.toLowerCase();
  return lower.includes("skip") || lower === "no" || lower === "none" || lower === "nahi";
}

function isEditRequest(msg: string): boolean {
  const lower = msg.toLowerCase();
  return lower.includes("edit") || lower.includes("change") || lower.includes("update") || lower.includes("modify");
}

function cleanChipLabel(label: string): string {
  // "📚 Educational / Coaching" → "Educational / Coaching"
  let result = label;
  // Remove leading non-letter characters (emojis are outside ASCII)
  let i = 0;
  while (i < result.length) {
    const cp = result.codePointAt(i) ?? 0;
    // Keep if it's a basic Latin letter, digit, or common punctuation
    if (cp > 127 || cp === 32) { i += (cp > 0xFFFF ? 2 : 1); }
    else break;
  }
  result = result.slice(i).trim();
  return result || label.trim();
}
