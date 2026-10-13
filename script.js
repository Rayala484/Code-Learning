(() => {
  const WHATSAPP_NUMBER = "918500386916";

  // Sticky nav state
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
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

  // Scroll reveal with stagger
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const siblings = [...entry.target.parentElement.children].filter((el) => el.classList.contains("reveal"));
          entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target), 6) * 70}ms`;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Animated counters
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  // Course filters
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".bento .card");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      const f = btn.dataset.filter;
      cards.forEach((card) => card.classList.toggle("is-hidden", f !== "all" && card.dataset.cat !== f));
    })
  );

  // Cursor spotlight on cards
  cards.forEach((card) =>
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    })
  );

  // "Enquire" links preselect the course in the form
  const courseSelect = document.getElementById("courseSelect");
  document.querySelectorAll("[data-course]").forEach((el) =>
    el.addEventListener("click", () => {
      const match = [...courseSelect.options].find((o) => o.value === el.dataset.course);
      if (match) courseSelect.value = match.value;
    })
  );

  // Enquiry form -> WhatsApp
  const form = document.getElementById("enquiryForm");
  const errorEl = document.getElementById("formError");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const digits = phone.replace(/\D/g, "");

    form.name.classList.toggle("is-invalid", !name);
    form.phone.classList.toggle("is-invalid", digits.length < 10);
    if (!name || digits.length < 10) {
      errorEl.textContent = "Please enter your name and a valid phone number.";
      return;
    }
    errorEl.textContent = "";

    const lines = [
      "Hi GoldXpert Academy! I'd like to enquire.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Interested in: ${data.get("course")}`,
    ];
    const message = String(data.get("message") || "").trim();
    if (message) lines.push(`Message: ${message}`);

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
