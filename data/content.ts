export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export const heroContent = {
  badge: "Professional Web Development",
  headline: "Order Your Website. We Build It.",
  subheadline:
    "Place your order, pay securely with Razorpay, chat with us on live chat — we build your website and deliver. Simple.",
  ctaPrimary: "Place an Order",
  ctaSecondary: "How It Works",
} as const;

export const howItWorksSteps = [
  {
    number: 1,
    title: "Place Your Order",
    description: "Tell us what you need. We'll send you a clear quote. No hidden costs.",
    icon: "FileEdit",
  },
  {
    number: 2,
    title: "Pay with Razorpay",
    description: "Pay securely with Razorpay — UPI, card, net banking. We start after you're confirmed.",
    icon: "CreditCard",
  },
  {
    number: 3,
    title: "Live Chat & We Build",
    description: "Chat with us in real time. We build your website and deliver. No third-party developers.",
    icon: "MessageSquare",
  },
] as const;

export const categories = [
  { id: "web-dev", title: "Web Development", icon: "Globe" },
  { id: "ui-ux", title: "UI/UX Design", icon: "Palette" },
  { id: "ecommerce", title: "E-commerce", icon: "ShoppingCart" },
  { id: "saas", title: "SaaS Development", icon: "Layers" },
  { id: "mobile", title: "Mobile Apps", icon: "Smartphone" },
  { id: "api", title: "API & Integrations", icon: "Plug" },
] as const;

export const whyChooseUsFeatures = [
  { title: "Razorpay Payments", description: "Pay securely with UPI, card, or net banking.", icon: "CreditCard" },
  { title: "Live Chat", description: "Chat with us in real time. Share files, get updates.", icon: "MessageSquare" },
  { title: "We Build for You", description: "We take your order and build your website ourselves.", icon: "Wrench" },
  { title: "Clear Deliverables", description: "Agreed scope and phases. You know what you're getting.", icon: "FileCheck" },
  { title: "Support When You Need", description: "Reach out on live chat. We're here to help.", icon: "Headphones" },
] as const;

export const ctaContent = {
  headline: "Ready for your website? Order now.",
  subheadline: "Place your order, pay with Razorpay, and chat with us. We'll build and deliver your site.",
  buttonText: "Place an Order",
} as const;

export const footerLinks = {
  product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "#contact" },
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
