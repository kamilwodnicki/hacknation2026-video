import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { CLI_DURATION, CliDemo, GUI_DURATION, GuiDemo } from "./scenes/Demos";
import { HOOK_DURATION, Hook } from "./scenes/Hook";
import { HOW_DURATION, HowItWorks } from "./scenes/HowItWorks";
import { NUMBERS_DURATION, Numbers } from "./scenes/Numbers";
import { OUTRO_DURATION, Outro, PLUSES_DURATION, Pluses } from "./scenes/Outro";
import { PROBLEM_DURATION, Problem } from "./scenes/Problem";
import { REVEAL_DURATION, Reveal } from "./scenes/Reveal";
import { YAML_DURATION, Yaml } from "./scenes/Yaml";

const T = 15; // transition length (frames)

const SCENES: { id: string; duration: number; Component: React.FC; enter?: "slide" | "fade" }[] = [
  { id: "Hak: skan → JSON", duration: HOOK_DURATION, Component: Hook },
  { id: "Problem", duration: PROBLEM_DURATION, Component: Problem, enter: "fade" },
  { id: "PISMO", duration: REVEAL_DURATION, Component: Reveal, enter: "fade" },
  { id: "Jak to działa", duration: HOW_DURATION, Component: HowItWorks, enter: "slide" },
  { id: "Demo: start.bat", duration: CLI_DURATION, Component: CliDemo, enter: "slide" },
  { id: "Demo: GUI", duration: GUI_DURATION, Component: GuiDemo, enter: "slide" },
  { id: "Nowy typ: YAML", duration: YAML_DURATION, Component: Yaml, enter: "slide" },
  { id: "Liczby", duration: NUMBERS_DURATION, Component: Numbers, enter: "fade" },
  { id: "Atuty", duration: PLUSES_DURATION, Component: Pluses, enter: "slide" },
  { id: "Finał", duration: OUTRO_DURATION, Component: Outro, enter: "fade" },
];

export const AD_DURATION = SCENES.reduce((s, sc) => s + sc.duration, 0) - T * (SCENES.length - 1);

export const PismoAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#070b18" }}>
    {/* Own synthesized track (public/muzyka.wav, no third-party rights); fades out with the video. */}
    <Audio
      src={staticFile("muzyka.wav")}
      volume={(f) =>
        interpolate(f, [0, 10, AD_DURATION - 45, AD_DURATION - 1], [0, 0.85, 0.85, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <TransitionSeries>
      {SCENES.map(({ id, duration, Component, enter }, i) => (
        <React.Fragment key={id}>
          {i > 0 ? (
            <TransitionSeries.Transition
              presentation={enter === "slide" ? slide({ direction: "from-right" }) : fade()}
              timing={linearTiming({ durationInFrames: T })}
            />
          ) : null}
          <TransitionSeries.Sequence durationInFrames={duration} name={id}>
            <Component />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}
    </TransitionSeries>
  </AbsoluteFill>
);
