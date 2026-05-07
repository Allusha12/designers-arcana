// Figma deck design (node 279:14291): logo is text only — no flanking ornament dots.
// Clicking the logo returns the user to the landing page.
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" aria-label="На головну" className="text-logo nav-link">
      THE DESIGNER&apos;S ARCANA
    </Link>
  );
}
