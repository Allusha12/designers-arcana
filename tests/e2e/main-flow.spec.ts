import { test, expect } from "@playwright/test";

// Helpers — target the primary CTA button/link by class to avoid `aria-label`
// collisions on similar-named elements (e.g. the deck card stack also has
// `aria-label="Тасувати колоду"`, the Logo has `aria-label="На головну"`).
const primaryButton = (page: import("@playwright/test").Page) => page.locator("button.btn-primary");
const primaryLink = (page: import("@playwright/test").Page) => page.locator("a.btn-primary");

// CardSpread renders three layouts and toggles them via media-query display:
// `.dealCard` is used inside the desktop flex row AND the tablet scroll row;
// `.dealCardGrid` is used inside the phone 2×2 grid. Match both so a single
// helper works at every viewport.
const spreadCards = (page: import("@playwright/test").Page) =>
  page.locator(".dealCard:visible, .dealCardGrid:visible");

// Phones get 4 cards (2×2 grid); tablet & desktop get 5 (full peek). Read the
// active viewport width to pick the right count — playwright.config.ts ships
// two projects (1440-wide chromium, 375-wide iphone-se) so this branch covers
// both without a manual project name check.
const expectedCardCount = (page: import("@playwright/test").Page) =>
  (page.viewportSize()?.width ?? 1440) < 768 ? 4 : 5;

// End-to-end happy path — the core PRD user journey:
// Landing → Deck → Shuffle → Pick → Detail → "Витягнути ще" → Deck.
test("main flow: pick a card and return to deck", async ({ page }) => {
  // ── 1. Landing ──
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Designer's Arcana/i })).toBeVisible();
  await expect(primaryLink(page)).toBeVisible();

  // ── 2. Click CTA → Deck ──
  await primaryLink(page).click();
  await expect(page).toHaveURL(/\/deck$/);
  await expect(page.getByRole("heading", { name: /ТАСУЙ ЩОБ ОБРАТИ КАРТУ/i })).toBeVisible();
  await expect(primaryButton(page)).toBeVisible();

  // ── 3. Shuffle → spread (5 cards on desktop/tablet, 4 on phone grid) ──
  await primaryButton(page).click();
  await expect(page.getByRole("heading", { name: /ОБИРАЙ СВОЮ КАРТУ/i })).toBeVisible({ timeout: 5000 });

  const visibleCards = spreadCards(page);
  await expect(visibleCards).toHaveCount(expectedCardCount(page));

  // ── 4. Pick the first card → navigate to detail.
  // `.first()` works on both layouts; the centre-of-five only exists on
  // desktop/tablet, so we don't try to be clever about position. ──
  await visibleCards.first().click();
  await expect(page).toHaveURL(/\/card\/card-\d+$/);

  // The card flip animation auto-runs after ~400ms; the card name should be
  // present somewhere on the page (in either the section labels or as alt
  // text on the image).
  // Both desktop (.lg:grid) and mobile (.lg:hidden) layouts render these
  // labels — pick whichever is currently visible at the active viewport.
  await expect(page.getByText(/ЗНАЧЕННЯ/i).filter({ visible: true })).toBeVisible();
  await expect(page.getByText(/ПОРАДА/i).filter({ visible: true })).toBeVisible();
  await expect(primaryLink(page)).toBeVisible();

  // ── 5. "Витягнути ще" returns to /deck ──
  await primaryLink(page).click();
  await expect(page).toHaveURL(/\/deck$/);
});

// History should pick up the card we just drew, and clicking the row should
// open the detail popup (rendered via React Portal into <body>).
test("history captures drawn cards and opens the detail popup", async ({ page, context }) => {
  // Wipe any prior local history so the test is deterministic.
  await context.addInitScript(() => localStorage.clear());

  await page.goto("/deck");
  await primaryButton(page).click();
  await expect(page.getByRole("heading", { name: /ОБИРАЙ СВОЮ КАРТУ/i })).toBeVisible();
  await spreadCards(page).first().click();
  await expect(page).toHaveURL(/\/card\/card-\d+$/);

  // Navigate to History via the Header link
  await page.getByRole("link", { name: /^ІСТОРІЯ$/i }).click();
  await expect(page).toHaveURL(/\/history$/);

  // One row should now be in the list
  const item = page.getByRole("listitem");
  await expect(item).toHaveCount(1);

  // Click the row's first button (thumbnail) → vanishOut animation + popup
  // opens after ~220ms delay.
  await item.locator("button").first().click();

  // Popup is rendered via createPortal into document.body, with the
  // accessible name "Закрити" on the close button.
  await expect(page.getByRole("button", { name: /Закрити/i })).toBeVisible({ timeout: 1500 });
  await expect(page.getByText(/ЗНАЧЕННЯ/i).first()).toBeVisible();
  await expect(page.getByText(/ПОРАДА/i).first()).toBeVisible();

  // Close the popup with Escape — body scroll unlocks and popup is removed.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /Закрити/i })).toBeHidden();
});

// Delete a history entry — pure interaction with localStorage path.
test("delete history entry removes the row", async ({ page, context }) => {
  await context.addInitScript(() => {
    const entry = {
      id: "local_test_a",
      cardSlug: "card-01",
      drawnAt: new Date().toISOString(),
    };
    localStorage.setItem("arcana_history", JSON.stringify([entry]));
  });

  await page.goto("/history");
  await expect(page.getByRole("listitem")).toHaveCount(1);

  await page.getByRole("button", { name: /Видалити запис/i }).click();
  await expect(page.getByRole("listitem")).toHaveCount(0);
  // Empty state illustration should now be visible
  await expect(page.locator('img[alt=""]').first()).toBeVisible();
});

// 404 — unknown path lands on the themed Not-Found page with a CTA.
test("unknown route shows themed 404 with a return-home button", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  // Next returns 404 status for not-found.tsx
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /Загубилась карта/i })).toBeVisible();
  await expect(primaryLink(page)).toBeVisible();

  await primaryLink(page).click();
  await expect(page).toHaveURL(/\/$/);
});
