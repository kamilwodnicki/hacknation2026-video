import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import hook from "../../public/hook.json";
import { Background, useIn } from "../components";
import { C, FONT, GRADIENT, MONO } from "../theme";

export const HOOK_DURATION = 195;

// Document card (the real scan) on the left: the upper part of the page, where the data is.
const CROP_TOP = 70;
const CROP_H = 600;
const DOC_W = 800;
const SCALE = DOC_W / hook.width;
const DOC_H = CROP_H * SCALE;
const DOC_TOP = 175;
const DOC_LEFT = 110;

// JSON panel on the right.
const PANEL_LEFT = 930;
const PANEL_TOP = 130;
const LINE_H = 46;
const FONT_SIZE = 27;
const CHAR_W = FONT_SIZE * 0.6; // JetBrains Mono advance width
const CODE_LEFT = PANEL_LEFT + 44;
const CODE_TOP = PANEL_TOP + 92;

const SCAN_START = 14;
const SCAN_END = 64;
const FLY = 16;

type Line = { text: string; value?: string; highlight?: number };

// Fragment of the real output of PISMO for this scan (output/…/0006.json).
const LINES: Line[] = [
  { text: "{" },
  { text: '  "mocodawca": [{' },
  { text: '    "nazwa": "Nordenix Automatyka Sp. z o.o.",', value: '"Nordenix Automatyka Sp. z o.o."', highlight: 0 },
  { text: '    "krs": "9997873010",', value: '"9997873010"', highlight: 1 },
  { text: '    "nip": "9991785572",', value: '"9991785572"', highlight: 2 },
  { text: '    "podpisujacy": [' },
  { text: '      "Monika Kaczmarek",', value: '"Monika Kaczmarek"', highlight: 5 },
  { text: '      "Dorota Szulc" ]', value: '"Dorota Szulc"', highlight: 6 },
  { text: "  }]," },
  { text: '  "pelnomocnicy": [' },
  { text: '      "Sylwia Sikora",', value: '"Sylwia Sikora"', highlight: 3 },
  { text: '      "Karolina Kaczmarek" ]', value: '"Karolina Kaczmarek"', highlight: 4 },
  { text: "}" },
];

const PAD = 3; // page px around the value

/** Exact rotated rectangle of the value (from OCR word boxes, scripts/wordbox), in screen px. */
const valueRect = (h: (typeof hook.highlights)[number]) => ({
  x: DOC_LEFT + (h.x - PAD) * SCALE,
  y: DOC_TOP + (h.y - CROP_TOP - PAD) * SCALE,
  w: (h.w + 2 * PAD) * SCALE,
  h: (h.h + 2 * PAD) * SCALE,
  angle: h.angle,
});

