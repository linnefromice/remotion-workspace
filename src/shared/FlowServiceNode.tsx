import React from 'react';
import { LogoSealNode, ActionRowNode } from '../AgentFlowCodexReClaude/components/ServiceNode';
import { ServiceIcon, type ServiceIconName } from '../AgentFlowCodexReClaude/components/ServiceIcon';

export type FlowNodeVariant = 'logoSeal' | 'actionRow';
export const FlowServiceNode: React.FC<{
  variant: FlowNodeVariant; icon: ServiceIconName; title: string; action: string;
  service: string; color: string; active: boolean; dashed?: boolean;
}> = ({variant, icon, title, action, service, color, active, dashed}) => {
  const Node = variant === 'logoSeal' ? LogoSealNode : ActionRowNode;
  return <div style={{position: 'relative'}}>
    {dashed && <div style={{position: 'absolute', inset: -5, height: variant === 'logoSeal' ? 138 : 114, border: `1px dashed ${color}`, borderRadius: 16, pointerEvents: 'none'}}/>}
    <Node compact icon={<ServiceIcon name={icon} size="100%"/>} service={title} action={action} detail={service} color={color} active={active} logoBackground="#182537"/>
  </div>;
};
