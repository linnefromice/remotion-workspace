import React from "react";
import { FlowDiagram } from "../../shared/FlowDiagram";
import { RESTORATION } from "./constants";

/** 原状回復の負担区分。設計メモ: docs/agent-flow-restoration.md */
export const AgentFlowRestoration: React.FC = () => <FlowDiagram spec={RESTORATION} />;

export const AgentFlowRestorationLogoSeal: React.FC = () => <FlowDiagram spec={RESTORATION} variant="logoSeal" />;
export const AgentFlowRestorationActionRow: React.FC = () => <FlowDiagram spec={RESTORATION} variant="actionRow" />;
export const AgentFlowRestorationIconsV2: React.FC = () => (
	<FlowDiagram spec={RESTORATION} variant="logoSeal" brandIcons />
);
