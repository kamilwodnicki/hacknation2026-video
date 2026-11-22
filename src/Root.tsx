import { Composition, Still } from "remotion";
import { AD_DURATION, PismoAd } from "./Ad";
import { TestVideo } from "./Composition";
import { Cover } from "./Cover";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="PismoAd" component={PismoAd} durationInFrames={AD_DURATION} fps={FPS} width={1920} height={1080} />
      <Still id="Cover" component={Cover} width={1920} height={1080} />
      <Composition id="TestVideo" component={TestVideo} durationInFrames={600} fps={60} width={1920} height={1080} />
    </>
  );
};
