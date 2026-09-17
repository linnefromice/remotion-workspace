import React from "react";
import { FlowDiagram } from "../../shared/FlowDiagram";
import { PROPOSAL } from "./constants";

/** 新規契約候補者への提案。設計メモ: docs/agent-flow-proposal.md */
export const AgentFlowProposal: React.FC = () => <FlowDiagram spec={PROPOSAL} />;

export const AgentFlowProposalLogoSeal: React.FC = () => <FlowDiagram spec={PROPOSAL} variant="logoSeal" />;
export const AgentFlowProposalActionRow: React.FC = () => <FlowDiagram spec={PROPOSAL} variant="actionRow" />;
export const AgentFlowProposalIconsV2: React.FC = () => (
	<FlowDiagram spec={PROPOSAL} variant="logoSeal" brandIcons />
);
