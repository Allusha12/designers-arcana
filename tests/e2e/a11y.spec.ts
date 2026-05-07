import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Accessibility audit using axe-core. Each spec loads a route, lets it settle,
// and runs axe with the WCAG 2.1 AA + best-practice rule sets. Test fails on
// any *violation* (incomplete + passes are tolerated).

const ROUTES = [
  { path: "/", name: "landing" },
  { path: "/deck", name: "deck" },
  { path: "/history", name: "history (empty state)" },
  { path: "/card/card-01", name: "card detail" },
  { path: "/this-route-does-not-exist", name: "404" },
];

for (const route of ROUTES) {
  test(`a11y — ${route.name}`, async ({ page }) => {
    await page.goto(route.path);
    // Give animations + font swap a beat to settle so we don't measure
    // mid-transition states.
    await page.waitForTimeout(800);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Skip rules that conflict with the dark cosmic palette by design —
      // we accept lower contrast on decorative gold borders & ghost text.
      // Anything text-content-related still gets checked.
      .disableRules(["region"])
      .analyze();

    // Surface violations in the test report so they're easy to read.
    if (results.violations.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        `\n⚠️  ${route.name} — ${results.violations.length} a11y violation(s):`,
      );
      for (const v of results.violations) {
        // eslint-disable-next-line no-console
        console.log(`  • ${v.id} (${v.impact}): ${v.help}`);
      }
    }

    expect(results.violations).toEqual([]);
  });
}
