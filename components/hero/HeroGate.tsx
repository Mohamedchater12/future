"use client";

import { useMemo, useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

const ARCH_HALF_WIDTH = 1.6;
const ARCH_STRAIGHT_HEIGHT = 2.6;
const ARCH_RADIUS = 1.6;
// How thick the stone frame is — also how far the inner opening is inset
// from the outer walls on every side (used by both ArchFrame and the
// portal's opening shape below, so the two can never drift out of sync).
const WALL_THICKNESS = 0.4;
const ARCH_TOTAL_HEIGHT = ARCH_STRAIGHT_HEIGHT + ARCH_RADIUS;
// The width (world units) the arch wants at rest before responsive shrinking —
// on narrow viewports it scales down so it's never cropped sideways.
const IDEAL_WIDTH = 4;
const BOTTOM_MARGIN = -0.9;
const REST_SCALE = 0.75;
// Rightward offset (world units) — the arch's permanent resting spot.
// It no longer moves from here: the camera does the walking (see
// getGateRestTransform + CameraRig in HeroScene.tsx), not the doorway.
const REST_X = 1.4;

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// The gate's fixed resting transform, in one place so CameraRig
// (HeroScene.tsx) can dolly the camera toward exactly where the doorway
// actually sits instead of duplicating/drifting from these numbers.
export function getGateRestTransform(viewport: { width: number; height: number }) {
  const responsiveScale = THREE.MathUtils.clamp(viewport.width / IDEAL_WIDTH, 0.4, 1);
  const archHalfHeight = (ARCH_TOTAL_HEIGHT / 2) * responsiveScale * REST_SCALE;
  const restY = -viewport.height / 2 + archHalfHeight + BOTTOM_MARGIN;
  return {
    x: REST_X * responsiveScale,
    y: restY,
    // The opening's vertical center, roughly — where the camera should
    // aim once it's lined up with the doorway, not the arch's ground pivot.
    centerY: restY + archHalfHeight,
    scale: responsiveScale * REST_SCALE,
  };
}

// ---------- Portal swirl shader — a hand-rolled fbm vortex, driven by
// time plus the same progress/rumble signals as the rest of the gate so
// the portal brightens through the cinematic and flickers during the
// rumble instead of animating in isolation. ----------
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uFlicker: 0,
    uColorA: new THREE.Color("#ffffff"),
    uColorB: new THREE.Color("#c9a8f5"),
    uColorC: new THREE.Color("#3d0f8a"),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uProgress;
    uniform float uFlicker;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 5; i++) {
        value += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);

      float swirl = angle * 2.0 + uTime * 0.6 - dist * 6.0;
      vec2 warped = vec2(cos(swirl), sin(swirl)) * dist * 3.0;

      float n = fbm(warped + uTime * 0.15);
      float rings = sin(dist * 18.0 - uTime * 1.8) * 0.5 + 0.5;

      float glow = smoothstep(0.55, 0.0, dist);
      float core = smoothstep(0.12, 0.0, dist);

      vec3 col = mix(uColorC, uColorB, n);
      col = mix(col, uColorA, rings * glow * 0.5);
      col = mix(col, uColorA, core);
      col += uColorA * uFlicker * glow * 0.6;

      // As progress nears 1 (passing through), the whole portal washes
      // out to white — the "being pulled into the light" moment.
      col = mix(col, uColorA, smoothstep(0.7, 1.0, uProgress) * 0.9);

      float vignette = smoothstep(0.75, 0.35, dist);
      col *= vignette * (0.85 + uProgress * 0.7);

      gl_FragColor = vec4(col, 1.0);
    }
  `
);

extend({ PortalMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    portalMaterial: any;
  }
}

// The archway's inner opening — a straight-walled window capped with a
// semicircular top, inset WALL_THICKNESS in from the outer profile below.
// Bottom-pivoted at y=0, exactly like the arch itself, so the two always
// share the same coordinate space with no separate offset to keep in sync.
function createOpeningShape() {
  const innerHalfWidth = ARCH_HALF_WIDTH - WALL_THICKNESS;
  const innerRadius = ARCH_RADIUS - WALL_THICKNESS;

  const shape = new THREE.Shape();
  shape.moveTo(-innerHalfWidth, 0);
  shape.lineTo(-innerHalfWidth, ARCH_STRAIGHT_HEIGHT);
  shape.absarc(0, ARCH_STRAIGHT_HEIGHT, innerRadius, Math.PI, 0, true);
  shape.lineTo(innerHalfWidth, 0);
  shape.lineTo(-innerHalfWidth, 0);
  return shape;
}

// ---------- Stone arch frame ----------
function ArchFrame() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = ARCH_HALF_WIDTH;
    const hStraight = ARCH_STRAIGHT_HEIGHT;
    const archRadius = ARCH_RADIUS;

    shape.moveTo(-w, 0);
    shape.lineTo(-w, hStraight);
    shape.absarc(0, hStraight, archRadius, Math.PI, 0, true);
    shape.lineTo(w, 0);
    shape.lineTo(w - WALL_THICKNESS, 0);
    shape.lineTo(w - WALL_THICKNESS, hStraight);
    shape.absarc(0, hStraight, archRadius - WALL_THICKNESS, 0, Math.PI, false);
    // Down the inner-left wall to match the inner-right wall above,
    // before stepping out to the outer-left corner to close the path —
    // without this the path cut straight from the top of the inner arc
    // to the outer-bottom-left corner, leaving a diagonal sliver of
    // stone (and a matching gap against the portal) on the left only.
    shape.lineTo(-(w - WALL_THICKNESS), 0);
    shape.lineTo(-w, 0);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
      curveSegments: isMobile ? 16 : 32,
    });
    // Center only the extrusion depth — x/y stay as authored so the arch
    // keeps its natural ground-level base at y=0, matching the group's
    // own bottom-pivot positioning below.
    geo.translate(0, 0, -0.2);
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#7b6aa8" roughness={0.75} metalness={0.15} />
    </mesh>
  );
}

// ---------- Portal shader mesh, cut to the exact shape of the archway's
// inner opening (straight sides + a matching semicircular top) rather
// than a plain rectangle, so it reaches every edge with no dark gaps —
// particularly in the curved top, where a rectangle would leave corners
// uncovered. ----------
function Portal({
  progressRef,
  shakeRef,
}: {
  progressRef: React.MutableRefObject<number>;
  shakeRef?: React.MutableRefObject<number>;
}) {
  const matRef = useRef<any>(null);

  const geometry = useMemo(() => {
    const shape = createOpeningShape();
    const geo = new THREE.ShapeGeometry(shape, isMobile ? 16 : 32);

    // ShapeGeometry's default UVs are just the raw shape-local x/y
    // coordinates, not normalized to 0-1 — since our opening isn't a
    // unit square, that left the shader's centered swirl (built around
    // uv 0.5,0.5) squeezed into a small blob near world-space (0.5, 0.5)
    // instead of spanning the whole window. Remap UV to the opening's
    // own bounding box so 0-1 covers it edge to edge, as the shader
    // (and every mesh built from a plain PlaneGeometry) expects.
    const innerHalfWidth = ARCH_HALF_WIDTH - WALL_THICKNESS;
    const innerRadius = ARCH_RADIUS - WALL_THICKNESS;
    const minX = -innerHalfWidth;
    const maxX = innerHalfWidth;
    const minY = 0;
    const maxY = ARCH_STRAIGHT_HEIGHT + innerRadius;
    const position = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < position.count; i++) {
      uv.setXY(
        i,
        (position.getX(i) - minX) / (maxX - minX),
        (position.getY(i) - minY) / (maxY - minY)
      );
    }
    uv.needsUpdate = true;

    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uTime += delta;
    matRef.current.uProgress = progressRef.current;
    matRef.current.uFlicker = shakeRef?.current ? Math.random() * shakeRef.current : 0;
  });

  return (
    <mesh geometry={geometry} position={[0, 0, -0.05]}>
      <portalMaterial ref={matRef} />
    </mesh>
  );
}

// ---------- Floating particles, drifting up through the opening ----------
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 80 : 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 1.3;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = 0.2 + Math.random() * 3.2;
      arr[i * 3 + 2] = -0.1 + Math.random() * 0.6;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = positionAttr.getY(i) + 0.002;
      positionAttr.setY(i, y > 3.4 ? 0.2 : y);
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e6d6ff" size={0.02} transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

// ---------- Ground glow, pooling light beneath the threshold ----------
function GroundGlow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.3]}>
      <circleGeometry args={[1.6, 48]} />
      <meshBasicMaterial color="#c9a8f5" transparent opacity={0.25} />
    </mesh>
  );
}

/**
 * The Hero's centerpiece: a stone archway housing a swirling violet/white
 * portal (custom GLSL shader), drifting particles and a violet ground
 * glow. It stays put — fixed size, fixed spot, low and offset to the
 * right — for the whole cinematic; it's the camera (see CameraRig in
 * HeroScene.tsx) that does the walking, dollying forward and steering
 * toward the doorway as `progress` (0-1, driven by scrolling through the
 * pinned hero section in Hero.tsx) climbs, so it reads as you approaching
 * and stepping through a doorway that never moves, not a doorway coming
 * to you. `shake` (also 0-1, over a band near the start of the same
 * scroll) still drives a rumble: tremor, jitter and flicker.
 */
export default function HeroGate({
  progressRef,
  shakeRef,
}: {
  progressRef: React.MutableRefObject<number>;
  shakeRef?: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lightARef = useRef<THREE.PointLight>(null);
  const lightBRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    const shakeAmt = shakeRef?.current ?? 0;

    const { x: baseX, y: restY, scale } = getGateRestTransform(state.viewport);

    if (groupRef.current) {
      const targetX = state.pointer.y * 0.08 * (1 - p);
      const targetY = state.pointer.x * 0.12 * (1 - p);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);

      const bob = Math.sin(t * 0.6) * 0.03;
      groupRef.current.position.y = restY + bob;
      groupRef.current.position.z = 0;
      groupRef.current.scale.setScalar(scale);

      // The rumble: a jittery tremor shaking the whole arch, as if it's
      // waking up right before it swings open.
      if (shakeAmt > 0.001) {
        groupRef.current.position.x = baseX + (Math.random() - 0.5) * 0.08 * shakeAmt;
        groupRef.current.rotation.z = (Math.random() - 0.5) * 0.045 * shakeAmt;
      } else {
        groupRef.current.position.x = baseX;
        groupRef.current.rotation.z = 0;
      }
    }

    // Thunder-like flicker layered on top of the steady glow while the
    // gate rumbles, as if the portal's energy is arcing unstably.
    const flicker = shakeAmt > 0.001 ? Math.random() * shakeAmt * 3 : 0;
    if (lightARef.current) lightARef.current.intensity = 1.2 + p * 5 + flicker * 1.5;
    if (lightBRef.current) lightBRef.current.intensity = 2 + p * 6 + flicker * 2;
  });

  return (
    <group ref={groupRef}>
      <GroundGlow />
      <ArchFrame />
      <Portal progressRef={progressRef} shakeRef={shakeRef} />
      <Particles />
      <pointLight ref={lightARef} position={[0, 1.8, 1.2]} intensity={1.2} color="#e6d6ff" distance={9} />
      <pointLight ref={lightBRef} position={[0, 1.2, -0.6]} intensity={2} color="#a668f0" distance={7} />
    </group>
  );
}
