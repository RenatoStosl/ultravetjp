/* ═══════════════════════════════════════
   ULTRAVET JP — main.js
   ═══════════════════════════════════════ */

"use strict";

/* ─── FAVICON: official symbol without wordmark ─── */
(function () {
  const link = document.getElementById("site-favicon");
  if (!link) return;

  const source = new Image();
  source.addEventListener("load", () => {
    const scan = document.createElement("canvas");
    scan.width = source.naturalWidth;
    scan.height = source.naturalHeight;
    const scanCtx = scan.getContext("2d", { willReadFrequently: true });
    if (!scanCtx) return;
    scanCtx.drawImage(source, 0, 0);
    const pixels = scanCtx.getImageData(0, 0, scan.width, scan.height).data;

    let minX = scan.width;
    let minY = scan.height;
    let maxX = 0;
    let maxY = 0;
    // The official wordmark starts below this boundary; only the pictogram is scanned.
    const scanBottom = Math.floor(scan.height * 0.67);
    for (let y = 0; y < scanBottom; y += 2) {
      for (let x = 0; x < scan.width; x += 2) {
        const i = (y * scan.width + x) * 4;
        const [r, g, b, a] = [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
        const isArtwork = a > 20 && !(r > 245 && g > 245 && b > 245);
        if (!isArtwork) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    if (minX >= maxX || minY >= maxY) return;

    const canvas = document.createElement("canvas");
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sourceWidth = maxX - minX;
    const sourceHeight = maxY - minY;
    const available = size - 8;
    const scale = Math.min(available / sourceWidth, available / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    ctx.drawImage(source, minX, minY, sourceWidth, sourceHeight, (size - width) / 2, (size - height) / 2, width, height);
    link.href = canvas.toDataURL("image/png");
  });
  source.src = "img/ULTRAVETJP VETOR OFICIAL-06.png";
})();

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

/* ─── REVIEWS CAROUSEL ─── */
(function () {
  const track = document.getElementById("reviews-track");
  const prev = document.getElementById("reviews-prev");
  const next = document.getElementById("reviews-next");
  const status = document.getElementById("reviews-status");
  if (!track || !prev || !next || !status) return;

  const cards = [...track.querySelectorAll(".review")];
  const maxIndex = () => {
    const cardWidth = cards[0]?.getBoundingClientRect().width || track.clientWidth;
    const visible = Math.max(1, Math.round(track.clientWidth / cardWidth));
    return Math.max(0, cards.length - visible);
  };
  const currentIndex = () => {
    const first = cards[0];
    if (!first) return 0;
    const step = first.getBoundingClientRect().width + 20;
    return Math.max(0, Math.min(maxIndex(), Math.round(track.scrollLeft / step)));
  };
  const updateStatus = () => {
    status.textContent = `${currentIndex() + 1} de ${maxIndex() + 1}`;
  };
  const move = (direction) => {
    const index = currentIndex();
    const last = maxIndex();
    const target = direction > 0
      ? (index >= last ? 0 : index + 1)
      : (index <= 0 ? last : index - 1);
    track.scrollTo({ left: cards[target]?.offsetLeft ?? 0, behavior: "smooth" });
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", updateStatus, { passive: true });
  window.addEventListener("resize", updateStatus, { passive: true });
  updateStatus();

  let autoplay = window.setInterval(() => move(1), 6000);
  const pause = () => window.clearInterval(autoplay);
  const resume = () => {
    window.clearInterval(autoplay);
    autoplay = window.setInterval(() => move(1), 6000);
  };
  track.closest(".reviews__carousel")?.addEventListener("mouseenter", pause);
  track.closest(".reviews__carousel")?.addEventListener("mouseleave", resume);
  track.closest(".reviews__carousel")?.addEventListener("focusin", pause);
  track.closest(".reviews__carousel")?.addEventListener("focusout", resume);
})();
