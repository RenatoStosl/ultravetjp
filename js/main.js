/* ═══════════════════════════════════════
   ULTRAVET JP — main.js
   ═══════════════════════════════════════ */

"use strict";

/* ─── NAV: scroll state ─── */
(function () {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ─── NAV: hamburger menu ─── */
(function () {
  const btn = document.getElementById("hamburger");
  const links = document.getElementById("nav-links");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Close on link click
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove("is-open");
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
})();

/* ─── SCROLL REVEAL ─── */
(function () {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ─── SMOOTH ANCHOR SCROLL (offset for fixed nav) ─── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById("nav")?.offsetHeight ?? 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
