import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Background, Heading, Pill, useIn } from "../components";
import { C, FPS, FONT } from "../theme";

/** A cut of a screen recording: source seconds [from, to] played at `rate`, then the frame at `to`
 * held still for `hold` seconds. */
type Cut = { from: number; to: number; rate: number; cover?: number; hold?: number };
const playFrames = (c: Cut) => Math.round(((c.to - c.from) * FPS) / c.rate);
const frames = (c: Cut) => playFrames(c) + Math.round((c.hold ?? 0) * FPS);

/** privacy: hide the Explorer navigation pane (account name, personal folders) */
const Cover: React.FC<{ width?: number; srcH: number }> = ({ width, srcH }) =>
  width ? <div style={{ position: "absolute", left: 0, top: 78, width, height: srcH - 120, background: "#1c1c1c" }} /> : null;

const SRC_W = 1918;

const Recording: React.FC<{
  src: string;
  cuts: Cut[];
  srcH: number;
  width: number;
  left: number;
  top: number;
  zoom?: { at: number; scale: number; originX: number; originY: number };
  children?: React.ReactNode;
}> = ({ src, cuts, srcH, width, left, top, zoom, children }) => {
  const frame = useCurrentFrame();
  const scale = width / SRC_W;
  const enter = useIn(0, 18, 110);
  const z = zoom
    ? interpolate(frame, [zoom.at, zoom.at + 24], [1, zoom.scale], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      })
    : 1;
  let start = 0;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height: srcH * scale,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [60, 0])}px)`,
        background: "#111",
      }}
    >
      <div style={{ width: SRC_W, height: srcH, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
      <div
        style={{
          width: SRC_W,
          height: srcH,
          transform: `scale(${z})`,
          transformOrigin: zoom ? `${zoom.originX}px ${zoom.originY}px` : "0 0",
          position: "relative",
        }}
      >
        {cuts.map((c, i) => {
          const from = start;
          const play = playFrames(c);
          const hold = frames(c) - play;
          start += play + hold;
          const videoStyle: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: SRC_W, height: srcH };
          return (
            <React.Fragment key={i}>
              <Sequence from={from} durationInFrames={play} layout="none">
                <OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(c.from * FPS)} playbackRate={c.rate} style={videoStyle} />
                <Cover width={c.cover} srcH={srcH} />
              </Sequence>
              {hold > 0 ? (
                <Sequence from={from + play} durationInFrames={hold} layout="none">
                  <Freeze frame={0}>
                    <OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(c.to * FPS) - 1} style={videoStyle} />
                  </Freeze>
                  <Cover width={c.cover} srcH={srcH} />
                </Sequence>
              ) : null}
            </React.Fragment>
          );
        })}
        {children}
      </div>
      </div>
    </div>
  );
};

/* ------------------------------ start.bat ------------------------------ */

const CLI_CUTS: Cut[] = [
  // input/ with three neutral file names (2.0–4.5 s skipped: accidental "choose an app" dialog)
  { from: 0.0, to: 1.6, rate: 1, cover: 200 },
  { from: 4.6, to: 5.9, rate: 1, cover: 200 },
  { from: 10.0, to: 13.0, rate: 1, cover: 200 }, // double click start.bat
  { from: 13.0, to: 21.6, rate: 4, cover: 98 }, // docker log, fast-forwarded
  // results; the window closes at ~26 s, so the last frame before that is held still
  { from: 21.6, to: 25.8, rate: 1, cover: 98, hold: 1.4 },
];
const CLI_RESULTS_AT = CLI_CUTS.slice(0, 4).reduce((s, c) => s + frames(c), 0);
const INPUT_END = frames(CLI_CUTS[0]) + frames(CLI_CUTS[1]);
export const CLI_DURATION = CLI_CUTS.reduce((s, c) => s + frames(c), 0);

export const CliDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - CLI_RESULTS_AT;
  const box = (delay: number) =>
    interpolate(local, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pill1 = useIn(CLI_RESULTS_AT + 34, 15);
  const pill0 = useIn(8, 15);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <Heading kicker="Jeden klik" title="Folder PDF-ów → folder JSON-ów" />
      <Recording
        src="nagranie_cli.mp4"
        cuts={CLI_CUTS}
        srcH={1020}
        width={1500}
        left={210}
        top={235}
        zoom={{ at: CLI_RESULTS_AT + 28, scale: 1.4, originX: 90, originY: 610 }}
      >
        {/* result lines [1/3]..[3/3] and the summary, in source pixels */}
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 536,
            width: 760,
            height: 82,
            borderRadius: 8,
            border: `4px solid ${C.cyan}`,
            boxShadow: `0 0 30px ${C.cyan}`,
            opacity: box(30),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 638,
            width: 560,
            height: 30,
            borderRadius: 8,
            border: `4px solid ${C.green}`,
            boxShadow: `0 0 30px ${C.green}`,
            opacity: box(42),
          }}
        />
      </Recording>
      <div style={{ position: "absolute", right: 70, top: 250, opacity: pill0 * interpolate(frame, [INPUT_END - 10, INPUT_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <Pill>input/ · nazwy plików bez znaczenia</Pill>
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 60, opacity: pill1, transform: `translateY(${interpolate(pill1, [0, 1], [30, 0])}px)` }}>
        <Pill color={C.green}>3 dokumenty rozpoznane · 1,4 s</Pill>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------- GUI --------------------------------- */

const GUI_CUTS: Cut[] = [
  { from: 0.0, to: 1.6, rate: 1 }, // start screen
  { from: 7.9, to: 14.1, rate: 1 }, // files uploaded → results → document next to data
];
const GUI_TABLE_AT = frames(GUI_CUTS[0]) + 6;
export const GUI_DURATION = GUI_CUTS.reduce((s, c) => s + frames(c), 0);

export const GuiDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const end = GUI_CUTS.reduce((s, c) => s + frames(c), 0);
  const p1 = interpolate(frame, [GUI_TABLE_AT, GUI_TABLE_AT + 10, GUI_TABLE_AT + 48, GUI_TABLE_AT + 58], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p2 = useIn(end - 70, 15);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background hue="violet" />
      <Heading kicker="Interfejs graficzny" title="Dokument obok wyodrębnionych danych" />
      <Recording src="nagranie_gui.mp4" cuts={GUI_CUTS} srcH={1018} width={1500} left={210} top={235} />
      <div style={{ position: "absolute", right: 70, top: 640, opacity: p1, transform: `translateX(${interpolate(p1, [0, 1], [40, 0])}px)` }}>
        <Pill>typ rozpoznany po treści</Pill>
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 70, opacity: p2, transform: `translateY(${interpolate(p2, [0, 1], [30, 0])}px)` }}>
        <Pill color={C.green}>przy każdej wartości: strona, fragment, reguła czy AI</Pill>
      </div>
    </AbsoluteFill>
  );
};
