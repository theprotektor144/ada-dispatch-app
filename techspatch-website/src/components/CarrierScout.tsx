"use client";

import { motion } from "framer-motion";
import { Search, Radar, ShieldCheck, Gauge, Database, Route } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import GlassCard from "./GlassCard";

const features = [
  {
    icon: Search,
    title: "Intelligent Carrier Search",
    description:
      "AI-powered search engine that finds the perfect carrier match based on lane history, capacity, equipment type, and reliability scores.",
  },
  {
    icon: Radar,
    title: "Real-Time Availability",
    description:
      "Live tracking of carrier capacity and availability across every major freight lane in the continental US and cross-border routes.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Verification",
    description:
      "Automatic authority checks, insurance validation, safety ratings, and FMCSA compliance verification in milliseconds.",
  },
  {
    icon: Gauge,
    title: "Performance Analytics",
    description:
      "Deep carrier scorecards with on-time delivery rates, claims history, tender acceptance ratios, and driver reliability metrics.",
  },
  {
    icon: Database,
    title: "Data Intelligence",
    description:
      "Proprietary database enriched daily with market rates, lane benchmarks, carrier growth signals, and capacity forecasts.",
  },
  {
    icon: Route,
    title: "Lane Optimization",
    description:
      "ML-driven lane matching that identifies backhaul opportunities and optimal carrier-lane pairings for maximum margin.",
  },
];

export default function CarrierScout() {
  return (
    <section id="carrierscout" className="relative py-32">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-aurora/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-plasma/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-aurora/20 bg-aurora/5 px-4 py-1.5 text-sm font-medium text-aurora">
            <Search className="h-3.5 w-3.5" />
            CarrierScout
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Find the Right Carrier.</span>
            <br />
            <span className="text-gradient-aurora">Every Single Time.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            CarrierScout is Techspatch&apos;s AI carrier intelligence platform that eliminates
            guesswork from carrier selection. Search, verify, and book — all in one workflow.
          </p>
        </AnimatedSection>

        {/* Interactive Product Preview */}
        <AnimatedSection delay={0.2} className="mt-16">
          <div className="glass rounded-3xl border border-border/50 p-2 glow-aurora">
            <div className="rounded-2xl bg-surface p-8 sm:p-12">
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Search Interface Mock */}
                <div className="lg:col-span-2">
                  <div className="rounded-xl border border-border bg-background p-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora/10">
                        <Search className="h-4 w-4 text-aurora" />
                      </div>
                      <div className="flex-1 rounded-lg bg-surface px-4 py-2.5 text-sm text-muted">
                        Search carriers: Dallas, TX → Chicago, IL | Dry Van | 45K lbs
                      </div>
                    </div>
                    {/* Results mock */}
                    <div className="mt-4 space-y-3">
                      {[
                        { name: "Summit Freight LLC", score: 98, rate: "$2,450", eta: "18h" },
                        { name: "Apex Logistics Inc", score: 94, rate: "$2,380", eta: "20h" },
                        { name: "Meridian Transport", score: 91, rate: "$2,520", eta: "17h" },
                      ].map((carrier, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.15 }}
                          className="flex items-center justify-between rounded-lg border border-border/50 bg-surface/50 p-4"
                        >
                          <div>
                            <p className="font-semibold text-foreground">{carrier.name}</p>
                            <p className="text-xs text-muted">ETA: {carrier.eta} | Dry Van</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-bold text-aurora">{carrier.rate}</p>
                              <p className="text-xs text-muted">all-in rate</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-aurora/10 text-sm font-bold text-aurora">
                              {carrier.score}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Panel */}
                <div className="space-y-4">
                  {[
                    { label: "Carriers Searched", value: "12,847", color: "text-aurora" },
                    { label: "Avg Match Time", value: "1.3s", color: "text-plasma" },
                    { label: "Compliance Rate", value: "100%", color: "text-solar" },
                    { label: "Cost Savings", value: "34%", color: "text-nebula" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border/50 bg-background p-4"
                    >
                      <p className="text-xs font-medium text-muted">{stat.label}</p>
                      <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <GlassCard glowColor="aurora" className="h-full">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-aurora/10">
                  <feature.icon className="h-5 w-5 text-aurora" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
