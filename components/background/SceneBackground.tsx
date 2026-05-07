import StarField from "./StarField";

export type SceneVariant = "landing" | "deck" | "detail" | "history";

interface SceneBackgroundProps {
  variant?: SceneVariant;
}

// ── Corner diamond polygon ────────────────────────────────
function CornerDiamond({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const style: React.CSSProperties = { position: "absolute", width: 10, height: 10 };
  // All corner diamonds at 35px inset (Figma exact)
  if (pos === "tl") { style.top = 35; style.left = 35; }
  if (pos === "tr") { style.top = 35; style.right = 35; }
  if (pos === "bl") { style.bottom = 35; style.left = 35; }
  if (pos === "br") { style.bottom = 35; style.right = 35; }
  return (
    <svg style={style} viewBox="0 0 10 10" aria-hidden="true">
      <polygon points="5,0 10,5 5,10 0,5" fill="#c8a861" opacity="0.6" />
    </svg>
  );
}

// ── Constellations SVG ───────────────────────────────────────────────────────
// Pixel-perfect from Figma node 257:12904 (background-pattern, deck screen).
// Star cx/cy = Figma x + w/2, cy = y + h/2.  Lines connect star centres.
// Stars twinkle (CSS .constellationStar) and lines breathe (.constellationLine).
function ConstStar({ cx, cy, r, i }: { cx: number; cy: number; r: number; i: number }) {
  return (
    <circle
      className="constellationStar"
      // Scale all star radii down ~50% from Figma so the constellation points
      // read as pinpricks rather than dots (two consecutive size reductions).
      cx={cx} cy={cy} r={r * 0.5}
      fill="#e8c882"
      opacity={0.85}
      style={{ animationDelay: `${((i * 0.83) % 5).toFixed(2)}s` }}
    />
  );
}
function ConstLine({ x1, y1, x2, y2, i }: { x1: number; y1: number; x2: number; y2: number; i: number }) {
  return (
    <line
      className="constellationLine"
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="#c8a861" strokeOpacity={0.26} strokeWidth={0.8}
      style={{ animationDelay: `${((i * 1.31) % 7).toFixed(2)}s` }}
    />
  );
}
// Pixel-perfect from Figma node 302:1689 (deck screen "02 box of cards").
// Star centres = Figma top-left + radius. Lines traced from rectangle endpoints.
//   Cygnus:     4 stars + 5 lines (two lines extend to phantom positions where
//               s04, s05 used to be — kept verbatim for 1:1 fidelity)
//   Cassiopeia: 5 stars + 4 lines (zigzag)
//   Lyra:       5 stars + 5 lines (diamond + tail)
//   Sagitta:    5 stars + 4 lines (arrow with s03 forking to s04 & s05)
function Constellations() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Cygnus — top-left, hub at s02 (200, 240) */}
      <g>
        <ConstLine i={0} x1={130} y1={200} x2={200} y2={240} />
        <ConstLine i={1} x1={200} y1={240} x2={270} y2={280} />
        <ConstLine i={2} x1={200} y1={240} x2={170} y2={340} />
        <ConstLine i={3} x1={200} y1={240} x2={340} y2={200} />
        <ConstLine i={4} x1={200} y1={240} x2={ 80} y2={300} />
        {[
          {cx:130,cy:200,r:4.5},
          {cx:200,cy:240,r:4},
          {cx:270,cy:280,r:4.5},
          {cx: 80,cy:300,r:3.5},
        ].map((s,i)=>( <ConstStar key={i} i={i} cx={s.cx} cy={s.cy} r={s.r} /> ))}
      </g>
      {/* Cassiopeia — top-right zigzag */}
      <g>
        <ConstLine i={5} x1={1450} y1={180} x2={1510} y2={240} />
        <ConstLine i={6} x1={1510} y1={240} x2={1560} y2={200} />
        <ConstLine i={7} x1={1560} y1={200} x2={1620} y2={260} />
        <ConstLine i={8} x1={1620} y1={260} x2={1670} y2={230} />
        {[
          {cx:1450,cy:180,r:4.5},
          {cx:1510,cy:240,r:4},
          {cx:1560,cy:200,r:4.5},
          {cx:1620,cy:260,r:4},
          {cx:1670,cy:230,r:3.5},
        ].map((s,i)=>( <ConstStar key={i} i={i+5} cx={s.cx} cy={s.cy} r={s.r} /> ))}
      </g>
      {/* Lyra — bottom-left, diamond + tail */}
      <g>
        <ConstLine i={9}  x1={140} y1={880} x2={230} y2={870} />
        <ConstLine i={10} x1={230} y1={870} x2={260} y2={950} />
        <ConstLine i={11} x1={260} y1={950} x2={170} y2={960} />
        <ConstLine i={12} x1={170} y1={960} x2={140} y2={880} />
        <ConstLine i={13} x1={170} y1={960} x2={120} y2={970} />
        {[
          {cx:140,cy:880,r:4.5},
          {cx:230,cy:870,r:4},
          {cx:260,cy:950,r:4},
          {cx:170,cy:960,r:4.5},
          {cx:120,cy:970,r:3},
        ].map((s,i)=>( <ConstStar key={i} i={i+10} cx={s.cx} cy={s.cy} r={s.r} /> ))}
      </g>
      {/* Sagitta — bottom-right, arrow with s03 → s04 & s03 → s05 fork */}
      <g>
        <ConstLine i={14} x1={1480} y1={920} x2={1540} y2={910} />
        <ConstLine i={15} x1={1540} y1={910} x2={1610} y2={900} />
        <ConstLine i={16} x1={1610} y1={900} x2={1660} y2={870} />
        <ConstLine i={17} x1={1610} y1={900} x2={1660} y2={940} />
        {[
          {cx:1480,cy:920,r:3.5},
          {cx:1540,cy:910,r:4.5},
          {cx:1610,cy:900,r:4},
          {cx:1660,cy:870,r:3.5},
          {cx:1660,cy:940,r:3.5},
        ].map((s,i)=>( <ConstStar key={i} i={i+15} cx={s.cx} cy={s.cy} r={s.r} /> ))}
      </g>
    </svg>
  );
}

