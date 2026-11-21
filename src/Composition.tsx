import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT =
  '"Inter", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';

// Timeline (60 fps): scenes overlap slightly so transitions blend.
const S1_FROM = 0;
const S1_DUR = 225; // 0 – 3.75 s (overlaps into scene 2)
const S2_FROM = 195; // transition starts at 3.25 s, fully in by ~3.6 s
const S2_DUR = 240;
const S3_FROM = 405; // transition starts at 6.75 s, fully in by ~7.1 s
const S3_DUR = 600 - S3_FROM;

const coverImg: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/* ---------------- Scene 1: building 1 + "TEST WIDEO" ---------------- */
const SceneOne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, S1_DUR], [1, 1.28], {
    easing: Easing.bezier(0.33, 0, 0.2, 1),
    extrapolateRight: "clamp",
  });

  const titleIn = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 120 } });
  const lineIn = spring({ frame: frame - 30, fps, config: { damping: 200 } });

  const titleScale = interpolate(titleIn, [0, 1], [0.7, 1]);
  const titleBlur = interpolate(titleIn, [0, 1], [24, 0]);
  const spacing = interpolate(titleIn, [0, 1], [60, 18]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img src={staticFile("building1.jpg")} style={coverImg} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 210,
            color: "white",
            letterSpacing: spacing,
            paddingLeft: spacing, // keep visually centred despite tracking
            opacity: titleIn,
            filter: `blur(${titleBlur}px)`,
            transform: `scale(${titleScale})`,
            textShadow: "0 20px 60px rgba(0,0,0,0.55)",
          }}
        >
          TEST WIDEO
        </div>
        <div
          style={{
            marginTop: 24,
            height: 8,
            width: 520 * lineIn,
            borderRadius: 4,
            background: "linear-gradient(90deg, #00e0ff, #7c4dff)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------- Scene 2: building 2, side pan + caption -------------- */
const SceneTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fast springy wipe-in from the right.
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const clipLeft = interpolate(enter, [0, 1], [100, 0]);
  const enterScale = interpolate(enter, [0, 1], [1.25, 1.12]);

  // Gentle lateral camera move (image is scaled so edges never show).
  const pan = interpolate(frame, [0, S2_DUR], [70, -70], {
    easing: Easing.inOut(Easing.sin),
  });

  const caption = spring({ frame: frame - 28, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${clipLeft}%)` }}>
      <AbsoluteFill
        style={{ transform: `translateX(${pan}px) scale(${enterScale})` }}
      >
        <Img src={staticFile("building2.jpg")} style={coverImg} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 45%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 80,
          opacity: caption,
          transform: `translateY(${interpolate(caption, [0, 1], [40, 0])}px)`,
          fontFamily: FONT,
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 6,
            color: "#00e0ff",
          }}
        >
          SCENA 02
        </div>
        <div style={{ fontSize: 54, fontWeight: 800, marginTop: 6 }}>
          Architektura z charakterem
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* -------- Scene 3: dog photo with 3D tilt + "GOTOWE DO DZIAŁANIA" ------ */
const SceneThree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const card = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 90 } });
  const rotY = interpolate(card, [0, 1], [-75, -14]);
  const rotX = interpolate(card, [0, 1], [18, 6]);
  const tx = interpolate(card, [0, 1], [-900, 0]);
  const float = Math.sin(frame / 28) * 8;

  const words = ["GOTOWE", "DO", "DZIAŁANIA"];

  return (
    <AbsoluteFill style={{ opacity: bgIn }}>
      {/* Background: blurred, darkened dog photo */}
      <AbsoluteFill style={{ transform: "scale(1.2)", filter: "blur(40px) brightness(0.45)" }}>
        <Img src={staticFile("dog.jpg")} style={coverImg} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(120deg, rgba(10,10,30,0.6) 0%, rgba(40,10,80,0.35) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 110,
          perspective: 1800,
        }}
      >
        <div
          style={{
            width: 860,
            height: 648, // matches dog.jpg aspect ratio (515x388)
            borderRadius: 28,
            overflow: "hidden",
            transform: `translateX(${tx}px) translateY(${float}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
            boxShadow:
              "40px 50px 90px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.15)",
          }}
        >
          <Img src={staticFile("dog.jpg")} style={coverImg} />
        </div>

        <div style={{ fontFamily: FONT, color: "white", width: 720 }}>
          {words.map((w, i) => {
            const s = spring({
              frame: frame - 30 - i * 9,
              fps,
              config: { damping: 12, stiffness: 130 },
            });
            return (
              <div
                key={w}
                style={{
                  fontSize: w === "DO" ? 70 : 118,
                  fontWeight: 900,
                  lineHeight: 1.02,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [70, 0])}px)`,
                  background:
                    i === 2
                      ? "linear-gradient(90deg, #00e0ff, #a66bff)"
                      : undefined,
                  WebkitBackgroundClip: i === 2 ? "text" : undefined,
                  color: i === 2 ? "transparent" : "white",
                  textShadow: i === 2 ? undefined : "0 12px 40px rgba(0,0,0,0.5)",
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TestVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={S1_FROM} durationInFrames={S1_DUR} name="Otwarcie">
        <SceneOne />
      </Sequence>
      <Sequence from={S2_FROM} durationInFrames={S2_DUR} name="Druga scena">
        <SceneTwo />
      </Sequence>
      <Sequence from={S3_FROM} durationInFrames={S3_DUR} name="Finał">
        <SceneThree />
      </Sequence>
    </AbsoluteFill>
  );
};
