import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { type HighlighterCore, createHighlighter } from "shiki";

const SAMPLE_CODE = `import { useCurrentFrame, interpolate, spring } from "remotion";

export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame, [0, 30], [0, 1],
    { extrapolateRight: "clamp" }
  );

  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div style={{ opacity, transform: \`scale(\${scale})\` }}>
      <h1>Hello, Remotion!</h1>
    </div>
  );
};`;

type TokenLine = {
  tokens: { content: string; color: string }[];
};

export const CodeAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [lines, setLines] = useState<TokenLine[] | null>(null);
  const [handle] = useState(() => delayRender("Loading syntax highlighter"));

  useEffect(() => {
    let cancelled = false;
    createHighlighter({
      themes: ["github-dark"],
      langs: ["tsx"],
    }).then((highlighter) => {
      if (cancelled) return;
      const result = highlighter.codeToTokens(SAMPLE_CODE, {
        lang: "tsx",
        theme: "github-dark",
      });
      const tokenLines: TokenLine[] = result.tokens.map((line) => ({
        tokens: line.map((token) => ({
          content: token.content,
          color: token.color || "#e1e4e8",
        })),
      }));
      setLines(tokenLines);
      continueRender(handle);
    });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  if (!lines) return null;

  const opacity = Math.min(
    interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [340, 360], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        background: "#0d1117",
        opacity,
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Title */}
      <Sequence from={0} durationInFrames={360}>
        <Title frame={frame} fps={fps} />
      </Sequence>

      {/* Code block */}
      <Sequence from={20} durationInFrames={340}>
        <CodeBlock lines={lines} frame={frame} fps={fps} />
      </Sequence>

      {/* Cursor */}
      <Sequence from={20} durationInFrames={340}>
        <Cursor lines={lines} frame={frame} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        width: "100%",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: "bold",
          color: "#e1e4e8",
          transform: `scale(${scale})`,
          letterSpacing: 4,
        }}
      >
        CODE ANIMATION
      </h1>
      <p
        style={{
          fontSize: 20,
          color: "#8b949e",
          marginTop: 8,
        }}
      >
        Powered by Shiki + Remotion
      </p>
    </div>
  );
};

const LINE_HEIGHT = 32;
const CODE_TOP = 160;
const CODE_LEFT = 120;
const CHARS_PER_FRAME = 3;

const CodeBlock: React.FC<{
  lines: TokenLine[];
  frame: number;
  fps: number;
}> = ({ lines, frame, fps }) => {
  // Total characters typed so far
  const localFrame = frame;
  const totalCharsTyped = localFrame * CHARS_PER_FRAME;

  let charCount = 0;

  return (
    <AbsoluteFill>
      {/* Editor chrome */}
      <div
        style={{
          position: "absolute",
          left: CODE_LEFT - 30,
          top: CODE_TOP - 20,
          right: CODE_LEFT - 30,
          bottom: 60,
          background: "#161b22",
          borderRadius: 12,
          border: "1px solid #30363d",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
        }}
      >
        {/* Title bar dots */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "14px 18px",
            borderBottom: "1px solid #30363d",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ff5f56",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#27c93f",
            }}
          />
          <span
            style={{
              marginLeft: 12,
              fontSize: 14,
              color: "#8b949e",
            }}
          >
            MyComponent.tsx
          </span>
        </div>
      </div>

      {/* Code lines */}
      {lines.map((line, lineIndex) => {
        const lineStartChar = charCount;
        const lineChars = line.tokens.reduce(
          (sum, t) => sum + t.content.length,
          0
        );
        charCount += lineChars;

        // Line not yet reached
        if (lineStartChar >= totalCharsTyped) return null;

        const lineRevealProgress = Math.min(
          1,
          (totalCharsTyped - lineStartChar) / Math.max(lineChars, 1)
        );

        const lineOpacity = spring({
          frame: Math.max(
            0,
            localFrame - Math.floor(lineStartChar / CHARS_PER_FRAME)
          ),
          fps,
          config: { damping: 20, stiffness: 200, mass: 0.3 },
        });

        let tokenCharOffset = 0;

        return (
          <div
            key={lineIndex}
            style={{
              position: "absolute",
              left: CODE_LEFT,
              top: CODE_TOP + 30 + lineIndex * LINE_HEIGHT,
              display: "flex",
              opacity: lineOpacity,
              height: LINE_HEIGHT,
              alignItems: "center",
            }}
          >
            {/* Line number */}
            <span
              style={{
                width: 40,
                textAlign: "right",
                marginRight: 20,
                fontSize: 16,
                color: "#484f58",
                userSelect: "none",
              }}
            >
              {lineIndex + 1}
            </span>

            {/* Tokens */}
            {line.tokens.map((token, tokenIndex) => {
              const tokenStart = tokenCharOffset;
              tokenCharOffset += token.content.length;

              const charsToShow = Math.max(
                0,
                Math.min(
                  token.content.length,
                  totalCharsTyped - lineStartChar - tokenStart
                )
              );

              if (charsToShow <= 0) return null;

              return (
                <span
                  key={tokenIndex}
                  style={{
                    fontSize: 18,
                    color: token.color,
                    whiteSpace: "pre",
                    lineHeight: `${LINE_HEIGHT}px`,
                  }}
                >
                  {token.content.slice(0, charsToShow)}
                </span>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Cursor: React.FC<{ lines: TokenLine[]; frame: number }> = ({
  lines,
  frame,
}) => {
  const totalCharsTyped = frame * CHARS_PER_FRAME;
  const blink = Math.sin(frame * 0.3) > 0 ? 1 : 0.2;

  // Find cursor position
  let charCount = 0;
  let cursorLine = 0;
  let cursorCol = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineChars = lines[i].tokens.reduce(
      (sum, t) => sum + t.content.length,
      0
    );
    if (charCount + lineChars >= totalCharsTyped) {
      cursorLine = i;
      cursorCol = totalCharsTyped - charCount;
      break;
    }
    charCount += lineChars;
    cursorLine = i;
    cursorCol = lineChars;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: CODE_LEFT + 60 + cursorCol * 10.8,
        top: CODE_TOP + 30 + cursorLine * LINE_HEIGHT,
        width: 2,
        height: LINE_HEIGHT - 4,
        background: "#58a6ff",
        opacity: blink,
        boxShadow: "0 0 8px rgba(88, 166, 255, 0.5)",
      }}
    />
  );
};
