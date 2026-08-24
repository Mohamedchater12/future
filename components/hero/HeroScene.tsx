"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import HeroGate, { getGateRestTransform } from "./HeroGate";

function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  useFrame((state) => {
    const p = progressRef.current;
    const camera = state.camera as THREE.PerspectiveCamera;
    // The gate itself never moves (see HeroGate.tsx) — the camera does the
    // "entering", both dollying forward through the portal's plane (around
    // z=0) AND steering its x/y from dead-center toward the doorway's own
    // (off-center) resting spot, so by the time it passes through it's
    // lined up exactly on the opening instead of sliding past it.
    const { x: doorX, centerY: doorY } = getGateRestTransform(state.viewport);
    camera.position.x = THREE.MathUtils.lerp(0, doorX, p);
    camera.position.y = THREE.MathUtils.lerp(0, doorY, p);
    camera.position.z = 6 - p * 7.2;
    // A dolly-zoom tightens the FOV through most of the approach, then a
    // rapid flare in the final stretch reads as a burst of speed/light
    // right as we pass through, echoing the whiteout in the shader/flash.
    const tighten = Math.min(p, 0.75) * 8;
    const flare = Math.max(0, p - 0.75) * 130;
    camera.fov = 45 - tighten + flare;
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function HeroScene({
  progressRef,
  shakeRef,
}: {
  progressRef?: React.MutableRefObject<number>;
  shakeRef?: React.MutableRefObject<number>;
}) {
  const fallbackRef = useRef(0);
  const ref = progressRef ?? fallbackRef;
  const shakeFallbackRef = useRef(0);
  const shake = shakeRef ?? shakeFallbackRef;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        {/* Thin atmospheric haze for depth — the portal fades into it rather
            than sitting on a flat black void. */}
        <fog attach="fog" args={["#0a0414", 3.2, 10.5]} />

        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#a855f7" />
        <pointLight position={[-5, -3, -5]} intensity={1.2} color="#6d28d9" />
        <spotLight
          position={[0, 5, 2]}
          angle={0.4}
          penumbra={1}
          intensity={1.5}
          color="#ffffff"
        />

        <HeroGate progressRef={ref} shakeRef={shake} />
        <CameraRig progressRef={ref} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
