"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "aurora" | "plasma" | "solar";
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  glowColor,
  hover = true,
}: GlassCardProps) {
  const glowMap = {
    aurora: "hover:shadow-[0_0_30px_rgba(0,255,204,0.15)]",
    plasma: "hover:shadow-[0_0_30px_rgba(153,69,255,0.15)]",
    solar: "hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "glass rounded-2xl p-6 transition-shadow duration-500",
        glowColor && glowMap[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
