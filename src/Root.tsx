import { Composition } from "remotion";
import { TestVideo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TestVideo"
        component={TestVideo}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
