"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/stores/useStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const setCurrentSection = useStore((state) => state.setCurrentSection);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !emailRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      tl.from(titleRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
      }).from(
        emailRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => setCurrentSection("contact"),
        onEnterBack: () => setCurrentSection("contact"),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen flex items-center py-32 bg-brand-teal-dark text-white"
      data-section="contact"
    >
      <div className="max-w-7xl mx-auto px-8 w-full text-center">
        <h2
          ref={titleRef}
          className="text-[clamp(3rem,8vw,6rem)] font-heading font-bold mb-12 tracking-tight leading-none text-white"
        >
          Let&apos;s Talk
        </h2>

        <a
          ref={emailRef}
          href="mailto:hello@mokshalabs.ie"
          className="text-[clamp(1.5rem,3vw,2.5rem)] text-brand-saffron hover:text-brand-saffron-light transition-colors duration-300 inline-block"
        >
          hello@mokshalabs.ie
        </a>
      </div>
    </section>
  );
}
