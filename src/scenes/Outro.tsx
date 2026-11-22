import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background, Check, Heading, useIn } from "../components";
import { C, FONT, GRADIENT, MONO } from "../theme";

// Order agreed with the team.
const PLUSES: [string, string][] = [
  ["100% open source", "licencja Apache 2.0"],
  ["Docker — szybkie wdrożenie", "jeden klik, zwykły laptop bez GPU"],
  ["Niska cena", "ok. 10 gr za 100 stron"],
  ["Pełna przejrzystość", "przy każdej wartości: strona, fragment, reguła czy AI"],
  ["Działa także bez AI", "same reguły, zero kosztów"],
  ["CLI + GUI + API", "do wsadu, do pracy ręcznej i do integracji"],
  ["Otwarty model AI", "Ministral 14B, serwery w UE"],
];

const EVERY = 22;
export const PLUSES_DURATION = 26 + PLUSES.length * EVERY + 60;

export const Pluses: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background hue="violet" />
      <Heading kicker="Dlaczego PISMO" title="Wszystko, czego potrzeba do wdrożenia" />
      <div
        style={{
          position: "absolute",
          left: 260,
          right: 260,
          top: 235,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {PLUSES.map(([p, sub], i) => {
          const at = 26 + i * EVERY;
          const s = interpolate(frame, [at, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "18px 30px",
                borderRadius: 18,
                background: C.panel,
                border: `1px solid ${C.border}`,
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [-50, 0])}px)`,
              }}
            >
              <div style={{ flexShrink: 0, display: "flex" }}>
                <Check size={44} />
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, color: C.text, flexShrink: 0 }}>{p}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: C.muted, marginLeft: "auto", textAlign: "right" }}>{sub}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const OUTRO_DURATION = 180;

export const Outro: React.FC = () => {
  const s = useIn(4, 14);
  const t = useIn(26, 16);
  const l = useIn(44, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Background />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          fontSize: 240,
          fontWeight: 900,
          letterSpacing: -4,
          background: GRADIENT,
          WebkitBackgroundClip: "text",
          color: "transparent",
          opacity: s,
          transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
        }}
      >
        PISMO
      </div>
      <div style={{ fontSize: 50, fontWeight: 800, color: C.text, opacity: t, marginTop: 10 }}>Od PDF-a do danych. Automatycznie.</div>
      <div
        style={{
          marginTop: 56,
          padding: "18px 34px",
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          background: C.panel,
          fontFamily: MONO,
          fontSize: 34,
          color: C.cyan,
          opacity: l,
        }}
      >
        github.com/kamilwodnicki/hacknation-2026
      </div>
      <div style={{ marginTop: 44, fontSize: 30, color: C.muted, opacity: l }}>
        Zespół{" "}
        <span style={{ color: C.text, fontWeight: 800 }}>Pierogi Driven Development</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 26, color: C.muted, opacity: l }}>HackNation 2026 · wyzwanie Odwołania2json · Urząd Zamówień Publicznych</div>
      </div>
    </AbsoluteFill>
  );
};
