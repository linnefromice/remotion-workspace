import {SubjectSide} from "./agent-flow/design-studies/side/subjects";
import {SideDemoDiagram} from "./agent-flow/design-studies/side/demo-full/Diagram";
import {SideStacked} from "./agent-flow/design-studies/side/Stacked";
import {DiagramBands, bandsSchema, bandsDefaults} from "./agent-flow/design-studies/agent-diagram/bands";
import {SideDemoFull, DEMO_FRAMES} from "./agent-flow/design-studies/side/demo-full";
import {SideSlotExample, SideSlotMinimal} from "./agent-flow/design-studies/side/SlotExample";
import {SideGate, SideReplay} from "./agent-flow/design-studies/side/GateReplay";
import { SideLedger } from "./agent-flow/design-studies/side/Ledger";
import React from "react";
import { Composition, Folder } from "remotion";
import { BasicAnimation } from "./examples/basics/basic-animation";
import {
  DataVisualization,
  dataVisualizationSchema,
  defaultDataVisualizationProps,
} from "./examples/basics/data-visualization";
import {
  PresentationSlides,
  presentationSlidesSchema,
  defaultPresentationSlidesProps,
} from "./examples/basics/presentation-slides";
import { ParticleSystem } from "./examples/effects/particle-system";
import { AudioVisualizer } from "./examples/effects/audio-visualizer";
import { MotionGraphics } from "./examples/effects/motion-graphics";
import { TransitionDemo } from "./examples/effects/transition-demo";
import { LottieDemo } from "./examples/effects/lottie-demo";
import { NoiseArt } from "./examples/effects/noise-art";
import { CodeAnimation } from "./examples/effects/code-animation";

// フロー図
import { AgentFlowClaimIntake } from "./agent-flow/claim-intake/cards";
import {
  AgentFlowClaimIntakeIcons,
  AgentFlowClaimIntakeLogoSeal,
  AgentFlowClaimIntakeIconsV2,
  AgentFlowClaimIntakeActionRow,
} from "./agent-flow/claim-intake/icons";
import {
  ClaimIntakeSideBySide,
  ClaimIntakeSideBySideClock,
  SIDE_BY_SIDE_PRESETS,
  sideBySideSchema,
} from "./agent-flow/claim-intake/side-by-side";
import {
  CANVAS_W as CLAIM_W,
  CANVAS_H as CLAIM_H,
  FPS as CLAIM_FPS,
  TOTAL_FRAMES as CLAIM_FRAMES,
} from "./agent-flow/claim-intake/cards/constants";
import { AgentFlowInquiry } from "./agent-flow/inquiry/cards";
import {
  AgentFlowInquiryIcons,
  AgentFlowInquiryLogoSeal,
  AgentFlowInquiryIconsV2,
  AgentFlowInquiryActionRow,
} from "./agent-flow/inquiry/icons";
import {
  CANVAS_W as INQUIRY_W,
  CANVAS_H as INQUIRY_H,
  FPS as INQUIRY_FPS,
  TOTAL_FRAMES as INQUIRY_FRAMES,
} from "./agent-flow/inquiry/cards/constants";
import { AgentFlowCodex } from "./agent-flow/reference/codex";
import {
  CANVAS_W as CODEX_W,
  CANVAS_H as CODEX_H,
  FPS as CODEX_FPS,
  TOTAL_FRAMES as CODEX_FRAMES,
} from "./agent-flow/reference/codex/constants";
import { AgentFlowCodexReClaude } from "./agent-flow/reference/codex-reclaude";
import {
  CANVAS_W as RECLAUDE_W,
  CANVAS_H as RECLAUDE_H,
  FPS as RECLAUDE_FPS,
  TOTAL_FRAMES as RECLAUDE_FRAMES,
} from "./agent-flow/reference/codex-reclaude/constants";
import { AgentFlow } from "./agent-flow/exhibition";
import {
  AgentFlowRestoration,
  AgentFlowRestorationLogoSeal,
  AgentFlowRestorationActionRow,
  AgentFlowRestorationIconsV2,
} from "./agent-flow/restoration";
import { STEPS as RST_STEPS, STEP_LEN as RST_STEP_LEN } from "./agent-flow/restoration/constants";
import {
  AgentFlowProposal,
  AgentFlowProposalLogoSeal,
  AgentFlowProposalActionRow,
  AgentFlowProposalIconsV2,
} from "./agent-flow/proposal";
import { STEPS as PRP_STEPS, STEP_LEN as PRP_STEP_LEN } from "./agent-flow/proposal/constants";

