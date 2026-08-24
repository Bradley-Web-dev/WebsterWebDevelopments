/* ==========================================================================
   WebsterWebDevelopments — script.js
   Vanilla JS only. No build step, no dependencies. Safe to open directly
   from file:// — every feature below works without a server.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initHeaderScrollState();
  initFaqAccordion();
  initScrollReveal();
  initSmoothScroll();
  initContactForm();
  initFooterYear();
});

/* --------------------------------------------------------------------------
   Mobile navigation
   Toggles a full-screen panel and keeps aria-expanded in sync. Closes on
   link click, on Escape, and when the viewport is resized past the
   mobile breakpoint.
   -------------------------------------------------------------------------- */
function initMobileNav() {
  var toggle = document.querySelector(".nav__toggle");
  var panel = document.querySelector(".nav__mobile-panel");

  if (!toggle || !panel) return;

  function closePanel() {
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openPanel() {
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  panel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closePanel);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePanel();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closePanel();
  });
}

/* --------------------------------------------------------------------------
   Header scroll state
   Adds a class once the page scrolls past the hero so the header can
   condense and pick up a background.
   -------------------------------------------------------------------------- */
function initHeaderScrollState() {
  var header = document.querySelector(".site-header");
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* --------------------------------------------------------------------------
   FAQ accordion
   Only one panel open at a time. Uses aria-expanded on the trigger and
   a data-open attribute on the item for the CSS grid-height animation.
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(function (item) {
    var question = item.querySelector(".faq-item__question");
    if (!question) return;

    question.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";

      items.forEach(function (other) {
        other.setAttribute("data-open", "false");
        var otherQuestion = other.querySelector(".faq-item__question");
        if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.setAttribute("data-open", "true");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll reveal
   IntersectionObserver-based fade/slide-in for elements marked with the
   `.reveal` class. Falls back to showing everything immediately if
   IntersectionObserver is unavailable, and is skipped entirely when the
   user prefers reduced motion (handled in CSS, but we also avoid the
   observer overhead here).
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   Smooth scroll for in-page anchor links
   `html { scroll-behavior: smooth }` already handles most of this in CSS;
   this adds keyboard-focus handling for accessibility so focus lands on
   the target section after the jump.
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      var target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
    });
  });
}

/* --------------------------------------------------------------------------
   Contact form
   This site is fully static — there is no backend to receive submissions.
   Rather than pretending the form sends an email, this builds a mailto:
   link from the entered fields and opens the visitor's own email client.
   No email address has been supplied, so the placeholder below must be
   replaced with the studio's real inbox before this goes live; until
   then the form clearly tells the visitor what will happen.
   -------------------------------------------------------------------------- */
function initContactForm() {
  var form = document.querySelector("#contact-form");
  var status = document.querySelector("#contact-form-status");
  if (!form) return;

  // Replace this with a real inbox before publishing the site.
  var STUDIO_EMAIL = "[BUSINESS EMAIL]";

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = form.querySelector("#field-name");
    var business = form.querySelector("#field-business");
    var email = form.querySelector("#field-email");
    var phone = form.querySelector("#field-phone");
    var websiteType = form.querySelector("#field-website-type");
    var message = form.querySelector("#field-message");

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showStatus("Please fill in your name, email, and message before sending.", "error");
      return;
    }

    var placeholderPattern = /^\[.*\]$/;
    if (placeholderPattern.test(STUDIO_EMAIL)) {
      showStatus(
        "This form is a front-end demonstration. Connect it to a real inbox or form service (and replace the [BUSINESS EMAIL] placeholder in js/script.js) before using it publicly.",
        "error"
      );
      return;
    }

    var subject = "New project inquiry from " + name.value.trim();
    var bodyLines = [
      "Name: " + name.value.trim(),
      "Business: " + (business.value.trim() || "—"),
      "Email: " + email.value.trim(),
      "Phone: " + (phone.value.trim() || "—"),
      "Website type: " + (websiteType.value || "—"),
      "",
      message.value.trim()
    ];

    var mailtoUrl =
      "mailto:" + encodeURIComponent(STUDIO_EMAIL) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(bodyLines.join("\n"));

    window.location.href = mailtoUrl;
    showStatus("Opening your email client to send this message…", "success");
  });

  function showStatus(text, type) {
    if (!status) return;
    status.textContent = text;
    status.classList.remove("is-success", "is-error");
    status.classList.add("is-visible", type === "success" ? "is-success" : "is-error");
  }
}

/* --------------------------------------------------------------------------
   Footer year
   Keeps the copyright year current without any manual edits.
   -------------------------------------------------------------------------- */
function initFooterYear() {
  var yearEls = document.querySelectorAll("[data-current-year]");
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
}
