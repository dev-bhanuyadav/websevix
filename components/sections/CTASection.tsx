"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ctaContent } from "@/data/content";
import Button from "@/components/ui/Button";
import GradientText from "@/components/ui/GradientText";
import AuroraBackground from "@/components/ui/AuroraBackground";

const easing = [0.25, 0.1, 0.25, 1] as const;

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <AuroraBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easing }}
        >
          <GradientText animate>{ctaContent.headline}</GradientText>
        </motion.h2>
        <motion.p
          className="text-text-muted text-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        >
          {ctaContent.subheadline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: easing }}
        >
          <Link href="#signup">
            <Button
              variant="primary"
              size="lg"
              shimmer
              className="relative shadow-glow hover:shadow-glow-lg"
            >
              {ctaContent.buttonText}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
