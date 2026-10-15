/*
  Theme (Light / Dark / System default) and language (English / Telugu) switches.
  Choices are remembered in this browser.
*/
(() => {
  const root = document.documentElement;
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } };

  // ---------- Theme ----------
  const resolve = (pref) => (pref === "system" ? (media && media.matches ? "light" : "dark") : pref);

  function applyTheme(pref) {
    root.setAttribute("data-theme-pref", pref);
    root.setAttribute("data-theme", resolve(pref));
    if (metaTheme) metaTheme.setAttribute("content", resolve(pref) === "light" ? "#fbf7ef" : "#04131b");
    document.querySelectorAll("[data-theme-set]").forEach((b) => {
      const on = b.dataset.themeSet === pref;
      b.classList.toggle("is-active", on);
      b.setAttribute(b.getAttribute("role") === "menuitemradio" ? "aria-checked" : "aria-pressed", String(on));
    });
  }

  function setTheme(pref) {
    save("gx-theme", pref);
    root.classList.add("theme-switching");
    applyTheme(pref);
    setTimeout(() => root.classList.remove("theme-switching"), 450);
  }

  applyTheme(root.getAttribute("data-theme-pref") || "system");
  if (media) {
    const onSystemChange = () => { if (root.getAttribute("data-theme-pref") === "system") applyTheme("system"); };
    if (media.addEventListener) media.addEventListener("change", onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  // Theme popover (desktop)
  const themeBtn = document.getElementById("themeBtn");
  const themePop = document.getElementById("themePop");
  const setPop = (open) => {
    if (!themePop) return;
    themePop.hidden = !open;
    themeBtn.setAttribute("aria-expanded", String(open));
  };
  if (themeBtn) {
    themeBtn.addEventListener("click", (e) => { e.stopPropagation(); setPop(themePop.hidden); });
    document.addEventListener("click", (e) => { if (!e.target.closest(".theme-menu")) setPop(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setPop(false); });
  }

  document.querySelectorAll("[data-theme-set]").forEach((b) =>
    b.addEventListener("click", () => { setTheme(b.dataset.themeSet); setPop(false); })
  );

  // ---------- Language ----------
  const i18n = window.GX_I18N;
  function markLang() {
    const lang = i18n ? i18n.lang : "en";
    document.querySelectorAll("[data-lang-set]").forEach((b) => {
      const on = b.dataset.langSet === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }
  const setLang = (lang) => {
    if (!i18n || i18n.lang === lang) return;
    i18n.setLang(lang);
    markLang();
  };
  document.querySelectorAll("[data-lang-toggle]").forEach((b) =>
    b.addEventListener("click", () => setLang(i18n && i18n.lang === "te" ? "en" : "te"))
  );
  document.querySelectorAll("[data-lang-set]").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.langSet))
  );
  markLang();
})();
