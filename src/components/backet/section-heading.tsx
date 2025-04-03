"use client";

import { motion } from "framer-motion";
import { fadeIn } from "../layout/animation";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <h2
        className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900 ${className} dark:text-white`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg ${className}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
