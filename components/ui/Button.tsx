"use client";
import Link from "next/link";
import { clsx } from "clsx";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit";
}

export default function Button({
  label,
  onClick,
  href,
  className,
  disabled,
  isLoading,
  type = "button",
}: ButtonProps) {
  const inner = (
    <>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: 18,
        }}
      >
        ✦
      </span>
      <span className="text-btn">{label}</span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: 18,
        }}
      >
        ✦
      </span>
    </>
  );

  const cls = clsx(
    "btn-primary",
    (disabled || isLoading) && "opacity-50 pointer-events-none",
    className
  );

  if (href && !disabled && !isLoading)
    return <Link href={href} className={cls}>{inner}</Link>;

  return (
    <button type={type} onClick={onClick} disabled={disabled || isLoading} className={cls}>
      {inner}
    </button>
  );
}
