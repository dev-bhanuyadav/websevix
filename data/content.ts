export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export const heroContent = {
  badge: "🚀 Now in Public Beta — Join Free",
  headline: "Find Expert Developers. Build Faster. Pay Securely.",
  subheadline:
    "Post your project, receive proposals from vetted developers, and pay securely with milestone-based escrow. From idea to launch — all in one place.",
  ctaPrimary: "Post a Project",
  ctaSecondary: "Explore Projects",
  trustText: "Trusted by 5,000+ developers & 2,000+ clients",
} as const;

export const howItWorksSteps = [
  {
    number: 1,
    title: "Post Your Requirement",
    description:
      "Describe your project, set milestones, and define your budget. Your requirement goes live to our network of verified developers.",
    icon: "FileText",
  },
  {
    number: 2,
    title: "Review & Hire Developer",
    description:
      "Compare proposals, check ratings and portfolios, and message developers. Hire the best fit and funds are held securely in escrow.",
    icon: "Users",
  },
  {
    number: 3,
    title: "Milestone-Based Secure Delivery",
    description:
      "Work in milestones. Release payment when each milestone is approved. Chat, share files, and track progress in real time.",
    icon: "ShieldCheck",
  },
] as const;

export const categories = [
  {
    id: "web-dev",
    title: "Web Development",
    activeProjects: 342,
    icon: "Globe",
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    activeProjects: 189,
    icon: "Palette",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    activeProjects: 256,
    icon: "ShoppingCart",
  },
  {
    id: "saas",
    title: "SaaS Development",
    activeProjects: 178,
    icon: "Layers",
  },
  {
    id: "mobile",
    title: "Mobile Apps",
    activeProjects: 221,
    icon: "Smartphone",
  },
  {
    id: "api",
    title: "API & Integrations",
    activeProjects: 134,
    icon: "Plug",
  },
] as const;

export const whyChooseUsFeatures = [
  {
    title: "Secure Escrow Payments",
    description:
      "Funds are held safely until milestones are completed. You're always in control.",
    icon: "Lock",
  },
  {
    title: "Verified & Rated Developers",
    description:
      "Every developer is verified. Ratings and reviews help you choose with confidence.",
    icon: "BadgeCheck",
  },
  {
    title: "Transparent Milestone Pricing",
    description:
      "Agree on scope and price per milestone. No surprises, no scope creep.",
    icon: "Receipt",
  },
  {
    title: "Real-Time Chat & File Sharing",
    description:
      "Communicate and share files in one place. Keep everything in context.",
    icon: "MessageCircle",
  },
  {
    title: "24/7 Dispute Resolution",
    description:
      "Our team is here to help resolve any issues fairly and quickly.",
    icon: "Headphones",
  },
] as const;

export const stats = [
  { value: 12400, suffix: "+", label: "Active Projects" },
  { value: 8200, suffix: "+", label: "Developers Online" },
  { value: 95000, suffix: "+", label: "Completed Orders" },
  { value: 4.2, suffix: "M+", label: "Total Secured Transactions", isDecimal: true },
] as const;

export const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc",
    avatar: "/images/avatar1.jpg",
    rating: 5,
    text: "We shipped our MVP in 6 weeks thanks to Websevix. The escrow and milestone flow gave us peace of mind. Highly recommend.",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Founder",
    company: "StartupXYZ",
    avatar: "/images/avatar2.jpg",
    rating: 5,
    text: "Found a brilliant developer within 48 hours. The platform is smooth, professional, and the support team is responsive.",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "CTO",
    company: "ScaleUp Labs",
    avatar: "/images/avatar3.jpg",
    rating: 5,
    text: "We use Websevix for all our outsourced dev work. Transparent pricing and real-time chat make collaboration effortless.",
  },
] as const;

export const ctaContent = {
  headline: "Ready to Build Something Great?",
  subheadline:
    "Post your project today and get proposals within 24 hours.",
  buttonText: "Start For Free",
} as const;

export const footerLinks = {
  product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Categories", href: "#categories" },
    { label: "Pricing", href: "#" },
    { label: "API", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  social: [
    { label: "Twitter", href: "#", icon: "Twitter" },
    { label: "LinkedIn", href: "#", icon: "Linkedin" },
    { label: "GitHub", href: "#", icon: "Github" },
  ],
} as const;
