import React from "react";
import { FlowDiagram } from "../../shared/FlowDiagram";
import { RESTORATION } from "./constants";

/** 原状回復の負担区分。設計メモ: docs/agent-flow-restoration.md */
export const AgentFlowRestoration: React.FC = () => <FlowDiagram spec={RESTORATION} />;
