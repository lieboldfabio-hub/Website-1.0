"use strict";

const jobManager = require("./jobManager");
const mediaLibrary = require("./mediaLibrary");
const promptBuilder = require("./promptBuilder");
const industries = require("./industries");
const imageProviders = require("../providers/image/registry");
const videoProviders = require("../providers/video/registry");

/*
  Buendelt die eigentliche Generierungs-Logik, damit sie sowohl von
  routes/generate.js (neue Anfrage) als auch von routes/media.js
  ("erneut generieren") verwendet werden kann, ohne Code zu verdoppeln.
*/

const DEFAULT_ASPECT = "1:1";
const VIDEO_POLL_INTERVAL_MS = 4000;
const VIDEO_MAX_WAIT_MS = 6 * 60 * 1000;

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function resolveAspect(industry, params) {
  if (params.slotId) {
    const slot = industry.slots.find((s) => s.id === params.slotId);
    if (slot) return slot.aspect;
  }
  return params.aspectOverride || DEFAULT_ASPECT;
}

function resolveSlot(industry, params) {
  if (!params.slotId) return null;
  return industry.slots.find((s) => s.id === params.slotId) || null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function enqueueImageGeneration(params) {
  const industry = industries.bySlug(params.industrySlug);
  if (!industry) throw badRequest(`Unbekannte Branche: ${params.industrySlug}`);

  const provider =
    params.provider && params.provider !== "auto"
      ? imageProviders.get(params.provider)
      : imageProviders.firstConfigured();
  if (!provider) throw badRequest("Kein Bild-Provider konfiguriert. Siehe ai-studio/README.md.");
  if (!provider.isConfigured()) throw badRequest(`Provider "${provider.id}" ist nicht konfiguriert.`);

  const aspect = resolveAspect(industry, params);
  const slot = resolveSlot(industry, params);
  const { prompt, negativePrompt } = promptBuilder.buildImagePrompt(params);
  const colorHex = promptBuilder.COLOR_SCHEMES[params.colorScheme]
    ? promptBuilder.COLOR_SCHEMES[params.colorScheme].hex
    : undefined;

  const job = jobManager.create("image", { industrySlug: params.industrySlug, slotId: params.slotId, provider: provider.id });

  jobManager.runWithSimulatedProgress(job.id, async () => {
    const { buffer, mimeType } = await provider.generateImage({
      prompt,
      negativePrompt,
      aspect,
      colorHex,
      label: industry.label,
    });

    const record = mediaLibrary.save({
      type: "image",
      provider: provider.id,
      industry: params.industrySlug,
      projectSlug: industry.projectSlug,
      slotId: params.slotId || null,
      slotFilename: slot ? slot.filename : null,
      prompt,
      params,
      buffer,
      mimeType,
      mock: provider.id === "mock",
    });

    return { mediaId: record.id };
  });

  return job;
}

function enqueueVideoGeneration(params) {
  const industry = industries.bySlug(params.industrySlug);
  if (!industry) throw badRequest(`Unbekannte Branche: ${params.industrySlug}`);

  const provider =
    params.provider && params.provider !== "auto"
      ? videoProviders.get(params.provider)
      : videoProviders.firstConfigured();
  if (!provider) throw badRequest("Kein Video-Provider konfiguriert. Siehe ai-studio/README.md.");
  if (!provider.isConfigured()) throw badRequest(`Provider "${provider.id}" ist nicht konfiguriert.`);

  const aspect = resolveAspect(industry, params);
  const slot = resolveSlot(industry, params);
  const { prompt } = promptBuilder.buildVideoPrompt(params);
  const durationSeconds = params.durationSeconds || 5;

  const job = jobManager.create("video", { industrySlug: params.industrySlug, slotId: params.slotId, provider: provider.id });

  jobManager.run(job.id, async (report) => {
    report(3, "Prompt wird aufbereitet …");

    let sourceImage;
    if (provider.requiresSourceImage) {
      report(8, "Startbild wird erzeugt (wird anschließend animiert) …");
      const imageProvider = imageProviders.firstConfigured();
      if (!imageProvider) {
        throw new Error(
          `${provider.label} benoetigt ein Startbild, es ist aber kein Bild-Provider konfiguriert.`
        );
      }
      const stillPrompt = promptBuilder.buildImagePrompt(params);
      sourceImage = await imageProvider.generateImage({
        prompt: stillPrompt.prompt,
        negativePrompt: stillPrompt.negativePrompt,
        aspect,
      });
    }

    report(15, "Anfrage an den Video-Anbieter …");
    const { externalJobId } = await provider.startGeneration({ prompt, aspect, durationSeconds, sourceImage });

    const startedAt = Date.now();
    let outcome = null;
    while (Date.now() - startedAt < VIDEO_MAX_WAIT_MS) {
      await sleep(VIDEO_POLL_INTERVAL_MS);
      const status = await provider.pollGeneration(externalJobId);
      if (status.status === "completed") {
        outcome = status;
        break;
      }
      if (status.status === "failed") {
        throw new Error(status.error || "Videogenerierung fehlgeschlagen.");
      }
      const elapsedFraction = (Date.now() - startedAt) / VIDEO_MAX_WAIT_MS;
      const progress = typeof status.progress === "number" ? status.progress : 15 + Math.round(elapsedFraction * 70);
      report(Math.min(94, progress), "Video wird gerendert …");
    }

    if (!outcome) throw new Error("Zeitüberschreitung beim Warten auf das Video.");

    report(96, "Video wird heruntergeladen …");
    let buffer, mimeType;
    if (outcome.inlineResult) {
      ({ buffer, mimeType } = outcome.inlineResult);
    } else if (outcome.videoUrl) {
      const fileResponse = await fetch(outcome.videoUrl);
      if (!fileResponse.ok) throw new Error("Fertiges Video konnte nicht heruntergeladen werden.");
      buffer = Buffer.from(await fileResponse.arrayBuffer());
      mimeType = fileResponse.headers.get("content-type") || "video/mp4";
    } else {
      throw new Error("Provider meldete Erfolg, aber ohne Video-Ergebnis.");
    }

    const record = mediaLibrary.save({
      type: "video",
      provider: provider.id,
      industry: params.industrySlug,
      projectSlug: industry.projectSlug,
      slotId: params.slotId || null,
      slotFilename: slot ? slot.filename : null,
      prompt,
      params,
      buffer,
      mimeType,
      mock: provider.id === "mock",
    });

    return { mediaId: record.id };
  });

  return job;
}

/** Baut die urspruenglichen Formularwerte eines Medien-Datensatzes erneut zu einem Job zusammen. */
function regenerate(record) {
  if (record.type === "image") return enqueueImageGeneration(record.params);
  if (record.type === "video") return enqueueVideoGeneration(record.params);
  throw new Error(`Unbekannter Medientyp: ${record.type}`);
}

module.exports = { enqueueImageGeneration, enqueueVideoGeneration, regenerate };
