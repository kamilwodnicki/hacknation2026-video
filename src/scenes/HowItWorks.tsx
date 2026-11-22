import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background, Heading, useIn } from "../components";
import { C, FONT, MONO } from "../theme";

const STEP = 132;
export const HOW_DURATION = 40 + STEP * 4 + 30;

const STEPS = [
  {
    n: 1,
    title: "Czyta",
    lines: ["PDF z tekstem albo skan", "OCR lokalnie na CPU — bez GPU"],
    tag: "tekst + OCR",
  },
  {
    n: 2,
    title: "Rozpoznaje",
    lines: ["odwołanie · pełnomocnictwo · przelew", "po treści, nie po nazwie pliku"],
    tag: "inny dokument → {}",
  },
  {
    n: 3,
    title: "Wyciąga",
    lines: ["reguły z konfiguracji + AI", "otwarty model Ministral 14B, serwery w UE"],
    tag: "reguły + AI",
  },
  {
    n: 4,
    title: "Sprawdza",
    lines: ["każda wartość AI musi być w dokumencie", "sumy kontrolne NIP · REGON · PESEL · IBAN"],
    tag: "null zamiast zgadywania",
  },
];

export const HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - 40;
  const active = Math.max(-1, Math.min(3, Math.floor(t / STEP)));
  const progress = interpolate(t, [0, STEP * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <Heading kicker="Jak to działa" title="Od PDF do danych w 4 krokach" />

      {/* progress rail */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 330, height: 6, borderRadius: 3, background: "rgba(148,163,255,0.15)" }}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 3,
            background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`,
            boxShadow: `0 0 20px ${C.cyan}`,
          }}
        />
      </div>

      <div style={{ position: "absolute", left: 120, right: 120, top: 380, display: "flex", gap: 36 }}>
        {STEPS.map((s, i) => {
          const appear = useIn(10 + i * 6, 16);
          const on = i <= active;
          const current = i === active;
          return (
            <div
              key={s.n}
              style={{
                flex: 1,
                height: 540,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: 26,
                padding: "32px 30px",
                background: current ? "rgba(34,211,238,0.10)" : C.panel,
                border: `2px solid ${current ? C.cyan : on ? "rgba(52,211,153,0.5)" : C.border}`,
                boxShadow: current ? `0 0 60px ${C.cyan}44` : "0 20px 60px rgba(0,0,0,0.4)",
                opacity: appear * (on ? 1 : 0.45),
                transform: `translateY(${interpolate(appear, [0, 1], [60, 0]) + (current ? -14 : 0)}px) scale(${current ? 1.04 : 1})`,
              }}
            >
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 39,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: 900,
                  color: on ? "#04101f" : C.muted,
                  background: on ? (current ? C.cyan : C.green) : "rgba(148,163,255,0.12)",
                }}
              >
                {s.n}
              </div>
              <div style={{ fontSize: 46, fontWeight: 800, color: C.text, marginTop: 24 }}>{s.title}</div>
              {s.lines.map((l) => (
                <div key={l} style={{ fontSize: 25, color: on ? "#cdd3f0" : C.muted, marginTop: 14, lineHeight: 1.3 }}>
                  {l}
                </div>
              ))}
              <div
                style={{
                  marginTop: "auto",
                  display: "inline-block",
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontFamily: MONO,
                  fontSize: 20,
                  whiteSpace: "nowrap",
                  color: current ? C.cyan : C.muted,
                  background: "rgba(7,11,24,0.6)",
                  border: `1px solid ${C.border}`,
                }}
              >
                {s.tag}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
