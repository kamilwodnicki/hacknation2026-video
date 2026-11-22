import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background, useIn } from "../components";
import { C, FONT, GRADIENT } from "../theme";

export const REVEAL_DURATION = 195; // +1 s on the expanded name

const WORDS = ["Parser", "Inteligentnie", "Strukturyzujący", "Materiały", "Odwoławcze"];

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const tagIn = useIn(96, 18);
  const glow = interpolate(Math.sin(frame / 12), [-1, 1], [30, 70]);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Background />
      <div style={{ display: "flex", gap: 8 }}>
        {"PISMO".split("").map((ch, i) => {
          const s = useIn(4 + i * 5, 11, 140);
          return (
            <div
              key={i}
              style={{
                fontSize: 260,
                fontWeight: 900,
                letterSpacing: -4,
                lineHeight: 1,
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                color: "transparent",
                filter: `drop-shadow(0 0 ${glow}px rgba(34,211,238,0.35))`,
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [120, 0])}px) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
              }}
            >
              {ch}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 34 }}>
        {WORDS.map((w, i) => {
          const s = useIn(40 + i * 7, 16);
          return (
            <div
              key={w}
              style={{ fontSize: 44, fontWeight: 600, color: C.muted, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)` }}
            >
              <span style={{ color: C.cyan, fontWeight: 900 }}>{w[0]}</span>
              {w.slice(1)}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 56,
          fontSize: 40,
          fontWeight: 700,
          color: C.text,
          opacity: tagIn,
          transform: `translateY(${interpolate(tagIn, [0, 1], [20, 0])}px)`,
        }}
      >
        Od PDF-a sprawy KIO do danych JSON — w kilka sekund.
      </div>
    </AbsoluteFill>
  );
};
