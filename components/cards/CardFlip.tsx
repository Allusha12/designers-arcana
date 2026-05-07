import CardBack from "./CardBack";
import CardFront from "./CardFront";
import type { Card } from "@/types";

interface CardFlipProps {
  card: Card;
  isFlipped: boolean;
}

// Uses CSS preserve-3d classes from globals.css:
// .perspective > .card-inner[.flipped] > .card-face / .card-back-face
//
// Fills 100% of the parent so callers control the responsive size; the
// 374:594 aspect ratio is enforced internally so the card always keeps the
// correct proportions regardless of viewport.
export default function CardFlip({ card, isFlipped }: CardFlipProps) {
  return (
    <div
      className="perspective"
      style={{ width: "100%", aspectRatio: "374 / 594" }}
    >
      <div
        className={`card-inner${isFlipped ? " flipped" : ""}`}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Visible when NOT flipped — back of card */}
        <div className="card-face">
          <CardBack size="fill" />
        </div>
        {/* Visible when flipped — front illustration */}
        <div className="card-back-face">
          <CardFront card={card} size="detail" />
        </div>
      </div>
    </div>
  );
}
