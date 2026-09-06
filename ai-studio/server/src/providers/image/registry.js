"use strict";

const config = require("../../config");
const OpenAIImageProvider = require("./openaiImageProvider");
const GoogleImageProvider = require("./googleImageProvider");
const MockImageProvider = require("./mockImageProvider");

/*
  Zentrale Anlaufstelle fuer alle Bild-Provider. Ein neuer Anbieter braucht
  nur eine Klasse wie die drei hier sowie einen weiteren new-Aufruf in
  dieser Liste - Routen und Frontend fragen ausschliesslich diese Registry.
*/

const providers = new Map();

function register(provider) {
  providers.set(provider.id, provider);
}

register(new OpenAIImageProvider(config.openai));
register(new GoogleImageProvider(config.google));
if (config.mockEnabled) register(new MockImageProvider());

function get(id) {
  const provider = providers.get(id);
  if (!provider) {
    const err = new Error(`Unbekannter Bild-Provider: ${id}`);
    err.status = 400;
    throw err;
  }
  return provider;
}

function list() {
  return Array.from(providers.values()).map((p) => ({
    id: p.id,
    label: p.label,
    costHint: p.costHint,
    configured: p.isConfigured(),
  }));
}

/** Erster konfigurierter Provider, als sinnvoller Vorgabewert fuer das Formular. */
function firstConfigured() {
  return Array.from(providers.values()).find((p) => p.isConfigured()) || null;
}

module.exports = { register, get, list, firstConfigured };
