// TODO rehacer la imagen en el featured car, con contenido curado.

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type FitMode = "smart" | "cover" | "contain";

interface ImageAdapterProps {
  src: string;
  alt: string;
  className?: string;
  fit?: FitMode;
  focalPoint?: { x: number; y: number };
  maxZoom?: number; 
}

export default function ImageAdapter({
  src,
  alt,
  className = "",
  fit = "smart",
  focalPoint,
  maxZoom = 2.2,
}: ImageAdapterProps) {
  const [smart, setSmart] = useState<{ x: number; y: number; zoom: number } | null>(null);

  useEffect(() => {
    if (fit !== "smart") {
      setSmart(null);
      return;
    }

    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.decoding = "async";
    img.src = src;

    img.onload = () => {
      try {
        const target = 96; 
        const scale = Math.min(target / img.naturalWidth, target / img.naturalHeight, 1);
        const w = Math.max(1, Math.floor(img.naturalWidth * scale));
        const h = Math.max(1, Math.floor(img.naturalHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("no-ctx");

        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        const sample = (x: number, y: number) => {
          const i = (y * w + x) * 4;
          return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
        };

        const c1 = sample(0, 0);
        const c2 = sample(w - 1, 0);
        const c3 = sample(0, h - 1);
        const c4 = sample(w - 1, h - 1);

        const bg = {
          r: Math.round((c1.r + c2.r + c3.r + c4.r) / 4),
          g: Math.round((c1.g + c2.g + c3.g + c4.g) / 4),
          b: Math.round((c1.b + c2.b + c3.b + c4.b) / 4),
        };

        let minX = w, minY = h, maxX = 0, maxY = 0;
        let hits = 0;

        const threshold = 55; 
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const a = data[i + 3];
            if (a < 20) continue;

            const r = data[i], g = data[i + 1], b = data[i + 2];
            const d = Math.abs(r - bg.r) + Math.abs(g - bg.g) + Math.abs(b - bg.b);

            if (d > threshold) {
              hits++;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (hits < w * h * 0.004) {
          if (!cancelled) setSmart(null);
          return;
        }

        const pad = 0.08;
        minX = Math.max(0, Math.floor(minX - w * pad));
        maxX = Math.min(w - 1, Math.floor(maxX + w * pad));
        minY = Math.max(0, Math.floor(minY - h * pad));
        maxY = Math.min(h - 1, Math.floor(maxY + h * pad));

        const bboxW = (maxX - minX + 1) / w;
        const bboxH = (maxY - minY + 1) / h;

        const cx = ((minX + maxX) / 2 / w) * 100;
        const cy = ((minY + maxY) / 2 / h) * 100;

        const zoom = Math.min(maxZoom, Math.max(1, 0.92 / Math.max(bboxW, bboxH)));

        if (!cancelled) setSmart({ x: cx, y: cy, zoom });
      } catch {
        if (!cancelled) setSmart(null);
      }
    };

    img.onerror = () => {
      if (!cancelled) setSmart(null);
    };

    return () => {
      cancelled = true;
    };
  }, [src, fit, maxZoom]);

  const fp = useMemo(() => {
    if (focalPoint) return focalPoint;
    if (fit === "smart" && smart) return { x: smart.x, y: smart.y };
    return { x: 50, y: 60 };
  }, [focalPoint, fit, smart]);

  const zoom = fit === "smart" ? (smart?.zoom ?? 1.12) : 1;
  const objectFit = fit === "contain" ? "contain" : "cover";

  return (
    <div className={`relative overflow-hidden w-full h-full bg-black/20 ${className}`}>
      <div
        className="absolute inset-0 z-0 opacity-25 scale-110 blur-3xl saturate-150 contrast-125"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: `${fp.x}% ${fp.y}%`,
        }}
      />

      <motion.img
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src={src}
        alt={alt}
        className="relative z-10 w-full h-full"
        style={{
          objectFit,
          objectPosition: `${fp.x}% ${fp.y}%`,
          transform: `scale(${zoom})`,
          transformOrigin: `${fp.x}% ${fp.y}%`,
          filter: "drop-shadow(0px 20px 50px rgba(0,0,0,0.65))",
        }}
      />

      <div className="absolute inset-0 z-20 bg-linear-to-t from-black/55 via-black/10 to-black/25 pointer-events-none" />
    </div>
  );
}
