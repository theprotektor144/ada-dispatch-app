"use client";

import {
  Cpu,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Plug,
  Clock,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import GlassCard from "./GlassCard";

const features = [
  {
    icon: Cpu,
    title: "AI-First Architecture",
    description:
      "Machine learning models trained on millions of freight transactions power every decision, from carrier scoring to rate prediction.",
    color: "aurora" as const,
    iconColor: "text-aurora",
    bgColor: "bg-aurora/10",
  },
  {
    icon: Zap,
    title: "Sub-Second Response",
    description:
      "Edge-deployed inference with P99 latency under 200ms. Your dispatchers never wait — results appear as fast as they can type.",
    color: "solar" as const,
    iconColor: "text-solar",
    bgColor: "bg-solar/10",
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    description:
      "Every lane, every state. Full CONUS coverage with cross-border capabilities into Canada and Mexico. No dead zones.",
    color: "plasma" as const,
    iconColor: "text-plasma",
    bgColor: "bg-plasma/10",
  },
  {
    icon: Shield,
    title: "Zero-Trust Security",
    description:
      "SOC 2 Type II, encrypted at rest and in transit, with granular RBAC. Your data never touches shared infrastructure.",
    color: "aurora" as const,
    iconColor: "text-aurora",
    bgColor: "bg-aurora/10",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description:
      "Forecast market rates 30 days ahead, predict carrier capacity crunches, and identify margin opportunities before competitors.",
    color: "solar" as const,
    iconColor: "text-solar",
    bgColor: "bg-solar/10",
  },
  {
    icon: Plug,
    title: "Universal API",
    description:
      "RESTful + GraphQL APIs with webhooks. Integrate with any TMS, ERP, or custom system in hours, not weeks. SDKs for every language.",
    color: "plasma" as const,
    iconColor: "text-plasma",
    bgColor: "bg-plasma/10",
  },
  {
    icon: Clock,
    title: "24/7 Operations",
    description:
      "Multi-region deployment with 99.99% uptime SLA. Automated failover, zero-downtime deploys, and always-on monitoring.",
    color: "aurora" as const,
    iconColor: "text-aurora",
    bgColor: "bg-aurora/10",
  },
  {
    icon: Sparkles,
    title: "Continuous Learning",
    description:
      "Models retrain weekly on fresh market data. The platform gets smarter with every load booked, every rate negotiated, every mile driven.",
    color: "solar" as const,
    iconColor: "text-solar",
    bgColor: "bg-solar/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-solar/20 bg-solar/5 px-4 py-1.5 text-sm font-medium text-solar">
            <Sparkles className="h-3.5 w-3.5" />
            Platform Capabilities
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Built Different.</span>
            <br />
            <span className="text-gradient-solar">Engineered for Scale.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Every component of Techspatch is purpose-built for the speed, reliability,
            and intelligence that modern freight brokerages demand.
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <GlassCard glowColor={feature.color} className="h-full">
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.bgColor}`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Integration Logos Band */}
        <AnimatedSection delay={0.3} className="mt-24 text-center">
          <p className="mb-8 text-sm font-medium text-muted">
            INTEGRATES WITH YOUR EXISTING STACK
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {[
              "McLeod",
              "TMW",
              "MercuryGate",
              "Aljex",
              "DAT",
              "Truckstop",
              "Salesforce",
              "SAP",
            ].map((name) => (
              <span key={name} className="text-lg font-bold text-foreground">
                {name}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
