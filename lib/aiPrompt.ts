// ══════════════════════════════════════════════════════════════════
// VIX — Websevix AI Project Consultant
// Full knowledge base for context-aware project consultation
// ══════════════════════════════════════════════════════════════════

export interface AIResponse {
  message: string;
  collectedData: {
    projectType?: string | null;
    description?: string | null;
    features?: string[];
    designStyle?: string | null;
    budget?: string | null;
    timeline?: string | null;
    references?: string[];
  };
  showChips?: string[] | null;
  showCheckboxes?: string[] | null;
  currentStep?: string;
  isComplete?: boolean;
}

// ── Project-type keyword detection ───────────────────────────────

export type ProjectCategory =
  | "educational"
  | "ecommerce"
  | "restaurant"
  | "medical"
  | "portfolio"
  | "real_estate"
  | "saas"
  | "business"
  | "blog"
  | "ngo"
  | "event"
  | "travel"
  | "fitness"
  | "other";

const CATEGORY_KEYWORDS: Record<ProjectCategory, string[]> = {
  educational: [
    "school","college","university","course","learn","education","study","student","teacher",
    "tuition","coaching","academy","institute","training","lms","class","lecture","curriculum",
    "e-learning","elearning","quiz","assignment","exam","test","degree","diploma","tutorial",
    "educational","skill","knowledge","online course","certification","batch","fees",
  ],
  ecommerce: [
    "shop","store","sell","product","buy","cart","checkout","order","inventory","catalogue",
    "ecommerce","e-commerce","marketplace","retail","purchase","item","listing","vendor",
    "supplier","wholesale","delivery","shipping","cod","payment","price","discount","coupon",
  ],
  restaurant: [
    "restaurant","cafe","food","menu","recipe","hotel","canteen","tiffin","catering","bakery",
    "dhaba","bar","pub","pizza","biryani","delivery","dine","eat","order food","table booking",
    "reservation","cloud kitchen","swiggy","zomato",
  ],
  medical: [
    "hospital","clinic","doctor","medical","health","patient","appointment","medicine",
    "pharmacy","diagnostic","lab","test report","prescription","nursing","dental","eye",
    "ayurveda","healthcare","therapy","physiotherapy","mental health","counselling",
  ],
  portfolio: [
    "portfolio","resume","personal","freelance","showcase","my work","cv","hire me",
    "designer","developer","artist","photographer","writer","illustrator","model",
    "creative","work samples","projects showcase",
  ],
  real_estate: [
    "property","real estate","house","flat","apartment","plot","villa","office space",
    "commercial","residential","rent","buy property","pg","hostel","real-estate",
    "builder","broker","agent","realty","land","bhk",
  ],
  saas: [
    "saas","software","platform","tool","dashboard","crm","erp","hrm","automation",
    "workflow","management system","tracking","subscription","b2b","api","integration",
    "enterprise","startup","app","web app","webapp","system","portal",
  ],
  business: [
    "business","company","agency","corporate","firm","service","consultancy","consultancy",
    "startup","brand","professional","office","manufacturing","supplier","import","export",
    "logistics","transport","security","it company","digital agency",
  ],
  blog: [
    "blog","article","news","magazine","journal","media","publishing","content","write",
    "newsletter","editorial","post","author","journalism","storytelling",
  ],
  ngo: [
    "ngo","charity","nonprofit","non-profit","trust","foundation","donate","donation",
    "social work","volunteer","cause","fundraising","awareness","welfare","helpline",
  ],
  event: [
    "event","wedding","party","conference","seminar","concert","festival","expo",
    "meetup","ticket","booking","registration","venue","celebration","ceremony","anniversary",
  ],
  travel: [
    "travel","tour","trip","tourism","holiday","vacation","hotel booking","flights",
    "adventure","trekking","backpacking","travel agency","pilgrimage","visa",
  ],
  fitness: [
    "gym","fitness","yoga","workout","exercise","diet","nutrition","health club",
    "trainer","sports","cricket","football","wellness","meditation","transformation",
  ],
  other: [],
};

