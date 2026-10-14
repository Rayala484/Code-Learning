(() => {
  const WHATSAPP_NUMBER = "918500386916";
  const COURSES = window.GX_COURSES || [];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const feeText = (c) => c.fee || "Call for fee";
  const durationText = (c) => c.duration || "Call for details";

  // ---------- Render courses ----------
  const grid = document.getElementById("courseGrid");
  grid.innerHTML = COURSES.map((c) => `
    <article class="card${c.featured ? " card--feature" : ""} reveal" data-cat="${c.cat}">
      <div class="card__top">
        ${c.tag ? `<span class="tag">${esc(c.tag)}</span>` : ""}
        <span class="card__ico" aria-hidden="true">${c.icon}</span>
      </div>
      <span class="card__cat">${esc(c.catLabel)}</span>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.short)}</p>
      ${c.featured ? `<ul class="card__list">${c.learn.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}
      <div class="card__meta">
        <span>${esc(c.format)}</span>
        <span class="card__fee">${esc(feeText(c))}</span>
      </div>
      <div class="card__actions">
        <button type="button" class="card__btn" data-details="${c.id}">View details</button>
        <a href="#contact" class="card__link" data-course="${esc(c.title)}">Enquire →</a>
      </div>
    </article>`).join("") + `
    <article class="card card--cta reveal" data-cat="all">
      <span class="card__ico" aria-hidden="true">🤝</span>
      <h3>Not sure which course is right for you?</h3>
      <p>Talk to our counsellor — we’ll guide you based on your goal, budget and experience.</p>
      <div class="card__actions">
        <a href="tel:+918500386916" class="btn btn--gold btn--sm">Call now</a>
        <a href="#contact" class="card__link" data-course="Not sure yet — need guidance">Enquire →</a>
      </div>
    </article>`;

  // ---------- Render fee table ----------
  document.getElementById("feeRows").innerHTML = COURSES.map((c) => `
    <div class="fees__row">
      <span class="fees__course"><i aria-hidden="true">${c.icon}</i>${esc(c.title)}</span>
      <span data-label="Format">${esc(c.format)}</span>
      <span data-label="Duration">${esc(durationText(c))}</span>
      <span data-label="Fee" class="fees__fee${c.fee ? "" : " is-ask"}">${esc(feeText(c))}</span>
      <span><a href="#contact" class="btn btn--ghost btn--sm" data-course="${esc(c.title)}">Enquire</a></span>
    </div>`).join("");

  // ---------- Course select in the form ----------
  const courseSelect = document.getElementById("courseSelect");
  courseSelect.innerHTML =
    COURSES.map((c) => `<option>${esc(c.title)}</option>`).join("") +
    `<option>Society Membership</option><option>Not sure yet — need guidance</option>`;

  // ---------- Sticky nav ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---------- Mobile menu ----------
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // ---------- Scroll reveal ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.children].filter((el) => el.classList.contains("reveal"));
        const delay = Math.min(siblings.indexOf(entry.target), 6) * 70;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
        // Once revealed, drop the reveal styles so hover effects respond instantly.
        setTimeout(() => {
          entry.target.classList.remove("reveal", "is-visible");
          entry.target.style.transitionDelay = "";
        }, 1000 + delay);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // ---------- Course filters ----------
  const filters = document.querySelectorAll(".filter");
  const cards = grid.querySelectorAll(".card:not(.card--cta)");
  filters.forEach((btn) => btn.addEventListener("click", () => {
    filters.forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-pressed", String(b === btn));
    });
    const f = btn.dataset.filter;
    cards.forEach((card) => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("is-hidden", !show);
      if (show) card.classList.add("is-visible");
    });
  }));

  // Cursor spotlight
  cards.forEach((card) => card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));

  // ---------- Pre-select course when "Enquire" is clicked ----------
  const preselect = (name) => {
    const match = [...courseSelect.options].find((o) => o.value === name);
    if (match) courseSelect.value = match.value;
  };
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-course]");
    if (el) preselect(el.dataset.course);
  });

  // ---------- Course details modal ----------
  const modal = document.getElementById("courseModal");
  const openModal = (id) => {
    const c = COURSES.find((x) => x.id === id);
    if (!c) return;
    document.getElementById("modalIco").textContent = c.icon;
    document.getElementById("modalCat").textContent = c.catLabel;
    document.getElementById("modalTitle").textContent = c.title;
    document.getElementById("modalDesc").textContent = c.desc;
    document.getElementById("modalMeta").innerHTML = `
      <div><small>Format</small><b>${esc(c.format)}</b></div>
      <div><small>Duration</small><b>${esc(durationText(c))}</b></div>
      <div><small>Fee</small><b>${esc(feeText(c))}</b></div>
      <div><small>Certificate</small><b>Yes</b></div>`;
    document.getElementById("modalList").innerHTML = c.learn.map((l) => `<li>${esc(l)}</li>`).join("");
    document.getElementById("modalFor").textContent = c.forWho;
    document.getElementById("modalEnquire").dataset.course = c.title;
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    document.body.classList.add("modal-open");
  };
  const closeModal = () => {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  };
  modal.addEventListener("close", () => document.body.classList.remove("modal-open"));
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-details]");
    if (btn) openModal(btn.dataset.details);
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) closeModal();
  });

  // ---------- Enquiry form (Netlify Forms, WhatsApp fallback) ----------
  const form = document.getElementById("enquiryForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("formSubmit");

  const whatsappLink = (data) => {
    const lines = [
      "Hi GoldXpert Academy! I'd like to enquire.",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      data.get("city") ? `City: ${data.get("city")}` : "",
      `Interested in: ${data.get("course")}`,
      data.get("message") ? `Message: ${data.get("message")}` : "",
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const digits = String(data.get("phone") || "").replace(/\D/g, "");
    form.name.classList.toggle("is-invalid", !name);
    form.phone.classList.toggle("is-invalid", digits.length < 10);
    if (!name || digits.length < 10) {
      statusEl.className = "form__status is-error";
      statusEl.textContent = "Please enter your name and a valid 10-digit phone number.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    statusEl.className = "form__status";
    statusEl.textContent = "";
    const wa = whatsappLink(data);

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      statusEl.className = "form__status is-success";
      statusEl.innerHTML = `Thank you, ${esc(name)}! We’ve received your enquiry and will call you soon. ` +
        `<a href="${wa}" target="_blank" rel="noopener">Want a faster reply? Message us on WhatsApp →</a>`;
      form.reset();
    } catch {
      // Not hosted on Netlify (or offline): hand the enquiry over to WhatsApp instead.
      statusEl.className = "form__status is-success";
      statusEl.innerHTML = `Opening WhatsApp to send your enquiry… <a href="${wa}" target="_blank" rel="noopener">Tap here if it didn’t open.</a>`;
      window.open(wa, "_blank", "noopener");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Enquiry";
    }
  });

  // ---------- "Your path" timeline: liquid gold flows from 1 to 5 ----------
  const tlWrap = document.getElementById("timelineWrap");
  if (tlWrap) {
    const track = tlWrap.querySelector(".timeline__track");
    const fill = document.getElementById("timelineFill");
    const steps = [...tlWrap.querySelectorAll(".step")];
    const dots = steps.map((s) => s.querySelector(".step__n"));
    let progress = 0; // 0 → at step 1, 4 → at step 5
    let vertical = false;

    // Circle centres relative to the wrapper (offsets ignore the reveal transforms).
    const centres = () => dots.map((d) => {
      let x = d.offsetWidth / 2, y = d.offsetHeight / 2, el = d;
      while (el && el !== tlWrap) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
      return { x, y };
    });

    const render = () => {
      const cs = centres();
      const i = Math.min(Math.floor(progress), cs.length - 2);
      const f = progress - i;
      const axis = vertical ? "y" : "x";
      const len = cs[i][axis] + (cs[i + 1][axis] - cs[i][axis]) * f - cs[0][axis];
      if (vertical) { fill.style.height = `${len}px`; fill.style.width = ""; }
      else { fill.style.width = `${len}px`; fill.style.height = ""; }
    };

    const layout = () => {
      const cs = centres();
      const first = cs[0], last = cs[cs.length - 1];
      vertical = Math.abs(cs[1].y - first.y) > Math.abs(cs[1].x - first.x);
      tlWrap.classList.toggle("is-vertical", vertical);
      Object.assign(track.style, vertical
        ? { left: `${first.x - 2}px`, top: `${first.y}px`, width: "4px", height: `${last.y - first.y}px` }
        : { left: `${first.x}px`, top: `${first.y - 2}px`, width: `${last.x - first.x}px`, height: "4px" });
      render();
    };

    const fillStep = (i) => {
      dots[i].classList.add("is-filled");
      steps[i].classList.add("is-reached");
    };

    const run = () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || typeof window.gsap === "undefined") {
        progress = dots.length - 1;
        render();
        dots.forEach((_, i) => fillStep(i));
        return;
      }
      const state = { p: 0 };
      const seq = window.gsap.timeline({ delay: 0.5 });
      seq.call(() => { fill.classList.add("is-flowing"); fillStep(0); });
      for (let i = 1; i < dots.length; i++) {
        seq.to(state, {
          p: i,
          duration: 1.1,
          ease: "sine.inOut",
          onUpdate: () => { progress = state.p; render(); },
        }, "+=0.55");
        seq.call(() => fillStep(i));
      }
      seq.call(() => fill.classList.remove("is-flowing"), null, "+=0.4");
    };

    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    document.addEventListener("gx:introdone", layout);
    if ("IntersectionObserver" in window) {
      const tio = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { tio.disconnect(); run(); }
      }, { threshold: 0.45 });
      tio.observe(tlWrap);
    } else {
      run();
    }
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
