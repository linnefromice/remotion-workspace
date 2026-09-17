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

// フロー図
import { AgentFlowClaimIntake } from "./AgentFlowClaimIntake";
import {
  AgentFlowClaimIntakeIcons,
  AgentFlowClaimIntakeLogoSeal,
  AgentFlowClaimIntakeIconsV2,
  AgentFlowClaimIntakeActionRow,
} from "./AgentFlowClaimIntakeIcons";
import {
  ClaimIntakeSideBySide,
  SIDE_BY_SIDE_PRESETS,
  sideBySideSchema,
} from "./ClaimIntakeSideBySide";
import {
  CANVAS_W as CLAIM_W,
  CANVAS_H as CLAIM_H,
  FPS as CLAIM_FPS,
  TOTAL_FRAMES as CLAIM_FRAMES,
} from "./AgentFlowClaimIntake/constants";
import { AgentFlowInquiry } from "./AgentFlowInquiry";
import {
  AgentFlowInquiryIcons,
  AgentFlowInquiryLogoSeal,
  AgentFlowInquiryIconsV2,
  AgentFlowInquiryActionRow,
} from "./AgentFlowInquiryIcons";
import {
  CANVAS_W as INQUIRY_W,
  CANVAS_H as INQUIRY_H,
  FPS as INQUIRY_FPS,
  TOTAL_FRAMES as INQUIRY_FRAMES,
} from "./AgentFlowInquiry/constants";
import { AgentFlowCodex } from "./AgentFlowCodex";
import {
  CANVAS_W as CODEX_W,
  CANVAS_H as CODEX_H,
  FPS as CODEX_FPS,
  TOTAL_FRAMES as CODEX_FRAMES,
} from "./AgentFlowCodex/constants";
import { AgentFlowCodexReClaude } from "./AgentFlowCodexReClaude";
import {
  CANVAS_W as RECLAUDE_W,
  CANVAS_H as RECLAUDE_H,
  FPS as RECLAUDE_FPS,
  TOTAL_FRAMES as RECLAUDE_FRAMES,
} from "./AgentFlowCodexReClaude/constants";
import { AgentFlow } from "./AgentFlow";

// 部品カタログ
import { BrandSealNodesPreview } from "./AgentFlowCodexReClaude/previews/BrandSealNodesPreview";
import { ServiceNodesPreview } from "./AgentFlowCodexReClaude/previews/ServiceNodesPreview";
import { IconNodesPreview } from "./AgentFlowCodexReClaude/previews/IconNodesPreview";
import { NodeCardsPreview } from "./AgentFlowCodexReClaude/previews/NodeCardsPreview";
import { IconsPreview } from "./AgentFlowCodexReClaude/previews/IconsPreview";
import { ConnectorsPreview } from "./AgentFlowCodexReClaude/previews/ConnectorsPreview";
import { LegendAndStepsPreview } from "./AgentFlowCodexReClaude/previews/LegendAndStepsPreview";
import { MiscPreview } from "./AgentFlowCodexReClaude/previews/MiscPreview";

const HD = { fps: 30, width: 1920, height: 1080 } as const;
const STILL = { durationInFrames: 1, ...HD } as const;

/**
 * サイドバーの並びは「題材 > 見せ方」。
 * id がそのままサイドバーの表示名になるので、題材と見せ方が読み取れる名前にしている。
 * 同じ題材の4つはノードの描き方だけが違い、構造とタイムラインは共有している。
 */
