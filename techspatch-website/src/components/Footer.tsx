"use client";

import { Zap } from "lucide-react";

const footerLinks = {
  Products: [
    { label: "CarrierScout", href: "#carrierscout" },
    { label: "Techspatch Nexus", href: "#nexus" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#features" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Support", href: "#contact" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-aurora to-plasma">
                <Zap className="h-5 w-5 text-background" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-foreground">Tech</span>
                <span className="text-gradient-aurora">spatch</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Powering the future of freight logistics with AI-driven carrier
              intelligence and real-time dispatch optimization.
            </p>
            <div className="mt-6 flex gap-3">
              {["X", "Li", "GH"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-xs font-bold text-muted transition-all hover:border-aurora/50 hover:text-aurora"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-aurora"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Techspatch. All rights reserved.
          </p>
          <p className="text-sm text-muted">
            Built with precision. Powered by intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
