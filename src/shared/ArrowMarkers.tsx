import React from "react";

/**
 * エッジの終端につける矢印。SVG の marker は色を継承しないので、
 * 使う色ごとに marker を1つずつ用意して id で引く。
 *
 * id の接頭辞を図ごとに分けているのは、同じページに複数の図が載ったときに
 * id が衝突しないようにするため。
 */

export const arrowMarkerId = (prefix: string, color: string) => `${prefix}${color.replace("#", "")}`;

/** 既存の <defs> の中に置いて使う */
export const ArrowMarkerDefs: React.FC<{ prefix: string; colors: readonly string[] }> = ({
	prefix,
	colors,
}) => (
	<>
		{colors.map((color) => (
			<marker
				key={color}
				id={arrowMarkerId(prefix, color)}
				viewBox="0 0 10 10"
				refX="8"
				refY="5"
				markerWidth="6"
				markerHeight="6"
				orient="auto-start-reverse"
			>
				<path d="M0 0 L10 5 L0 10 Z" fill={color} />
			</marker>
		))}
	</>
);