// ── Orbital paths (deck + history background-pattern, 1728×1117) ─────────────
// Figma: orbital-paths group contains 3 Groups each with 1–2 Vector arcs.
// Group 1: bounding box w:1040, h:1100 at approx x:344, y:17 (two arc paths, op:0.22)
// Group 2: bounding box w:1280, h:240 at approx x:224, y:438 (one arc, op:0.18)
// Group 3: bounding box w:960, h:160 at approx x:384, y:638 (one arc, op:0.14)
// We represent them as ellipses matching each group's bbox centre and half-extents.
function OrbitalPaths({ showPlanets = true }: { showPlanets?: boolean } = {}) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Group 1 — large tilted orbit pair, w:1040 h:1100 centred ~(864,567) */}
      <ellipse cx="864" cy="567" rx="520" ry="370"
        fill="none" stroke="#c8a861" strokeWidth="0.6" opacity="0.22" />
      <ellipse cx="864" cy="567" rx="460" ry="310"
        fill="none" stroke="#c8a861" strokeWidth="0.4" opacity="0.12" />
      {/* Group 2 — wide mid orbit, w:1280 h:240 centred ~(864,558) */}
      <ellipse cx="864" cy="558" rx="640" ry="120"
        fill="none" stroke="#c8a861" strokeWidth="0.5" opacity="0.18" />
      {/* Path 3: x:775, y:54, w:960, h:160, opacity 0.14 — top-right arc */}
      <ellipse cx="1255" cy="134" rx="480" ry="80"
        fill="none" stroke="rgba(200,168,97,1)" strokeWidth="0.4" opacity="0.14" />
      {/* Planet dots */}
      {showPlanets && (
        <>
          <circle cx="1300" cy="420" r="4" fill="rgba(200,168,97,0.85)" />
          <circle cx="421" cy="700" r="3.5" fill="rgba(200,168,97,0.78)" />
          <circle cx="1181" cy="720" r="3" fill="rgba(200,168,97,0.72)" />
        </>
      )}
    </svg>
  );
}

