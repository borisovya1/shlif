import type { Metadata } from "next";

import About from "@/components/sections/About";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Contacts from "@/components/sections/Contacts";
import CtaBanner from "@/components/sections/CtaBanner";
import Faq from "@/components/sections/Faq";
import Hero from "@/components/sections/Hero";
import Portfolio from "@/components/sections/Portfolio";
import Quiz from "@/components/sections/Quiz";
import Reviews from "@/components/sections/Reviews";
import Services from "@/components/sections/Services";
import Steps from "@/components/sections/Steps";
import JsonLd from "@/components/seo/JsonLd";
import { faq } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${site.tagline} в ${site.regionShort} | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: `${site.tagline} в ${site.regionShort} | ${site.name}`,
    description: site.description,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <Hero />
      <Services />
      <Quiz />
      <Portfolio />
      <BeforeAfter />
      <Reviews />
      <Faq />
      <Steps />
      <About />
      <Contacts />
      <CtaBanner />
    </>
  );
}
