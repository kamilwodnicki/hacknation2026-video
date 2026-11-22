import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background, Heading } from "../components";
import { C, FONT, GRADIENT } from "../theme";

const EACH = 96;

type Stat = { value: (p: number) => string; label: string; sub: string; color?: string };

const dec = (target: number) => (p: number) => (target * p).toFixed(2).replace(".", ",");

const STATS: Stat[] = [
  { value: (p) => `~${Math.max(1, Math.round(10 * p))} gr`, label: "za 100 stron z AI", sub: "otwarty model w UE · ok. 1 zł za 1000 stron" },
  { value: dec(1), label: "F1 na zbiorze treningowym", sub: "60 spraw × 3 dokumenty" },
  { value: dec(0.987), label: "F1 na nowych skanach", sub: "układy, których reguły nie widziały" },
];

export const NUMBERS_DURATION = 30 + EACH * STATS.length + 40;

export const Numbers: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - 30;
  const current = Math.max(0, Math.min(STATS.length - 1, Math.floor(t / EACH)));
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <Heading kicker="Wyniki" title="Zmierzone, nie obiecane" />

      {/* big current number */}
      {STATS.map((s, i) => {
        const local = t - i * EACH;
        const visible = i === current;
        if (!visible) return null;
        const p = interpolate(local, [0, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const appear = interpolate(local, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", opacity: appear }}>
            <div
              style={{
                fontSize: 230,
                fontWeight: 900,
                letterSpacing: -6,
                lineHeight: 1,
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                color: "transparent",
                transform: `scale(${interpolate(appear, [0, 1], [0.85, 1])})`,
              }}
            >
              {s.value(p)}
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: C.text, marginTop: 18 }}>{s.label}</div>
            <div style={{ fontSize: 32, color: C.muted, marginTop: 10 }}>{s.sub}</div>
          </div>
        );
      })}

      {/* collected strip */}
      <div style={{ position: "absolute", left: 300, right: 300, bottom: 80, display: "flex", gap: 26 }}>
        {STATS.map((s, i) => {
          const local = t - i * EACH;
          const on = interpolate(local, [30, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "18px 20px",
                borderRadius: 16,
                background: C.panel,
                border: `1px solid ${i === current ? C.cyan : C.border}`,
                opacity: on,
                transform: `translateY(${interpolate(on, [0, 1], [30, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 38, fontWeight: 900, color: C.text }}>{s.value(1)}</div>
              <div style={{ fontSize: 21, color: C.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
