"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Github, Zap } from "lucide-react";
import { footerLinks } from "@/data/content";

const ease = [0.25, 0.1, 0.25, 1] as const;
const socialIconMap = { Twitter, Linkedin, Github };

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#04040F]">
      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <motion.div
            className="col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center shadow-glow-sm">
                <Zap className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-base text-ink-white">Websevix</span>
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed max-w-[200px]">
              The professional marketplace for web services.
            </p>
          </motion.div>

          {/* Links */}
          {[
            { title: "Product", links: footerLinks.product },
            { title: "Company", links: footerLinks.company },
            { title: "Legal", links: footerLinks.legal },
          ].map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.06 * (gi + 1), ease }}
            >
              <h4 className="text-[11px] font-semibold text-ink-muted uppercase tracking-[0.15em] mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted hover:text-ink-white transition-colors duration-200 hover:translate-y-[-1px] inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            <h4 className="text-[11px] font-semibold text-ink-muted uppercase tracking-[0.15em] mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Get product updates and dev insights.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-ink-white text-xs placeholder:text-ink-muted focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
              />
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors flex-shrink-0"
              >
                Join
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Websevix. Made with ❤️ in India
          </p>
          <div className="flex items-center gap-1">
            {footerLinks.social.map((link) => {
              const Icon = socialIconMap[link.icon as keyof typeof socialIconMap];
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-violet-400 hover:bg-violet-600/10 transition-all duration-200"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