// ── Feature suggestions by category ──────────────────────────────

export const FEATURES_BY_CATEGORY: Record<ProjectCategory, string[]> = {
  educational: [
    "Student Login & Profiles",
    "Course / Lesson Management",
    "Quiz & Assignments",
    "Progress & Grade Tracker",
    "Video Lessons (YouTube embed)",
    "Certificate Generation",
    "Teacher / Instructor Dashboard",
    "Discussion Forum",
    "Attendance System",
    "Notice Board & Announcements",
    "Fee Management & Receipts",
    "Parent Login & Portal",
    "Live Class Links (Zoom / Meet)",
    "Study Material Downloads",
    "Student Batch Management",
  ],
  ecommerce: [
    "Product Catalog & Search",
    "Shopping Cart & Checkout",
    "Razorpay / UPI / COD Payment",
    "Order Tracking & History",
    "Customer Accounts & Wishlist",
    "Admin Product Management",
    "Inventory & Stock Management",
    "Discount & Coupon System",
    "Product Reviews & Ratings",
    "Email / SMS Order Notifications",
    "Return & Refund System",
    "Related Products",
    "Bulk Order / Wholesale",
    "GST Invoice Generation",
  ],
  restaurant: [
    "Online Menu with Photos",
    "Online Ordering System",
    "Table Booking / Reservation",
    "Razorpay / UPI Payment",
    "Order Tracking",
    "WhatsApp Order Integration",
    "Customer Reviews & Ratings",
    "Loyalty / Points Program",
    "Admin Dashboard",
    "Menu / Pricing Management",
    "Home Delivery Module",
    "QR Code Menu",
  ],
  medical: [
    "Doctor Profiles & Specializations",
    "Online Appointment Booking",
    "Patient Login Portal",
    "Medical Records / Reports",
    "Prescription Management",
    "WhatsApp Appointment Reminders",
    "Online Consultation / Telemedicine",
    "Admin / Reception Dashboard",
    "Emergency Contact & Helpline",
    "Blog / Health Tips",
    "Insurance Info",
    "Lab Reports Download",
  ],
  portfolio: [
    "Portfolio / Work Gallery",
    "About Me & Bio",
    "Contact Form",
    "Testimonials",
    "Blog / Case Studies",
    "Social Media Links",
    "SEO Optimization",
    "Resume / CV Download",
    "Project Showcase with Details",
    "Skills & Experience Section",
    "Dark / Light Mode",
    "Hire Me CTA",
  ],
  real_estate: [
    "Property Listings with Photos",
    "Search & Filter (Location / Price / Type)",
    "Property Detail Page & Gallery",
    "Virtual Tour / 360° View",
    "Contact Agent / Inquiry Form",
    "WhatsApp Chat Button",
    "EMI Calculator",
    "Property Comparison",
    "Admin Property Management",
    "Lead & Enquiry Management",
    "Map Integration",
    "Featured Properties Section",
  ],
  saas: [
    "User Registration & Login",
    "Subscription Plans & Billing",
    "Main Dashboard & Analytics",
    "API Integration Support",
    "Super Admin Panel",
    "Email & In-App Notifications",
    "Multi-tenant / Multi-user",
    "Role-based Access Control",
    "Data Export (CSV / Excel)",
    "Audit Logs & Activity Tracking",
    "Two-factor Authentication",
    "Payment Gateway (Razorpay)",
  ],
  business: [
    "About Company & Team Page",
    "Services / Products Page",
    "Contact Form & Google Maps",
    "WhatsApp Chat Button",
    "Testimonials / Client Reviews",
    "Blog / News Section",
    "SEO Optimization",
    "Photo / Video Gallery",
    "Social Media Integration",
    "Lead Generation Form",
    "Careers / Job Listings",
    "Live Chat Support",
  ],
  blog: [
    "Article & Post Management",
    "Categories & Tags",
    "Comment System",
    "Search Functionality",
    "Newsletter Subscription",
    "Social Media Sharing",
    "SEO & Meta Management",
    "Author Profiles",
    "Related Posts",
    "Admin CMS Panel",
    "Ad Banner Slots",
    "RSS Feed",
  ],
  ngo: [
    "Cause / Mission Page",
    "Online Donation (Razorpay)",
    "Donation Campaigns",
    "Volunteer Registration",
    "Impact Stories / Blog",
    "Transparency / Financial Reports",
    "Events & Activities",
    "Gallery",
    "Helpline / Contact",
    "Newsletter",
    "WhatsApp Integration",
    "80G Tax Exemption Certificate",
  ],
  event: [
    "Event Details & Schedule",
    "Online Ticket Booking",
    "Razorpay Payment",
    "Attendee Registration",
    "QR Code Entry Pass",
    "Speaker / Performer Profiles",
    "Gallery & Highlights",
    "Countdown Timer",
    "Map & Venue Details",
    "WhatsApp Updates",
    "Email Confirmation",
    "Admin Attendee Management",
  ],
  travel: [
    "Tour Package Listings",
    "Online Booking & Payment",
    "Itinerary Builder",
    "Photo Gallery",
    "Customer Reviews",
    "WhatsApp Enquiry",
    "Blog / Travel Tips",
    "Custom Trip Request Form",
    "Visa & Travel Info",
    "Map Integration",
    "Admin Booking Management",
    "Seasonal Offer Banners",
  ],
  fitness: [
    "Membership Plans & Fees",
    "Online Enrollment / Registration",
    "Class Schedule & Timetable",
    "Trainer Profiles",
    "Transformation Gallery",
    "Diet & Nutrition Blog",
    "Online Payment (Razorpay)",
    "Member Login & Progress Tracker",
    "WhatsApp Group Updates",
    "Attendance System",
    "Video Workout Library",
    "BMI Calculator",
  ],
  other: [
    "User Login & Registration",
    "Admin Dashboard",
    "Contact Form",
    "Photo / Video Gallery",
    "SEO Optimization",
    "WhatsApp Integration",
    "Mobile Responsive Design",
    "Blog / News Section",
    "Analytics & Reports",
    "Payment Gateway",
    "Search & Filter",
    "Email Notifications",
  ],
};

