"use strict";

/*
  Bewusst kein Logging-Framework. Der Server hat wenig Traffic (internes
  Werkzeug, kein Publikumsverkehr) - ein paar formatierte Zeilen auf stdout
  reichen und lassen sich von jedem Hosting-Anbieter direkt einsehen.
*/

function stamp() {
  return new Date().toISOString();
}

function info(...args) {
  console.log(`[${stamp()}] [info]`, ...args);
}

function warn(...args) {
  console.warn(`[${stamp()}] [warn]`, ...args);
}

function error(...args) {
  console.error(`[${stamp()}] [error]`, ...args);
}

module.exports = { info, warn, error };
