import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, GRADIENT } from "./theme";

/** Dark animated background shared by every scene. */
export const Background: React.FC<{ hue?: "cyan" | "violet" }> = ({ hue = "cyan" }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 60;
  const glow = hue === "cyan" ? "rgba(34,211,238,0.16)" : "rgba(139,92,246,0.18)";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 0%, ${C.bg2} 0%, ${C.bg} 65%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: 1100 + drift,
          top: -300,
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          left: -250 - drift,
          top: 500,
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Spring 0 → 1 starting at `delay` frames. */
export const useIn = (delay = 0, damping = 16, stiffness = 120) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

/** Scene header: small gradient kicker + big title. */
export const Heading: React.FC<{ kicker: string; title: string; delay?: number; top?: number; center?: boolean }> = ({
  kicker,
  title,
  delay = 0,
  top = 70,
  center = false,
}) => {
  const s = useIn(delay);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: center ? 0 : 120,
        right: center ? 0 : undefined,
        textAlign: center ? "center" : "left",
        fontFamily: FONT,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          background: GRADIENT,
          WebkitBackgroundClip: "text",
          color: "transparent",
          display: "inline-block",
        }}
      >
        {kicker}
      </div>
      <div style={{ fontSize: 60, fontWeight: 800, color: C.text, marginTop: 6, letterSpacing: -1 }}>{title}</div>
    </div>
  );
};

/** Rounded pill label used for call-outs. */
export const Pill: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.cyan,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 26px",
      borderRadius: 999,
      background: "rgba(7,11,24,0.86)",
      border: `2px solid ${color}`,
      boxShadow: `0 0 40px ${color}55`,
      color: C.text,
      fontFamily: FONT,
      fontSize: 30,
      fontWeight: 700,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Check mark drawn in SVG (no emoji fonts needed). */
export const Check: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
    <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
