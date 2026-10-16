/* ==========================================================
   TRUST GOLD SERVICES — interaction engine (no dependencies)
   ========================================================== */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const CFG = window.TG || {};
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- 1. business settings -> page ---------- */
  const digits = s => String(s || "").replace(/[^\d]/g, "");
  const waNum = digits(CFG.whatsapp);
  const telHref = CFG.phone ? "tel:" + CFG.phone.replace(/\s/g, "") : "#contact";
  const waText = "Hello Trust Gold Services, I'd like a free valuation.";
  const waHref = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}` : "#contact";

  function bindConfig() {
    $$("[data-tel]").forEach(a => { a.href = telHref; });
    $$("[data-wa]").forEach(a => {
      a.href = waHref;
      if (!waNum) { a.removeAttribute("target"); }
    });
    // no number yet -> drop the WhatsApp dock button, keep Call
    if (!waNum) { const w = $(".dock__btn--wa"); if (w) w.hidden = true; }
    if (!CFG.phone && !waNum) { const d = $("#dock"); if (d) d.style.display = "none"; }
    $$("[data-mail]").forEach(a => { a.href = CFG.email ? "mailto:" + CFG.email : "#contact"; });
    $$("[data-bind]").forEach(el => { el.textContent = CFG[el.dataset.bind] || ""; });
    let any = false;
    $$("[data-has]").forEach(li => {
      if (CFG[li.dataset.has]) { li.classList.add("on"); any = true; }
    });
    const empty = $("[data-empty]"); if (empty && any) empty.hidden = true;
    $$('[data-feature="doorstep"]').forEach(el => { el.hidden = !CFG.doorstep; });

    if (CFG.mapsUrl) { const m = $("#mapLink"); m.href = CFG.mapsUrl; m.target = "_blank"; m.rel = "noopener"; m.hidden = false; }
    if (CFG.mapsEmbed) { $("#mapFrame").src = CFG.mapsEmbed; $("#mapWrap").hidden = false; }

    // reviews: render ONLY real ones supplied in config.js
    if (Array.isArray(CFG.reviews) && CFG.reviews.length) {
      const box = $("#reviewList");
      CFG.reviews.forEach(r => {
        const d = document.createElement("div");
        d.className = "review reveal tilt";
        const stars = "★".repeat(clamp(+r.stars || 5, 1, 5));
        d.innerHTML = `<div class="stars">${stars}</div><p></p><b></b><small></small>`;
        d.querySelector("p").textContent = "“" + (r.text || "") + "”";
        d.querySelector("b").textContent = r.name || "";
        d.querySelector("small").textContent = r.area || "";
        box.appendChild(d);
      });
      $("#reviews").hidden = false;
      if (CFG.googleReviewsUrl) { const l = $("#reviewLink"); l.href = CFG.googleReviewsUrl; l.target = "_blank"; l.rel = "noopener"; l.hidden = false; }
    }

    // gold rate widget
    const k24 = Number(CFG.goldRate && CFG.goldRate.k24);
    if (k24 > 0) {
      const v = $("#rateVal"); v.removeAttribute("data-i18n");
      v.textContent = "₹" + k24.toLocaleString("en-IN") + " /g · 24K";
      if (CFG.goldRate.updated) v.title = CFG.goldRate.updated;
    }

    // social
    const soc = $("#social");
    [["instagram", "IG"], ["facebook", "FB"], ["youtube", "YT"]].forEach(([k, t]) => {
      if (CFG.social && CFG.social[k]) {
        const a = document.createElement("a");
        a.href = CFG.social[k]; a.target = "_blank"; a.rel = "noopener"; a.textContent = t; a.setAttribute("aria-label", k);
        a.setAttribute("data-cursor", ""); soc.appendChild(a);
      }
    });
    $("#year").textContent = new Date().getFullYear();
    // form button label depends on whether WhatsApp is configured
    const sb = $("#enquiry button[type=submit] span");
    sb.dataset.i18n = waNum ? "f_send" : "f_send2";
    sb.textContent = waNum ? "Send on WhatsApp" : "Send enquiry";
  }

  /* ---------- 2. language (English / Telugu) ---------- */
  const MARQ = ["mq1", "mq2", "mq3", "mq4", "mq5", "mq6"];
  let lang = store.get("tg-lang") === "te" ? "te" : "en";
  function t(key, fallback) {
    const te = (window.TG_TE || {})[key];
    return lang === "te" && te ? te : fallback;
  }
  function buildMarquee() {
    const en = window.TG_MARQ_EN || [];
    const track = $(".marquee__track");
    if (!track || !en.length) return;
    const row = MARQ.map((k, i) => `<span>${t(k, en[i])}</span><i>◆</i>`).join("");
    track.innerHTML = row + row;
  }
  function applyLang(l, animate) {
    lang = l;
    document.documentElement.lang = l;
    document.documentElement.dataset.lang = l;
    $$("[data-i18n]").forEach(el => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const te = (window.TG_TE || {})[el.dataset.i18n];
      el.innerHTML = l === "te" && te ? te : el.dataset.en;
    });
    buildMarquee();
    store.set("tg-lang", l);
    if (animate) { document.body.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 450, easing: "ease-out" }); }
  }

  /* ---------- 3. loader ---------- */
  const loader = $("#loader");
  function initLoader() {
    const fill = $("#gaugeFill"), num = $("#loaderNum"), msg = $("#loaderMsg");
    // gauge ticks
    const ticks = $(".gauge__ticks");
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2, r1 = 94, r2 = i % 4 === 0 ? 100 : 97;
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", 100 + Math.cos(a) * r1); l.setAttribute("y1", 100 + Math.sin(a) * r1);
      l.setAttribute("x2", 100 + Math.cos(a) * r2); l.setAttribute("y2", 100 + Math.sin(a) * r2);
      ticks.appendChild(l);
    }
    const steps = [[0, "Weighing…", "తూకం వేస్తున్నాం…"], [35, "Testing purity…", "స్వచ్ఛత పరీక్ష…"], [72, "Verifying…", "ధృవీకరణ…"], [100, "24K · Verified", "24K · ధృవీకరించబడింది"]];
    const DUR = reduce ? 300 : 2400;
    let loaded = document.readyState === "complete", start = performance.now(), finished = false;
    addEventListener("load", () => { loaded = true; });
    const ease = x => 1 - Math.pow(1 - x, 3);
    function frame(now) {
      const p = clamp((now - start) / DUR, 0, 1);
      // hold at 96% until the page has really loaded
      const v = Math.min(ease(p) * 99.9, loaded ? 99.9 : 96);
      num.textContent = v.toFixed(1);
      fill.style.strokeDashoffset = 540.4 * (1 - v / 100);
      const s = [...steps].reverse().find(s => v >= s[0] - (s[0] === 100 ? 0.2 : 0));
      if (s) msg.textContent = lang === "te" ? s[2] : s[1];
      if (v >= 99.9 && !finished) { finished = true; setTimeout(finish, 350); return; }
      if (!finished) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    setTimeout(() => { if (!finished) { finished = true; finish(); } }, 7000); // failsafe
  }
  let started = false;
  function finish() {
    if (started) return; started = true;
    loader.classList.add("is-done");
    setTimeout(() => {
      document.body.classList.remove("is-loading");
      $("#hero").classList.add("in");
      initReveal();
    }, 500);
    setTimeout(() => loader.classList.add("is-gone"), 1500);
  }

  /* ---------- 4. smooth scrolling (inertia) ---------- */
  const root = document.documentElement;
  const drawer = $("#drawer");
  let sTarget = scrollY, sCur = scrollY, sRun = false;
  const useSmooth = !reduce && fine;
  function sLoop() {
    sCur = lerp(sCur, sTarget, 0.085);
    if (Math.abs(sTarget - sCur) < 0.4) { sCur = sTarget; sRun = false; scrollTo(0, sCur); return; }
    scrollTo(0, sCur);
    requestAnimationFrame(sLoop);
  }
  function scrollToY(y) {
    const max = root.scrollHeight - innerHeight;
    y = clamp(y, 0, max);
    if (useSmooth) { sTarget = y; if (!sRun) { sCur = scrollY; sRun = true; requestAnimationFrame(sLoop); } }
    else scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
  function initScroll() {
    if (!useSmooth) root.classList.add("native-scroll");
    if (useSmooth) {
      addEventListener("wheel", e => {
        if (e.ctrlKey || document.body.classList.contains("is-loading") || drawer.classList.contains("is-open")) return;
        if (e.target.closest && e.target.closest("iframe")) return;
        e.preventDefault();
        const max = root.scrollHeight - innerHeight;
        if (!sRun) { sCur = scrollY; sTarget = scrollY; }
        sTarget = clamp(sTarget + e.deltaY * (e.deltaMode === 1 ? 34 : 1), 0, max);
        if (!sRun) { sRun = true; requestAnimationFrame(sLoop); }
      }, { passive: false });
      addEventListener("scroll", () => { if (!sRun) { sCur = sTarget = scrollY; } }, { passive: true });
    }
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener("click", e => {
        const id = a.getAttribute("href");
        if (!id || id === "#") { e.preventDefault(); return; }
        const el = $(id); if (!el) return;
        e.preventDefault();
        closeDrawer();
        if (a.dataset.service) setService(a.dataset.service);
        const y = id === "#top" ? 0 : el.getBoundingClientRect().top + scrollY - (id === "#contact" ? 40 : 10);
        scrollToY(y);
      });
    });
  }

  /* ---------- 5. mobile drawer ---------- */
  const burger = $("#burger");
  function closeDrawer() { drawer.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  burger.addEventListener("click", () => {
    const open = !drawer.classList.contains("is-open");
    drawer.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* ---------- 6. entrance reveal ---------- */
  function initReveal() {
    const items = $$(".reveal");
    // stagger siblings
    const groups = new Map();
    items.forEach(el => {
      const p = el.parentElement; const n = groups.get(p) || 0; groups.set(p, n + 1);
      el.style.setProperty("--d", Math.min(n * 0.09, 0.6) + "s");
    });
    $$(".line > span").forEach((s, i) => s.style.setProperty("--d", 0.1 + i * 0.14 + "s"));
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    items.forEach(el => io.observe(el));

    const once = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); once.unobserve(en.target); } });
    }, { threshold: 0.3 });
    $$("#purity").forEach(el => once.observe(el));

    const lineIO = new IntersectionObserver((ents) => {
      ents.forEach(en => en.target.classList.toggle("line-go", en.isIntersecting));
    }, { threshold: 0.25 });
    $$(".steps").forEach(el => lineIO.observe(el));
  }

  /* ---------- 7. parallax + scroll state ---------- */
  const nav = $("#nav"), prog = $("#progress"), dock = $("#dock");
  const para = $$("[data-speed]");
  const navLinks = $$(".nav__links a");
  const secs = navLinks.map(a => $(a.getAttribute("href")));
  let lastY = scrollY;
  function onScroll() {
    const y = scrollY, max = root.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("is-solid", y > 40);
    nav.classList.toggle("is-hidden", y > lastY + 4 && y > 300 && !drawer.classList.contains("is-open"));
    if (y < lastY - 4) nav.classList.remove("is-hidden");
    lastY = y;
    dock.classList.toggle("show", y > 500);
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
    navLinks.forEach((a, i) => a.classList.toggle("is-active", i === cur));
  }
  addEventListener("scroll", onScroll, { passive: true });

  function parallax() {
    if (reduce) return;
    const vh = innerHeight;
    for (const el of para) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const c = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0,${(c * parseFloat(el.dataset.speed)).toFixed(1)}px,0)`;
    }
  }

  /* ---------- 8. 3D hero (gold bar + coins) ---------- */
  const bar = $("#bar"), scene = $(".scene"), stage = $("#stage");
  const pt = { x: 0, y: 0, tx: 0, ty: 0 };
  let spin = 0, spinV = 0;
  function buildCoins() {
    $$("[data-coin]").forEach(c => {
      const N = 9;
      for (let i = 0; i < N; i++) {
        const l = document.createElement("div"); l.className = "coin__l";
        l.style.transform = `translateZ(${(i - (N - 1) / 2) * 1.1}px)`; l.style.filter = "brightness(.72)";
        c.appendChild(l);
      }
      const f = document.createElement("div"); f.className = "coin__l front"; f.textContent = "T"; f.style.transform = "translateZ(5.5px)";
      const b = document.createElement("div"); b.className = "coin__l back"; b.textContent = "TG"; b.style.transform = "rotateY(180deg) translateZ(5.5px)";
      c.append(f, b);
    });
  }
  stage.addEventListener("click", () => { spinV = 14; });
  document.addEventListener("pointermove", e => {
    pt.tx = (e.clientX / innerWidth - .5) * 2;
    pt.ty = (e.clientY / innerHeight - .5) * 2;
  }, { passive: true });

  /* ---------- 9. tilt / spotlight / magnetic / ripple ---------- */
  function initTilt() {
    if (!fine || reduce) return;
    $$(".tilt").forEach(el => {
      const max = el.classList.contains("choice") || el.classList.contains("step") ? 7 : 6;
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transitionDuration = ".18s"; el.style.transitionDelay = "0s";
        el.style.transform = `perspective(900px) rotateX(${((.5 - py) * max).toFixed(2)}deg) rotateY(${((px - .5) * max * 1.2).toFixed(2)}deg) translateY(-4px)`;
        el.style.setProperty("--mx", px * 100 + "%"); el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("pointerleave", () => {
        el.style.transitionDuration = ".7s"; el.style.transitionDelay = "0s";
        el.style.transform = "";
        setTimeout(() => { el.style.transitionDuration = ""; el.style.transitionDelay = ""; }, 720);
      });
    });
    $$(".magnetic").forEach(b => {
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * .22).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * .3).toFixed(1)}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }
  document.addEventListener("click", e => {
    const b = e.target.closest(".btn"); if (!b || reduce) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
    const d = document.createElement("span"); d.className = "ripple";
    d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(d); setTimeout(() => d.remove(), 750);
  });

  /* ---------- 10. cursor + sparkle trail ---------- */
  const cur = $("#cursor"), ring = $(".cursor__ring"), dot = $(".cursor__dot"), label = $("#cursorLabel");
  const m = { x: -100, y: -100, rx: -100, ry: -100 };
  let lastSpark = 0;
  function initCursor() {
    if (!fine) return;
    document.addEventListener("pointermove", e => {
      if (!root.classList.contains("has-cursor")) root.classList.add("has-cursor");
      m.x = e.clientX; m.y = e.clientY;
      const now = performance.now();
      if (!reduce && now - lastSpark > 55 && e.buttons === 0) {
        lastSpark = now;
        if (Math.random() < .5) {
          const s = document.createElement("span"); s.className = "spark";
          s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
          s.style.setProperty("--dx", (Math.random() - .5) * 36 + "px"); s.style.setProperty("--dy", 10 + Math.random() * 26 + "px");
          document.body.appendChild(s); s.addEventListener("animationend", () => s.remove());
        }
      }
    }, { passive: true });
    document.addEventListener("pointerover", e => {
      const el = e.target.closest && e.target.closest("a,button,summary,[data-cursor],.tilt");
      const hov = !!el && !el.classList.contains("tilt") || (el && el.hasAttribute("data-cursor"));
      cur.classList.toggle("is-hover", !!hov);
      const txt = el && el.getAttribute("data-cursor");
      cur.classList.toggle("is-label", !!txt);
      label.textContent = txt || "";
    });
    document.addEventListener("pointerdown", () => cur.classList.add("is-down"));
    document.addEventListener("pointerup", () => cur.classList.remove("is-down"));
    document.addEventListener("pointerleave", () => { m.x = m.y = -100; });
  }

  /* ---------- 11. gold dust canvas ---------- */
  const cv = $("#dust"), cx = cv.getContext("2d");
  let W = 0, H = 0, dust = [];
  function sizeDust() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; cx.setTransform(1, 0, 0, 1, 0, 0); cx.scale(dpr, dpr);
    W = innerWidth; H = innerHeight;
    const n = clamp(Math.round(W * H / 30000), 14, 56);
    dust = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 2, d: .2 + Math.random() * .9,
      vx: (Math.random() - .5) * .12, vy: -.05 - Math.random() * .2, a: .2 + Math.random() * .6, p: Math.random() * 6.28
    }));
  }
  function drawDust(t) {
    if (reduce) return;
    cx.clearRect(0, 0, W, H);
    const sy = scrollY;
    for (const p of dust) {
      p.x += p.vx + pt.x * .05 * p.d; p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      const y = ((p.y - sy * p.d * .35) % (H + 20) + H + 20) % (H + 20) - 10;
      const tw = .5 + .5 * Math.sin(t / 900 + p.p);
      const g = cx.createRadialGradient(p.x, y, 0, p.x, y, p.r * 4);
      g.addColorStop(0, `rgba(247,226,156,${p.a * tw})`); g.addColorStop(1, "rgba(212,167,60,0)");
      cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, y, p.r * 4, 0, 6.283); cx.fill();
    }
  }

  /* ---------- master frame loop ---------- */
  function frame(t) {
    pt.x = lerp(pt.x, pt.tx, .06); pt.y = lerp(pt.y, pt.ty, .06);
    // 3D bar: gentle sway + pointer + click-spin
    spin += spinV; spinV *= .94; if (spinV < .05) spinV = 0;
    if (!reduce) {
      const sway = Math.sin(t / 2400) * 24;
      bar.style.setProperty("--ry", (-28 + sway + pt.x * 18 + spin) + "deg");
      bar.style.setProperty("--rx", (-18 - pt.y * 10 + Math.cos(t / 3100) * 5) + "deg");
      scene.style.setProperty("--sy", (pt.x * 8) + "deg");
      scene.style.setProperty("--sx", (-pt.y * 6) + "deg");
    }
    // cursor
    m.rx = lerp(m.rx, m.x, .17); m.ry = lerp(m.ry, m.y, .17);
    dot.style.transform = `translate3d(${m.x}px,${m.y}px,0)`;
    ring.style.transform = `translate3d(${m.rx}px,${m.ry}px,0)`;
    parallax(); drawDust(t);
    requestAnimationFrame(frame);
  }

  /* ---------- 12. tabs ---------- */
  function initTabs() {
    const tabs = $$(".tab"), pill = $(".tabs__pill");
    function place(btn) {
      pill.style.width = btn.offsetWidth + "px";
      pill.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
    }
    tabs.forEach(b => b.addEventListener("click", () => {
      tabs.forEach(x => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
      $$(".steps").forEach(p => p.classList.toggle("is-active", p.dataset.panel === b.dataset.tab));
      place(b);
      const panel = $(`.steps[data-panel="${b.dataset.tab}"]`);
      $$(".step", panel).forEach((s, i) => {
        s.animate([{ opacity: 0, transform: "translateY(30px) rotateX(-25deg)" }, { opacity: 1, transform: "none" }],
          { duration: 800, delay: i * 90, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      });
      panel.classList.remove("line-go"); requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add("line-go")));
    }));
    const place0 = () => place($(".tab.is-active"));
    place0(); addEventListener("resize", place0); document.fonts && document.fonts.ready.then(place0);
    // keep the pill right after language switches too
    new MutationObserver(place0).observe($(".tabs"), { subtree: true, characterData: true, childList: true });
  }

  /* ---------- 13. calculator ---------- */
  function tween(el, to, dec) {
    const from = parseFloat(el.dataset.v || "0") || 0; el.dataset.v = to;
    if (reduce) { el.textContent = fmt(to, dec); return; }
    const t0 = performance.now(), D = 520;
    (function s(now) {
      const p = clamp((now - t0) / D, 0, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(lerp(from, to, e), dec);
      if (p < 1) requestAnimationFrame(s);
    })(t0);
  }
  const fmt = (v, d) => d ? v.toFixed(d) : Math.round(v).toLocaleString("en-IN");
  function initCalc() {
    const w = $("#cWeight"); let k = 22;
    const rate = Number(CFG.goldRate && CFG.goldRate.k24) || 0;
    function run() {
      const wt = Math.max(0, parseFloat(w.value) || 0);
      const pure = wt * k / 24;
      tween($("#outPure"), pure, 2);
      if (rate > 0) {
        $("#outValueWrap").hidden = false;
        tween($("#outValue"), pure * rate, 0);
        const n = $("#calcNote");
        n.dataset.i18n = "calc_note2";
        n.dataset.en = `Based on ₹${rate.toLocaleString("en-IN")}/g for 24K${CFG.goldRate.updated ? " (" + CFG.goldRate.updated + ")" : ""}. Final value is confirmed after testing and weighing.`;
        n.innerHTML = lang === "te" && (window.TG_TE || {}).calc_note2 ? window.TG_TE.calc_note2 : n.dataset.en;
      }
      $$(".purity__row").forEach(r => r.classList.toggle("is-on", +r.dataset.k === k));
    }
    $$(".karat").forEach(b => b.addEventListener("click", () => {
      k = +b.dataset.k; $$(".karat").forEach(x => x.classList.toggle("is-active", x === b)); run();
    }));
    w.addEventListener("input", run); run();
  }

  /* ---------- 14. FAQ (one open at a time) ---------- */
  function initFaq() {
    const all = $$(".faq details");
    all.forEach(d => d.addEventListener("toggle", () => { if (d.open) all.forEach(o => { if (o !== d) o.open = false; }); }));
  }

  /* ---------- 15. enquiry form ---------- */
  let service = "sell";
  function setService(s) {
    service = s;
    const seg = $("#seg"); if (!seg) return;
    $$(".seg__btn", seg).forEach(b => b.classList.toggle("is-active", b.dataset.service === s));
    seg.dataset.i = s === "release" ? 1 : 0;
  }
  function initForm() {
    $$(".seg__btn").forEach(b => b.addEventListener("click", () => setService(b.dataset.service)));
    const f = $("#enquiry"), err = $("#formErr");
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const name = $("#fName"), phone = $("#fPhone"), note = $("#fNote");
      const okName = name.value.trim().length > 1, okPhone = digits(phone.value).length >= 10;
      name.classList.toggle("is-bad", !okName); phone.classList.toggle("is-bad", !okPhone);
      err.hidden = okName && okPhone;
      if (!(okName && okPhone)) { err.style.animation = "none"; void err.offsetWidth; err.style.animation = ""; return; }
      const svc = service === "release" ? "Release pledged gold" : "Sell gold";
      const msg = `Hello Trust Gold Services,\nService: ${svc}\nName: ${name.value.trim()}\nPhone: ${phone.value.trim()}` + (note.value.trim() ? `\nDetails: ${note.value.trim()}` : "");
      // 1) store the enquiry (works when hosted on Netlify)
      try {
        const body = new URLSearchParams({ "form-name": "enquiry", service: svc, name: name.value.trim(), phone: phone.value.trim(), note: note.value.trim() });
        await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
      } catch (x) { /* offline / not on Netlify: ignore */ }
      // 2) open WhatsApp if a number is configured
      if (waNum) window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      $("#formOk").hidden = false;
      setTimeout(() => { $("#formOk").hidden = true; f.reset(); $$(".field input", f).forEach(i => i.classList.remove("is-bad")); }, 6000);
    });
  }

  /* ---------- boot ---------- */
  bindConfig();
  applyLang(lang, false);
  $("#langBtn").addEventListener("click", () => applyLang(lang === "en" ? "te" : "en", true));
  buildCoins(); sizeDust(); addEventListener("resize", sizeDust);
  initScroll(); initTilt(); initCursor(); initTabs(); initCalc(); initFaq(); initForm();
  onScroll();
  requestAnimationFrame(frame);
  if (reduce) { document.body.classList.remove("is-loading"); }
  initLoader();
})();