export const Root: React.FC = () => {
  return (
    <>
      <Folder name="AgentFlow">
        {/* 実装済みPoC（farleap/tenant-claim-intake-demoapp）の構造 */}
        <Folder name="ClaimIntake">
          <Composition
            id="ClaimIntake-Cards"
            component={AgentFlowClaimIntake}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-Icons"
            component={AgentFlowClaimIntakeIcons}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-IconsV2"
            component={AgentFlowClaimIntakeIconsV2}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-LogoSeal"
            component={AgentFlowClaimIntakeLogoSeal}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-ActionRow"
            component={AgentFlowClaimIntakeActionRow}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          {/* プレゼン用1枚サイト。案の切り替えは props パネルから。docs/presentation-site.md */}
          <Composition
            id="ClaimIntake-SideBySide"
            component={ClaimIntakeSideBySide}
            schema={sideBySideSchema}
            defaultProps={SIDE_BY_SIDE_PRESETS.plain}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-SideBySide-Map"
            component={ClaimIntakeSideBySide}
            schema={sideBySideSchema}
            defaultProps={SIDE_BY_SIDE_PRESETS.map}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-SideBySide-Counterfactual"
            component={ClaimIntakeSideBySide}
            schema={sideBySideSchema}
            defaultProps={SIDE_BY_SIDE_PRESETS.counterfactual}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-SideBySide-Full"
            component={ClaimIntakeSideBySide}
            schema={sideBySideSchema}
            defaultProps={SIDE_BY_SIDE_PRESETS.full}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-SideBySide-Timeline"
            component={ClaimIntakeSideBySide}
            schema={sideBySideSchema}
            defaultProps={SIDE_BY_SIDE_PRESETS.timeline}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
        </Folder>

        {/* 問い合わせ対応フローの構想 */}
        <Folder name="Inquiry">
          <Composition
            id="Inquiry-Cards"
            component={AgentFlowInquiry}
            durationInFrames={INQUIRY_FRAMES}
            fps={INQUIRY_FPS}
            width={INQUIRY_W}
            height={INQUIRY_H}
          />
          <Composition
            id="Inquiry-Icons"
            component={AgentFlowInquiryIcons}
            durationInFrames={INQUIRY_FRAMES}
            fps={INQUIRY_FPS}
            width={INQUIRY_W}
            height={INQUIRY_H}
          />
          <Composition
            id="Inquiry-IconsV2"
            component={AgentFlowInquiryIconsV2}
            durationInFrames={INQUIRY_FRAMES}
            fps={INQUIRY_FPS}
            width={INQUIRY_W}
            height={INQUIRY_H}
          />
          <Composition
            id="Inquiry-LogoSeal"
            component={AgentFlowInquiryLogoSeal}
            durationInFrames={INQUIRY_FRAMES}
            fps={INQUIRY_FPS}
            width={INQUIRY_W}
            height={INQUIRY_H}
          />
          <Composition
            id="Inquiry-ActionRow"
            component={AgentFlowInquiryActionRow}
            durationInFrames={INQUIRY_FRAMES}
            fps={INQUIRY_FPS}
            width={INQUIRY_W}
            height={INQUIRY_H}
          />
        </Folder>

        {/* Cloudflare 音声エージェント参照図の再現と、その保守性リファクタ版 */}
        <Folder name="Reference">
          <Composition
            id="Reference-Cloudflare"
            component={AgentFlowCodex}
            durationInFrames={CODEX_FRAMES}
            fps={CODEX_FPS}
            width={CODEX_W}
            height={CODEX_H}
          />
          <Composition
            id="Reference-Cloudflare-Refactored"
            component={AgentFlowCodexReClaude}
            durationInFrames={RECLAUDE_FRAMES}
            fps={RECLAUDE_FPS}
            width={RECLAUDE_W}
            height={RECLAUDE_H}
          />
        </Folder>

        {/* 展示会で流す20秒シームレスループ */}
        <Folder name="Exhibition">
          <Composition id="Exhibition-Loop" component={AgentFlow} durationInFrames={600} {...HD} />
        </Folder>
      </Folder>

      <Folder name="Components">
        <Folder name="Nodes">
          <Composition id="Node-BrandSeal" component={BrandSealNodesPreview} {...STILL} />
          <Composition id="Node-Service" component={ServiceNodesPreview} {...STILL} />
          <Composition id="Node-Icon" component={IconNodesPreview} {...STILL} />
          <Composition id="Node-Card" component={NodeCardsPreview} {...STILL} />
        </Folder>
        <Folder name="Parts">
          <Composition id="Part-Icons" component={IconsPreview} {...STILL} />
          <Composition id="Part-Connectors" component={ConnectorsPreview} {...STILL} />
          <Composition id="Part-StepsAndLegend" component={LegendAndStepsPreview} {...STILL} />
          <Composition id="Part-Misc" component={MiscPreview} {...STILL} />
        </Folder>
      </Folder>

      <Folder name="Examples">
        <Folder name="Basics">
          <Composition id="BasicAnimation" component={BasicAnimation} durationInFrames={150} {...HD} />
          <Composition
            id="DataVisualization"
            component={DataVisualization}
            durationInFrames={210}
            {...HD}
            schema={dataVisualizationSchema}
            defaultProps={defaultDataVisualizationProps}
          />
          <Composition
            id="PresentationSlides"
            component={PresentationSlides}
            durationInFrames={450}
            {...HD}
            schema={presentationSlidesSchema}
            defaultProps={defaultPresentationSlidesProps}
          />
        </Folder>
        <Folder name="3D">
          <Composition id="ThreeScene" component={ThreeScene} durationInFrames={240} {...HD} />
          <Composition id="ParticleSystem" component={ParticleSystem} durationInFrames={240} {...HD} />
        </Folder>
        <Folder name="Effects">
          <Composition id="AudioVisualizer" component={AudioVisualizer} durationInFrames={300} {...HD} />
          <Composition id="MotionGraphics" component={MotionGraphics} durationInFrames={300} {...HD} />
          <Composition id="TransitionDemo" component={TransitionDemo} durationInFrames={540} {...HD} />
          <Composition id="LottieDemo" component={LottieDemo} durationInFrames={270} {...HD} />
          <Composition id="NoiseArt" component={NoiseArt} durationInFrames={300} {...HD} />
          <Composition id="CodeAnimation" component={CodeAnimation} durationInFrames={360} {...HD} />
        </Folder>
      </Folder>
    </>
  );
};
