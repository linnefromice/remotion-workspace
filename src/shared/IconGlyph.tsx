import React from "react";
import {
	ServiceIcon,
	type ServiceIconName,
} from "../AgentFlowCodexReClaude/components/ServiceIcon";

/**
 * ServiceIcon は 56px 固定なので、カードに載せるサイズへ縮めて使う。
 * transform で縮めているだけなので、線の太さも一緒に細くなる。
 */
export const IconGlyph: React.FC<{ name: ServiceIconName; size: number }> = ({ name, size }) => (
	<span
		style={{
			display: "block",
			width: size,
			height: size,
			lineHeight: 0,
			transform: `scale(${size / 56})`,
			transformOrigin: "top left",
		}}
	>
		<ServiceIcon name={name} />
	</span>
);
