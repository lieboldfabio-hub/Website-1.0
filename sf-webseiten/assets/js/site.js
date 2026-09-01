(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");

  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.hidden === false;
      menu.hidden = open;
      toggle.setAttribute("aria-expanded", String(!open));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  var filterRow = document.querySelector("[data-filter]");
  if (filterRow) {
    var chips = filterRow.querySelectorAll(".chip");
    var cards = document.querySelectorAll("[data-branche]");
    filterRow.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      var value = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var match = value === "alle" || card.getAttribute("data-branche") === value;
        card.style.display = match ? "" : "none";
      });
    });
  }

  var yearEl = document.getElementById("jahr");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }
})();