// 部品カタログ
import { BrandSealNodesPreview } from "./agent-flow/reference/codex-reclaude/previews/BrandSealNodesPreview";
import { ServiceNodesPreview } from "./agent-flow/reference/codex-reclaude/previews/ServiceNodesPreview";
import { IconNodesPreview } from "./agent-flow/reference/codex-reclaude/previews/IconNodesPreview";
import { NodeCardsPreview } from "./agent-flow/reference/codex-reclaude/previews/NodeCardsPreview";
import { IconsPreview } from "./agent-flow/reference/codex-reclaude/previews/IconsPreview";
import { ConnectorsPreview } from "./agent-flow/reference/codex-reclaude/previews/ConnectorsPreview";
import { LegendAndStepsPreview } from "./agent-flow/reference/codex-reclaude/previews/LegendAndStepsPreview";
import { MiscPreview } from "./agent-flow/reference/codex-reclaude/previews/MiscPreview";

import { ClaimIntakeDecisionStory, decisionStorySchema, decisionStoryDefaults } from "./agent-flow/claim-intake/decision-story";
import { SideEvidence } from "./agent-flow/design-studies/side";
import {
  ClaimIntakeDecisionStoryWithMap,
  withMapDefaults,
  withMapSchema,
  withMapStacked,
} from "./agent-flow/claim-intake/decision-story/WithMap";

