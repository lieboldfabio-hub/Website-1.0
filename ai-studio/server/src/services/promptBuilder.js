"use strict";

const industries = require("./industries");

/*
  Baut aus den Formularwerten (Branche, Stil, Farbschema, Zielgruppe,
  Atmosphaere, Modernitaet, Premium-Level, Zusatzwuensche) einen einzigen,
  strukturierten englischen Prompt. Bildmodelle verstehen Englisch spuerbar
  praeziser (siehe beispiele/BILDPROMPTS.md) - die Bedienoberflaeche bleibt
  trotzdem komplett auf Deutsch.
*/

// Dieselben sechs Farbrichtungen wie im Farbwaehler der Musterseite
// (sf-webseiten/assets/css/site.css, .muster[data-muster="..."]) - so bleibt
// die Farbsprache der KI-Bilder mit dem Rest der Website konsistent.
const COLOR_SCHEMES = {
  vermillion: { label: "Vermillion", hex: "#c23c1a", phrase: "a warm vermillion red-orange accent color" },
  kobalt: { label: "Kobalt", hex: "#2247d4", phrase: "a cool cobalt blue accent color" },
  marine: { label: "Marine", hex: "#9e580d", phrase: "a warm amber-bronze accent color" },
  tanne: { label: "Tanne", hex: "#8a6a1c", phrase: "a warm olive-gold accent color" },
  aubergine: { label: "Aubergine", hex: "#c33c46", phrase: "a deep berry-red aubergine accent color" },
  petrol: { label: "Petrol", hex: "#0a6f78", phrase: "a deep petrol teal accent color" },
};

const STYLES = {
  "modern-minimal": "modern minimalist composition, clean negative space, uncluttered",
  "elegant-premium": "elegant premium composition, refined and understated luxury",
  "dynamisch-energetisch": "dynamic energetic composition, strong diagonals, sense of motion",
  "warm-einladend": "warm inviting composition, soft and approachable",
  "seriös-klassisch": "serious classic composition, timeless and trustworthy",
  "kreativ-verspielt": "creative playful composition, unexpected angles, expressive",
};

const ATMOSPHERES = {
  gemuetlich: "a cozy, relaxed atmosphere",
  elegant: "an elegant, refined atmosphere",
  energiegeladen: "an energetic, high-energy atmosphere",
  "seriös-professionell": "a serious, professional atmosphere",
  luxurioes: "a luxurious, high-end atmosphere",
  "freundlich-einladend": "a friendly, welcoming atmosphere",
};

const MODERNITY_SCALE = [
  "traditional and classic in style",
  "mostly traditional with a few modern touches",
  "balanced between classic and contemporary",
  "modern and contemporary",
  "ultra-modern, cutting-edge, futuristic",
];

const PREMIUM_SCALE = [
  "simple and functional, no-frills",
  "solid and approachable, mid-range",
  "high quality and well-appointed",
  "premium and high-end",
  "ultra-premium, luxury flagship quality",
];

const QUALITY_SUFFIX_IMAGE =
  "professional commercial photography, high resolution, sharp focus, " +
  "natural realistic look, no text, no logos, no watermark, no distorted hands or faces";

const QUALITY_SUFFIX_VIDEO =
  "professional commercial cinematography, smooth stable motion, high " +
  "resolution, natural realistic look, no text overlays, no logos, no watermark";

const NEGATIVE_PROMPT_IMAGE =
  "text, watermark, logo, signature, low quality, blurry, distorted anatomy, extra limbs, oversaturated, cartoon, illustration";

function clampScale(value) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return 3;
  return Math.max(1, Math.min(5, n));
}

/** Entfernt Steuerzeichen und begrenzt die Laenge; Freitext geht sonst ungeprueft in den Prompt. */
function sanitizeFreeText(value, maxLength) {
  if (!value) return "";
  return String(value)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength || 400);
}

function resolveSubject(industry, subjectId, customSubject) {
  if (subjectId === "custom" || !subjectId) {
    const custom = sanitizeFreeText(customSubject, 300);
    if (custom) return custom;
  }
  const preset = industry.subjectPresets.find((p) => p.id === subjectId);
  if (preset) return preset.promptFragment;
  return industry.subjectPresets[0].promptFragment;
}

function buildCommonParts(input) {
  const industry = industries.bySlug(input.industrySlug);
  if (!industry) throw new Error(`Unbekannte Branche: ${input.industrySlug}`);

  const style = STYLES[input.style] || STYLES["modern-minimal"];
  const colorScheme = COLOR_SCHEMES[input.colorScheme] || null;
  const atmosphere = ATMOSPHERES[input.atmosphere] || ATMOSPHERES["seriös-professionell"];
  const modernity = MODERNITY_SCALE[clampScale(input.modernity) - 1];
  const premium = PREMIUM_SCALE[clampScale(input.premium) - 1];
  const audience = sanitizeFreeText(input.audience, 150);
  const extra = sanitizeFreeText(input.extra, 400);

  return { industry, style, colorScheme, atmosphere, modernity, premium, audience, extra };
}

function buildImagePrompt(input) {
  const { industry, style, colorScheme, atmosphere, modernity, premium, audience, extra } =
    buildCommonParts(input);
  const subject = resolveSubject(industry, input.subjectId, input.customSubject);

  const parts = [
    subject + ".",
    industry.defaultStyleBlock + ".",
    style + ".",
    colorScheme ? `Color palette built around ${colorScheme.phrase}.` : "",
    `The image conveys ${atmosphere}.`,
    `The visual style is ${modernity}, and the overall quality level feels ${premium}.`,
    audience ? `Designed to appeal to this target audience: ${audience}.` : "",
    extra ? `Additional wishes: ${extra}.` : "",
    QUALITY_SUFFIX_IMAGE + ".",
  ].filter(Boolean);

  return {
    prompt: parts.join(" "),
    negativePrompt: NEGATIVE_PROMPT_IMAGE,
    industry,
  };
}

function buildVideoPrompt(input) {
  const { industry, style, colorScheme, atmosphere, modernity, premium, audience, extra } =
    buildCommonParts(input);
  const subject = resolveSubject(industry, input.subjectId, input.customSubject);

  const parts = [
    subject + ", shown as a short continuous camera shot.",
    industry.videoStyleBlock + ".",
    style + ".",
    colorScheme ? `Color palette built around ${colorScheme.phrase}.` : "",
    `The footage conveys ${atmosphere}.`,
    `The visual style is ${modernity}, and the overall quality level feels ${premium}.`,
    audience ? `Designed to appeal to this target audience: ${audience}.` : "",
    extra ? `Additional wishes: ${extra}.` : "",
    QUALITY_SUFFIX_VIDEO + ".",
  ].filter(Boolean);

  return {
    prompt: parts.join(" "),
    industry,
  };
}

module.exports = {
  COLOR_SCHEMES,
  STYLES,
  ATMOSPHERES,
  buildImagePrompt,
  buildVideoPrompt,
  sanitizeFreeText,
};
