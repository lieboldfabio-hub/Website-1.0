"use strict";

const config = require("../../config");
const RunwayVideoProvider = require("./runwayVideoProvider");
const LumaVideoProvider = require("./lumaVideoProvider");
const MockVideoProvider = require("./mockVideoProvider");

const providers = new Map();

function register(provider) {
  providers.set(provider.id, provider);
}

register(new LumaVideoProvider(config.luma));
register(new RunwayVideoProvider(config.runway));
if (config.mockEnabled) register(new MockVideoProvider());

function get(id) {
  const provider = providers.get(id);
  if (!provider) {
    const err = new Error(`Unbekannter Video-Provider: ${id}`);
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
    requiresSourceImage: p.requiresSourceImage,
  }));
}

function firstConfigured() {
  return Array.from(providers.values()).find((p) => p.isConfigured()) || null;
}

module.exports = { register, get, list, firstConfigured };