// ── Landing flying comets ────────────────────────────────────────────────
// Two long warm-gold streaks that ENTER from off-screen upper-right and travel
// diagonally across the viewport, exiting off-screen lower-left. Distinct
// from the existing static `Comets` flashes — these actually traverse the
// whole screen. Independent durations & delays so the two never sync.
//
// Geometry note: the wrapper is rotated to angle θ; the inner streak is
// painted with its bright head at the wrapper origin and its tail extending
// in the wrapper's −X direction. After rotation by θ ∈ (90°, 180°), the tail
// lands UPPER-RIGHT of the head in screen space. Animating the inner element
// with translateX(+positive) moves it along the wrapper's +X axis — which,
// for those rotation angles, maps to LOWER-LEFT in screen — so head leads
// the motion and tail trails behind it (correct comet semantics).
function FlyingComets() {
  // `side: "right"` → enters upper-right, head moves lower-left. Angle ∈ (90°, 180°).
  // `side: "left"`  → mirrored: enters upper-left, head moves lower-right. Mirror angle = 180° − right_angle.
  const comets: {
    side: "right" | "left";
    top: string;
    offset: string;
    angle: number;
    delay: string;
    duration: string;
  }[] = [
    // Original two — both from right side
    { side: "right", top: "10%", offset: "-15%", angle: 132, delay: "0s",  duration: "13s" },
    { side: "right", top: "32%", offset: "-15%", angle: 148, delay: "7s",  duration: "17s" },
    // Mirror of the first one — same speed (13s), starts halfway through so the
    // two opposite trajectories alternate periodically across the screen.
    { side: "left",  top: "16%", offset: "-15%", angle: 48,  delay: "1s", duration: "13s" },
  ];
  return (
    <>
      {comets.map((c, i) => (
        <span
          key={i}
          className="flying-comet"
          style={{
            top: c.top,
            // Position from the chosen edge — same `::before` & animation work
            // for both because ::before's right:0 anchors to wrapper origin in
            // either case, and translateX(+) moves along wrapper's local +X
            // which after rotation maps to the correct screen direction.
            ...(c.side === "right" ? { right: c.offset } : { left: c.offset }),
            transform: `rotate(${c.angle}deg)`,
            ["--fc-delay" as string]: c.delay,
            ["--fc-duration" as string]: c.duration,
          }}
        />
      ))}
    </>
  );
}

// ── Landing shooting stars (зорепад) ─────────────────────────────────────
// Three diagonal streaks fall across the upper portion of the viewport at
// long, asynchronous intervals. Effect is intentionally sparse — each streak
// fires for ~1.5–2s every 22–38s, so on average ~one streak per 8–12s.
// CSS-only (GPU-accelerated transforms) so it costs nothing on the main
// thread. Animation is disabled for prefers-reduced-motion.
function ShootingStars() {
  const stars: { top: string; left: string; angle: number; delay: string; duration: string }[] = [
    { top: "9%",  left: "92%", angle: 215, delay: "0s",  duration: "26s" },
    { top: "18%", left: "70%", angle: 228, delay: "11s", duration: "31s" },
    { top: "6%",  left: "48%", angle: 210, delay: "22s", duration: "38s" },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="shooting-star"
          style={{
            top: s.top,
            left: s.left,
            transform: `rotate(${s.angle}deg)`,
            ["--ss-delay" as string]: s.delay,
            ["--ss-duration" as string]: s.duration,
          }}
        />
      ))}
    </>
  );
}

