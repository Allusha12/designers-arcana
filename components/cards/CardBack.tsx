import Image from "next/image";
import { clsx } from "clsx";

interface CardBackProps {
  className?: string;
  onClick?: () => void;
  size?: "spread" | "idle" | "fill";
}

// spread: 208×329, idle: 219×347, fill: 100%×100% (used inside CardFlip)
export default function CardBack({ className, onClick, size = "idle" }: CardBackProps) {
  const isFill = size === "fill";
  const w = size === "spread" ? 208 : 219;
  const h = size === "spread" ? 329 : 347;
  const r = size === "spread" ? 15 : 16;

  return (
    <div
      className={clsx(
        "relative shrink-0 overflow-hidden",
        onClick && "cursor-pointer transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_0_24px_rgba(200,168,97,0.3)]",
        isFill && "w-full h-full",
        className
      )}
      style={isFill ? { borderRadius: r } : { width: w, height: h, borderRadius: r }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <Image
        src="/cards/back.png"
        alt="Зворотня сторона карти"
        fill
        sizes={`${w}px`}
        className="object-cover"
        priority
      />
      {/* Gold glow border on hover */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: r,
          border: "1px solid rgba(200,168,97,0.45)",
        }}
      />
    </div>
  );
}
