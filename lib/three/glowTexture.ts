import * as THREE from "three";

let cached: THREE.Texture | null = null;

/**
 * A soft radial-gradient sprite texture generated on a canvas at runtime —
 * used for fog/glow sprites so the scene never depends on an external
 * texture URL. Memoized: every caller shares the same GPU upload.
 */
export function getGlowTexture(): THREE.Texture {
  if (cached) return cached;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.3, "rgba(216,180,254,0.6)");
  gradient.addColorStop(1, "rgba(124,58,237,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  cached = texture;
  return texture;
}
