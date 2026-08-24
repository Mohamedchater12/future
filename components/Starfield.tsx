// Small scattered-stars background accent, dropped into a section's
// existing decorative-background layer (alongside things like grid-mesh
// and blur glows). Two tiled layers at different scales/speeds so it
// reads as gentle twinkle/depth rather than one flat repeating pattern.
export default function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="starfield-layer starfield-layer-a" />
      <div className="starfield-layer starfield-layer-b" />
    </div>
  );
}
