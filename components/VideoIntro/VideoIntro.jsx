"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import styles from "./VideoIntro.module.css";
import { useVideoIntroAnimations, scrollToNextSection } from "./useVideoIntroAnimations";

// Three.js touches the window/canvas APIs — load client-side only, and keep
// it out of the initial bundle since it's purely decorative atmosphere.
const CinematicLayer = dynamic(() => import("../CinematicLayer/CinematicLayer"), {
  ssr: false,
});

const VIDEO_SRC = "/videos/hero.mp4";

function formatTimecode(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  const f = Math.floor((seconds % 1) * 24)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}:${f}`;
}

export default function VideoIntro() {
  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const videoRef = useRef(null);
  const backdropVideoRef = useRef(null);
  const hudFrameRef = useRef(null);
  const eyebrowRef = useRef(null);
  const nameLine1Ref = useRef(null);
  const nameLine2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const controlsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const soundBadgeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [timecode, setTimecode] = useState("00:00:00");

  useVideoIntroAnimations({
    root: rootRef,
    backdrop: backdropRef,
    video: videoRef,
    hudFrame: hudFrameRef,
    eyebrow: eyebrowRef,
    nameLine1: nameLine1Ref,
    nameLine2: nameLine2Ref,
    subtitle: subtitleRef,
    controls: controlsRef,
    scrollIndicator: scrollIndicatorRef,
    soundBadge: soundBadgeRef,
  });

  // Keep the blurred backdrop clone in perfect sync with the foreground video
  useEffect(() => {
    const fg = videoRef.current;
    const bg = backdropVideoRef.current;
    if (!fg || !bg) return;

    const sync = () => {
      if (Math.abs(fg.currentTime - bg.currentTime) > 0.15) {
        bg.currentTime = fg.currentTime;
      }
    };
    const id = setInterval(sync, 1000);
    return () => clearInterval(id);
  }, []);

  // Timecode HUD readout
  useEffect(() => {
    const fg = videoRef.current;
    if (!fg) return;
    const update = () => setTimecode(formatTimecode(fg.currentTime));
    fg.addEventListener("timeupdate", update);
    return () => fg.removeEventListener("timeupdate", update);
  }, []);

  const togglePlay = useCallback(() => {
    const fg = videoRef.current;
    const bg = backdropVideoRef.current;
    if (!fg) return;
    if (fg.paused) {
      fg.play();
      bg?.play();
      setIsPlaying(true);
    } else {
      fg.pause();
      bg?.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const fg = videoRef.current;
    if (!fg) return;
    fg.muted = !fg.muted;
    setIsMuted(fg.muted);
  }, []);

  return (
    <section className={styles.hero} ref={rootRef} aria-label="Intro">
      {/* Blurred ambient backdrop — duplicate of the foreground video */}
      <div className={styles.backdropLayer} ref={backdropRef}>
        <video
          ref={backdropVideoRef}
          className={styles.backdropVideo}
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Foreground talking-head video */}
      <div className={styles.videoLayer}>
        <video
          ref={videoRef}
          className={styles.foregroundVideo}
          src={VIDEO_SRC}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
        />
      </div>

      {/* Cinematic gradient + vignette + grain for legibility and mood */}
      <div className={styles.gradientOverlay} />
      <div className={styles.vignette} />
      <div className={styles.grain} />

      {/* Floating bokeh particle atmosphere */}
      <CinematicLayer particleCount={220} />

      {/* Signature HUD frame */}
      <div className={styles.hudFrame} ref={hudFrameRef}>
        <span className={`${styles.hudCorner} ${styles["hudCorner--tl"]}`} />
        <span className={`${styles.hudCorner} ${styles["hudCorner--tr"]}`} />
        <span className={`${styles.hudCorner} ${styles["hudCorner--bl"]}`} />
        <span className={`${styles.hudCorner} ${styles["hudCorner--br"]}`} />
        <div className={styles.hudTimecode}>
          <span className={styles.hudRecDot} aria-hidden="true" />
          <span>{isPlaying ? "REC" : "PAUSED"}</span>
          <span>{timecode}</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.eyebrow} ref={eyebrowRef}>
          CS &amp; AI Student · Portfolio
        </p>
        <div className={styles.nameBlock}>
          <span className={styles.nameLine} ref={nameLine1Ref}>
            Nyasa
          </span>
          <span className={`${styles.nameLine} ${styles["nameLine--accent"]}`} ref={nameLine2Ref}>
            Patel
          </span>
        </div>
        <p className={styles.subtitle} ref={subtitleRef}>
          <strong>Computer Science &amp; Applied AI</strong> student building
          intelligent, human-centered software — across a dual degree at NIAT
          and IIT Jodhpur.
        </p>
      </div>

      {/* Tap-for-sound badge */}
      <button
        ref={soundBadgeRef}
        className={styles.soundBadge}
        onClick={toggleMute}
        aria-hidden={!isMuted}
        tabIndex={isMuted ? 0 : -1}
        type="button"
      >
        <SpeakerIcon />
        <span>Tap for sound</span>
      </button>

      {/* Playback controls */}
      <div className={styles.controls} ref={controlsRef}>
        <button
          className={styles.controlButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          type="button"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          className={styles.controlButton}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          type="button"
        >
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
      </div>

      {/* Scroll indicator */}
      <button
        className={styles.scrollIndicator}
        ref={scrollIndicatorRef}
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
        type="button"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Inline icon set — no external icon dependency needed for four glyphs.  */
/* ---------------------------------------------------------------------- */

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 9v6h4l5 4V5L8 9H4z"
        fill="currentColor"
      />
      <path
        d="M16 9l4 6M20 9l-4 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path
        d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path
        d="M16.5 8.5a5 5 0 010 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
