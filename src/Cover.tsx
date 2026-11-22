import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import hook from "../public/hook.json";
import { Background } from "./components";
import { C, FONT, GRADIENT, MONO } from "./theme";

// Real scan + exact value boxes (public/hook.json), cropped to the part with the data.
const CROP_TOP = 60;
const CROP_H = 470;
const CROP_LEFT = 40; // skip the scanner shadow on the left edge
const CARD_W = 700;
const SCALE = CARD_W / (hook.width - CROP_LEFT);
const PAD = 3;

const JSON_LINES: [string, string?][] = [
  ["{"],
  ['  "nazwa": ', '"Nordenix Automatyka Sp. z o.o."'],
  ['  "krs": ', '"9997873010"'],
  ['  "nip": ', '"9991785572"'],
  ['  "podpisujacy": ', '["Monika Kaczmarek", …]'],
  ['  "pelnomocnicy": ', '["Sylwia Sikora", …]'],
  ["}"],
];

const WORDS = ["Parser", "Inteligentnie", "Strukturyzujący", "Materiały", "Odwoławcze"];
const CHIPS = ["100% open source", "Otwarty model AI w UE", "~10 gr za 100 stron"];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Background />

    {/* left: name and promise */}
    <div style={{ position: "absolute", left: 110, top: 140, width: 940 }}>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 6,
          background: GRADIENT,
          WebkitBackgroundClip: "text",
          color: "transparent",
          display: "inline-block",
        }}
      >
        HACKNATION 2026 · ODWOŁANIA2JSON
      </div>
      <div
        style={{
          fontSize: 240,
          fontWeight: 900,
          letterSpacing: -6,
          lineHeight: 1,
          marginTop: 8,
          background: GRADIENT,
          WebkitBackgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 0 50px rgba(34,211,238,0.35))",
        }}
      >
        PISMO
      </div>
      <div style={{ fontSize: 29, fontWeight: 600, color: C.muted, marginTop: 14 }}>
        {WORDS.map((w) => (
          <span key={w} style={{ marginRight: 12 }}>
            <span style={{ color: C.cyan, fontWeight: 900 }}>{w[0]}</span>
            {w.slice(1)}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 62, fontWeight: 800, color: C.text, marginTop: 46, lineHeight: 1.15, letterSpacing: -1 }}>
        Od PDF-a sprawy KIO
        <br />
        do danych{" "}
        <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", color: "transparent" }}>JSON.</span>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 50, flexWrap: "wrap" }}>
        {CHIPS.map((c) => (
          <div
            key={c}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: `2px solid ${C.cyan}66`,
              background: "rgba(7,11,24,0.7)",
              color: C.text,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {c}
          </div>
        ))}
      </div>
    </div>

    <div style={{ position: "absolute", left: 110, bottom: 70, fontSize: 28, color: C.muted }}>
      Zespół <span style={{ color: C.text, fontWeight: 800 }}>Pierogi Driven Development</span>
    </div>

    {/* right: real scan with highlighted values */}
    <div
      style={{
        position: "absolute",
        left: 1080,
        top: 120,
        width: CARD_W,
        height: CROP_H * SCALE,
        borderRadius: 16,
        overflow: "hidden",
        transform: "rotate(-4deg)",
        boxShadow: "0 50px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.15)",
      }}
    >
      <Img
        src={staticFile("scan_pelnomocnictwo.jpg")}
        style={{ position: "absolute", left: -CROP_LEFT * SCALE, top: -CROP_TOP * SCALE, width: hook.width * SCALE, height: hook.height * SCALE }}
      />
      {hook.highlights.map((h, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (h.x - CROP_LEFT - PAD) * SCALE,
            top: (h.y - CROP_TOP - PAD) * SCALE,
            width: (h.w + 2 * PAD) * SCALE,
            height: (h.h + 2 * PAD) * SCALE,
            borderRadius: 4,
            background: `${C.cyan}33`,
            border: `2px solid ${C.cyan}`,
            boxShadow: `0 0 14px ${C.cyan}`,
            transform: `rotate(${h.angle}deg)`,
            transformOrigin: `${PAD * SCALE}px ${PAD * SCALE}px`,
          }}
        />
      ))}
    </div>

    {/* right: JSON result overlapping the scan */}
    <div
      style={{
        position: "absolute",
        left: 1110,
        top: 520,
        width: 750,
        padding: "26px 32px 30px",
        borderRadius: 22,
        background: "rgba(10,15,34,0.96)",
        border: `1px solid ${C.border}`,
        boxShadow: `0 50px 120px rgba(0,0,0,0.6), 0 0 80px ${C.cyan}22`,
        transform: "rotate(2.5deg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
        {["#f87171", "#fbbf24", "#34d399"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.85 }} />
        ))}
        <div style={{ marginLeft: 14, fontFamily: MONO, fontSize: 20, color: C.muted }}>output/pelnomocnictwo.json</div>
      </div>
      {JSON_LINES.map(([k, v], i) => (
        <div key={i} style={{ fontFamily: MONO, fontSize: 24, lineHeight: "40px", whiteSpace: "pre", color: "#c4cbe8" }}>
          {k}
          {v ? <span style={{ color: C.green }}>{v}</span> : null}
          {v && i < JSON_LINES.length - 2 ? "," : ""}
        </div>
      ))}
    </div>

    {/* arrow scan -> JSON */}
    <svg style={{ position: "absolute", left: 945, top: 470 }} width="170" height="170" viewBox="0 0 170 170">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.cyan} />
          <stop offset="1" stopColor={C.violet} />
        </linearGradient>
      </defs>
      <path d="M20 20 C 20 110, 70 140, 140 140" fill="none" stroke="url(#g)" strokeWidth="7" strokeLinecap="round" />
      <path d="M118 118 L142 140 L116 160" fill="none" stroke="url(#g)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </AbsoluteFill>
);
