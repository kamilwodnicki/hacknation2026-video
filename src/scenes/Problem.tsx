import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Background, useIn } from "../components";
import { C, FONT } from "../theme";

export const PROBLEM_DURATION = 225;

const DOCS = [
  { file: "doc_odwolanie.jpg", label: "Odwołanie", rot: -9, x: -150 },
  { file: "doc_pelnomocnictwo.jpg", label: "Pełnomocnictwo", rot: 0, x: 0 },
  { file: "doc_przelew.jpg", label: "Potwierdzenie przelewu", rot: 9, x: 150 },
];

const LINES = [
  { text: "Tysiące spraw odwoławczych KIO rocznie.", at: 18, color: C.text },
  { text: "Każda to kilka PDF-ów — tekst albo skan,", at: 62, color: C.text },
  { text: "a każdy dokument ma inny układ.", at: 84, color: C.text },
  { text: "Dziś dane przepisuje się ręcznie.", at: 135, color: C.amber },
];

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background hue="violet" />
      {DOCS.map((d, i) => {
        const s = useIn(4 + i * 8, 15, 100);
        const wobble = Math.sin((frame + i * 20) / 30) * 1.2;
        return (
          <div
            key={d.file}
            style={{
              position: "absolute",
              left: 330 + d.x * s,
              top: 230,
              width: 430,
              height: 600,
              borderRadius: 12,
              overflow: "hidden",
              background: "white",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              transform: `rotate(${d.rot * s + wobble}deg) translateY(${interpolate(s, [0, 1], [300, 0])}px)`,
              opacity: s,
            }}
          >
            <Img src={staticFile(d.file)} style={{ width: "100%" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "14px 18px",
                background: "linear-gradient(0deg, rgba(7,11,24,0.92), rgba(7,11,24,0))",
                color: "white",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              PDF · {d.label}
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 990, top: 290, width: 860 }}>
        {LINES.map((l) => {
          const s = interpolate(frame, [l.at, l.at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={l.text}
              style={{
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.25,
                color: l.color,
                marginBottom: l.at > 100 ? 0 : 18,
                marginTop: l.at > 100 ? 40 : 0,
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
