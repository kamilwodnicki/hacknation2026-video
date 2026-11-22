import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const FPS = 30;

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});
const mono = loadMono("normal", { weights: ["400", "600", "700"], subsets: ["latin", "latin-ext"] });

export const FONT = inter.fontFamily;
export const MONO = mono.fontFamily;

export const C = {
  bg: "#070b18",
  bg2: "#0d1430",
  panel: "rgba(17, 24, 51, 0.88)",
  border: "rgba(148, 163, 255, 0.18)",
  text: "#eef2ff",
  muted: "#97a0c3",
  cyan: "#22d3ee",
  violet: "#8b5cf6",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
};

export const GRADIENT = `linear-gradient(90deg, ${C.cyan}, ${C.violet})`;