// ── Landing constellations — pixel-perfect from Figma node 257:12857 ──
// Source: 5 line vectors (group 257:12858) + 17 dot vectors (group 257:12865).
// Stroke #c8a861 @ opacity 0.28, strokeWidth 0.8. Dots filled solid #c8a861.
// No motion — exact static reproduction.
function LandingConstellationDots() {
  const stroke = "#c8a861";
  const lineProps = { fill: "none" as const, stroke, strokeOpacity: 0.28, strokeWidth: 0.8 };
  const dots: { cx: number; cy: number; r: number }[] = [
    // Top-left cluster
    { cx: 88.6,    cy: 138.6,   r: 2.6 },
    { cx: 228.6,   cy: 208.6,   r: 3.2 },
    { cx: 178.6,   cy: 328.6,   r: 2.4 },
    { cx: 380,     cy: 480,     r: 3   },
    { cx: 358.6,   cy: 158.6,   r: 2.2 },
    // Top-right cluster
    { cx: 1508.4,  cy: 135,     r: 3   },
    { cx: 1398.4,  cy: 225,     r: 2.4 },
    { cx: 1528.4,  cy: 345,     r: 3.2 },
    { cx: 1648.4,  cy: 295,     r: 2.4 },
    // Bottom-left zigzag
    { cx: 90.4,    cy: 1034.4,  r: 2.4 },
    { cx: 211,     cy: 964,     r: 3   },
    { cx: 341.2,   cy: 1033.2,  r: 3.2 },
    { cx: 441.2,   cy: 964.2,   r: 3.2 },
    // Bottom-right zigzag
    { cx: 1274.4,  cy: 969.4,   r: 2.4 },
    { cx: 1404.4,  cy: 1039.4,  r: 3   },
    { cx: 1544.4,  cy: 979.4,   r: 2.4 },
    { cx: 1664.4,  cy: 1039.4,  r: 3.2 },
  ];
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Top-left: (88.6,138.6) → (228.6,208.6) → (178.6,328.6) */}
      <polyline points="88.6,138.6 228.6,208.6 178.6,328.6" {...lineProps} />
      {/* Top-left short: (228.6,208.6) → (358.6,158.6) */}
      <line x1="228.6" y1="208.6" x2="358.6" y2="158.6"
            stroke={stroke} strokeOpacity={0.28} strokeWidth={0.8} />
      {/* Top-right: (1508.4,135) → (1398.4,225) → (1528.4,345) → (1648.4,295) */}
      <polyline points="1508.4,135 1398.4,225 1528.4,345 1648.4,295" {...lineProps} />
      {/* Bottom-left zigzag: (91,1034) → (211,964) → (341,1034) → (441,964) */}
      <polyline points="91,1034 211,964 341,1034 441,964" {...lineProps} />
      {/* Bottom-right zigzag: (1274.4,969.4) → (1404.4,1039.4) → (1544.4,979.4) → (1664.4,1039.4) */}
      <polyline points="1274.4,969.4 1404.4,1039.4 1544.4,979.4 1664.4,1039.4" {...lineProps} />

      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={stroke} />
      ))}
    </svg>
  );
}

// ── Astral chart (landing) — pixel-perfect from Figma node 257:12836 ──
// Geometry: 2 concentric rings + hexagram (two triangles) + 10 vertex dots, all gold.
// Sized & positioned to always fit inside the inner gold frame (inset 50px on every
// side). The SVG uses preserveAspectRatio="xMidYMid meet" with a SQUARE viewBox so
// the circle stays a circle and shrinks/grows with the rectangle.
function AstralChart() {
  const s = "#c8a861";
  // Coordinates around centre (0, 0). Outer ring r=540 (Figma exact). The viewBox
  // is padded to 1140 so there's a small breathing margin between the outer ring and
  // the inner gold rectangle on whichever axis is the constraint.
  //
  // 12 dots evenly spaced every 30° around each ring (clock-position layout).
  // The Figma source had 10 dots with two missing positions (90° top + 210°
  // lower-left) that produced visibly uneven gaps — we generate a clean set
  // instead. Both rings carry the same dot pattern; outer dots ride the CW
  // spin and inner dots ride the CCW spin, so they counter-rotate visually.
  // SVG y-axis points down, so sin is negated to keep 90° = top.
  const DOT_R = 3;
  const DOT_COUNT = 12;
  const makeRingDots = (radius: number) =>
    Array.from({ length: DOT_COUNT }, (_, i) => {
      const angle = (i * 2 * Math.PI) / DOT_COUNT;
      return {
        cx: radius * Math.cos(angle),
        cy: -radius * Math.sin(angle),
      };
    });
  // Rings scaled +15% from Figma baseline (540 → 621, 496.8 → 571.32) for a
  // more present chart on the landing hero.
  const outerDots = makeRingDots(621);
  const innerDots = makeRingDots(571.32);
  // Hexagram triangles — Figma vertices translated so chart centre sits at (0,0)
  // Figma cx=864, cy=588.5 → subtract from each vertex.
  const tri1 = "0,-390.1 386.38,278.64 -386.38,278.64";
  const tri2 = "0,390.1 -386.38,-278.64 386.38,-278.64";
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none flex items-center justify-center astral-chart-wrap"
    >
      <svg
        className="block w-full h-full"
        viewBox="-630 -630 1260 1260"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Outer ring — r=540 — and 12 dots evenly spaced on its circumference
            (every 30°). Grouped together so they rotate as one rigid unit, CW. */}
        <g className="astral-ring-outer">
          <circle cx={0} cy={0} r={621} fill="none" stroke={s} strokeOpacity={0.4} strokeWidth={1} />
          {outerDots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={DOT_R} fill={s} />
          ))}
        </g>

        {/* Inner ring — r=496.8 — same 12-dot pattern, rotates CCW. */}
        <g className="astral-ring-inner">
          <circle cx={0} cy={0} r={571.32} fill="none" stroke={s} strokeOpacity={0.4} strokeWidth={1} />
          {innerDots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={DOT_R} fill={s} />
          ))}
        </g>

        {/* Hexagram (Star of David) — static, kept outside both rotating
            groups so the geometry stays fixed while the rings spin. */}
        <polygon points={tri1} fill="none" stroke={s} strokeOpacity={0.6} strokeWidth={0.6} />
        <polygon points={tri2} fill="none" stroke={s} strokeOpacity={0.6} strokeWidth={0.6} />
      </svg>
    </div>
  );
}

