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
    </>
  );
};
