import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background, Heading, useIn } from "../components";
import { C, FONT, MONO } from "../theme";

export const YAML_DURATION = 300;

// Shortened version of the example from docs/nowy-typ-dokumentu.md (real syntax).
const YAML: [string, string][] = [
  ["name: ", "zawiadomienie_wybor"],
  ["description: ", "Zawiadomienie o wyborze oferty"],
  ["classification:", ""],
  ["  keywords:", ""],
  ["    - ", "wybór najkorzystniejszej oferty"],
  ["    - ", "zamawiający informuje"],
  ["  min_score: ", "2"],
  ["output:", ""],
  ["  numer_postepowania:", ""],
  ["    type: ", "reference"],
  ["  wybrany_wykonawca:", ""],
  ["    type: ", "company"],
  ["  cena:", ""],
  ["    type: ", "amount"],
];

const TYPES = ["odwolanie · 22 pola", "pelnomocnictwo · 8 pól", "przelew · 6 pól"];
const TYPE_AT = 30 + YAML.length * 8 + 18;

export const Yaml: React.FC = () => {
  const frame = useCurrentFrame();
  const editorIn = useIn(6, 18);
  const listIn = useIn(16, 18);
  const newIn = useIn(TYPE_AT, 12, 140);
  const claimIn = useIn(TYPE_AT + 30, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background hue="violet" />
      <Heading kicker="Elastyczność" title="Nowy typ dokumentu? Jeden plik YAML." />

      {/* editor */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 250,
          width: 980,
          height: 720,
          borderRadius: 22,
          background: "rgba(10,15,34,0.94)",
          border: `1px solid ${C.border}`,
          boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
          opacity: editorIn,
          transform: `translateY(${interpolate(editorIn, [0, 1], [60, 0])}px)`,
        }}
      >
        <div style={{ padding: "22px 28px", fontFamily: MONO, fontSize: 22, color: C.muted, borderBottom: `1px solid ${C.border}` }}>
          config/document_types/<span style={{ color: C.text }}>zawiadomienie_wybor.yaml</span>
        </div>
        <div style={{ padding: "22px 34px" }}>
          {YAML.map(([k, v], i) => {
            const at = 30 + i * 8;
            const shown = interpolate(frame, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ fontFamily: MONO, fontSize: 29, lineHeight: "41px", whiteSpace: "pre", opacity: shown }}>
                <span style={{ color: "#93c5fd" }}>{k}</span>
                <span style={{ color: C.green }}>{v}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* document types list, as in the GUI sidebar */}
      <div
        style={{
          position: "absolute",
          left: 1160,
          top: 250,
          width: 640,
          borderRadius: 22,
          padding: "30px 32px",
          background: C.panel,
          border: `1px solid ${C.border}`,
          opacity: listIn,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 800, color: C.text, marginBottom: 20 }}>Typy dokumentów</div>
        {TYPES.map((t) => (
          <div key={t} style={rowStyle(false)}>
            {t}
          </div>
        ))}
        <div
          style={{
            ...rowStyle(true),
            opacity: newIn,
            transform: `scale(${interpolate(newIn, [0, 1], [0.7, 1])})`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>zawiadomienie_wybor · 3 pola</span>
          <span style={{ fontSize: 20, fontWeight: 900, padding: "4px 12px", borderRadius: 8, background: C.green, color: "#04101f" }}>NOWY</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1160,
          top: 770,
          width: 640,
          fontSize: 36,
          fontWeight: 700,
          lineHeight: 1.35,
          color: C.text,
          opacity: claimIn,
          transform: `translateY(${interpolate(claimIn, [0, 1], [30, 0])}px)`,
        }}
      >
        Bez programowania.
        <div style={{ fontSize: 28, fontWeight: 500, color: C.muted, marginTop: 12 }}>
          Rozpoznawanie, pola, reguły i prompt AI — z jednego pliku konfiguracji.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const rowStyle = (isNew: boolean): React.CSSProperties => ({
  padding: "18px 22px",
  borderRadius: 14,
  marginBottom: 14,
  fontSize: 28,
  fontWeight: 600,
  color: C.text,
  background: isNew ? "rgba(52,211,153,0.12)" : "rgba(7,11,24,0.55)",
  border: `2px solid ${isNew ? C.green : C.border}`,
  boxShadow: isNew ? `0 0 40px ${C.green}55` : undefined,
});