// ── History astro decorations (simplified) ──
function HistoryDecorations() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Armillary sphere — left side */}
      <g opacity="0.55" transform="translate(197, 420)">
        <ellipse cx="0" cy="0" rx="55" ry="55" fill="none" stroke="#c8a861" strokeWidth="1" />
        <ellipse cx="0" cy="0" rx="55" ry="20" fill="none" stroke="#c8a861" strokeWidth="0.8" />
        <ellipse cx="0" cy="0" rx="20" ry="55" fill="none" stroke="#c8a861" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="6" fill="#c8a861" opacity="0.8" />
        <line x1="0" y1="-55" x2="0" y2="55" stroke="#c8a861" strokeWidth="0.8" opacity="0.5" />
      </g>
      {/* Planet orbit — right side */}
      <g opacity="0.45" transform="translate(1560, 440)">
        <ellipse cx="0" cy="0" rx="60" ry="60" fill="none" stroke="#c8a861" strokeWidth="0.8" />
        <ellipse cx="0" cy="0" rx="30" ry="10" fill="none" stroke="#c8a861" strokeWidth="0.6" />
        <circle cx="0" cy="0" r="10" fill="#c8a861" opacity="0.6" />
        <circle cx="55" cy="-22" r="5" fill="#c8a861" opacity="0.8" />
      </g>
    </svg>
  );
}

