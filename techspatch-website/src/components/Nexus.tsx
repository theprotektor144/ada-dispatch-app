"use client";

import { motion } from "framer-motion";
import {
  Network,
  Workflow,
  Bell,
  BarChart3,
  Layers,
  Lock,
  ArrowRight,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import GlassCard from "./GlassCard";

const capabilities = [
  {
    icon: Workflow,
    title: "Automated Dispatch",
    description:
      "End-to-end dispatch automation from load posting to carrier assignment, rate confirmation, and BOL generation.",
  },
  {
    icon: Bell,
    title: "Real-Time Tracking",
    description:
      "Live shipment visibility with predictive ETA updates, exception alerts, and automated customer notifications.",
  },
  {
    icon: BarChart3,
    title: "Revenue Intelligence",
    description:
      "Margin analysis, rate trend forecasting, and profitability dashboards that turn data into revenue opportunities.",
  },
  {
    icon: Layers,
    title: "TMS Integration",
    description:
      "Seamless two-way integration with McLeod, TMW, MercuryGate, Aljex, and all major TMS platforms via REST API.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified. End-to-end encryption, role-based access control, and complete audit trails.",
  },
  {
    icon: Network,
    title: "Multi-Modal Support",
    description:
      "Full truckload, LTL, intermodal, and drayage — managed from a single unified command center.",
  },
];

export default function Nexus() {
  return (
    <section id="nexus" className="relative py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-plasma/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-plasma/20 bg-plasma/5 px-4 py-1.5 text-sm font-medium text-plasma">
            <Network className="h-3.5 w-3.5" />
            Techspatch Nexus
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Your Dispatch</span>
            <br />
            <span className="text-gradient-plasma">Command Center.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Nexus is the operational nerve center that connects every moving piece of your
            brokerage — dispatchers, carriers, shippers, and loads — into one intelligent
            real-time platform.
          </p>
        </AnimatedSection>

        {/* Nexus Dashboard Preview */}
        <AnimatedSection delay={0.2} className="mt-16">
          <div className="glass rounded-3xl border border-border/50 p-2 glow-plasma">
            <div className="rounded-2xl bg-surface p-6 sm:p-10">
              {/* Dashboard Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Nexus Command Center</h3>
                  <p className="text-sm text-muted">Real-time dispatch operations</p>
                </div>
                <div className="flex gap-2">
                  {["1h", "24h", "7d", "30d"].map((period) => (
                    <button
                      key={period}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        period === "24h"
                          ? "bg-plasma/15 text-plasma"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid gap-4 lg:grid-cols-4">
                {[
                  { label: "Active Loads", value: "247", change: "+12%", color: "text-aurora" },
                  { label: "In Transit", value: "189", change: "+8%", color: "text-plasma" },
                  { label: "Revenue Today", value: "$184K", change: "+23%", color: "text-solar" },
                  { label: "On-Time Rate", value: "97.2%", change: "+1.4%", color: "text-nebula" },
                ].map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="rounded-xl border border-border/50 bg-background p-5"
                  >
                    <p className="text-xs font-medium text-muted">{metric.label}</p>
                    <p className={`mt-2 text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                    <p className="mt-1 text-xs text-aurora">{metric.change} vs last period</p>
                  </motion.div>
                ))}
              </div>

              {/* Activity Feed Mock */}
              <div className="mt-6 rounded-xl border border-border/50 bg-background p-5">
                <h4 className="mb-4 text-sm font-semibold text-foreground">Live Activity</h4>
                <div className="space-y-3">
                  {[
                    { time: "2m ago", event: "Load #4892 assigned to Summit Freight — DAL→CHI", type: "dispatch" },
                    { time: "5m ago", event: "Carrier Apex Logistics confirmed rate $2,380", type: "confirm" },
                    { time: "8m ago", event: "Load #4891 delivered on-time — ATL→MIA", type: "delivery" },
                    { time: "12m ago", event: "New load posted: LAX→SEA | Reefer | 42K lbs", type: "new" },
                  ].map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`mt-1.5 h-2 w-2 rounded-full ${
                          activity.type === "dispatch"
                            ? "bg-plasma"
                            : activity.type === "confirm"
                            ? "bg-aurora"
                            : activity.type === "delivery"
                            ? "bg-solar"
                            : "bg-nebula"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.event}</p>
                        <p className="text-xs text-muted">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Capability Cards */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <GlassCard glowColor="plasma" className="h-full">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-plasma/10">
                  <cap.icon className="h-5 w-5 text-plasma" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{cap.description}</p>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.3} className="mt-16 text-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-lg font-semibold text-plasma transition-colors hover:text-foreground"
          >
            See Nexus in action
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