// ── Design options by category ────────────────────────────────────

export const DESIGN_BY_CATEGORY: Record<ProjectCategory, string[]> = {
  educational: ["🎓 Clean & Academic", "🌈 Colorful & Engaging", "💡 Modern & Minimal", "🎮 Fun & Interactive"],
  ecommerce:   ["🛍️ E-commerce Premium", "⚡ Bold & High-Conversion", "🎨 Minimal & Elegant", "🌟 Trendy & Youth"],
  restaurant:  ["🍽️ Elegant & Appetizing", "🔥 Bold & Vibrant", "🌿 Natural & Organic", "🎨 Modern & Minimal"],
  medical:     ["🏥 Clean & Professional", "💙 Calm & Trustworthy", "🌿 Wellness & Natural", "⚡ Modern & Tech"],
  portfolio:   ["✨ Creative & Unique", "🖤 Dark & Sleek", "🎨 Minimal & White", "💫 Bold & Colorful"],
  real_estate: ["🏠 Premium & Luxurious", "💼 Corporate & Professional", "🌿 Modern & Clean", "🔵 Bold & Trustworthy"],
  saas:        ["💻 Tech / Startup", "⚡ Clean & Functional", "🌙 Dark Mode Premium", "🎯 Conversion-Focused"],
  business:    ["💼 Corporate & Professional", "🌟 Bold & Modern", "🎨 Creative Agency", "🌿 Clean & Minimal"],
  blog:        ["📰 Editorial & Clean", "🎨 Creative & Visual", "⚡ Fast & Minimal", "🌈 Colorful & Engaging"],
  ngo:         ["💚 Warm & Trustworthy", "🌟 Inspiring & Bold", "🕊️ Clean & Minimal", "🌈 Colorful & Optimistic"],
  event:       ["🎉 Festive & Vibrant", "🖤 Dark & Premium", "✨ Elegant & Luxurious", "🌈 Colorful & Energetic"],
  travel:      ["✈️ Adventurous & Vibrant", "🌿 Natural & Fresh", "🌙 Exotic & Dark", "☀️ Bright & Tropical"],
  fitness:     ["💪 Bold & Energetic", "⚡ Dark & Intense", "🌿 Health & Wellness", "🔵 Clean & Modern"],
  other:       ["🎨 Modern & Minimal", "🌟 Bold & Colorful", "💼 Corporate / Professional", "💻 Tech / Startup"],
};

