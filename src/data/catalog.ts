export const BRAND_NAME = "SAINTV STUDIOS";
export const LINE_A = "SAINTV";
export const LINE_B = "ATELIER";

export type GarmentCategory = "JACKETS" | "TOPS" | "BOTTOMS" | "ACCESSORIES";
export type GarmentSize = "S" | "M" | "L" | "XL" | "OS";
export type ArchiveFilter = "all" | typeof LINE_A | typeof LINE_B | GarmentCategory;
export type SortMode = "featured" | "low" | "high";

export interface SwatchOption {
  hex: string;
  name: string;
  filterStyle?: string;
}

export interface GarmentProduct {
  id: string;
  sku: string;
  brand: string;
  brandLabel: string;
  name: string;
  category: GarmentCategory;
  price: number;
  compareAt: number | null;
  badge: string;
  scarcity: string;
  swatches: string[];
  swatchDetails: SwatchOption[];
  image: string;
  hoverImage: string;
  fabricWeight: string;
  composition: string;
  washProcess: string;
  fitProfile: string;
  description: string;
  availableSizes: GarmentSize[];
}

export interface CartEntry {
  item: GarmentProduct;
  size: GarmentSize;
  qty: number;
}

export interface LookItem {
  code: string;
  title: string;
  img: string;
  productId: string;
}

export const RAIL_FEATURED_IDS: readonly string[] = [
  "washed-black-zip-jacket",
  "olive-waxed-trench-coat",
  "bone-thermal-waffle-longsleeve",
  "tactical-nylon-cargo-pants",
  "crimson-washed-boxy-tee",
  "washed-stand-collar-leather-jacket",
  "charcoal-pleated-wide-trousers",
  "waxed-canvas-messenger-bag",
];

export const MARQUEE_PHRASES: readonly string[] = [
  "SAINTV STUDIOS × ATELIER",
  "FROM CAIRO STREETS TO THE WORLD",
  "GIZA TOLERATES NO WEAKNESS",
  "SAINTV WASHED COLLECTION LIVE",
  "DROP THE SHOP · ONE NINETY, NEW CAIRO",
  "FREE SHIPPING ON PREPAID ORDERS",
];

export const PROMOS: readonly string[] = [
  "SAINTV STUDIOS — GIZA TOLERATES NO WEAKNESS — WASHED COLLECTION LIVE",
  "FREE SHIPPING FOR PREPAID ORDERS · CASH ON DELIVERY AVAILABLE",
  "10% OFF FOR ORDERS OVER 2,999 EGP · CODE: CAIRO26",
  "POP-UP ARCHIVE: DROP THE SHOP, ONE NINETY, NEW CAIRO",
];

export const computeBadge = (
  price: number,
  compareAt: number | null,
  defaultLabel: string
): string =>
  compareAt && compareAt > price
    ? `SAVE ${Math.round(((compareAt - price) / compareAt) * 100)}%`
    : defaultLabel;

export const formatEGP = (amount: number): string =>
  `LE ${amount.toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} EGP`;

const ASSET_BASE = "/assets/products/";
const IMAGE_BASE = "/images/";