import {
  DiagramBranches,
  DiagramCaseboard,
  DiagramChronicle,
  DiagramLanes,
  DiagramOrbit,
  DiagramRelay,
  DiagramTerraces,
  DiagramTransit,
} from "./agent-flow/design-studies/agent-diagram";

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
        {/* 見せ方の試作。商談で使う成果物とは分けて置く */}
        <Folder name="DesignStudies">
          <Folder name="AgentDiagram">
            <Composition id="Diagram-Bands" component={DiagramBands} schema={bandsSchema} defaultProps={bandsDefaults} durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H}/>
            <Composition
              id="Diagram-Branches"
              component={DiagramBranches}
              durationInFrames={INQUIRY_FRAMES}
              fps={INQUIRY_FPS}
              width={INQUIRY_W}
              height={INQUIRY_H}
            />
            <Composition
              id="Diagram-Terraces"
              component={DiagramTerraces}
              durationInFrames={INQUIRY_FRAMES}
              fps={INQUIRY_FPS}
              width={INQUIRY_W}
              height={INQUIRY_H}
            />
            <Composition
              id="Diagram-Lanes"
              component={DiagramLanes}
              durationInFrames={INQUIRY_FRAMES}
              fps={INQUIRY_FPS}
              width={INQUIRY_W}
              height={INQUIRY_H}
            />
            <Composition
              id="Diagram-Chronicle"
              component={DiagramChronicle}
              durationInFrames={INQUIRY_FRAMES}
              fps={INQUIRY_FPS}
              width={INQUIRY_W}
              height={INQUIRY_H}
            />
            <Composition
              id="Diagram-Caseboard"
              component={DiagramCaseboard}
              durationInFrames={INQUIRY_FRAMES}
              fps={INQUIRY_FPS}
              width={INQUIRY_W}
              height={INQUIRY_H}
            />
            <Composition
              id="Diagram-Transit"
              component={DiagramTransit}
              durationInFrames={INQUIRY_FRAMES}
              fps={INQUIRY_FPS}
              width={INQUIRY_W}
              height={INQUIRY_H}
            />
            <Composition
              id="Diagram-Orbit"
              component={DiagramOrbit}
              durationInFrames={INQUIRY_FRAMES}
              fps={INQUIRY_FPS}
              width={INQUIRY_W}
              height={INQUIRY_H}
            />
            <Composition
              id="Diagram-Relay"
              component={DiagramRelay}
              durationInFrames={INQUIRY_FRAMES}
              fps={INQUIRY_FPS}
              width={INQUIRY_W}
              height={INQUIRY_H}
            />
          </Folder>
          <Folder name="Side">
            {/* 図を主役にする3つ。ここから先の Side はこの3つを土台にする（docs/side-layout-variants.md） */}
            <Composition id="Side-DemoDiagram" component={SideDemoDiagram} durationInFrames={DEMO_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H}/>
            <Composition id="Side-SlotMinimal" component={SideSlotMinimal} durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H}/>
            <Composition id="Side-Stacked" component={SideStacked} durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H}/>
            <Composition id="Side-DemoFull" component={SideDemoFull} durationInFrames={DEMO_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H}/>
            <Composition id="Side-SlotExample" component={SideSlotExample} durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H}/>
            <Composition id="Side-Gate" component={SideGate} durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H} />
            <Composition id="Side-Replay" component={SideReplay} durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H} />
            <Composition id="Side-Ledger" component={SideLedger} durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H} />
            <Composition
              id="Side-Evidence"
              component={SideEvidence}
              durationInFrames={CLAIM_FRAMES}
              fps={CLAIM_FPS}
              width={CLAIM_W}
              height={CLAIM_H}
            />
          </Folder>
        </Folder>

        {/* 実装済みPoC（farleap/tenant-claim-intake-demoapp）の構造 */}
        <Folder name="ClaimIntake">
          <Composition id="ClaimIntake-DecisionStory" component={ClaimIntakeDecisionStory}
            schema={decisionStorySchema} defaultProps={decisionStoryDefaults}
            durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H} />
          {/* DecisionStory にフロー図を地図として添えた版。横並びと縦積みを比べる */}
          <Composition
            id="ClaimIntake-DecisionStory-Side"
            component={ClaimIntakeDecisionStoryWithMap}
            schema={withMapSchema}
            defaultProps={withMapDefaults}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
          <Composition
            id="ClaimIntake-DecisionStory-Stacked"
            component={ClaimIntakeDecisionStoryWithMap}
            schema={withMapSchema}
            defaultProps={withMapStacked}
            durationInFrames={CLAIM_FRAMES}
            fps={CLAIM_FPS}
            width={CLAIM_W}
            height={CLAIM_H}
          />
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
          <Composition id="ClaimIntake-SideBySide-Clock" component={ClaimIntakeSideBySideClock}
            schema={sideBySideSchema} defaultProps={SIDE_BY_SIDE_PRESETS.clock}
            durationInFrames={CLAIM_FRAMES} fps={CLAIM_FPS} width={CLAIM_W} height={CLAIM_H}/>
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

        {/* 原状回復の負担区分（構想）。docs/agent-flow-restoration.md */}
        <Folder name="Restoration">
          <Composition id="Restoration-Side-DemoDiagram" component={SubjectSide} defaultProps={{subject:"Restoration",layout:"DemoDiagram"}} durationInFrames={1260} fps={30} width={1920} height={1080}/>
          <Composition id="Restoration-Side-SlotMinimal" component={SubjectSide} defaultProps={{subject:"Restoration",layout:"SlotMinimal"}} durationInFrames={840} fps={30} width={1920} height={1080}/>
          <Composition id="Restoration-Side-Stacked" component={SubjectSide} defaultProps={{subject:"Restoration",layout:"Stacked"}} durationInFrames={840} fps={30} width={1920} height={1080}/>
          <Composition
            id="Restoration-Cards"
            component={AgentFlowRestoration}
            durationInFrames={RST_STEPS.length * RST_STEP_LEN}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Restoration-IconsV2"
            component={AgentFlowRestorationIconsV2}
            durationInFrames={RST_STEPS.length * RST_STEP_LEN}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Restoration-LogoSeal"
            component={AgentFlowRestorationLogoSeal}
            durationInFrames={RST_STEPS.length * RST_STEP_LEN}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Restoration-ActionRow"
            component={AgentFlowRestorationActionRow}
            durationInFrames={RST_STEPS.length * RST_STEP_LEN}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>

        {/* 新規契約候補者への提案（構想）。docs/agent-flow-proposal.md */}
        <Folder name="Proposal">
          <Composition id="Proposal-Side-DemoDiagram" component={SubjectSide} defaultProps={{subject:"Proposal",layout:"DemoDiagram"}} durationInFrames={1260} fps={30} width={1920} height={1080}/>
          <Composition id="Proposal-Side-SlotMinimal" component={SubjectSide} defaultProps={{subject:"Proposal",layout:"SlotMinimal"}} durationInFrames={840} fps={30} width={1920} height={1080}/>
          <Composition id="Proposal-Side-Stacked" component={SubjectSide} defaultProps={{subject:"Proposal",layout:"Stacked"}} durationInFrames={840} fps={30} width={1920} height={1080}/>
          <Composition
            id="Proposal-Cards"
            component={AgentFlowProposal}
            durationInFrames={PRP_STEPS.length * PRP_STEP_LEN}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Proposal-IconsV2"
            component={AgentFlowProposalIconsV2}
            durationInFrames={PRP_STEPS.length * PRP_STEP_LEN}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Proposal-LogoSeal"
            component={AgentFlowProposalLogoSeal}
            durationInFrames={PRP_STEPS.length * PRP_STEP_LEN}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Proposal-ActionRow"
            component={AgentFlowProposalActionRow}
            durationInFrames={PRP_STEPS.length * PRP_STEP_LEN}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>

        {/* 問い合わせ対応フローの構想 */}
        <Folder name="Inquiry">
          <Composition id="Inquiry-Side-DemoDiagram" component={SubjectSide} defaultProps={{subject:"Inquiry",layout:"DemoDiagram"}} durationInFrames={1080} fps={30} width={1920} height={1080}/>
          <Composition id="Inquiry-Side-SlotMinimal" component={SubjectSide} defaultProps={{subject:"Inquiry",layout:"SlotMinimal"}} durationInFrames={720} fps={30} width={1920} height={1080}/>
          <Composition id="Inquiry-Side-Stacked" component={SubjectSide} defaultProps={{subject:"Inquiry",layout:"Stacked"}} durationInFrames={720} fps={30} width={1920} height={1080}/>
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
        <Folder name="Effects">
          {/* 3D フォルダにあったが、three.js を使う ThreeScene を外したあとは
              粒子だけが残り、中身と名前が合わなくなっていた */}
          <Composition id="ParticleSystem" component={ParticleSystem} durationInFrames={240} {...HD} />
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
