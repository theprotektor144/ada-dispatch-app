"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowRight, Mail, Building2, User, MessageSquare } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

export default function CTA() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 quantum-bg" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-aurora/8 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-plasma/8 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: Messaging */}
          <AnimatedSection>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-foreground">Ready to Transform</span>
              <br />
              <span className="text-gradient-full">Your Brokerage?</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Join the next generation of freight brokerages using AI to move faster,
              book smarter, and scale without limits. Get started in minutes.
            </p>

            <div className="mt-10 space-y-6">
              {[
                {
                  title: "14-Day Free Trial",
                  description: "Full access to CarrierScout and Nexus. No credit card required.",
                },
                {
                  title: "Dedicated Onboarding",
                  description: "Our team will get you up and running with personalized setup.",
                },
                {
                  title: "ROI Guarantee",
                  description: "See measurable results in 30 days or your money back.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aurora/15">
                    <ArrowRight className="h-3 w-3 text-aurora" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: Contact Form */}
          <AnimatedSection delay={0.2}>
            <div className="glass rounded-2xl p-8 glow-aurora">
              {!submitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-5"
                >
                  <h3 className="text-xl font-bold text-foreground">Get Started Today</h3>
                  <p className="text-sm text-muted">
                    Fill out the form and our team will reach out within 24 hours.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:border-aurora/50">
                        <User className="h-4 w-4 text-muted" />
                        <input
                          type="text"
                          placeholder="John Smith"
                          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted/50"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">
                        Work Email
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:border-aurora/50">
                        <Mail className="h-4 w-4 text-muted" />
                        <input
                          type="email"
                          placeholder="john@company.com"
                          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted/50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      Company Name
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:border-aurora/50">
                      <Building2 className="h-4 w-4 text-muted" />
                      <input
                        type="text"
                        placeholder="Your Brokerage LLC"
                        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      Monthly Load Volume
                    </label>
                    <select
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted outline-none focus:border-aurora/50"
                      required
                    >
                      <option value="">Select volume</option>
                      <option value="<500">Under 500 loads</option>
                      <option value="500-1000">500 - 1,000 loads</option>
                      <option value="1000-2500">1,000 - 2,500 loads</option>
                      <option value="2500-5000">2,500 - 5,000 loads</option>
                      <option value="5000+">5,000+ loads</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      Message (Optional)
                    </label>
                    <div className="flex items-start gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:border-aurora/50">
                      <MessageSquare className="mt-0.5 h-4 w-4 text-muted" />
                      <textarea
                        rows={3}
                        placeholder="Tell us about your needs..."
                        className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aurora to-aurora-dim px-6 py-3.5 text-sm font-semibold text-background transition-all hover:shadow-lg hover:shadow-aurora/25 pulse-glow"
                  >
                    <Send className="h-4 w-4" />
                    Request Demo
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-aurora/15">
                    <Send className="h-7 w-7 text-aurora" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">We&apos;re On It!</h3>
                  <p className="mt-3 text-muted">
                    Our team will reach out within 24 hours to schedule your personalized demo.
                  </p>
                </motion.div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
