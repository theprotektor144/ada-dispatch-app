"use client";

import { motion } from "framer-motion";
import { Search, Network, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const products = [
  {
    icon: Search,
    name: "CarrierScout",
    tagline: "AI Carrier Intelligence",
    description:
      "Find, verify, and book the perfect carrier in seconds. AI-powered search across 10,000+ verified carriers with real-time availability, compliance checks, and predictive scoring.",
    href: "#carrierscout",
    gradient: "from-aurora to-aurora-dim",
    glowColor: "aurora",
    iconBg: "bg-aurora/10",
    iconColor: "text-aurora",
    borderHover: "hover:border-aurora/30",
    stats: [
      { value: "10K+", label: "Carriers" },
      { value: "1.3s", label: "Avg Match" },
      { value: "98%", label: "Accuracy" },
    ],
  },
  {
    icon: Network,
    name: "Techspatch Nexus",
    tagline: "Dispatch Command Center",
    description:
      "The operational nerve center for your brokerage. Automated dispatch workflows, real-time tracking, revenue intelligence, and seamless TMS integration — all in one platform.",
    href: "#nexus",
    gradient: "from-plasma to-plasma-dim",
    glowColor: "plasma",
    iconBg: "bg-plasma/10",
    iconColor: "text-plasma",
    borderHover: "hover:border-plasma/30",
    stats: [
      { value: "247", label: "Active Loads" },
      { value: "97%", label: "On-Time" },
      { value: "40%", label: "Faster" },
    ],
  },
];

export default function Products() {
  return (
    <section id="products" className="relative py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Two Products.</span>
            <br />
            <span className="text-gradient-full">One Mission.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Techspatch combines carrier intelligence with dispatch automation to create
            the most powerful freight brokerage platform on the market.
          </p>
        </AnimatedSection>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          {products.map((product, i) => (
            <AnimatedSection key={i} delay={i * 0.2}>
              <motion.a
                href={product.href}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={`group block rounded-2xl border border-border bg-surface/50 p-8 backdrop-blur-sm transition-all duration-500 sm:p-10 ${product.borderHover}`}
              >
                {/* Icon + Label */}
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${product.iconBg}`}>
                    <product.icon className={`h-7 w-7 ${product.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{product.name}</h3>
                    <p className="text-sm font-medium text-muted">{product.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-6 text-base leading-relaxed text-muted">
                  {product.description}
                </p>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {product.stats.map((stat, j) => (
                    <div
                      key={j}
                      className="rounded-xl border border-border/50 bg-background/50 p-3 text-center"
                    >
                      <p className={`text-xl font-bold ${product.iconColor}`}>{stat.value}</p>
                      <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className={`mt-8 flex items-center gap-2 font-semibold ${product.iconColor} transition-colors`}>
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
