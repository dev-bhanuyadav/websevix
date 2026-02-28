"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Github } from "lucide-react";
import { footerLinks } from "@/data/content";

const socialIcons = { Twitter, Linkedin, Github };
const easing = [0.25, 0.1, 0.25, 1] as const;

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            className="col-span-2 md:col-span-4 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: easing }}
          >
            <Link href="/" className="font-display font-bold text-xl text-text-primary inline-block mb-4">
              Websevix
            </Link>
            <p className="text-text-muted text-sm max-w-xs">
              On-demand web services marketplace. Find developers, build faster, pay securely.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: easing }}
          >
            <h4 className="font-display font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-muted text-sm hover:text-text-primary transition-colors inline-block hover:-translate-y-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: easing }}
          >
            <h4 className="font-display font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-muted text-sm hover:text-text-primary transition-colors inline-block hover:-translate-y-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: easing }}
          >
            <h4 className="font-display font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-muted text-sm hover:text-text-primary transition-colors inline-block hover:-translate-y-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Websevix. Made with ❤️ in India
          </p>
          <div className="flex gap-4">
            {footerLinks.social.map((link) => {
              const Icon = socialIcons[link.icon as keyof typeof socialIcons];
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="text-text-muted hover:text-primary transition-colors hover:scale-110"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
