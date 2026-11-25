"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HalftoneDot = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  order: number;
};

const revealDuration = 1700;
const dotSpacing = 4.6;

export default function AnimatedPortrait() {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const photoCanvas = photoCanvasRef.current;
    const context = canvas?.getContext("2d");
    const photoContext = photoCanvas?.getContext("2d");
    if (!frame || !image || !canvas || !context || !photoCanvas || !photoContext) return;

    let animationFrame = 0;
    let resizeObserver: ResizeObserver | undefined;

    const drawPortrait = () => {
      if (!image.complete || !image.naturalWidth) return;

      const { width, height } = frame.getBoundingClientRect();
      if (!width || !height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      photoCanvas.width = canvas.width;
      photoCanvas.height = canvas.height;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      const source = document.createElement("canvas");
      source.width = canvas.width;
      source.height = canvas.height;
      const sourceContext = source.getContext("2d", { willReadFrequently: true });
      if (!sourceContext) return;

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const imageWidth = image.naturalWidth * scale * pixelRatio;
      const imageHeight = image.naturalHeight * scale * pixelRatio;
      sourceContext.drawImage(
        image,
        (source.width - imageWidth) * 0.5,
        (source.height - imageHeight) * 0.28,
        imageWidth,
        imageHeight,
      );

      const pixels = sourceContext.getImageData(0, 0, source.width, source.height).data;
      const photoPixels = sourceContext.createImageData(source.width, source.height);
      photoPixels.data.set(pixels);
      for (let pixel = 0; pixel < pixels.length; pixel += 4) {
        const red = pixels[pixel];
        const green = pixels[pixel + 1];
        const blue = pixels[pixel + 2];
        const isBlueBackdrop = blue > 90 && blue > red * 1.35 && blue > green * 1.12;
        const luminance = isBlueBackdrop
          ? 0
          : Math.max(0, Math.min(255, (red * 0.2126 + green * 0.7152 + blue * 0.0722 - 16) * 1.08));
        photoPixels.data[pixel] = luminance;
        photoPixels.data[pixel + 1] = luminance;
        photoPixels.data[pixel + 2] = luminance;
        photoPixels.data[pixel + 3] = 255;
      }
      photoContext.putImageData(photoPixels, 0, 0);

      const shouldAnimate = motionEnabled
        && !reducedMotion
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        && !hasRevealedRef.current;

      if (!shouldAnimate) {
        hasRevealedRef.current = true;
        setRevealComplete(true);
        return;
      }

      const dots: HalftoneDot[] = [];

      for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
        for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
          const pixel = (Math.floor(y * pixelRatio) * source.width + Math.floor(x * pixelRatio)) * 4;
          const red = pixels[pixel];
          const green = pixels[pixel + 1];
          const blue = pixels[pixel + 2];
          const isBlueBackdrop = blue > 90 && blue > red * 1.35 && blue > green * 1.12;
          if (isBlueBackdrop) continue;

          const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
          const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
          const distance = Math.hypot(x - width * 0.5, (y - height * 0.43) * 0.88);
          dots.push({
            x,
            y,
            radius: 0.35 + luminance * 1.8,
            alpha: 0.22 + luminance * 0.75,
            order: distance + hash * 115,
          });
        }
      }

      dots.sort((a, b) => a.order - b.order);

      const paintDot = (dot: HalftoneDot, scale = 1) => {
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius * scale, 0, Math.PI * 2);
        context.fillStyle = `rgba(232, 231, 225, ${dot.alpha})`;
        context.fill();
      };

      let drawnCount = 0;
      const startedAt = performance.now();
      const reveal = (now: number) => {
        const progress = Math.min((now - startedAt) / revealDuration, 1);
        const easedProgress = 1 - (1 - progress) ** 2;
        const targetCount = Math.min(dots.length, Math.ceil(dots.length * easedProgress));

        dots.slice(drawnCount, targetCount).forEach((dot) => {
          paintDot(dot, 0.92 + easedProgress * 0.08);
        });
        drawnCount = targetCount;

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(reveal);
        } else {
          hasRevealedRef.current = true;
          setRevealComplete(true);
        }
      };

      animationFrame = window.requestAnimationFrame(reveal);
    };

    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(animationFrame);
      drawPortrait();
    });
    observer.observe(frame);
    resizeObserver = observer;

    if (image.complete) drawPortrait();
    else image.addEventListener("load", drawPortrait, { once: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      image.removeEventListener("load", drawPortrait);
    };
  }, [motionEnabled, reducedMotion]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const resetMotion = () => {
      frame.style.setProperty("--portrait-x", "0px");
      frame.style.setProperty("--portrait-y", "0px");
      frame.style.setProperty("--scroll-y", "0px");
      frame.style.setProperty("--light-x", "72%");
      frame.style.setProperty("--light-y", "20%");
    };

    if (!motionEnabled || reducedMotion) {
      resetMotion();
      return;
    }

    let pointerFrame = 0;
    const updateScroll = () => {
      const bounds = frame.getBoundingClientRect();
      const distanceFromCenter = window.innerHeight * 0.5 - (bounds.top + bounds.height * 0.5);
      const offset = Math.max(-10, Math.min(10, distanceFromCenter * 0.025));
      frame.style.setProperty("--scroll-y", `${offset.toFixed(2)}px`);
    };
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        const bounds = frame.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        frame.style.setProperty("--portrait-x", `${((x - 0.5) * 8).toFixed(2)}px`);
        frame.style.setProperty("--portrait-y", `${((y - 0.5) * 8).toFixed(2)}px`);
        frame.style.setProperty("--light-x", `${Math.round(x * 100)}%`);
        frame.style.setProperty("--light-y", `${Math.round(y * 100)}%`);
      });
    };
    const resetPointer = () => {
      frame.style.setProperty("--portrait-x", "0px");
      frame.style.setProperty("--portrait-y", "0px");
      frame.style.setProperty("--light-x", "72%");
      frame.style.setProperty("--light-y", "20%");
    };

    frame.addEventListener("pointermove", updatePointer);
    frame.addEventListener("pointerleave", resetPointer);
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    return () => {
      window.cancelAnimationFrame(pointerFrame);
      frame.removeEventListener("pointermove", updatePointer);
      frame.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", updateScroll);
    };
  }, [motionEnabled, reducedMotion]);

  return (
    <div
      className="hero-portrait"
      aria-label="Portrait of Syed Muhammad"
      data-motion={motionEnabled && !reducedMotion ? "on" : "off"}
      data-revealed={revealComplete}
    >
      <div className="portrait-frame" ref={frameRef}>
        <Image
          ref={imageRef}
          src="/images/syed-muhammad.jpeg"
          alt="Syed Muhammad wearing a navy blazer and black turtleneck"
          fill
          priority
          sizes="(max-width: 800px) 88vw, 42vw"
          className="portrait-image"
        />
        <canvas className="portrait-photo" ref={photoCanvasRef} aria-hidden="true" />
        <canvas className="portrait-halftone" ref={canvasRef} aria-hidden="true" />
        <div className="portrait-amber-light" aria-hidden="true" />
        <div className="portrait-texture" aria-hidden="true" />
      </div>
      <button
        className="portrait-motion-toggle"
        type="button"
        disabled={reducedMotion}
        aria-pressed={motionEnabled && !reducedMotion}
        aria-label={motionEnabled && !reducedMotion ? "Turn portrait motion off" : "Turn portrait motion on"}
        onClick={() => setMotionEnabled((enabled) => !enabled)}
      >
        {motionEnabled && !reducedMotion ? <Pause size={11} /> : <Play size={11} />}
        <span>MOTION {motionEnabled && !reducedMotion ? "ON" : "OFF"}</span>
      </button>
      <div className="portrait-orbit portrait-orbit--one" />
      <div className="portrait-orbit portrait-orbit--two" />
      <span className="portrait-label">THE DEVELOPER<br />BEHIND THE WORK</span>
      <span className="portrait-index">SM — 001</span>
      <span className="portrait-cross">✳</span>
    </div>
  );
}
