"use client";

import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const plans = [
  {
    name: "Starter",
    description: "For growing brokerages",
    price: "$499",
    period: "/month",
    features: [
      "Up to 500 loads/month",
      "CarrierScout basic search",
      "5 dispatcher seats",
      "Standard integrations",
      "Email support",
      "Basic analytics",
    ],
    cta: "Start Free Trial",
    popular: false,
    glowClass: "",
    borderClass: "border-border",
    ctaClass:
      "border border-border text-foreground hover:border-aurora/40 hover:bg-surface",
  },
  {
    name: "Professional",
    description: "For scaling operations",
    price: "$1,299",
    period: "/month",
    features: [
      "Up to 2,500 loads/month",
      "CarrierScout AI matching",
      "Nexus dispatch automation",
      "20 dispatcher seats",
      "All TMS integrations",
      "Priority support + SLA",
      "Advanced analytics & reporting",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
    glowClass: "glow-aurora",
    borderClass: "border-aurora/30",
    ctaClass:
      "bg-gradient-to-r from-aurora to-aurora-dim text-background hover:shadow-lg hover:shadow-aurora/25",
  },
  {
    name: "Enterprise",
    description: "For high-volume brokerages",
    price: "Custom",
    period: "",
    features: [
      "Unlimited loads",
      "Full CarrierScout + Nexus suite",
      "Unlimited seats",
      "Custom integrations",
      "Dedicated success manager",
      "24/7 phone support",
      "Custom ML model training",
      "On-premise deployment option",
      "SLA: 99.99% uptime",
    ],
    cta: "Contact Sales",
    popular: false,
    glowClass: "",
    borderClass: "border-border",
    ctaClass:
      "border border-border text-foreground hover:border-plasma/40 hover:bg-surface",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurora/3 blur-[200px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Simple, Transparent</span>
            <br />
            <span className="text-gradient-full">Pricing.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            No hidden fees. No long-term contracts. Start free, scale as you grow.
          </p>
        </AnimatedSection>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`relative flex h-full flex-col rounded-2xl border bg-surface/50 p-8 backdrop-blur-sm ${plan.borderClass} ${plan.glowClass}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-aurora to-plasma px-4 py-1 text-xs font-bold text-background">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted">{plan.description}</p>
                </div>

                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-muted">{plan.period}</span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora" />
                      <span className="text-sm text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all ${plan.ctaClass}`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