/** Frame at which the scanner line passes a page y coordinate. */
const scanFrame = (pageY: number) => SCAN_START + ((pageY - CROP_TOP) / CROP_H) * (SCAN_END - SCAN_START);

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const docIn = useIn(0, 18, 110);
  const panelIn = useIn(6, 18, 110);
  const titleIn = useIn(96, 15, 120);

  const scanY = interpolate(frame, [SCAN_START, SCAN_END], [CROP_TOP, CROP_TOP + CROP_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const scanning = frame >= SCAN_START && frame <= SCAN_END + 6;

  // Highlights trigger in the order the scanner reaches them, staggered so values fly one by one.
  const order = hook.highlights
    .map((h, i) => ({ i, y: h.y + h.h / 2, x: h.x }))
    .sort((a, b) => a.y - b.y || a.x - b.x);
  const hitFrame: Record<number, number> = {};
  order.forEach((o, rank) => {
    hitFrame[o.i] = Math.max(scanFrame(o.y), SCAN_START + 8 + rank * 7);
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />

      {/* The scan */}
      <div
        style={{
          position: "absolute",
          left: DOC_LEFT,
          top: DOC_TOP,
          width: DOC_W,
          height: DOC_H,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12)",
          opacity: docIn,
          transform: `perspective(1600px) rotateY(${interpolate(docIn, [0, 1], [-25, 0])}deg) translateX(${interpolate(docIn, [0, 1], [-120, 0])}px)`,
          transformOrigin: "left center",
        }}
      >
        <Img src={staticFile("scan_pelnomocnictwo.jpg")} style={{ position: "absolute", left: 0, top: -CROP_TOP * SCALE, width: DOC_W, height: hook.height * SCALE }} />
        {/* dim the page slightly so highlights pop */}
        <AbsoluteFill style={{ background: "rgba(7,11,24,0.12)" }} />
        {scanning ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (scanY - CROP_TOP) * SCALE - 60,
              height: 60,
              background: `linear-gradient(180deg, transparent, ${C.cyan}55)`,
              borderBottom: `3px solid ${C.cyan}`,
              boxShadow: `0 0 30px ${C.cyan}`,
            }}
          />
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: DOC_LEFT,
          top: DOC_TOP - 48,
          color: C.muted,
          fontSize: 24,
          fontWeight: 600,
          opacity: docIn,
        }}
      >
        Skan pełnomocnictwa (PDF bez tekstu)
      </div>

      {/* Highlight boxes on the page */}
      {hook.highlights.map((h, i) => {
        const r = valueRect(h);
        const t = frame - hitFrame[i];
        const on = interpolate(t, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (on <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              borderRadius: 5,
              background: `${C.cyan}33`,
              border: `2px solid ${C.cyan}`,
              boxShadow: `0 0 ${interpolate(t, [0, 8, 30], [0, 26, 10], { extrapolateRight: "clamp" })}px ${C.cyan}`,
              opacity: on,
              transform: `rotate(${r.angle}deg)`,
              transformOrigin: `${PAD * SCALE}px ${PAD * SCALE}px`,
            }}
          />
        );
      })}

      {/* JSON panel */}
      <div
        style={{
          position: "absolute",
          left: PANEL_LEFT,
          top: PANEL_TOP,
          width: 860,
          height: 720,
          borderRadius: 22,
          background: "rgba(10,15,34,0.92)",
          border: `1px solid ${C.border}`,
          boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
          opacity: panelIn,
          transform: `translateX(${interpolate(panelIn, [0, 1], [80, 0])}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 28px" }}>
          {["#f87171", "#fbbf24", "#34d399"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.8 }} />
          ))}
          <div style={{ marginLeft: 16, fontFamily: MONO, fontSize: 22, color: C.muted }}>output/0006.json</div>
        </div>
      </div>

      {LINES.map((line, li) => {
        const y = CODE_TOP + li * LINE_H;
        const hf = line.highlight !== undefined ? hitFrame[line.highlight] : undefined;
        const structIn = interpolate(frame, [10 + li * 2, 20 + li * 2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const arrive = hf !== undefined ? hf + FLY : 0;
        const valueOn = hf !== undefined ? interpolate(frame, [arrive - 2, arrive + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        const flash = hf !== undefined ? interpolate(frame, [arrive, arrive + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        const vIdx = line.value ? line.text.indexOf(line.value) : -1;
        const before = vIdx >= 0 ? line.text.slice(0, vIdx) : line.text;
        const after = vIdx >= 0 ? line.text.slice(vIdx + (line.value?.length ?? 0)) : "";
        return (
          <div
            key={li}
            style={{
              position: "absolute",
              left: CODE_LEFT,
              top: y,
              fontFamily: MONO,
              fontSize: FONT_SIZE,
              whiteSpace: "pre",
              color: "#c4cbe8",
              opacity: structIn * panelIn,
            }}
          >
            <span>{before}</span>
            {line.value ? (
              <span
                style={{
                  color: C.green,
                  opacity: valueOn,
                  background: `rgba(34,211,238,${0.35 * flash})`,
                  borderRadius: 6,
                }}
              >
                {line.value}
              </span>
            ) : null}
            <span style={{ opacity: line.value ? valueOn : 1 }}>{after}</span>
          </div>
        );
      })}

      {/* Values flying from the page into the JSON */}
      {LINES.filter((l) => l.highlight !== undefined).map((line) => {
        const i = line.highlight as number;
        const start = hitFrame[i] + 3;
        const p = interpolate(frame, [start, start + FLY], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
        if (p <= 0 || p >= 1) return null;
        const src = valueRect(hook.highlights[i]);
        const li = LINES.indexOf(line);
        const dstX = CODE_LEFT + line.text.indexOf(line.value as string) * CHAR_W;
        const dstY = CODE_TOP + li * LINE_H;
        const x = interpolate(p, [0, 1], [src.x, dstX]);
        const y = interpolate(p, [0, 1], [src.y, dstY]) - Math.sin(p * Math.PI) * 120;
        return (
          <div
            key={`fly-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              padding: "4px 12px",
              borderRadius: 8,
              background: C.cyan,
              color: "#04101f",
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: interpolate(p, [0, 1], [18, FONT_SIZE - 4]),
              whiteSpace: "nowrap",
              boxShadow: `0 0 30px ${C.cyan}`,
              transform: `scale(${1 + Math.sin(p * Math.PI) * 0.15})`,
            }}
          >
            {hook.highlights[i].value}
          </div>
        );
      })}

      {/* Claim */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 912,
          textAlign: "center",
          fontSize: 64,
          fontWeight: 900,
          color: C.text,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)`,
        }}
      >
        Skan PDF{" "}
        <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", color: "transparent" }}>→ dane JSON.</span>{" "}
        Automatycznie.
      </div>
    </AbsoluteFill>
  );
};
