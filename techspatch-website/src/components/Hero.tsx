"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import ParticleField from "./ParticleField";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden quantum-bg noise-overlay">
      {/* Particle Network Background */}
      <ParticleField />

      {/* Decorative Orbit Rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="orbit h-[600px] w-[600px] rounded-full border border-aurora/5" />
        <div className="orbit-reverse absolute h-[800px] w-[800px] rounded-full border border-plasma/5" />
        <div className="orbit absolute h-[1000px] w-[1000px] rounded-full border border-solar/3" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-aurora">
            <span className="h-2 w-2 rounded-full bg-aurora animate-pulse" />
            Now in Production &mdash; AI-Powered Freight Intelligence
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-5xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          <span className="text-foreground">The Future of</span>
          <br />
          <span className="text-gradient-full">Freight Logistics</span>
          <br />
          <span className="text-foreground">Starts Here</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          Techspatch delivers AI-driven carrier intelligence and real-time dispatch
          optimization that transforms how freight brokerages operate. Scout carriers
          instantly. Dispatch seamlessly. Scale infinitely.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#contact"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora to-aurora-dim px-8 py-4 text-base font-semibold text-background transition-all hover:shadow-lg hover:shadow-aurora/25 pulse-glow"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#products"
            className="group flex items-center gap-2 rounded-full border border-border px-8 py-4 text-base font-medium text-foreground transition-all hover:border-aurora/40 hover:bg-surface"
          >
            <Play className="h-4 w-4 text-aurora" />
            Watch Demo
          </a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {[
            { value: "10K+", label: "Carriers Indexed" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<2s", label: "Match Speed" },
            { value: "40%", label: "Cost Reduction" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-gradient-aurora sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-muted sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