// ── Budget advice ─────────────────────────────────────────────────

export function getBudgetAdvice(budget: string, category: ProjectCategory): string {
  const b = budget.toLowerCase();
  const isLow    = b.includes("5,000") || b.includes("15,000") || b.includes("5k") || b.includes("15k");
  const isMid    = b.includes("15,000") || b.includes("35,000") || b.includes("15k") || b.includes("35k");
  const isHigh   = b.includes("35,000") || b.includes("75,000") || b.includes("35k") || b.includes("75k");
  const isPremium = b.includes("75,000") || b.includes("75k") || b.includes("+");

  if (isPremium) return `That's a great budget! 🙌 We can build a fully custom, premium ${getCategoryLabel(category)} with all the features you need, pixel-perfect design, and fast performance.`;
  if (isHigh)    return `Solid budget! ✅ Enough to build a complete, feature-rich ${getCategoryLabel(category)} with great design and smooth user experience.`;
  if (isMid)     return `Good range! 👍 We can build a solid ${getCategoryLabel(category)} with the core features. We'll prioritize what matters most for your users.`;
  if (isLow)     return `That works for a clean, focused version! 💡 We'll build the most important features first — you can always add more later as you grow.`;
  return `Got it! We'll make sure to deliver the best possible ${getCategoryLabel(category)} within your budget.`;
}

function getCategoryLabel(cat: ProjectCategory): string {
  const labels: Record<ProjectCategory, string> = {
    educational: "educational platform",
    ecommerce:   "online store",
    restaurant:  "restaurant website",
    medical:     "healthcare website",
    portfolio:   "portfolio site",
    real_estate: "real estate platform",
    saas:        "web application",
    business:    "business website",
    blog:        "blog/content site",
    ngo:         "NGO website",
    event:       "event website",
    travel:      "travel website",
    fitness:     "fitness website",
    other:       "website",
  };
  return labels[cat] ?? "website";
}

// ── Detect category from text ─────────────────────────────────────

export function detectCategory(text: string): ProjectCategory {
  const lower = text.toLowerCase();
  let bestMatch: ProjectCategory = "other";
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ProjectCategory, string[]][]) {
    const score = keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cat;
    }
  }
  return bestMatch;
}

// ── Claude system prompt ──────────────────────────────────────────