// ── Detail page astral pattern ──
// Source: Figma node 257:12716 → Frame 60 → Frame 62 (751×751, centered at 879.5/501.5)
// Three concentric rings + one offset bottom arc + heptagram {7/3} + 7 vertex dots
function DetailAstralCircles() {
  const cx = 864;       // pattern center X — aligned to card horizontal center
  const cy = 545;       // pattern center Y — sits on card center +10px
  const s = "#c8a861";  // gold stroke/fill
  const R = 346.86;     // shared radius — outer-ring 3, heptagram, dot orbit

  // 7 heptagram vertices (one at top, 360/7 ≈ 51.43° apart)
  const vertices = Array.from({ length: 7 }, (_, i) => {
    const rad = (i * 2 * Math.PI) / 7;
    return { x: cx + R * Math.sin(rad), y: cy - R * Math.cos(rad) };
  });

  // {7/3} star: connect every 3rd vertex (creates the woven 7-point star)
  const starOrder = Array.from({ length: 7 }, (_, i) => vertices[(i * 3) % 7]);
  const starPath =
    starOrder.map((v, i) => `${i === 0 ? "M" : "L"}${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(" ") + " Z";

  // Vertex 5 (angle 257.14°, lower-left) is rendered slightly smaller in Figma — keep parity
  const dotR = (i: number) => (i === 5 ? 3.20 : 3.83);

  // CSS rotation pivots around (50%, 50%) of the viewBox = (864, 558.5).
  // Our pattern center is offset to (879.5, 501.5) → translate as a percentage of viewBox.
  const rotateOriginX = ((cx / 1728) * 100).toFixed(3) + "%";
  const rotateOriginY = ((cy / 1117) * 100).toFixed(3) + "%";

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Offset bottom arc — stays still (anchors the composition to the card's lower half) */}
      <circle cx={cx} cy={cy + 123.17} r={227.21} fill="none" stroke={s} strokeWidth={0.48} opacity={0.16} />

      {/* Rotating astral ring stack */}
      <g
        className="astralRotateReverse"
        style={{ transformBox: "view-box", transformOrigin: `${rotateOriginX} ${rotateOriginY}` }}
      >
        {/* Three concentric rings (Figma values: r 375.5/358.76/346.86, op 0.28/0.16/0.42, sw 0.84/0.48/0.60) */}
        <circle cx={cx} cy={cy} r={375.50} fill="none" stroke={s} strokeWidth={0.84} opacity={0.28} />
        <circle cx={cx} cy={cy} r={358.76} fill="none" stroke={s} strokeWidth={0.48} opacity={0.16} />
        <circle cx={cx} cy={cy} r={346.86} fill="none" stroke={s} strokeWidth={0.60} opacity={0.42} />

        {/* Heptagram {7/3} — exact path traced from Figma */}
        <path d={starPath} fill="none" stroke={s} strokeWidth={0.84} opacity={0.55} />

        {/* 7 accent dots at heptagram vertices (vertex 5 slightly smaller) */}
        {vertices.map((v, i) => (
          <circle
            key={i}
            className="constellationStar"
            cx={v.x}
            cy={v.y}
            r={dotR(i)}
            fill={s}
            opacity={0.85}
            style={{ animationDelay: `${(i * 0.71) % 5}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

// ── Decorative branches near the card — pixel-perfect from Figma node 257:12716 ──
// Two identical branch groups (stems + 5 leaves + 1 red berry), positioned via
// Figma's exact relative transforms. Top branch sits above card's top-left; bottom
// branch is rotated/mirrored at the card's bottom-right. Hidden on mobile.
function FigmaBranchContent() {
  const stem = "#738c62";   // rgb(115,140,98)
  const berry = "#a0281e";  // rgb(160,40,30)
  // Group is positioned at (10, 4.5) inside the 130×86 frame
  return (
    <g transform="translate(10 4.5)">
      {/* Stems — stroke #738c62, sw 1 */}
      <path d="M 0 58 C 14.667 43.333 29.333 32 44 24 C 58.667 16 74.667 8 92 0"
            transform="translate(10 18)" fill="none" stroke={stem} strokeWidth="1" />
      <path d="M 2 22 C -0.667 14 -0.667 6.667 2 0"
            transform="translate(30 34)" fill="none" stroke={stem} strokeWidth="1" />
      <path d="M 0 18 C 4 11.333 8 5.333 12 0"
            transform="translate(32 38)" fill="none" stroke={stem} strokeWidth="1" />
      <path d="M 2 16 C -0.667 9.333 -0.667 4 2 0"
            transform="translate(56 22)" fill="none" stroke={stem} strokeWidth="1" />
      <path d="M 0 10 C 5.333 4.667 10 1.333 14 0"
            transform="translate(58 28)" fill="none" stroke={stem} strokeWidth="1" />
      <path d="M 0.667 16 C -0.667 9.333 0 4 2.667 0"
            transform="translate(81.333 10)" fill="none" stroke={stem} strokeWidth="1" />
      {/* Leaves — fill #738c62 */}
      <ellipse cx="32" cy="34" rx="3.2" ry="6.5" fill={stem} />
      <ellipse cx="44" cy="38" rx="6.5" ry="3.2" fill={stem} />
      <ellipse cx="58" cy="22" rx="3.2" ry="5.5" fill={stem} />
      <ellipse cx="72" cy="28" rx="5.5" ry="3.2" fill={stem} />
      <ellipse cx="84" cy="10" rx="3.2" ry="5.5" fill={stem} />
      {/* Berry — fill #a0281e */}
      <circle cx="102" cy="18" r="3.2" fill={berry} />
    </g>
  );
}

// Branches rendered as DOM children of the card container. Each branch is a small
// SVG positioned with its center pinned to a card corner via absolute + translate(-50%, -50%).
// Sized in % of card width, so they scale automatically with the card on any viewport.
//
// viewBox is centered on the rotated branch's geometric center (70, 35.5) so the
// SVG's CSS center == the branch's visual center. The branch transform (the matrix)
// was tuned so that the rotated/reflected branch lands centered in the viewBox.
const BRANCH_VIEWBOX = "-5 -15 150 100";

export function CardCornerBranches() {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    width: "46%",
    height: "auto",
    aspectRatio: "150 / 100",
    overflow: "visible",
    zIndex: 10,
    pointerEvents: "none",
  };
  return (
    <>
      {/* Top-left — branch center pinned to card top-left corner */}
      <svg
        aria-hidden="true"
        className="hidden md:block"
        style={{ ...baseStyle, top: 0, left: 0 }}
        viewBox={BRANCH_VIEWBOX}
      >
        <g transform="matrix(0.9948 -0.1015 0.1015 0.9948 0 0)">
          <FigmaBranchContent />
        </g>
      </svg>
      {/* Bottom-right — 180° mirror, branch center pinned to card bottom-right corner */}
      <svg
        aria-hidden="true"
        className="hidden md:block"
        style={{ ...baseStyle, top: "100%", left: "100%" }}
        viewBox={BRANCH_VIEWBOX}
      >
        <g transform="matrix(-0.9948 0.1015 -0.1015 -0.9948 140 71)">
          <FigmaBranchContent />
        </g>
      </svg>
    </>
  );
}

// ── Deck-specific astro decorations (Figma node 257:12904 → astro-comet + astro-pleiades) ──
// Comet: thin warm-white gradient streak, top-center area.
// Pleiades: 7 four-pointed sparkle stars clustered in the lower-left.
function DeckAstroDecorations({ showPleiades = true }: { showPleiades?: boolean } = {}) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="cometGrad" x1="595.5" y1="210.6" x2="731.2" y2="174.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE89A" stopOpacity="0" />
          <stop offset="0.6" stopColor="#FFE89A" stopOpacity="0.45" />
          <stop offset="0.92" stopColor="#FFFAE0" stopOpacity="0.95" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
      {/* astro-comet (Figma 257:13041) — anchor (540,130), 240×80 frame */}
      <g transform="translate(540 130)">
        <path
          d="M123.54 64.076C161.019 54.0337 191.3 45.5129 191.174 45.0445C191.048 44.576 160.564 52.3371 123.086 62.3795C85.6073 72.4218 55.3267 80.9425 55.4522 81.411C55.5777 81.8795 86.0618 74.1183 123.54 64.076Z"
          fill="url(#cometGrad)"
        />
      </g>
      {/* astro-pleiades (Figma 257:13052) — 7 sparkles, anchor (470,870), 100×80 frame */}
      {showPleiades && (
        <g transform="translate(470 870)" fill="#FFE89A">
          <path className="constellationStar" style={{ animationDelay: "0s" }}    d="M20 27L20.7 29.3L23 30L20.7 30.7L20 33L19.3 30.7L17 30L19.3 29.3L20 27Z" />
          <path className="constellationStar" style={{ animationDelay: "0.7s" }}  d="M50 14.4L50.9 17.1L53.6 18L50.9 18.9L50 21.6L49.1 18.9L46.4 18L49.1 17.1L50 14.4Z" />
          <path className="constellationStar" style={{ animationDelay: "1.4s" }}  d="M78 27.6L78.6 29.4L80.4 30L78.6 30.6L78 32.4L77.4 30.6L75.6 30L77.4 29.4L78 27.6Z" />
          <path className="constellationStar" style={{ animationDelay: "2.1s" }}  d="M34 47.2L34.7 49.3L36.8 50L34.7 50.7L34 52.8L33.3 50.7L31.2 50L33.3 49.3L34 47.2Z" />
          <path className="constellationStar" style={{ animationDelay: "2.8s" }}  d="M64 52.8L64.8 55.2L67.2 56L64.8 56.8L64 59.2L63.2 56.8L60.8 56L63.2 55.2L64 52.8Z" />
          <path className="constellationStar" style={{ animationDelay: "3.5s" }}  d="M82 62L82.5 63.5L84 64L82.5 64.5L82 66L81.5 64.5L80 64L81.5 63.5L82 62Z" />
          <path className="constellationStar" style={{ animationDelay: "4.2s" }}  d="M14 62L14.5 63.5L16 64L14.5 64.5L14 66L13.5 64.5L12 64L13.5 63.5L14 62Z" />
        </g>
      )}
    </svg>
  );
}