export const CATALOG: GarmentProduct[] = [
  {
    id: "washed-black-zip-jacket",
    sku: "SV2-DM-01",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "BLACK WASHED FULL-ZIP WORK JACKET",
    category: "JACKETS",
    price: 1499,
    compareAt: null,
    badge: computeBadge(1499, null, "NEW"),
    scarcity: "Only 4 left",
    swatches: ["#0b0b0c", "#3a3a3c"],
    swatchDetails: [
      { hex: "#0b0b0c", name: "Washed Obsidian", filterStyle: "none" },
      {
        hex: "#3a3a3c",
        name: "Weathered Graphite",
        filterStyle: "brightness(1.14) contrast(0.92)",
      },
    ],
    image: `${IMAGE_BASE}washed_black_zip_jacket_1795380641700.jpg`,
    hoverImage: `${ASSET_BASE}washed-black-zip-jacket-back.webp`,
    fabricWeight: "440 GSM Heavy Twill",
    composition: "100% Combed Egyptian Cotton Canvas",
    washProcess: "Enzyme Stone-Wash & Seam Fade",
    fitProfile: "Boxy Cropped Workwear Silhouette",
    description:
      "Architectural boxy work jacket cut from heavy cotton twill, finished with a two-way antique silver zip, dual snap chest pockets, and natural seam whiskering.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "canvas-utility-work-jacket",
    sku: "SV2-AT-02",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "HEAVYWEIGHT BLACK CANVAS WORK JACKET",
    category: "JACKETS",
    price: 2499,
    compareAt: null,
    badge: computeBadge(2499, null, "NEW"),
    scarcity: "Few Left · 7 in S",
    swatches: ["#050607", "#1d2226"],
    swatchDetails: [
      { hex: "#050607", name: "Pitch Duck Black", filterStyle: "none" },
      {
        hex: "#1d2226",
        name: "Midnight Slate",
        filterStyle: "hue-rotate(195deg) saturate(1.25) brightness(1.06)",
      },
    ],
    image: `${IMAGE_BASE}canvas_utility_work_jacket_1795380639705.jpg`,
    hoverImage: `${ASSET_BASE}canvas-utility-work-jacket-back.webp`,
    fabricWeight: "14 oz Duck Canvas",
    composition: "100% Structured Ring-Spun Cotton",
    washProcess: "Garment-Dyed Matte Carbon",
    fitProfile: "Structured Relaxed Utility Cut",
    description:
      "Four-pocket utility field jacket engineered from dense 14 oz duck canvas with triple-needle felled seams, concealed placket, and matte gunmetal snap closures.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "raw-seam-washed-jacket",
    sku: "SV2-DM-03",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "CHARCOAL RAW-SEAM WASHED DENIM JACKET",
    category: "JACKETS",
    price: 1499,
    compareAt: 1799,
    badge: computeBadge(1499, 1799, "SALE"),
    scarcity: "Selling Fast",
    swatches: ["#2d2c2a", "#000000", "#76736e"],
    swatchDetails: [
      { hex: "#2d2c2a", name: "Acid Charcoal", filterStyle: "none" },
      {
        hex: "#000000",
        name: "Overdyed Jet",
        filterStyle: "brightness(0.84) contrast(1.12)",
      },
      {
        hex: "#76736e",
        name: "Ash Mineral",
        filterStyle: "brightness(1.18) contrast(0.9)",
      },
    ],
    image: `${IMAGE_BASE}raw_seam_washed_jacket_1795380641609.jpg`,
    hoverImage: `${ASSET_BASE}raw-seam-washed-jacket-back.webp`,
    fabricWeight: "14.5 oz Selvedge Twill",
    composition: "100% Rigid Cotton Denim",
    washProcess: "Mineral Acid-Wash & Hand-Frayed Seams",
    fitProfile: "Boxy Dropped-Shoulder Trucker",
    description:
      "Deconstructed trucker jacket showcasing exposed outward raw-edge seams across the chest, sleeves, and hem, washed down to a nuanced charcoal patina.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "padded-collar-bomber-jacket",
    sku: "SV2-AT-04",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "OVERSIZED COLLAR PADDED BOMBER JACKET",
    category: "JACKETS",
    price: 2899,
    compareAt: null,
    badge: computeBadge(2899, null, "LIMITED"),
    scarcity: "Only 3 left",
    swatches: ["#141517", "#5a1818"],
    swatchDetails: [
      { hex: "#141517", name: "Matte Onyx", filterStyle: "none" },
      {
        hex: "#5a1818",
        name: "Oxblood Noir",
        filterStyle: "sepia(0.35) hue-rotate(-38deg) saturate(1.85) brightness(0.94)",
      },
    ],
    image: `${IMAGE_BASE}padded_collar_bomber_jacket_1795380644376.jpg`,
    hoverImage: `${ASSET_BASE}padded-collar-bomber-jacket-back.webp`,
    fabricWeight: "380 GSM Insulated Ripstop",
    composition: "72% Matte Nylon, 28% Cotton · Thermal Fill",
    washProcess: "Water-Repellent Peached Finish",
    fitProfile: "Voluminous Cropped Puffer Cut",
    description:
      "Sculptural high-loft bomber built with an architectural oversized funnel collar, wide baffle channels, heavy matte two-way zip, and dense ribbed cuffs.",
    availableSizes: ["S", "M", "L"],
  },
  {
    id: "washed-black-barrel-jeans",
    sku: "SV2-DM-05",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "BLACK WASHED BARREL-FIT OVERSIZED JEANS",
    category: "BOTTOMS",
    price: 1399,
    compareAt: null,
    badge: computeBadge(1399, null, "NEW"),
    scarcity: "In Stock",
    swatches: ["#141414", "#4a3b31"],
    swatchDetails: [
      { hex: "#141414", name: "Smoked Carbon", filterStyle: "none" },
      {
        hex: "#4a3b31",
        name: "Mud-Tinted Charcoal",
        filterStyle: "sepia(0.28) brightness(0.98) contrast(1.04)",
      },
    ],
    image: `${IMAGE_BASE}washed_black_barrel_jeans_1795380642089.jpg`,
    hoverImage: `${ASSET_BASE}washed-black-barrel-jeans-back.webp`,
    fabricWeight: "15 oz Heavy Slub Denim",
    composition: "100% Unsanforized Cotton Denim",
    washProcess: "Hand-Sanded Whisker & Charcoal Dip",
    fitProfile: "Wide Architectural Barrel-Leg",
    description:
      "Curved-seam barrel-leg trousers cut with dramatic thigh volume that tapers subtly at the hem, creating a structured stacked drape over boots or sneakers.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "heavyweight-black-pullover-hoodie",
    sku: "SV2-AT-06",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "HEAVYWEIGHT BOXY BLACK PULLOVER HOODIE",
    category: "TOPS",
    price: 1799,
    compareAt: null,
    badge: computeBadge(1799, null, "NEW"),
    scarcity: "Few Left",
    swatches: ["#040404", "#6e7073"],
    swatchDetails: [
      { hex: "#040404", name: "Void Black", filterStyle: "none" },
      {
        hex: "#6e7073",
        name: "Concrete Ash",
        filterStyle: "brightness(1.24) contrast(0.88)",
      },
    ],
    image: `${IMAGE_BASE}heavyweight_black_pullover_hoodie_1795380640121.jpg`,
    hoverImage: `${ASSET_BASE}heavyweight-black-pullover-hoodie-back.webp`,
    fabricWeight: "520 GSM Brushed Fleece",
    composition: "100% Heavyweight Egyptian Cotton",
    washProcess: "Pre-Shrunk Matte Carbon Dye",
    fitProfile: "Boxy Dropped-Shoulder Cut",
    description:
      "Flagship 520 GSM hoodie featuring a self-standing double-lined crossover hood without drawstrings, articulated dropped shoulders, and deep 2x2 rib trims.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "washed-stand-collar-leather-jacket",
    sku: "SV2-DM-07",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "WASHED STAND-COLLAR MOTO LEATHER JACKET",
    category: "JACKETS",
    price: 1999,
    compareAt: 2299,
    badge: computeBadge(1999, 2299, "SALE"),
    scarcity: "Only 2 left",
    swatches: ["#1c1b1a", "#000000"],
    swatchDetails: [
      { hex: "#1c1b1a", name: "Distressed Umber Black", filterStyle: "none" },
      {
        hex: "#000000",
        name: "Jet Calfskin",
        filterStyle: "saturate(0.25) brightness(0.86) contrast(1.12)",
      },
    ],
    image: `${IMAGE_BASE}washed_stand_collar_leather_jacket_1795380641764.jpg`,
    hoverImage: `${ASSET_BASE}washed-stand-collar-leather-jacket-back.webp`,
    fabricWeight: "1.2mm Full-Grain Hide",
    composition: "100% Drum-Dyed Leather · Viscose Lining",
    washProcess: "Tumble-Washed Vintage Patina",
    fitProfile: "Tailored Moto Silhouette",
    description:
      "Café-racer moto silhouette crafted from supple tumbled leather with ribbed elbow articulation, brushed steel zip hardware, and a single-snap stand collar.",
    availableSizes: ["M", "L"],
  },
  {
    id: "faded-charcoal-drop-shoulder-hoodie",
    sku: "SV2-AT-08",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "FADED CHARCOAL DROP-SHOULDER FLEECE HOODIE",
    category: "TOPS",
    price: 1799,
    compareAt: null,
    badge: computeBadge(1799, null, "NEW"),
    scarcity: "Selling Fast",
    swatches: ["#121316", "#020303"],
    swatchDetails: [
      { hex: "#121316", name: "Sun-Faded Charcoal", filterStyle: "none" },
      {
        hex: "#020303",
        name: "Deep Coal",
        filterStyle: "brightness(0.76) contrast(1.14)",
      },
    ],
    image: `${IMAGE_BASE}faded_charcoal_drop_shoulder_hoodie_1795380642213.jpg`,
    hoverImage: `${ASSET_BASE}faded-charcoal-drop-shoulder-hoodie-back.webp`,
    fabricWeight: "490 GSM Loopback Fleece",
    composition: "100% Organic Cotton",
    washProcess: "Pigment Sun-Fade & Micro-Abrasion",
    fitProfile: "Oversized Drop-Shoulder",
    description:
      "Pigment-dyed fleece hoodie washed in small batches for tonal high-low highlights along every coverstitch seam, complete with subtle hood-edge distressing.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "washed-ribbed-knit-crewneck",
    sku: "SV2-DM-09",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "WASHED CHARCOAL RIBBED KNIT CREWNECK SWEATER",
    category: "TOPS",
    price: 1399,
    compareAt: null,
    badge: computeBadge(1399, null, "LIMITED"),
    scarcity: "Only 5 left",
    swatches: ["#333230", "#080808"],
    swatchDetails: [
      { hex: "#333230", name: "Washed Slate Knit", filterStyle: "none" },
      {
        hex: "#080808",
        name: "Obsidian Yarn",
        filterStyle: "brightness(0.78) contrast(1.12)",
      },
    ],
    image: `${IMAGE_BASE}washed_ribbed_knit_crewneck_1795380642062.jpg`,
    hoverImage: `${ASSET_BASE}washed-ribbed-knit-crewneck-back.webp`,
    fabricWeight: "5-Gauge Heavy Knit",
    composition: "85% Cotton, 15% Brushed Wool",
    washProcess: "Cold-Enzyme Softening & Raw Trim",
    fitProfile: "Relaxed Heavy Drape",
    description:
      "Deep fisherman-rib crewneck knitted on 5-gauge flatbed looms with intentional micro-frayed edge distressing across the collar, cuffs, and hem.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "distressed-black-terry-crewneck",
    sku: "SV2-AT-10",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "DISTRESSED BLACK FRENCH TERRY CREWNECK",
    category: "TOPS",
    price: 1499,
    compareAt: null,
    badge: computeBadge(1499, null, "LIMITED"),
    scarcity: "Few Left",
    swatches: ["#030405"],
    swatchDetails: [
      { hex: "#030405", name: "Grind-Washed Black", filterStyle: "none" },
    ],
    image: `${IMAGE_BASE}distressed_black_terry_crewneck_1795380641382.jpg`,
    hoverImage: `${ASSET_BASE}distressed-black-terry-crewneck-back.webp`,
    fabricWeight: "480 GSM Unbrushed Terry",
    composition: "100% Heavyweight Egyptian Cotton",
    washProcess: "Carbon Pigment & Edge Grinding",
    fitProfile: "Wide Architectural Boxy Fit",
    description:
      "Substantial unbrushed French terry sweatshirt featuring a wide mock-rib collar and understated hand-ground distressing along shoulder and cuff bindings.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "washed-striped-longsleeve-tee",
    sku: "SV2-DM-11",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "WASHED STRIPED BLACK & GREY LONGSLEEVE TEE",
    category: "TOPS",
    price: 899,
    compareAt: 1099,
    badge: computeBadge(899, 1099, "SALE"),
    scarcity: "In Stock",
    swatches: ["#262626", "#d8d8d8"],
    swatchDetails: [
      { hex: "#262626", name: "Charcoal / Heather Ash", filterStyle: "none" },
      {
        hex: "#d8d8d8",
        name: "Inverted Chalk Stripe",
        filterStyle: "brightness(1.1) contrast(1.08)",
      },
    ],
    image: `${IMAGE_BASE}washed_striped_longsleeve_tee_1795380640604.jpg`,
    hoverImage: `${ASSET_BASE}washed-striped-longsleeve-tee-back.webp`,
    fabricWeight: "310 GSM Yarn-Dyed Jersey",
    composition: "100% Open-End Combed Cotton",
    washProcess: "Vintage Silicon Enzyme Wash",
    fitProfile: "Relaxed Boxy Longsleeve",
    description:
      "Heavyweight yarn-dyed horizontal stripe jersey built with a thick 3cm mock-ribbed collar, dropped shoulders, and dry vintage hand-feel.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "crimson-washed-boxy-tee",
    sku: "SV2-AT-12",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "CRIMSON WASHED HEAVYWEIGHT BOXY T-SHIRT",
    category: "TOPS",
    price: 639,
    compareAt: 799,
    badge: computeBadge(639, 799, "SALE"),
    scarcity: "Few Left",
    swatches: ["#b3121b", "#050505", "#8a8c8f"],
    swatchDetails: [
      { hex: "#b3121b", name: "Oxblood Crimson", filterStyle: "none" },
      {
        hex: "#050505",
        name: "Washed Pitch",
        filterStyle: "saturate(0.05) brightness(0.68) contrast(1.2)",
      },
      {
        hex: "#8a8c8f",
        name: "Cement Mist",
        filterStyle: "saturate(0.06) brightness(1.18) contrast(0.88)",
      },
    ],
    image: `${IMAGE_BASE}crimson_washed_boxy_tee_1795380645755.jpg`,
    hoverImage: `${ASSET_BASE}crimson-washed-boxy-tee-back.webp`,
    fabricWeight: "320 GSM Heavy Jersey",
    composition: "100% Carded Egyptian Cotton",
    washProcess: "Oxblood Pigment-Dye & Sun-Wash",
    fitProfile: "Cropped Wide Boxy Tee",
    description:
      "Statement pigment-dyed oxblood tee cut from dry-hand 320 GSM jersey that drapes off the shoulder with a thick collar rib and tonal washed seam highs.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "olive-waxed-trench-coat",
    sku: "SV2-AT-13",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "DARK OLIVE WAXED COTTON ARCHITECTURAL OVERCOAT",
    category: "JACKETS",
    price: 3499,
    compareAt: null,
    badge: computeBadge(3499, null, "LIMITED"),
    scarcity: "Only 2 left",
    swatches: ["#34392f", "#141517"],
    swatchDetails: [
      { hex: "#34392f", name: "Dry-Waxed Moss", filterStyle: "none" },
      {
        hex: "#141517",
        name: "Waxed Pitch",
        filterStyle: "saturate(0.15) brightness(0.84) contrast(1.1)",
      },
    ],
    image: `${IMAGE_BASE}olive_waxed_trench_coat_1795389830191.jpg`,
    hoverImage: `${ASSET_BASE}padded-collar-bomber-jacket-front.webp`,
    fabricWeight: "11 oz Dry-Waxed Cotton",
    composition: "100% Scottish-Finish Waxed Cotton · Bemberg Lining",
    washProcess: "Dry-Wax Weatherproof Coating",
    fitProfile: "Oversized Mid-Length Raglan Trench",
    description:
      "Storm-flap overcoat cut with sweeping raglan sleeves, throat latch, oversized bellows hip pockets, and buckled strap cuffs in dry-waxed olive cotton.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "tactical-nylon-cargo-pants",
    sku: "SV2-AT-14",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "MATTE BLACK PARACHUTE UTILITY CARGO PANTS",
    category: "BOTTOMS",
    price: 1699,
    compareAt: null,
    badge: computeBadge(1699, null, "NEW"),
    scarcity: "Selling Fast",
    swatches: ["#0d0e10", "#3a3d38"],
    swatchDetails: [
      { hex: "#0d0e10", name: "Tactical Pitch", filterStyle: "none" },
      {
        hex: "#3a3d38",
        name: "Field Olive Slate",
        filterStyle: "sepia(0.18) hue-rotate(42deg) brightness(1.08)",
      },
    ],
    image: `${IMAGE_BASE}tactical_nylon_cargo_pants_1795389829679.jpg`,
    hoverImage: `${ASSET_BASE}washed-black-barrel-jeans-front.webp`,
    fabricWeight: "260 GSM Technical Cotton-Nylon",
    composition: "65% Cotton, 35% Matte Ripstop Nylon",
    washProcess: "Water-Repellent Matte Enzyme Finish",
    fitProfile: "Wide Articulated Parachute Leg",
    description:
      "Engineered wide-leg cargo trousers with 3D gusseted thigh pockets, articulated double-tuck knees, D-ring belt loop hardware, and bungee cord-lock hems.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "bone-thermal-waffle-longsleeve",
    sku: "SV2-DM-15",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "ASH BONE DISTRESSED WAFFLE THERMAL LONGSLEEVE",
    category: "TOPS",
    price: 949,
    compareAt: 1149,
    badge: computeBadge(949, 1149, "SALE"),
    scarcity: "In Stock",
    swatches: ["#d7d2c6", "#54524e"],
    swatchDetails: [
      { hex: "#d7d2c6", name: "Sun-Faded Ash Bone", filterStyle: "none" },
      {
        hex: "#54524e",
        name: "Washed Concrete",
        filterStyle: "brightness(0.68) contrast(1.08)",
      },
    ],
    image: `${IMAGE_BASE}bone_thermal_waffle_longsleeve_1795389830098.jpg`,
    hoverImage: `${ASSET_BASE}washed-striped-longsleeve-tee-front.webp`,
    fabricWeight: "390 GSM Heavy Waffle Knit",
    composition: "100% Combed Egyptian Thermal Cotton",
    washProcess: "Vintage Stone-Wash & Cuff Grinding",
    fitProfile: "Relaxed Dropped-Shoulder Layer",
    description:
      "Deep-honeycomb thermal longsleeve constructed with exposed reverse flatlock seams, wide boxy sleeves, and subtle hand-distressed cuff edges.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "utility-padded-work-vest",
    sku: "SV2-DM-16",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "WASHED CHARCOAL QUILTED UTILITY PUFFER VEST",
    category: "JACKETS",
    price: 1899,
    compareAt: null,
    badge: computeBadge(1899, null, "NEW"),
    scarcity: "Only 4 left",
    swatches: ["#232528", "#0a0a0c"],
    swatchDetails: [
      { hex: "#232528", name: "Washed Graphite", filterStyle: "none" },
      {
        hex: "#0a0a0c",
        name: "Jet Obsidian",
        filterStyle: "brightness(0.82) contrast(1.14)",
      },
    ],
    image: `${IMAGE_BASE}utility_padded_work_vest_1795389829187.jpg`,
    hoverImage: `${ASSET_BASE}washed-black-zip-jacket-front.webp`,
    fabricWeight: "360 GSM Insulated Peached Shell",
    composition: "70% Cotton, 30% Nylon · Recycled Thermal Loft",
    washProcess: "Garment-Washed Matte Charcoal",
    fitProfile: "Boxy Layering Gilet",
    description:
      "Sleeveless architectural utility vest built to layer cleanly over heavyweight hoodies, featuring dual snap cargo pockets, storm placket, and mock funnel collar.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "charcoal-pleated-wide-trousers",
    sku: "SV2-DM-17",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "CHARCOAL DOUBLE-PLEAT WIDE TAILORED TROUSERS",
    category: "BOTTOMS",
    price: 1599,
    compareAt: 1899,
    badge: computeBadge(1599, 1899, "SALE"),
    scarcity: "Few Left",
    swatches: ["#35373c", "#101114"],
    swatchDetails: [
      { hex: "#35373c", name: "Slate Worsted", filterStyle: "none" },
      {
        hex: "#101114",
        name: "Noir Suiting",
        filterStyle: "brightness(0.75) contrast(1.14)",
      },
    ],
    image: `${IMAGE_BASE}charcoal_pleated_wide_trousers_1795389829250.jpg`,
    hoverImage: `${ASSET_BASE}raw-seam-washed-jacket-front.webp`,
    fabricWeight: "340 GSM Worsted Twill",
    composition: "60% Virgin Wool, 40% Structured Viscose",
    washProcess: "Pressed Matte Steam Finish",
    fitProfile: "Full-Length Wide Architectural Drape",
    description:
      "Sharp double-pleated suiting trousers cut with an extended waistband tab and fluid wide-leg volume that breaks cleanly over heavy footwear.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "washed-slate-fleece-shorts",
    sku: "SV2-AT-18",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "HEAVYWEIGHT WASHED SLATE RAW-HEM SWEATSHORTS",
    category: "BOTTOMS",
    price: 849,
    compareAt: null,
    badge: computeBadge(849, null, "NEW"),
    scarcity: "In Stock",
    swatches: ["#3d4044", "#0d0e10"],
    swatchDetails: [
      { hex: "#3d4044", name: "Enzyme Slate", filterStyle: "none" },
      {
        hex: "#0d0e10",
        name: "Carbon Black",
        filterStyle: "brightness(0.74) contrast(1.16)",
      },
    ],
    image: `${IMAGE_BASE}washed_slate_fleece_shorts_1795389829914.jpg`,
    hoverImage: `${ASSET_BASE}distressed-black-terry-crewneck-front.webp`,
    fabricWeight: "500 GSM Loopback Terry",
    composition: "100% Heavyweight Egyptian Cotton",
    washProcess: "Enzyme Stone-Wash & Raw Edge Roll",
    fitProfile: "Below-Knee Wide Boxy Cut",
    description:
      "Heavy 500 GSM sweatshorts designed with a wide triple-channel waistband, elongated metal-tipped cotton drawcords, and naturally rolling raw hems.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "waxed-canvas-messenger-bag",
    sku: "SV2-AT-19",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "WAXED BLACK CANVAS ARCHITECTURAL CROSSBODY BAG",
    category: "ACCESSORIES",
    price: 1299,
    compareAt: null,
    badge: computeBadge(1299, null, "LIMITED"),
    scarcity: "Only 5 left",
    swatches: ["#141518", "#353832"],
    swatchDetails: [
      { hex: "#141518", name: "Waxed Carbon", filterStyle: "none" },
      {
        hex: "#353832",
        name: "Waxed Olive",
        filterStyle: "sepia(0.22) hue-rotate(48deg) brightness(1.06)",
      },
    ],
    image: `${IMAGE_BASE}waxed_canvas_messenger_bag_1795389829713.jpg`,
    hoverImage: `${ASSET_BASE}canvas-utility-work-jacket-front.webp`,
    fabricWeight: "16 oz Waxed Duck Canvas",
    composition: "100% Waxed Cotton · Brushed Steel Buckles",
    washProcess: "Hand-Waxed Weatherproof Patina",
    fitProfile: "One Size · Adjustable Padded Strap (16L)",
    description:
      "Daily studio courier bag crafted from heavy 16 oz waxed duck canvas with dual zippered utility front pockets, brushed steel quick-release buckles, and 16-inch laptop sleeve.",
    availableSizes: ["OS"],
  },
  {
    id: "chunky-ribbed-wool-beanie",
    sku: "SV2-DM-20",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "DISTRESSED CHARCOAL FISHERMAN RIBBED BEANIE",
    category: "ACCESSORIES",
    price: 499,
    compareAt: 649,
    badge: computeBadge(499, 649, "SALE"),
    scarcity: "In Stock",
    swatches: ["#26272a", "#08080a"],
    swatchDetails: [
      { hex: "#26272a", name: "Washed Charcoal", filterStyle: "none" },
      {
        hex: "#08080a",
        name: "Obsidian Knit",
        filterStyle: "brightness(0.76) contrast(1.14)",
      },
    ],
    image: `${IMAGE_BASE}chunky_ribbed_wool_beanie_1795389829323.jpg`,
    hoverImage: `${ASSET_BASE}washed-ribbed-knit-crewneck-front.webp`,
    fabricWeight: "5-Gauge Heavy Fisherman Rib",
    composition: "80% Merino-Cotton Blend, 20% Nylon Core",
    washProcess: "Enzyme Softening & Subtle Cuff Distress",
    fitProfile: "One Size · Deep Fold-Over Watch Cap",
    description:
      "Sculptural heavyweight fisherman-ribbed watch cap knitted to hold structured crown volume, finished with understated hand-worn distressing along the folded cuff.",
    availableSizes: ["OS"],
  },
];

