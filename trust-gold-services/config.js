/*
  Trust Gold Services — business settings.
  Edit this file to update the gold rate, phone numbers and links.
  Everything on the site (rate strip, rate cards, calculator, buttons) updates automatically.
*/
window.TGS_CONFIG = {
  // ---- Today's gold rate (₹ per gram). Update daily. ----
  rates: {
    updated: "2026-10-16T10:00", // date and time of the last update (YYYY-MM-DDTHH:MM)
    k24: 15200,                  // 24K (999) rate per gram
    k22: 13700                   // 22K (916) rate per gram
  },

  // Processing fee taken from the total gold value (1% = 0.01)
  processingFee: 0.01,

  // ---- Contact ----
  phone: "+919393494455",
  phoneDisplay: "+91 93934 94455",
  whatsapp: "919393494455", // country code + number, no "+" or spaces
  email: "trustgoldservices@gmail.com",
  city: "Vijayawada, Andhra Pradesh",

  // ---- Links ----
  maps: "https://maps.app.goo.gl/hkybjegfg9zumDPx6",
  instagram: "https://www.instagram.com/trustgoldservices",
  facebook: "https://www.facebook.com/share/1bgL24rnT9/",
  youtube: "" // paste the YouTube channel link here to show the YouTube icon
};
