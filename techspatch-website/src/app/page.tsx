"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import CarrierScout from "@/components/CarrierScout";
import Nexus from "@/components/Nexus";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Products />
        <CarrierScout />
        <Nexus />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
