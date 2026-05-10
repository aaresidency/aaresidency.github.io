/**
 * Build-time site context: analytics, light experimentation, operations metadata.
 *
 * GitHub Actions / local env examples:
 *   GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *   HERO_VARIANT=a              # or b — homepage headline alternate (rebuild to switch)
 *   RATES_EFFECTIVE_ISO=2026-05-01
 *   RATES_EFFECTIVE_LABEL="May 2026"
 */
export default function () {
  const heroVariant = (process.env.HERO_VARIANT || "a").trim().toLowerCase();
  const hv = heroVariant === "b" ? "b" : "a";

  const ratesISO = (process.env.RATES_EFFECTIVE_ISO || "2026-05-01").trim() || "2026-05-01";
  const ratesLabel = (process.env.RATES_EFFECTIVE_LABEL || "May 2026").trim() || "May 2026";

  return {
    gaMeasurementId: (process.env.GA_MEASUREMENT_ID || "").trim(),
    heroVariant: hv,
    ratesEffectiveISO: ratesISO,
    ratesEffectiveLabel: ratesLabel,
  };
}
