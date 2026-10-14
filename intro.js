/*
  GoldXpert intro: a raw gold bar heats up, melts, and the molten gold
  pours into the GX logo, which acts as a mold. When the mold is full the
  gold cools, a shine sweeps across it, the sun rays burst out, the
  wordmark appears, and the website is revealed.
*/
(() => {
  const intro = document.getElementById("intro");
  const body = document.body;
  if (!intro) return;

  const SVG_NS = "http://www.w3.org/2000/svg";
  const BAR =
    "M147,82 C180,82 220,82 253,82 C260,101 267,120 275,140 C240,140 222,140 208,140 C204,140 196,140 192,140 C178,140 160,140 125,140 C133,120 140,101 147,82 Z";
  const MELT =
    "M158,112 C182,104 218,104 242,112 C260,118 266,132 250,138 C232,144 214,146 206,162 C204,167 196,167 194,162 C186,146 168,144 150,138 C134,132 140,118 158,112 Z";
  const DROP =
    "M192,150 C196,148 204,148 208,150 C210,152 210,155 208,157 C206,159 204,160 202,164 C201,166 199,166 198,164 C196,160 194,159 192,157 C190,155 190,152 192,150 Z";
  const STREAM_TOP = 158;
  const MOLD_ENTRY = 342; // where the stream meets the mold (absolute y)
  const FILL_START = 92;
  const FILL_END = -96;

  let finished = false;
  let tl = null;
  let loops = [];

  const $ = (sel) => intro.querySelector(sel);
  const status = $("#introStatus");
  const setStatus = (t) => { if (status) status.textContent = t; };

  function finish() {
    if (finished) return;
    finished = true;
    loops.forEach((t) => t.kill());
    loops = [];
    intro.classList.add("is-hidden");
    body.classList.remove("intro-active");
    document.dispatchEvent(new CustomEvent("gx:introdone"));
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof window.gsap === "undefined") {
    finish();
    return;
  }
  const gsap = window.gsap;
  const rand = gsap.utils.random;

  // ---------- build dynamic pieces once ----------
  const rays = $("#introRays");
  for (let i = 0; i < 24; i++) {
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("transform", `rotate(${i * 15})`);
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "-112");
    line.setAttribute("x2", "0");
    line.setAttribute("y2", "-112");
    line.dataset.len = i % 2 ? "-142" : "-160";
    g.appendChild(line);
    rays.appendChild(g);
  }

  const embers = $("#embers");
  for (let i = 0; i < 26; i++) {
    const c = document.createElementNS(SVG_NS, "circle");
    c.setAttribute("r", rand(0.8, 2.2).toFixed(2));
    c.setAttribute("cx", "200");
    c.setAttribute("cy", "140");
    c.setAttribute("fill", i % 3 ? "#FFC14D" : "#FFF1C2");
    embers.appendChild(c);
  }

  const splash = $("#splash");
  for (let i = 0; i < 12; i++) {
    const c = document.createElementNS(SVG_NS, "circle");
    c.setAttribute("r", rand(1, 2.4).toFixed(2));
    c.setAttribute("cx", "0");
    c.setAttribute("cy", "-68");
    c.setAttribute("fill", "#FFE9A0");
    splash.appendChild(c);
  }

  function startLoops() {
    // flickering heat haze
    loops.push(gsap.to("#hazeNoise", { attr: { baseFrequency: "0.025 0.13" }, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" }));
    // rising embers
    embers.querySelectorAll("circle").forEach((c) => {
      const x = rand(140, 260);
      loops.push(
        gsap.fromTo(c,
          { attr: { cx: x, cy: rand(110, 145) }, opacity: 1 },
          { attr: { cx: x + rand(-25, 25), cy: rand(10, 70) }, opacity: 0, duration: rand(0.9, 1.9), repeat: -1, delay: rand(0, 1.4), ease: "power1.out" })
      );
    });
    // flowing highlight inside the stream
    loops.push(gsap.to("#streamFlow", { attr: { "stroke-dashoffset": -44 }, duration: 0.3, repeat: -1, ease: "none" }));
    // liquid surface waves
    loops.push(gsap.to("#fillWave", { x: -50, duration: 0.7, repeat: -1, ease: "none" }));
    // splashes where the gold enters the mold
    splash.querySelectorAll("circle").forEach((c) => {
      loops.push(
        gsap.fromTo(c,
          { attr: { cx: 0, cy: -68 }, opacity: 1 },
          { attr: { cx: rand(-22, 22), cy: -68 - rand(6, 22) }, opacity: 0, duration: rand(0.35, 0.6), repeat: -1, delay: rand(0, 0.5), ease: "power2.out" })
      );
    });
  }

  function reset() {
    gsap.set(intro, { opacity: 1 });
    gsap.set("#barGroup", { opacity: 0, y: -40 });
    gsap.set(".bar-shape", { attr: { d: BAR } });
    gsap.set("#barHotShape", { opacity: 0 });
    gsap.set("#barTop", { opacity: 1, y: 0 });
    gsap.set("#barText", { opacity: 1 });
    gsap.set("#hazeMap", { attr: { scale: 0 } });
    gsap.set("#furnaceGlow", { opacity: 0 });
    gsap.set("#embers", { opacity: 0 });
    gsap.set("#splash", { opacity: 0 });
    gsap.set("#stream", { attr: { y: STREAM_TOP, height: 0 }, opacity: 1 });
    gsap.set("#streamFlow", { attr: { y1: STREAM_TOP, y2: STREAM_TOP }, opacity: 0.9 });
    gsap.set("#fillLevel", { y: FILL_START });
    gsap.set("#cavities", { opacity: 1 });
    gsap.set("#liquidHot", { opacity: 1 });
    gsap.set("#moldFlash", { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" });
    gsap.set("#shine", { attr: { x: -260 }, opacity: 0 });
    gsap.set("#introRays line", { attr: { y2: -112 }, opacity: 0 });
    gsap.set("#introWord", { opacity: 0, y: 24 });
    gsap.set(status, { opacity: 1 });
    setStatus("Heating raw gold…");
  }

  function play() {
    finished = false;
    intro.classList.remove("is-hidden");
    body.classList.add("intro-active");
    reset();
    startLoops();

    tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: finish });

    // 1 — the raw gold bar appears
    tl.to("#barGroup", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0)

    // 2 — heating: glow, haze, embers, colour shifts to white-hot
      .to("#furnaceGlow", { opacity: 1, duration: 1.4 }, 0.4)
      .to("#barHotShape", { opacity: 1, duration: 1.4, ease: "power1.in" }, 0.4)
      .to("#hazeMap", { attr: { scale: 7 }, duration: 1.4 }, 0.4)
      .to("#barText", { opacity: 0, duration: 0.8 }, 0.9)
      .to("#embers", { opacity: 1, duration: 0.5 }, 0.6)

    // 3 — melting: the bar slumps into a funnel and starts to drip
      .call(() => setStatus("Melting…"), null, 1.5)
      .to(".bar-shape", { attr: { d: MELT }, duration: 1.1, ease: "power2.in" }, 1.6)
      .to("#barTop", { opacity: 0, y: 14, duration: 0.6 }, 1.6)

    // 4 — pouring: a bright stream runs into the GX mold
      .to("#stream", { attr: { height: MOLD_ENTRY - STREAM_TOP }, duration: 0.45, ease: "power1.in" }, 2.45)
      .to("#streamFlow", { attr: { y2: MOLD_ENTRY }, duration: 0.45, ease: "power1.in" }, 2.45)
      .call(() => setStatus("Pouring into the GX mold…"), null, 2.6)
      .to("#splash", { opacity: 1, duration: 0.2 }, 2.85)

    // 5 — filling: liquid gold rises through the rings and the letters
      .to("#fillLevel", { y: FILL_END, duration: 2.0, ease: "sine.inOut" }, 2.85)
      .to(".bar-shape", { attr: { d: DROP }, duration: 1.2, ease: "power1.in" }, 2.8)
      .to("#barGroup", { opacity: 0, duration: 0.4 }, 3.9)
      .to("#furnaceGlow", { opacity: 0, duration: 0.8 }, 3.9)
      .to("#embers", { opacity: 0, duration: 0.6 }, 3.9)

    // 6 — the stream runs dry
      .to("#stream", { attr: { y: MOLD_ENTRY, height: 0 }, duration: 0.45, ease: "power1.in" }, 4.45)
      .to("#streamFlow", { attr: { y1: MOLD_ENTRY }, opacity: 0, duration: 0.45 }, 4.45)
      .to("#splash", { opacity: 0, duration: 0.3 }, 4.75)

    // 7 — the gold cools, flashes and shines
      .to(status, { opacity: 0, duration: 0.4 }, 4.8)
      .to("#cavities", { opacity: 0, duration: 0.6 }, 4.9)
      .to("#liquidHot", { opacity: 0, duration: 1.2 }, 4.9)
      .to("#moldFlash", { opacity: 1, scale: 1.15, duration: 0.35, ease: "power2.out" }, 5.0)
      .to("#moldFlash", { opacity: 0, duration: 0.9 }, 5.35)
      .to("#shine", { opacity: 1, duration: 0.1 }, 5.1)
      .to("#shine", { attr: { x: 230 }, duration: 0.9, ease: "power2.inOut" }, 5.1)

    // 8 — sun rays burst out, wordmark appears
      .to("#introRays line", {
        attr: { y2: (i, el) => Number(el.dataset.len) },
        opacity: 1,
        duration: 0.5,
        ease: "back.out(2.2)",
        stagger: 0.022,
      }, 5.2)
      .to("#introWord", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 5.6)

    // 9 — reveal the website
      .to(intro, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 7.1);
  }

  function skip() {
    if (finished) return;
    if (tl) tl.kill();
    gsap.to(intro, { opacity: 0, duration: 0.4, onComplete: finish });
  }

  document.getElementById("introSkip").addEventListener("click", skip);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !finished) skip();
  });

  const replay = document.getElementById("replayIntro");
  if (replay) {
    replay.addEventListener("click", () => {
      window.scrollTo({ top: 0 });
      play();
    });
  }

  // Safety net: never trap the visitor behind the intro.
  setTimeout(() => { if (!finished && (!tl || !tl.isActive())) finish(); }, 12000);

  play();
})();