// ── Comets — pixel-perfect from Figma node 296:1522 ──
// Three thin gold streaks angled at 15° (CCW), gradient from transparent tail
// to bright white head. Each comet's bbox after rotation is ~136×38px.
// Positions chosen so every comet stays inside the inner gold frame
// (x ∈ [50, 1540], y ∈ [90, 1065]) AND clear of titles, deck, list, CTA.
// During flight, the inner CSS translateX(±300) along the rotated -15° axis moves
// the comet by ±78 px vertically + half-bbox 19 px → ~97 px peak swing in world Y.
// So a top comet at y=170 actually reaches y=73 at its peak — overlapping the
// brand row & inner frame line. Top positions are bumped to y≥210 for clearance,
// bottom positions to y≤950 (mirror), keeping a harmonious top/bottom rhythm.
const COMETS_BY_VARIANT: Record<SceneVariant, { x: number; y: number }[]> = {
  // Landing — hero title band y≈440–700, CTA y≈770–830, brand top-centre y≈70.
  landing: [
    { x: 160,  y: 220 },   // top-left, well below brand row
    { x: 1370, y: 210 },   // top-right
    { x: 1390, y: 940 },   // bottom-right
  ],
  // Deck — title y≈215–260 centred (x≈600–1128), deck cards centre, CTA y≈820.
  // Side gutters x<450 / x>1280 keep top comets clear of the title text.
  deck: [
    { x: 140,  y: 220 },   // top-left, beside title
    { x: 1380, y: 230 },   // top-right, beside title
    { x: 170,  y: 940 },   // bottom-left
  ],
  // Detail — clean, no comets.
  detail: [],
  // History — title y≈210, subtitle y≈270, list/empty centred below (x≈544–1184).
  history: [
    { x: 160,  y: 230 },   // top-left
    { x: 1380, y: 210 },   // top-right
    { x: 1390, y: 940 },   // bottom-right
  ],
};