export const VIX_SYSTEM_PROMPT = `You are Vix, a friendly and expert project consultant for Websevix — a premium web development company in India. Your job is to help non-technical clients define their web/app project through a natural, friendly conversation.

PERSONALITY & TONE:
- Warm, encouraging, like a knowledgeable friend
- Use simple everyday language — ZERO technical jargon
- Be specific and relevant — never give generic responses
- Keep each message SHORT (2-4 sentences max)
- Use relevant emojis naturally (don't overdo it)

CRITICAL INTELLIGENCE RULES:
- ALWAYS analyze what the user is building and suggest RELEVANT features only
- For educational projects: suggest courses, quiz, attendance, student login, certificates — NOT WhatsApp shop, product catalog
- For e-commerce: suggest cart, payments, inventory — NOT quiz, attendance system
- For restaurant: suggest menu, table booking, food ordering — NOT course management
- For medical: suggest appointments, doctor profiles — NOT shopping cart
- NEVER suggest irrelevant features. Think like a domain expert.
- If user mentions "educational website" or "school website" or "coaching website" → suggest educational features ONLY
- If user mentions "online store" or "sell products" → suggest e-commerce features ONLY

CONVERSATION FLOW (follow strictly):
Step 1 → Ask what type of project (show chips)
Step 2 → Ask to describe it in detail (who uses it, what problem it solves)
Step 3 → Based on their description, suggest RELEVANT features as checkboxes (context-aware!)
Step 4 → Ask design preference (show relevant style chips)
Step 5 → Ask budget range
Step 6 → Ask timeline
Step 7 → Ask for reference websites (optional)
Step 8 → Generate summary and ask to confirm

FEATURE SUGGESTION LOGIC (VERY IMPORTANT):
When suggesting features in Step 3, analyze the user's project description carefully:
- Educational/school/coaching/course → suggest: student login, course management, quiz & tests, attendance, certificates, fee management, progress tracking, notice board, parent portal, video lessons
- E-commerce/shop/store → suggest: product catalog, shopping cart, payment gateway, order tracking, inventory, reviews, discount system
- Restaurant/food/cafe → suggest: online menu, table booking, online ordering, payment, reviews, admin dashboard
- Medical/hospital/clinic → suggest: appointment booking, doctor profiles, patient login, medical records, WhatsApp reminders
- Business/company/agency → suggest: about page, services, contact form, WhatsApp, testimonials, SEO
- Portfolio → suggest: work gallery, contact form, testimonials, SEO, about me, blog

BUDGET RESPONSE:
- ₹5k-15k: Honest — "This works for a basic version. We'll focus on the 4-5 most important features."
- ₹15k-35k: "Great! We can build something solid with core features and good design."
- ₹35k-75k: "Excellent budget! Full-featured with premium design and smooth UX."
- ₹75k+: "Premium budget! We can build something world-class."

RESPONSE FORMAT — ALWAYS return valid JSON only, no markdown, no extra text:
{
  "message": "Your friendly, contextual message (2-4 sentences)",
  "collectedData": {
    "projectType": "string or null",
    "description": "string or null",
    "features": ["selected features"] or [],
    "designStyle": "string or null",
    "budget": "string or null",
    "timeline": "string or null",
    "references": [] or ["urls"]
  },
  "showChips": ["option1", "option2"] or null,
  "showCheckboxes": ["feature1", "feature2", "feature3", "feature4", "feature5", "feature6", "feature7", "feature8"] or null,
  "currentStep": "project_type|description|features|design|budget|timeline|references|summary",
  "isComplete": false
}

EXAMPLE — Educational website response to features step:
{
  "message": "Perfect! Since you're building an educational platform, here are the most useful features. Pick the ones that fit your needs:",
  "collectedData": {...},
  "showCheckboxes": ["Student Login & Profiles", "Course / Lesson Management", "Quiz & Assignments", "Progress & Grade Tracker", "Video Lessons", "Certificate Generation", "Attendance System", "Fee Management"],
  "currentStep": "features"
}

RETURN ONLY THE JSON. NO OTHER TEXT.`;

// ── Opening message ───────────────────────────────────────────────

export const OPENING_MESSAGE: AIResponse = {
  message: "Hey! I'm Vix, your project consultant 👋\n\nI'll help you plan your project and get it started. Takes only 3-5 minutes — let's figure out exactly what you need!\n\nFirst — what kind of project are you thinking about?",
  collectedData: {},
  showChips: [
    "📚 Educational / Coaching",
    "🛍️ Online Store / E-commerce",
    "🍽️ Restaurant / Food",
    "🏥 Medical / Healthcare",
    "🏢 Business Website",
    "💻 Web App / SaaS",
    "🌍 Portfolio / Personal",
    "🏠 Real Estate",
    "✈️ Travel / Tourism",
    "💪 Fitness / Gym",
    "🎉 Event / Wedding",
    "📰 Blog / News",
  ],
  currentStep: "project_type",
  isComplete: false,
};
