"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CinematicLayer
 * ---------------------------------------------------------------------------
 * A transparent, full-bleed canvas of warm orange + white bokeh particles
 * drifting on slow sine-wave paths, with a soft mouse-parallax camera move.
 * Designed to sit ABOVE the video layers and BELOW the text content,
 * purely additive — it should read as atmosphere, never as "a UI element".
 *
 * Performance notes:
 * - Single BufferGeometry / Points draw call for the whole field.
 * - Particle motion computed on CPU into a Float32Array once per frame
 *   (cheap for a few hundred points) rather than per-particle objects.
 * - Renderer paused via IntersectionObserver-style visibility check and
 *   fully disposed on unmount (geometry, material, texture, renderer).
 * - DPR capped at 2 to avoid burning fill-rate on high-density displays.
 */
export default function CinematicLayer({ particleCount = 260 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ---- Scene / camera / renderer ----------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ---- Soft round glow texture (procedural, no asset needed) -----------
    const glowTexture = (() => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    })();

    // ---- Particle field -----------------------------------------------
    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    const warmOrange = new THREE.Color("#ff8a4c");
    const warmWhite = new THREE.Color("#fff3e6");
    const coolBlue = new THREE.Color("#8fb6ff");

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 13;
      const z = (Math.random() - 0.5) * 14;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      // Weighted palette: mostly warm ember/white, occasional cool monitor glow
      const roll = Math.random();
      const c =
        roll < 0.55
          ? warmOrange.clone().lerp(warmWhite, Math.random() * 0.6)
          : roll < 0.85
          ? warmWhite
          : coolBlue.clone().lerp(warmWhite, 0.4);

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 2.2 + 0.4;
      speeds[i] = Math.random() * 0.4 + 0.15;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.42,
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---- Mouse parallax state ---------------------------------------------
    const pointer = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    function handlePointerMove(e) {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // ---- Resize handling ----------------------------------------------
    function handleResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // ---- Visibility pause (don't burn cycles off-screen) ----------------
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(mount);

    // ---- Animation loop -------------------------------------------------
    const clock = new THREE.Clock();
    let rafId;

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        const posAttr = geometry.attributes.position;
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const speed = speeds[i];
          const phase = phases[i];
          posAttr.array[idx] =
            basePositions[idx] + Math.sin(t * speed + phase) * 0.9;
          posAttr.array[idx + 1] =
            basePositions[idx + 1] + Math.cos(t * speed * 0.8 + phase) * 0.6;
          posAttr.array[idx + 2] =
            basePositions[idx + 2] + Math.sin(t * speed * 0.5 + phase) * 0.5;
        }
        posAttr.needsUpdate = true;

        points.rotation.y = Math.sin(t * 0.03) * 0.05;
      }

      // Smooth camera parallax toward pointer position
      targetCamera.x += (pointer.x * 0.9 - targetCamera.x) * 0.03;
      targetCamera.y += (pointer.y * 0.5 - targetCamera.y) * 0.03;
      camera.position.x = targetCamera.x;
      camera.position.y = targetCamera.y;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // ---- Cleanup ------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      geometry.dispose();
      material.dispose();
      glowTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [particleCount]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
