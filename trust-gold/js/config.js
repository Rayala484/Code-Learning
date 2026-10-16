/* ============================================================
   TRUST GOLD SERVICES — SITE SETTINGS
   Everything business-specific lives here. Fill these in and the
   whole site (buttons, links, form, footer, map) updates itself.
   Anything left empty is simply hidden or falls back to "Contact".
   ============================================================ */
window.TG = {
  brand: "Trust Gold Services",
  city: "Hyderabad, Telangana",     // CONFIRM: change to your real location

  phone: "",        // e.g. "+919876543210"   (used for Call buttons)
  whatsapp: "",     // digits only incl. country code, e.g. "919876543210"
  email: "",        // e.g. "hello@trustgoldservices.com"
  address: "",      // full shop address, shown in Contact + footer
  mapsUrl: "",      // Google Maps share link to your shop
  mapsEmbed: "",    // Google Maps "Embed a map" src URL (optional)
  hours: "",        // e.g. "Mon–Sat · 10:00 AM – 7:00 PM"

  // Today's gold rate PER GRAM in ₹. Leave null to hide the rupee estimate;
  // the calculator then shows pure-gold content and asks visitors to ask for today's rate.
  goldRate: { k24: null, updated: "" },   // e.g. { k24: 7300, updated: "16 Oct 2026, 10:30 AM" }

  doorstep: false,  // true ONLY if you really offer doorstep valuation / pickup

  // Add REAL customer reviews only, e.g. { name:"Ravi K.", area:"Kukatpally", text:"...", stars:5 }
  reviews: [],
  googleReviewsUrl: "",   // link to your Google Business reviews

  social: { instagram: "", facebook: "", youtube: "" }
};
