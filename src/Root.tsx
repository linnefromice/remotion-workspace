import React from "react";
import { Composition } from "remotion";
import { BasicAnimation } from "./BasicAnimation";
import {
  DataVisualization,
  dataVisualizationSchema,
  defaultDataVisualizationProps,
} from "./DataVisualization";
import {
  PresentationSlides,
  presentationSlidesSchema,
  defaultPresentationSlidesProps,
} from "./PresentationSlides";
import { ThreeScene } from "./ThreeScene";
import { ParticleSystem } from "./ParticleSystem";
import { AudioVisualizer } from "./AudioVisualizer";
import { MotionGraphics } from "./MotionGraphics";
import { TransitionDemo } from "./TransitionDemo";
import { LottieDemo } from "./LottieDemo";
import { NoiseArt } from "./NoiseArt";
import { CodeAnimation } from "./CodeAnimation";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="BasicAnimation"
        component={BasicAnimation}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DataVisualization"
        component={DataVisualization}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        schema={dataVisualizationSchema}
        defaultProps={defaultDataVisualizationProps}
      />
      <Composition
        id="PresentationSlides"
        component={PresentationSlides}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        schema={presentationSlidesSchema}
        defaultProps={defaultPresentationSlidesProps}
      />
      <Composition
        id="ThreeScene"
        component={ThreeScene}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ParticleSystem"
        component={ParticleSystem}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AudioVisualizer"
        component={AudioVisualizer}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MotionGraphics"
        component={MotionGraphics}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TransitionDemo"
        component={TransitionDemo}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LottieDemo"
        component={LottieDemo}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NoiseArt"
        component={NoiseArt}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CodeAnimation"
        component={CodeAnimation}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
