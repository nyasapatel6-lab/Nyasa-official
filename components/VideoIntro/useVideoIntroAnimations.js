"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * useVideoIntroAnimations
 * ---------------------------------------------------------------------------
 * Orchestrates the page-load entrance: video/backdrop fade-in first,
 * then the frame HUD, then the text block (eyebrow -> name -> subtitle),
 * then controls and scroll indicator settle in last. One timeline,
 * one direction, nothing scattered — the sequence itself is the moment.
 *
 * refs: object of React refs for each element to animate.
 */
export function useVideoIntroAnimations(refs) {
  useEffect(() => {
    const {
      root,
      backdrop,
      video,
      hudFrame,
      eyebrow,
      nameLine1,
      nameLine2,
      subtitle,
      controls,
      scrollIndicator,
      soundBadge,
    } = refs;

    if (!root.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            backdrop.current,
            video.current,
            hudFrame.current,
            eyebrow.current,
            nameLine1.current,
            nameLine2.current,
            subtitle.current,
            controls.current,
            scrollIndicator.current,
          ],
          { opacity: 1, clearProps: "transform" }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.set(root.current, { opacity: 1 })
        .fromTo(
          backdrop.current,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" }
        )
        .fromTo(
          video.current,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" },
          "-=1.3"
        )
        .fromTo(
          hudFrame.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power1.out" },
          "-=0.8"
        )
        .fromTo(
          eyebrow.current,
          { opacity: 0, y: 14, letterSpacing: "0.5em" },
          { opacity: 1, y: 0, letterSpacing: "0.32em", duration: 0.9 },
          "-=0.5"
        )
        .fromTo(
          nameLine1.current,
          { opacity: 0, y: 60, filter: "blur(14px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
          "-=0.45"
        )
        .fromTo(
          nameLine2.current,
          { opacity: 0, y: 60, filter: "blur(14px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
          "-=0.85"
        )
        .fromTo(
          subtitle.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.5"
        )
        .fromTo(
          controls.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          scrollIndicator.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.3"
        );

      if (soundBadge.current) {
        tl.fromTo(
          soundBadge.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5 },
          "-=0.5"
        );

        // Gentle ambient pulse while it's visible
        gsap.to(soundBadge.current, {
          scale: 1.05,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: tl.duration(),
        });

        // Auto-hide after a few seconds
        gsap.to(soundBadge.current, {
          opacity: 0,
          y: -8,
          duration: 0.6,
          delay: tl.duration() + 3.5,
          ease: "power1.in",
          onComplete: () => {
            if (soundBadge.current) soundBadge.current.style.pointerEvents = "none";
          },
        });
      }
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // refs are stable useRef objects — run once on mount, not on every render
}

/**
 * Smoothly scrolls to the element following the hero section.
 */
export function scrollToNextSection() {
  const next = document.querySelector("[data-next-section]");
  if (next) {
    next.scrollIntoView({ behavior: "smooth" });
  }
}
