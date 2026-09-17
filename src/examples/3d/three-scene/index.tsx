import React, { useRef } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 8 seconds at 30fps
const DURATION = 240;

export const ThreeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Camera orbit angle
  const cameraY = interpolate(frame, [0, DURATION], [3, 1], {
    extrapolateRight: "clamp",
  });
  const cameraAngle = interpolate(frame, [0, DURATION], [0, Math.PI * 2]);
  const cameraX = Math.sin(cameraAngle) * 5;
  const cameraZ = Math.cos(cameraAngle) * 5;

  // Scene fade in / out
  const opacity = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [DURATION - 20, DURATION], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a1a",
        opacity,
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [cameraX, cameraY, cameraZ], fov: 50 }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#4fc3f7" />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#e040fb" />
        <AnimatedBox frame={frame} fps={fps} />
        <OrbitingSphere frame={frame} fps={fps} offset={0} color="#4fc3f7" />
        <OrbitingSphere frame={frame} fps={fps} offset={Math.PI * 0.66} color="#e040fb" />
        <OrbitingSphere frame={frame} fps={fps} offset={Math.PI * 1.33} color="#66bb6a" />
        <Ground />
      </ThreeCanvas>
    </div>
  );
};

const AnimatedBox: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Spring scale entrance
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1 },
  });

  // Continuous rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = frame * 0.02;
      meshRef.current.rotation.y = frame * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial
        color="#ff7043"
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
};

const OrbitingSphere: React.FC<{
  frame: number;
  fps: number;
  offset: number;
  color: string;
}> = ({ frame, fps, offset, color }) => {
  const enterScale = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  const angle = frame * 0.04 + offset;
  const radius = 2.5;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(frame * 0.05 + offset) * 0.5;

  return (
    <mesh position={[x, y, z]} scale={[enterScale * 0.4, enterScale * 0.4, enterScale * 0.4]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const Ground: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#1a1a2e"
        metalness={0.8}
        roughness={0.3}
      />
    </mesh>
  );
};