export const HERO_LINEUP_IDS: readonly string[] = [
  "washed-black-zip-jacket",
  "raw-seam-washed-jacket",
  "padded-collar-bomber-jacket",
  "canvas-utility-work-jacket",
];

export const LOOKS: readonly LookItem[] = [
  {
    code: "LOOK 01 // STUDIO EDIT",
    title: "CHARCOAL KNIT + WIDE DENIM",
    img: `${ASSET_BASE}washed-black-zip-jacket-back.webp`,
    productId: "washed-black-zip-jacket",
  },
  {
    code: "LOOK 02 // UTILITY ROTATION",
    title: "BOXY BLACK TEE + BAGGY DENIM",
    img: `${ASSET_BASE}canvas-utility-work-jacket-back.webp`,
    productId: "canvas-utility-work-jacket",
  },
  {
    code: "LOOK 03 // CONCRETE LINEUP",
    title: "RIBBED KNIT + BARREL DENIM",
    img: `${ASSET_BASE}raw-seam-washed-jacket-back.webp`,
    productId: "raw-seam-washed-jacket",
  },
  {
    code: "LOOK 04 // NIGHT ARCHIVE",
    title: "OLIVE RAGLAN + CORDUROY TROUSER",
    img: `${ASSET_BASE}padded-collar-bomber-jacket-back.webp`,
    productId: "padded-collar-bomber-jacket",
  },
];
