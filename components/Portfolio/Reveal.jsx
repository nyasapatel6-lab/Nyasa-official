"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

/**
 * Fades + lifts children into place the first time they cross into the
 * viewport. Runs once (no re-trigger on scroll-back), respects
 * prefers-reduced-motion via the global transition-duration override in
 * globals.css, and never blocks content if IntersectionObserver is
 * unavailable (falls back to visible).
 */
export default function Reveal({ children, as: Tag = "div", className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, visible ? styles.visible : "", className].filter(Boolean).join(" ")}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