function Comets({ variant }: { variant: SceneVariant }) {
  const comets = COMETS_BY_VARIANT[variant];
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="cometGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#FFE89A" stopOpacity="0"    />
          <stop offset="60%"  stopColor="#FFE89A" stopOpacity="0.45" />
          <stop offset="92%"  stopColor="#FFFAE0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1"    />
        </linearGradient>
      </defs>
      {comets.map((c, i) => (
        // Outer <g>: SVG transform = static position + rotation
        // Inner <g>: CSS-animated flash (opacity + slight scale punch)
        <g key={i} transform={`translate(${c.x} ${c.y}) rotate(-15)`}>
          <g
            className="comet"
            style={{ ["--comet-delay" as string]: `${i * 2.7}s` }}
          >
            <ellipse cx="70.255" cy="0.88" rx="70.255" ry="0.88" fill="url(#cometGradient)" />
          </g>
        </g>
      ))}
    </svg>
  );
}

export default function SceneBackground({ variant = "landing" }: SceneBackgroundProps) {
  return (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Atmosphere glow */}
      <div className="atmosphere-glow" />

      {/* Frame borders — hidden on mobile */}
      <div className="hidden md:block">
        <div className="frame-border" style={{ borderColor: "rgba(200,168,97,0.45)" }} />
        <div className="frame-border-inner" style={{ borderColor: "rgba(200,168,97,0.20)" }} />
        <CornerDiamond pos="tl" />
        <CornerDiamond pos="tr" />
        <CornerDiamond pos="bl" />
        <CornerDiamond pos="br" />
      </div>

      {/* Variant-specific layers.
          Landing keeps the astral chart + shooting stars on top of comets.
          Every other page renders ONLY comets — no constellations, no
          twinkles, no astral objects. Comets are the single shared ambient
          decoration across the whole app. */}
      {variant === "landing" && (
        <>
          <AstralChart />
          <ShootingStars />
          <FlyingComets />
        </>
      )}
      {/* Deck — 4 corner constellations from Figma node 302:1689 + flying comets
          (same animations as landing) */}
      {variant === "deck" && (
        <>
          <Constellations />
          <ShootingStars />
          <FlyingComets />
        </>
      )}
      <Comets variant={variant} />
    </div>
  );
}
