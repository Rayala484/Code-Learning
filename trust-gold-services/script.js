/*
  Trust Gold Services — site behaviour:
  theme (Light / Dark / Default), English / Telugu, gold rates, calculator,
  menu, scroll effects and the WhatsApp enquiry form.
*/
(() => {
  const cfg = window.TGS_CONFIG || {};
  const TE = window.TGS_TE || {};
  const EN_DYN = window.TGS_EN_DYN || {};
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } };

  let lang = root.lang === "te" ? "te" : "en";
  const dyn = (k) => (lang === "te" && TE.dyn && TE.dyn[k]) || EN_DYN[k] || "";
  const fill = (tpl, vals) => tpl.replace(/\{(\w+)\}/g, (_, k) => vals[k]);
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

  // ---------- Links & contact text from config ----------
  const linkFor = {
    phone: () => cfg.phone && "tel:" + cfg.phone,
    whatsapp: () => cfg.whatsapp && "https://wa.me/" + cfg.whatsapp,
    email: () => cfg.email && "mailto:" + cfg.email,
    maps: () => cfg.maps,
    instagram: () => cfg.instagram,
    facebook: () => cfg.facebook,
    youtube: () => cfg.youtube
  };
  function applyLinks() {
    $$("[data-link]").forEach((a) => {
      const fn = linkFor[a.dataset.link];
      const href = fn && fn();
      if (href) { a.href = href; a.hidden = false; } else if (a.dataset.link === "youtube") { a.hidden = true; }
    });
    $$("[data-text]").forEach((el) => { if (cfg[el.dataset.text]) el.textContent = cfg[el.dataset.text]; });
  }

  // ---------- Gold rates ----------
  const rates = Object.assign({}, cfg.rates);
  const fee = typeof cfg.processingFee === "number" ? cfg.processingFee : 0.01;
  // Dates are always shown in India time. With the live rate, the strip shows today's date.
  function renderRates() {
    const locale = lang === "te" ? "te-IN" : "en-IN";
    const tz = { timeZone: "Asia/Kolkata" };
    const d = rates.updated ? new Date(rates.updated) : null;
    const valid = d && !isNaN(d);
    const day = rates.live ? new Date() : d;
    $$("[data-rate]").forEach((el) => {
      const k = el.dataset.rate;
      if (k === "k24" || k === "k22") { if (rates[k]) el.textContent = inr(rates[k]); }
      else if (valid && k === "updated") {
        el.textContent = day.toLocaleDateString(locale, { ...tz, day: "numeric", month: "short", year: "numeric" });
        el.dateTime = day.toISOString();
      } else if (valid && k === "updatedLong") {
        el.textContent = d.toLocaleString(locale, { ...tz, day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" });
        el.dateTime = rates.updated;
      }
    });
  }

  // Buying rate per gram for a given purity (%). 22K and 24K use the published rates.
  function rateFor(purity) {
    if (purity >= 99.5 && rates.k24) return rates.k24;
    return (rates.k22 || 0) * (purity / 91.6);
  }

  function renderExample() {
    const value = 20 * (rates.k22 || 0);
    const loan = 150000;
    const f = value * fee;
    const t = $("#exText"), n = $("#exNote");
    if (t) t.innerHTML = fill(dyn("exText"), { value: inr(value), loan: inr(loan), fee: inr(f), total: inr(value - loan - f) });
    if (n) n.textContent = fill(dyn("exNote"), { rate: inr(rates.k22 || 0), loan: inr(loan) });
  }

  // ---------- Language ----------
  const i18nEls = $$("[data-i18n], [data-i18n-html]").map((el) => ({
    el, key: el.dataset.i18n || el.dataset.i18nHtml, en: el.innerHTML
  }));
  const phEls = $$("[data-i18n-ph]").map((el) => ({ el, key: el.dataset.i18nPh, en: el.placeholder }));

  function setLang(next, persist) {
    lang = next === "te" ? "te" : "en";
    root.lang = lang;
    i18nEls.forEach(({ el, key, en }) => { el.innerHTML = lang === "te" && TE[key] ? TE[key] : en; });
    phEls.forEach(({ el, key, en }) => { el.placeholder = lang === "te" && TE[key] ? TE[key] : en; });
    document.title = dyn("pageTitle");
    $$("[data-lang-toggle]").forEach((b) => b.setAttribute("aria-label", lang === "te" ? "Switch to English" : "తెలుగులో చూడండి"));
    applyLinks();
    renderRates();
    renderExample();
    if (persist) save("tgs-lang", lang);
  }
  $$("[data-lang-toggle]").forEach((b) => b.addEventListener("click", () => setLang(lang === "te" ? "en" : "te", true)));

  // ---------- Theme ----------
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const metaTheme = $('meta[name="theme-color"]');
  const resolve = (pref) => (pref === "system" ? (media && media.matches ? "dark" : "light") : pref);
  function applyTheme(pref) {
    root.setAttribute("data-theme-pref", pref);
    root.setAttribute("data-theme", resolve(pref));
    if (metaTheme) metaTheme.setAttribute("content", resolve(pref) === "dark" ? "#060c1c" : "#0a1a40");
    $$("[data-theme-set]").forEach((b) => {
      const on = b.dataset.themeSet === pref;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }
  $$("[data-theme-set]").forEach((b) => b.addEventListener("click", () => {
    root.classList.add("theme-switching");
    applyTheme(b.dataset.themeSet);
    save("tgs-theme", b.dataset.themeSet);
    setTimeout(() => root.classList.remove("theme-switching"), 450);
  }));
  if (media) {
    const onChange = () => { if (root.getAttribute("data-theme-pref") === "system") applyTheme("system"); };
    media.addEventListener ? media.addEventListener("change", onChange) : media.addListener(onChange);
  }
  applyTheme(root.getAttribute("data-theme-pref") || "system");

  // ---------- Mobile menu ----------
  const header = $(".header");
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");
  const setMenu = (open) => {
    if (open) nav.style.top = Math.max(0, header.getBoundingClientRect().bottom) + "px";
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  };
  menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 1020) setMenu(false); });

  // ---------- Scroll effects ----------
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));

    const links = $$('.nav a[href^="#"]');
    const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) spy.observe(s); });
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  // ---------- Calculator ----------
  const calc = $("#calc");
  let mode = "sell";
  const cWeight = $("#cWeight"), cPurity = $("#cPurity"), cLoan = $("#cLoan");
  function compute() {
    const w = Math.max(0, parseFloat(cWeight.value) || 0);
    const p = parseFloat(cPurity.value) || 91.6;
    const loan = mode === "release" ? Math.max(0, parseFloat(cLoan.value) || 0) : 0;
    const value = w * rateFor(p);
    const f = value * fee;
    const total = value - f - loan;
    $("#oValue").textContent = inr(value);
    $("#oFee").textContent = "− " + inr(f);
    $("#oLoan").textContent = "− " + inr(loan);
    $("#oTotal").textContent = inr(Math.max(0, total));
    $("#calcWarn").hidden = !(mode === "release" && w > 0 && total < 0);
  }
  $$(".tab[data-mode]", calc).forEach((t) => t.addEventListener("click", () => {
    mode = t.dataset.mode;
    $$(".tab[data-mode]", calc).forEach((x) => { const on = x === t; x.classList.toggle("is-active", on); x.setAttribute("aria-selected", String(on)); });
    $(".field--loan", calc).hidden = mode !== "release";
    $(".row-loan", calc).hidden = mode !== "release";
    compute();
  }));
  [cWeight, cPurity, cLoan].forEach((el) => el.addEventListener("input", compute));
  calc.addEventListener("submit", (e) => e.preventDefault());

  // ---------- Enquiry form ----------
  const form = $("#leadForm");
  const F = form.elements;
  const relOnly = $$(".rel-only", form);
  const syncService = () => {
    const rel = F.service.value === "release";
    relOnly.forEach((f) => { f.hidden = !rel; });
  };
  const pickService = (s) => { const r = $(`input[name="service"][value="${s}"]`, form); if (r) { r.checked = true; syncService(); } };
  $$('input[name="service"]', form).forEach((r) => r.addEventListener("change", syncService));
  $$("[data-service]").forEach((a) => a.addEventListener("click", () => pickService(a.dataset.service)));
  $("#calcCta").addEventListener("click", () => {
    pickService(mode);
    if (cWeight.value) F.weight.value = cWeight.value;
    if (mode === "release" && cLoan.value) F.loan.value = cLoan.value;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = F.name.value.trim();
    const phone = F.phone.value.replace(/[^\d]/g, "").replace(/^91(?=\d{10}$)/, "");
    const ok = name.length > 1 && /^[6-9]\d{9}$/.test(phone);
    $("#formError").hidden = ok;
    if (!ok) { (name.length > 1 ? F.phone : F.name).focus(); return; }
    const rel = F.service.value === "release";
    const lines = [
      dyn("waIntro"),
      "",
      `${dyn("waService")}: ${rel ? dyn("waRelease") : dyn("waSell")}`,
      `${dyn("waName")}: ${name}`,
      `${dyn("waPhone")}: ${phone}`
    ];
    if (F.weight.value) lines.push(`${dyn("waWeight")}: ${F.weight.value} g`);
    lines.push(`${dyn("waType")}: ${F.type.options[F.type.selectedIndex].text}`);
    if (rel && F.bank.value.trim()) lines.push(`${dyn("waBank")}: ${F.bank.value.trim()}`);
    if (rel && F.loan.value) lines.push(`${dyn("waLoan")}: ${inr(parseFloat(F.loan.value))}`);
    window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  // ---------- Live gold rate (refreshes every 10 minutes) ----------
  async function loadLiveRates() {
    try {
      const res = await fetch("/api/gold-rate", { headers: { accept: "application/json" } });
      if (!res.ok) return;
      const d = await res.json();
      if (!(d.k24 > 0 && d.k22 > 0)) return;
      Object.assign(rates, { k24: d.k24, k22: d.k22, updated: d.updated, live: true });
      renderRates();
      renderExample();
      compute();
    } catch (e) { /* keep the rates from config.js */ }
  }
  if (cfg.liveRates !== false) {
    loadLiveRates();
    setInterval(loadLiveRates, 10 * 60 * 1000);
    setInterval(renderRates, 60 * 1000); // date rolls over at midnight on an open page
  }

  // ---------- Customer reviews (from config.js) ----------
  const reviewsBox = $("#reviewsList");
  const reviews = Array.isArray(cfg.reviews) ? cfg.reviews.filter((r) => r && r.text && r.name) : [];
  if (reviewsBox && reviews.length) {
    const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
    reviewsBox.innerHTML = reviews.map((r) => {
      const n = Math.max(0, Math.min(5, Math.round(r.rating || 5)));
      const stars = Array.from({ length: 5 }, (_, i) => `<svg class="ic${i < n ? "" : " is-off"}"><use href="#i-star" /></svg>`).join("");
      return `<article class="review"><div class="stars" role="img" aria-label="${n} out of 5 stars">${stars}</div>` +
        `<p>${esc(r.text)}</p><footer><span class="review__avatar" aria-hidden="true">${esc(r.name.trim().charAt(0).toUpperCase())}</span>` +
        `<div><b>${esc(r.name)}</b>${r.place ? `<small>${esc(r.place)}</small>` : ""}</div></footer></article>`;
    }).join("");
    reviewsBox.hidden = false;
  }

  // ---------- Hero slideshow (infinite loop) ----------
  const slider = $("#heroSlider");
  if (slider) {
    const slides = $$(".slide", slider);
    const dots = $$(".slider__dots button", slider);
    const bar = $(".slider__bar", slider);
    const SLIDE_MS = 5000;
    let idx = 0, timer = null;
    slider.style.setProperty("--slide-ms", SLIDE_MS + "ms");
    const show = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => { d.classList.toggle("is-active", i === idx); d.setAttribute("aria-current", String(i === idx)); });
      bar.classList.remove("is-running"); void bar.offsetWidth; bar.classList.add("is-running");
    };
    const play = () => { clearInterval(timer); timer = setInterval(() => show(idx + 1), SLIDE_MS); };
    dots.forEach((d, i) => d.addEventListener("click", () => { show(i); play(); }));
    $(".slider__nav--prev", slider).addEventListener("click", () => { show(idx - 1); play(); });
    $(".slider__nav--next", slider).addEventListener("click", () => { show(idx + 1); play(); });
    slider.tabIndex = 0;
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { show(idx - 1); play(); }
      if (e.key === "ArrowRight") { show(idx + 1); play(); }
    });
    // Swipe with a finger or drag with the mouse / trackpad
    let x0 = null;
    const track = $(".slider__track", slider);
    track.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
    track.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { show(idx + (dx < 0 ? 1 : -1)); play(); }
    });
    track.addEventListener("pointercancel", () => { x0 = null; });
    track.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("visibilitychange", () => { if (document.hidden) clearInterval(timer); else { show(idx); play(); } });
    show(0); play();
  }

  // ---------- Init ----------
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();
  setLang(lang, false);
  syncService();
  compute();
})();
