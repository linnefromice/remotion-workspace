import React from "react";
import { Composition, Folder } from "remotion";
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
import { AgentFlow } from "./AgentFlow";
import { AgentFlowCodex } from "./AgentFlowCodex";
import { CANVAS_W, CANVAS_H, FPS, TOTAL_FRAMES } from "./AgentFlowCodex/constants";
import { AgentFlowCodexReClaude } from "./AgentFlowCodexReClaude";
import {
  CANVAS_W as RECLAUDE_CANVAS_W,
  CANVAS_H as RECLAUDE_CANVAS_H,
  FPS as RECLAUDE_FPS,
  TOTAL_FRAMES as RECLAUDE_TOTAL_FRAMES,
} from "./AgentFlowCodexReClaude/constants";
import { IconsPreview } from "./AgentFlowCodexReClaude/previews/IconsPreview";
import { IconNodesPreview } from "./AgentFlowCodexReClaude/previews/IconNodesPreview";
import { NodeCardsPreview } from "./AgentFlowCodexReClaude/previews/NodeCardsPreview";
import { ConnectorsPreview } from "./AgentFlowCodexReClaude/previews/ConnectorsPreview";
import { LegendAndStepsPreview } from "./AgentFlowCodexReClaude/previews/LegendAndStepsPreview";
import { MiscPreview } from "./AgentFlowCodexReClaude/previews/MiscPreview";
import { AgentFlowInquiryIcons } from "./AgentFlowInquiryIcons";
import { AgentFlowInquiry } from "./AgentFlowInquiry";
import { AgentFlowClaimIntake } from "./AgentFlowClaimIntake";
import {
  CANVAS_W as CLAIM_CANVAS_W,
  CANVAS_H as CLAIM_CANVAS_H,
  FPS as CLAIM_FPS,
  TOTAL_FRAMES as CLAIM_TOTAL_FRAMES,
} from "./AgentFlowClaimIntake/constants";
import {
  CANVAS_W as INQUIRY_CANVAS_W,
  CANVAS_H as INQUIRY_CANVAS_H,
  FPS as INQUIRY_FPS,
  TOTAL_FRAMES as INQUIRY_TOTAL_FRAMES,
} from "./AgentFlowInquiry/constants";

export const Root: React.FC = () => {
  return (
    <>
      <Folder name="Examples">
        <Folder name="Basics">
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
        </Folder>
        <Folder name="3D">
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
        </Folder>
        <Folder name="Effects">
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
        </Folder>
      </Folder>
      <Composition
        id="AgentFlowCodex"
        component={AgentFlowCodex}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={CANVAS_W}
        height={CANVAS_H}
      />
      <Composition
        id="AgentFlowCodexReClaude"
        component={AgentFlowCodexReClaude}
        durationInFrames={RECLAUDE_TOTAL_FRAMES}
        fps={RECLAUDE_FPS}
        width={RECLAUDE_CANVAS_W}
        height={RECLAUDE_CANVAS_H}
      />
      <Composition
        id="AgentFlow"
        component={AgentFlow}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AgentFlowInquiryIcons"
        component={AgentFlowInquiryIcons}
        durationInFrames={INQUIRY_TOTAL_FRAMES}
        fps={INQUIRY_FPS}
        width={INQUIRY_CANVAS_W}
        height={INQUIRY_CANVAS_H}
      />
      <Composition
        id="AgentFlowClaimIntake"
        component={AgentFlowClaimIntake}
        durationInFrames={CLAIM_TOTAL_FRAMES}
        fps={CLAIM_FPS}
        width={CLAIM_CANVAS_W}
        height={CLAIM_CANVAS_H}
      />
      <Composition
        id="AgentFlowInquiry"
        component={AgentFlowInquiry}
        durationInFrames={INQUIRY_TOTAL_FRAMES}
        fps={INQUIRY_FPS}
        width={INQUIRY_CANVAS_W}
        height={INQUIRY_CANVAS_H}
      />
      <Folder name="Components">
        <Folder name="AgentFlowCodexReClaude">
          <Composition
            id="Components-AgentFlowCodexReClaude-Icons"
            component={IconsPreview}
            durationInFrames={1}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Components-AgentFlowCodexReClaude-IconNodes"
            component={IconNodesPreview}
            durationInFrames={1}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Components-AgentFlowCodexReClaude-NodeCards"
            component={NodeCardsPreview}
            durationInFrames={1}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Components-AgentFlowCodexReClaude-Connectors"
            component={ConnectorsPreview}
            durationInFrames={1}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Components-AgentFlowCodexReClaude-LegendAndSteps"
            component={LegendAndStepsPreview}
            durationInFrames={1}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Components-AgentFlowCodexReClaude-Misc"
            component={MiscPreview}
            durationInFrames={1}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
      </Folder>
    </>
  );
};
