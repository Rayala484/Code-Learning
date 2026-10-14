/*
  GoldXpert course catalogue.
  ─────────────────────────────────────────────────────────────
  To update the website, edit the values below:
    • fee      → e.g. "₹15,000"  (leave null to show "Call for fee")
    • duration → e.g. "30 days"  (leave null to show "Call for details")
  Courses, the fee table and the enquiry dropdown all update automatically.
*/
window.GX_COURSES = [
  {
    id: "ornament-making",
    cat: "making",
    catLabel: "Making & Manufacturing",
    icon: "💍",
    title: "Gold Ornament Making",
    tag: "Most Popular",
    featured: true,
    short: "Learn to make gold jewellery from scratch — from melting and wire drawing to soldering, setting and a mirror-finish polish.",
    desc: "A complete, bench-based program for anyone who wants to make gold ornaments professionally. You work with real tools and metal from day one, guided by experienced goldsmiths.",
    learn: [
      "Goldsmith tools, workshop setup & safety",
      "Alloying for 22K / 18K and karat calculations",
      "Melting, ingot pouring, sheet rolling & wire drawing",
      "Soldering, joining and chain & ring making",
      "Basics of stone setting and design",
      "Filing, finishing, polishing & quality checks"
    ],
    forWho: "Beginners, goldsmiths and anyone planning to start a jewellery-making unit.",
    format: "Hands-on workshop",
    duration: null,
    fee: null
  },
  {
    id: "manufacturing",
    cat: "making",
    catLabel: "Making & Manufacturing",
    icon: "🏭",
    title: "Gold Manufacturing & Casting",
    tag: "New",
    featured: true,
    short: "Step into gold manufacturing — melting, refining basics, lost-wax casting, production workflow and quality control.",
    desc: "Designed for people who want to get into gold manufacturing. Understand the full production cycle — from raw gold to finished, hallmark-ready products.",
    learn: [
      "Furnaces, crucibles and controlled melting",
      "Refining basics & purity management",
      "Lost-wax casting and mould making",
      "Production workflow & loss (wastage) control",
      "Quality control & preparing for hallmarking",
      "Setting up a small manufacturing unit"
    ],
    forWho: "Entrepreneurs, workshop owners and craftsmen scaling up to production.",
    format: "Workshop + classroom",
    duration: null,
    fee: null
  },
  {
    id: "appraisal",
    cat: "testing",
    catLabel: "Testing & Appraisal",
    icon: "⚖️",
    title: "Gold Appraisal",
    short: "Assess purity, weight and value accurately using touchstone, acid, specific-gravity and XRF methods.",
    desc: "The core skill demanded by banks, NBFCs and gold-loan companies. Learn to test gold confidently and detect fake or plated items.",
    learn: [
      "Karat & purity identification",
      "Touchstone, acid and specific-gravity tests",
      "Introduction to XRF analysis",
      "Detecting fake, plated & filled gold",
      "Net weight and value calculation",
      "Appraisal documentation"
    ],
    forWho: "Job seekers, bank & NBFC staff, and gold-loan professionals.",
    format: "Classroom + lab",
    duration: null,
    fee: null
  },
  {
    id: "hallmarking",
    cat: "testing",
    catLabel: "Testing & Appraisal",
    icon: "🏅",
    title: "BIS Hallmarking",
    short: "Understand BIS hallmarking, HUID, marking standards and quality-assurance processes.",
    desc: "Learn how hallmarking works in India and how jewellers and assaying centres ensure purity and compliance.",
    learn: [
      "BIS standards and the hallmarking process",
      "HUID and hallmark components",
      "Assaying and sampling basics",
      "Compliance for jewellers",
      "Reading and verifying hallmarks"
    ],
    forWho: "Jewellers, assaying-centre staff and appraisers.",
    format: "Classroom + lab",
    duration: null,
    fee: null
  },
  {
    id: "valuation",
    cat: "business",
    catLabel: "Finance & Audit",
    icon: "📈",
    title: "Gold Valuation",
    short: "Price jewellery and bullion with live rates, making charges, wastage and stone deductions.",
    desc: "Learn professional valuation methods used by jewellers, valuers and lenders.",
    learn: [
      "Gold rate structure & market basics",
      "Making charges, wastage & stone deductions",
      "Bullion vs jewellery valuation",
      "Valuation reports"
    ],
    forWho: "Valuers, jewellers, entrepreneurs and finance professionals.",
    format: "Classroom",
    duration: null,
    fee: null
  },
  {
    id: "auditing",
    cat: "business",
    catLabel: "Finance & Audit",
    icon: "📋",
    title: "Gold Auditing",
    short: "Audit gold-loan portfolios and vault inventories with structured checklists and reporting.",
    desc: "Build the skills to audit gold held by lenders and businesses — accurately and ethically.",
    learn: [
      "Gold-loan audit procedures",
      "Sampling & re-testing methods",
      "Vault and inventory verification",
      "Fraud red flags",
      "Audit reporting"
    ],
    forWho: "Auditors, bank & NBFC staff, and appraisers.",
    format: "Classroom + practical",
    duration: null,
    fee: null
  },
  {
    id: "pawn",
    cat: "business",
    catLabel: "Finance & Audit",
    icon: "🏦",
    title: "Pawn Broking",
    short: "Loan valuation, documentation, risk control and secure pawn management end-to-end.",
    desc: "Everything you need to run or work in a pawn-broking business safely and profitably.",
    learn: [
      "Loan-to-value and valuation",
      "Documentation & compliance",
      "Risk control and secure storage",
      "Auctions & recovery basics"
    ],
    forWho: "Pawn-shop owners, staff and entrepreneurs.",
    format: "Classroom",
    duration: null,
    fee: null
  },
  {
    id: "gemstones",
    cat: "gems",
    catLabel: "Gems & Finishing",
    icon: "💎",
    title: "Gemstone Identification",
    short: "Identify precious and semi-precious stones, spot synthetics and simulants, and grade quality.",
    desc: "Learn practical gem identification with professional gemmological tools.",
    learn: [
      "Precious vs semi-precious stones",
      "Natural, synthetic & simulant identification",
      "Using loupe, refractometer & other tools",
      "Quality grading basics"
    ],
    forWho: "Jewellers, ornament makers and appraisers.",
    format: "Lab",
    duration: null,
    fee: null
  },
  {
    id: "polishing",
    cat: "gems",
    catLabel: "Gems & Finishing",
    icon: "✨",
    title: "Jewellery Cleaning & Polishing",
    short: "Professional cleaning, polishing and finishing — a skill every showroom and workshop needs.",
    desc: "Short, practical training to give jewellery a flawless showroom finish.",
    learn: [
      "Ultrasonic & steam cleaning",
      "Buffing and mirror polishing",
      "Matte, sand-blast & textured finishes",
      "Care for stone-set jewellery"
    ],
    forWho: "Craftsmen, showroom staff and self-employed professionals.",
    format: "Hands-on workshop",
    duration: null,
    fee: null
  }
];
