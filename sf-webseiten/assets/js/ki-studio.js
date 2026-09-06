(function () {
  "use strict";

  /*
    Reines Frontend fuer das ai-studio/server-Backend (siehe ai-studio/README.md).
    Adresse und Admin-Token liegen ausschliesslich im localStorage dieses
    Browsers - nirgends im Quellcode dieser Seite. Ohne gueltiges Token lehnt
    der Server jede Anfrage ab (siehe server/src/middleware/auth.js).
  */

  var STORAGE_KEY = "ki-studio-verbindung";

  var state = {
    apiBase: "",
    token: "",
    industries: [],
    providers: { image: [], video: [] },
    mediaType: "image",
    currentIndustry: null,
    pollTimer: null,
  };

  // ------------------------------------------------------------- Elemente --

  var el = {
    gate: document.getElementById("kiGate"),
    gateForm: document.getElementById("kiGateForm"),
    gateStatus: document.getElementById("kiGateStatus"),
    apiBaseInput: document.getElementById("kiApiBase"),
    tokenInput: document.getElementById("kiToken"),
    app: document.getElementById("kiApp"),
    logout: document.getElementById("kiLogout"),
    quota: document.getElementById("kiQuota"),
    error: document.getElementById("kiError"),
    errorText: document.getElementById("kiErrorText"),
    form: document.getElementById("kiForm"),
    submit: document.getElementById("kiSubmit"),
    mediaSwitch: document.querySelectorAll("[data-media-type]"),
    industry: document.getElementById("kiIndustry"),
    subject: document.getElementById("kiSubject"),
    customSubjectField: document.getElementById("kiCustomSubjectField"),
    customSubject: document.getElementById("kiCustomSubject"),
    slotField: document.getElementById("kiSlotField"),
    slot: document.getElementById("kiSlot"),
    style: document.getElementById("kiStyle"),
    atmosphere: document.getElementById("kiAtmosphere"),
    colorScheme: document.getElementById("kiColorScheme"),
    audience: document.getElementById("kiAudience"),
    modernity: document.getElementById("kiModernity"),
    modernityVal: document.getElementById("kiModernityVal"),
    premium: document.getElementById("kiPremium"),
    premiumVal: document.getElementById("kiPremiumVal"),
    extra: document.getElementById("kiExtra"),
    durationField: document.getElementById("kiDurationField"),
    duration: document.getElementById("kiDuration"),
    provider: document.getElementById("kiProvider"),
    progress: document.getElementById("kiProgress"),
    progressMessage: document.getElementById("kiProgressMessage"),
    progressFill: document.getElementById("kiProgressFill"),
    gallery: document.getElementById("kiGallery"),
    galleryEmpty: document.getElementById("kiGalleryEmpty"),
    cardTpl: document.getElementById("kiMediaCardTpl"),
  };

  // ----------------------------------------------------------------- API --

  function apiUrl(path) {
    return state.apiBase.replace(/\/$/, "") + path;
  }

  function apiFetch(path, options) {
    options = options || {};
    var headers = Object.assign({ "x-admin-token": state.token }, options.headers || {});
    if (options.body) headers["Content-Type"] = "application/json";
    return fetch(apiUrl(path), Object.assign({}, options, { headers: headers }))
      .catch(function () {
        throw new Error("Server nicht erreichbar unter " + state.apiBase + ". Laeuft der Backend-Prozess?");
      })
      .then(function (response) {
        if (response.status === 204) return null;
        return response.json().catch(function () { return null; }).then(function (data) {
          if (!response.ok) {
            var message = (data && data.message) || ("Fehler " + response.status);
            throw new Error(message);
          }
          return data;
        });
      });
  }

  function fileUrl(mediaId) {
    return apiUrl("/api/media/" + mediaId + "/file?token=" + encodeURIComponent(state.token));
  }

  // --------------------------------------------------------------- Fehler --

  function showError(message) {
    el.errorText.textContent = message;
    el.error.hidden = false;
  }
  function clearError() {
    el.error.hidden = true;
  }

  // ----------------------------------------------------------- Verbindung --

  function loadStoredConnection() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function storeConnection(apiBase, token) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiBase: apiBase, token: token }));
    } catch (err) { /* localStorage kann in privaten Fenstern fehlen - dann eben nicht merken */ }
  }

  function clearStoredConnection() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) {}
  }

  function connect(apiBase, token, isRetry) {
    state.apiBase = apiBase.replace(/\/$/, "");
    state.token = token;
    return apiFetch("/api/meta/providers").then(function () {
      storeConnection(state.apiBase, state.token);
      el.gate.hidden = true;
      el.app.hidden = false;
      return initApp();
    }).catch(function (err) {
      if (!isRetry) throw err;
      el.gateStatus.textContent = err.message;
      el.gateStatus.setAttribute("data-state", "error");
    });
  }

  el.gateForm.addEventListener("submit", function (e) {
    e.preventDefault();
    el.gateStatus.textContent = "Verbindung wird geprueft …";
    el.gateStatus.removeAttribute("data-state");
    connect(el.apiBaseInput.value.trim(), el.tokenInput.value.trim(), true).catch(function (err) {
      el.gateStatus.textContent = err.message;
      el.gateStatus.setAttribute("data-state", "error");
    });
  });

  el.logout.addEventListener("click", function () {
    clearStoredConnection();
    if (state.pollTimer) clearInterval(state.pollTimer);
    window.location.reload();
  });

  // ------------------------------------------------------------- Aufbau ---

  function populateSelect(select, options, valueKey, labelKey) {
    select.innerHTML = "";
    options.forEach(function (opt) {
      var el2 = document.createElement("option");
      el2.value = opt[valueKey];
      el2.textContent = opt[labelKey];
      select.appendChild(el2);
    });
  }

  function renderIndustryDependent() {
    var industry = state.industries.find(function (i) { return i.slug === el.industry.value; });
    state.currentIndustry = industry;
    if (!industry) return;

    var subjectOptions = industry.subjectPresets.map(function (p) { return { id: p.id, label: p.label }; });
    subjectOptions.push({ id: "custom", label: "Eigenes Motiv beschreiben …" });
    populateSelect(el.subject, subjectOptions, "id", "label");
    el.customSubjectField.hidden = el.subject.value !== "custom";

    if (industry.slots.length) {
      var slotOptions = industry.slots.map(function (s) {
        return { id: s.id, label: s.label + " (" + s.aspect + (s.filename ? ", " + s.filename : "") + ")" };
      });
      populateSelect(el.slot, slotOptions, "id", "label");
      el.slotField.hidden = false;
    } else {
      el.slot.innerHTML = "";
      el.slotField.hidden = true;
    }
  }

  el.subject.addEventListener("change", function () {
    el.customSubjectField.hidden = el.subject.value !== "custom";
  });
  el.industry.addEventListener("change", renderIndustryDependent);

  function renderProviderOptions() {
    var list = state.providers[state.mediaType] || [];
    el.provider.innerHTML = "";
    var auto = document.createElement("option");
    auto.value = "auto";
    auto.textContent = "Automatisch (erster verfügbarer Anbieter)";
    el.provider.appendChild(auto);
    list.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.label + (p.configured ? "" : " – nicht konfiguriert") + " · " + p.costHint;
      opt.disabled = !p.configured;
      el.provider.appendChild(opt);
    });
  }

  el.mediaSwitch.forEach(function (btn) {
    btn.addEventListener("click", function () {
      el.mediaSwitch.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-checked", "true");
      state.mediaType = btn.getAttribute("data-media-type");
      el.durationField.hidden = state.mediaType !== "video";
      renderProviderOptions();
    });
  });

  el.colorScheme.querySelectorAll("[data-farbe-wahl]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      el.colorScheme.querySelectorAll("[data-farbe-wahl]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
    });
  });

  el.modernity.addEventListener("input", function () { el.modernityVal.textContent = el.modernity.value; });
  el.premium.addEventListener("input", function () { el.premiumVal.textContent = el.premium.value; });

  function selectedColorScheme() {
    var active = el.colorScheme.querySelector('[aria-pressed="true"]');
    return active ? active.getAttribute("data-farbe-wahl") : "vermillion";
  }

  function updateQuota(meta) {
    el.quota.textContent = "Heute genutzt: " + meta.usedToday + " / " + meta.dailyLimit;
  }

  // -------------------------------------------------------------- Formular

  function collectPayload() {
    return {
      industrySlug: el.industry.value,
      subjectId: el.subject.value,
      customSubject: el.customSubject.value,
      slotId: el.slotField.hidden ? null : el.slot.value,
      style: el.style.value,
      atmosphere: el.atmosphere.value,
      colorScheme: selectedColorScheme(),
      audience: el.audience.value,
      modernity: Number(el.modernity.value),
      premium: Number(el.premium.value),
      extra: el.extra.value,
      provider: el.provider.value,
      durationSeconds: Number(el.duration.value),
    };
  }

  el.form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();
    startGeneration(collectPayload(), state.mediaType);
  });

  function startGeneration(payload, mediaType) {
    el.submit.disabled = true;
    el.progress.hidden = false;
    el.progressFill.style.width = "4%";
    el.progressMessage.textContent = "Wird gesendet …";

    var path = mediaType === "video" ? "/api/generate/video" : "/api/generate/image";
    apiFetch(path, { method: "POST", body: JSON.stringify(payload) })
      .then(function (data) { pollJob(data.jobId); })
      .catch(function (err) {
        el.progress.hidden = true;
        el.submit.disabled = false;
        showError(err.message);
      });
  }

  function pollJob(jobId) {
    if (state.pollTimer) clearInterval(state.pollTimer);
    state.pollTimer = setInterval(function () {
      apiFetch("/api/jobs/" + jobId).then(function (job) {
        el.progressFill.style.width = job.progress + "%";
        el.progressMessage.textContent = job.message;
        if (job.status === "done") {
          clearInterval(state.pollTimer);
          el.progress.hidden = true;
          el.submit.disabled = false;
          loadMedia();
        } else if (job.status === "error") {
          clearInterval(state.pollTimer);
          el.progress.hidden = true;
          el.submit.disabled = false;
          showError(job.error || "Generierung fehlgeschlagen.");
        }
      }).catch(function (err) {
        clearInterval(state.pollTimer);
        el.progress.hidden = true;
        el.submit.disabled = false;
        showError(err.message);
      });
    }, 1300);
  }

  // -------------------------------------------------------------- Galerie -

  function industryLabel(slug) {
    var industry = state.industries.find(function (i) { return i.slug === slug; });
    return industry ? industry.label : slug;
  }

  function providerLabel(type, id) {
    var list = state.providers[type] || [];
    var found = list.find(function (p) { return p.id === id; });
    return found ? found.label : id;
  }

  function renderMediaCard(record) {
    var node = el.cardTpl.content.cloneNode(true);
    var card = node.querySelector(".ki-card");
    var preview = node.querySelector(".ki-card__preview");

    if (record.mimeType.indexOf("image/") === 0) {
      var img = document.createElement("img");
      img.src = fileUrl(record.id);
      img.alt = "";
      img.loading = "lazy";
      preview.appendChild(img);
    } else if (record.mimeType.indexOf("video/") === 0) {
      var video = document.createElement("video");
      video.src = fileUrl(record.id);
      video.controls = true;
      video.muted = true;
      preview.appendChild(video);
    } else {
      var placeholder = document.createElement("p");
      placeholder.className = "ki-card__placeholder";
      placeholder.textContent = "Test-Ergebnis ohne Vorschau (" + record.mimeType + ") – siehe Download.";
      preview.appendChild(placeholder);
    }

    node.querySelector(".ki-card__meta").textContent =
      industryLabel(record.industry) +
      (record.slotId ? " · " + record.slotId : "") +
      " · " + providerLabel(record.type, record.provider) +
      (record.mock ? " · TEST" : "");
    node.querySelector(".ki-card__prompt").textContent = record.prompt;

    var appliedEl = node.querySelector(".ki-card__applied");
    if (record.appliedPath) {
      appliedEl.hidden = false;
      appliedEl.textContent = "Übernommen: " + record.appliedPath;
    }

    var downloadLink = node.querySelector('[data-action="download"]');
    downloadLink.href = fileUrl(record.id);

    node.querySelector('[data-action="regenerate"]').addEventListener("click", function () {
      card.classList.add("is-busy");
      apiFetch("/api/media/" + record.id + "/regenerate", { method: "POST" })
        .then(function (data) {
          card.classList.remove("is-busy");
          clearError();
          el.progress.hidden = false;
          el.progressFill.style.width = "4%";
          el.progressMessage.textContent = "Wird neu erzeugt …";
          pollJob(data.jobId);
        })
        .catch(function (err) { card.classList.remove("is-busy"); showError(err.message); });
    });

    node.querySelector('[data-action="apply"]').addEventListener("click", function () {
      apiFetch("/api/media/" + record.id + "/apply", { method: "POST" })
        .then(function (result) {
          appliedEl.hidden = false;
          if (result.applied) {
            appliedEl.removeAttribute("data-state");
            appliedEl.textContent = "Übernommen: " + result.targetPath;
          } else {
            appliedEl.setAttribute("data-state", "hint");
            appliedEl.textContent = result.hint;
          }
        })
        .catch(function (err) { showError(err.message); });
    });

    node.querySelector('[data-action="delete"]').addEventListener("click", function () {
      if (!window.confirm("Dieses Medium wirklich loeschen?")) return;
      apiFetch("/api/media/" + record.id, { method: "DELETE" })
        .then(function () { loadMedia(); })
        .catch(function (err) { showError(err.message); });
    });

    return node;
  }

  function loadMedia() {
    apiFetch("/api/media").then(function (data) {
      el.gallery.querySelectorAll(".ki-card").forEach(function (n) { n.remove(); });
      if (!data.media.length) {
        el.galleryEmpty.hidden = false;
        return;
      }
      el.galleryEmpty.hidden = true;
      data.media.forEach(function (record) {
        el.gallery.appendChild(renderMediaCard(record));
      });
    }).catch(function (err) { showError(err.message); });
  }

  // ---------------------------------------------------------------- Start -

  function initApp() {
    return apiFetch("/api/meta/industries")
      .then(function (data) {
        state.industries = data.industries;
        populateSelect(el.industry, state.industries, "slug", "label");
        renderIndustryDependent();
        return apiFetch("/api/meta/providers");
      })
      .then(function (providers) {
        state.providers.image = providers.image;
        state.providers.video = providers.video;
        renderProviderOptions();
        updateQuota(providers);
        return loadMedia();
      })
      .catch(function (err) { showError(err.message); });
  }

  var stored = loadStoredConnection();
  if (stored && stored.apiBase && stored.token) {
    el.apiBaseInput.value = stored.apiBase;
    el.tokenInput.value = stored.token;
    connect(stored.apiBase, stored.token, false).catch(function () {
      // Gespeicherte Verbindung nicht mehr gueltig - Zugangsformular bleibt sichtbar.
    });
  }
})();
