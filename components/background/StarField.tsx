// Pixel-perfect star field — exact positions, colors and opacities
// from Figma node 257:12904 (background-pattern, deck screen 1728×1117)
// Each star renders at its Figma opacity value and twinkles via CSS animation.
// NOTE: we separate fill color from opacity so CSS animation only pulses alpha,
// not the double-multiplied rgba value that caused stars to appear too dim.

const STARS = [
  // planets (no twinkle — fixed dots)
  { x:1296, y:416,  r:4,   color:"#c8a861", op:0.85, planet:true },
  { x:417,  y:697,  r:3.5, color:"#c8a861", op:0.78, planet:true },
  { x:1177, y:717,  r:3,   color:"#c8a861", op:0.72, planet:true },
  // star-twinkle-01..70 — exact Figma data
  { x:1312, y:958,  r:4.5, color:"#c8a861", op:0.28 },
  { x:480,  y:581,  r:4,   color:"#e8c882", op:0.67 },
  { x:277,  y:305,  r:4,   color:"#c8a861", op:0.39 },
  { x:620,  y:624,  r:2.5, color:"#e5ddc8", op:0.30 },
  { x:495,  y:187,  r:2,   color:"#e5ddc8", op:0.60 },
  { x:255,  y:979,  r:2,   color:"#c8a861", op:0.59 },
  { x:1443, y:1009, r:2.5, color:"#e8c882", op:0.65 },
  { x:381,  y:482,  r:3,   color:"#e5ddc8", op:0.34 },
  { x:1382, y:606,  r:4.5, color:"#c8a861", op:0.39 },
  { x:1331, y:519,  r:4.5, color:"#c8a861", op:0.32 },
  { x:165,  y:962,  r:3,   color:"#e5ddc8", op:0.51 },
  { x:974,  y:413,  r:1.5, color:"#e5ddc8", op:0.31 },
  { x:129,  y:483,  r:3,   color:"#e8c882", op:0.63 },
  { x:1285, y:807,  r:4,   color:"#c8a861", op:0.34 },
  { x:586,  y:928,  r:4,   color:"#e5ddc8", op:0.61 },
  { x:854,  y:897,  r:2,   color:"#c8a861", op:0.44 },
  { x:1654, y:808,  r:3,   color:"#c8a861", op:0.54 },
  { x:189,  y:362,  r:2,   color:"#e5ddc8", op:0.37 },
  { x:1449, y:225,  r:4,   color:"#e8c882", op:0.55 },
  { x:1128, y:894,  r:2.5, color:"#e5ddc8", op:0.39 },
  { x:1379, y:620,  r:2,   color:"#c8a861", op:0.69 },
  { x:317,  y:723,  r:1.5, color:"#c8a861", op:0.36 },
  { x:1119, y:243,  r:2.5, color:"#c8a861", op:0.55 },
  { x:429,  y:656,  r:1.5, color:"#c8a861", op:0.27 },
  { x:419,  y:575,  r:4,   color:"#c8a861", op:0.49 },
  { x:695,  y:401,  r:2,   color:"#e5ddc8", op:0.61 },
  { x:1305, y:835,  r:3,   color:"#c8a861", op:0.44 },
  { x:1422, y:1002, r:4.5, color:"#e8c882", op:0.66 },
  { x:387,  y:963,  r:2.5, color:"#e5ddc8", op:0.31 },
  { x:1661, y:258,  r:3,   color:"#c8a861", op:0.58 },
  { x:1569, y:908,  r:4,   color:"#e8c882", op:0.69 },
  { x:194,  y:492,  r:2,   color:"#e5ddc8", op:0.56 },
  { x:1412, y:938,  r:1.5, color:"#c8a861", op:0.27 },
  { x:405,  y:828,  r:3.5, color:"#c8a861", op:0.32 },
  { x:1505, y:756,  r:2.5, color:"#e5ddc8", op:0.47 },
  { x:1639, y:217,  r:4,   color:"#c8a861", op:0.53 },
  { x:211,  y:562,  r:4.5, color:"#c8a861", op:0.27 },
  { x:1383, y:875,  r:4,   color:"#e5ddc8", op:0.66 },
  { x:1041, y:312,  r:4.5, color:"#c8a861", op:0.64 },
  { x:552,  y:119,  r:2,   color:"#e8c882", op:0.55 },
  { x:315,  y:437,  r:3,   color:"#c8a861", op:0.30 },
  { x:1624, y:238,  r:3,   color:"#e5ddc8", op:0.45 },
  { x:554,  y:999,  r:4,   color:"#e5ddc8", op:0.26 },
  { x:1510, y:830,  r:3.5, color:"#c8a861", op:0.45 },
  { x:1328, y:436,  r:4,   color:"#e5ddc8", op:0.40 },
  { x:363,  y:894,  r:3,   color:"#e8c882", op:0.30 },
  { x:965,  y:164,  r:2,   color:"#e8c882", op:0.70 },
  { x:1372, y:738,  r:2.5, color:"#e5ddc8", op:0.45 },
  { x:205,  y:590,  r:4,   color:"#c8a861", op:0.36 },
  { x:152,  y:379,  r:3,   color:"#e5ddc8", op:0.36 },
  { x:669,  y:976,  r:3,   color:"#e5ddc8", op:0.38 },
  { x:1333, y:490,  r:4.5, color:"#c8a861", op:0.27 },
  { x:595,  y:540,  r:2.5, color:"#e8c882", op:0.29 },
  { x:423,  y:870,  r:2.5, color:"#c8a861", op:0.46 },
  { x:1149, y:978,  r:4,   color:"#e5ddc8", op:0.26 },
  { x:500,  y:972,  r:2.5, color:"#c8a861", op:0.54 },
  { x:690,  y:746,  r:4,   color:"#c8a861", op:0.38 },
  { x:1379, y:260,  r:3.5, color:"#e5ddc8", op:0.51 },
  { x:1492, y:112,  r:3.5, color:"#e5ddc8", op:0.46 },
  { x:187,  y:389,  r:2,   color:"#e5ddc8", op:0.38 },
  { x:1386, y:243,  r:2,   color:"#c8a861", op:0.57 },
  { x:1630, y:918,  r:4,   color:"#c8a861", op:0.46 },
  { x:84,   y:190,  r:3.5, color:"#c8a861", op:0.53 },
  { x:1564, y:144,  r:4.5, color:"#c8a861", op:0.41 },
  { x:1364, y:1016, r:2.5, color:"#e5ddc8", op:0.54 },
  { x:69,   y:169,  r:2.5, color:"#e5ddc8", op:0.44 },
  { x:180,  y:806,  r:2,   color:"#c8a861", op:0.45 },
  { x:557,  y:327,  r:1.5, color:"#e8c882", op:0.66 },
  { x:523,  y:988,  r:2,   color:"#e5ddc8", op:0.64 },
  { x:992,  y:928,  r:4,   color:"#c8a861", op:0.58 },
] satisfies { x: number; y: number; r: number; color: string; op: number; planet?: boolean }[];

export default function StarField() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="xMidYMid slice"
    >
      {STARS.map((s, i) => (
        <circle
          key={i}
          // cx/cy = top-left corner + radius (Figma stores x,y as top-left of bounding box)
          cx={s.x + s.r}
          cy={s.y + s.r}
          r={s.r}
          fill={s.color}
          opacity={s.op}
          className={s.planet ? undefined : "constellationStar"}
          style={s.planet ? undefined : { animationDelay: `${((i * 0.37) % 4.8).toFixed(2)}s` }}
        />
      ))}
    </svg>
  );
}
