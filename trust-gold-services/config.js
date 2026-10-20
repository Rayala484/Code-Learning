/*
  Trust Gold Services — business settings.
  Edit this file to update the gold rate, phone numbers and links.
  Everything on the site (rate strip, rate cards, calculator, buttons) updates automatically.
*/
window.TGS_CONFIG = {
  // ---- Gold rate (₹ per gram) ----
  // liveRates: true  → the site shows the live market rate, refreshed automatically every 10 minutes.
  // liveRates: false → the site shows the numbers below exactly as typed (use this to set your own rate).
  // The numbers below are also shown if the live rate is ever unavailable.
  liveRates: true,
  rates: {
    updated: "2026-10-16T10:00", // date and time of these numbers (YYYY-MM-DDTHH:MM)
    k24: 14744,                  // 24K (999) rate per gram
    k22: 13515                   // 22K (916) rate per gram
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
  youtube: "https://youtube.com/@trustgoldservices",

  // ---- Customer reviews ----
  // Copy real reviews from Google / WhatsApp here (with the customer's permission).
  // They appear as review cards under "Hear it from our customers". Example:
  //   { name: "Ravi K.", place: "Vijayawada", rating: 5, text: "Very transparent process..." },
  reviews: [
    { name: "Sai Kumar", place: "Vijayawada", rating: 5,
      text: "I had my gold pledged at a private bank in Vijayawada and was struggling with high interest. V. Manohar garu and the team helped clear the loan directly with the bank, released my jewellery safely, and paid the balance amount on the spot. Very smooth and transparent process!" },
    { name: "Ranga Rao", place: "Guntur / Vijayawada Region", rating: 5,
      text: "Most gold buyers charge heavy hidden fees or insist on melting the gold right away. At Trust Gold Services, they tested the purity right in front of me and charged only a 1% processing fee as promised. Highly reliable and honest service." },
    { name: "Pragathi Sharma", place: "Hyderabad, Telangana", rating: 5,
      text: "I wanted to sell some old family gold ornaments for urgent family needs. The team explained the day's live gold rate, tested the purity open on screen without any secret deductions, and transferred the money directly to my bank account instantly. Completely safe for women!" },
    { name: "Venkatesh V.", place: "Khammam / Telangana", rating: 5,
      text: "Very professional approach compared to traditional gold pawn shops. They took care of all the legal paperwork and bank release procedures without any tension. If you want to release pledged gold without getting cheated, I strongly recommend Trust Gold Services." },
    { name: "Anitha Reddy", place: "Vijayawada", rating: 5,
      text: "Trustworthy and polite staff. They didn't force me to melt my jewellery, and every calculation was shown clearly before proceeding. Getting the remaining cash balance immediately after bank closure was a big relief for my family." }
  ]
};
