export const BRAND_NAME = "SAINTV STUDIOS";
export const LINE_A = "SAINTV";
export const LINE_B = "ATELIER";

export type GarmentCategory = "KNITWEAR" | "TOPS" | "BOTTOMS" | "SETS";
export type GarmentSize = "S" | "M" | "L" | "XL" | "OS";
export type ArchiveFilter =
  | "all"
  | typeof LINE_A
  | typeof LINE_B
  | GarmentCategory;
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
  stockQty?: number;
  featuredRank?: number;
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
  "raw-seam-washed-jacket",
  "padded-collar-bomber-jacket",
  "washed-black-barrel-jeans",
  "heavyweight-black-pullover-hoodie",
  "faded-charcoal-drop-shoulder-hoodie",
  "crimson-washed-boxy-tee",
  "tactical-nylon-cargo-pants",
];

export const MARQUEE_PHRASES: readonly string[] = [
  "SAINTV STUDIOS × ATELIER",
  "GIZA TOLERATES NO WEAKNESS",
  "FROM GIZA STREETS TO THE WORLD",
  "SAINTV WASHED COLLECTION LIVE",
  "DROP THE SHOP · GIZA UNDERGROUND ARCHIVE",
  "FREE SHIPPING ON PREPAID ORDERS",
];

export const PROMOS: readonly string[] = [
  "SAINTV STUDIOS — GIZA TOLERATES NO WEAKNESS — WASHED COLLECTION LIVE",
  "FREE SHIPPING FOR PREPAID ORDERS · CASH ON DELIVERY AVAILABLE",
  "10% OFF FOR ORDERS OVER 2,999 EGP · CODE: GIZA26",
  "POP-UP ARCHIVE: DROP THE SHOP, GIZA UNDERGROUND",
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
  `LE ${Math.round(amount).toLocaleString("en-US")} EGP`;

const ASSET_BASE = "/assets/products/";
const IMAGE_BASE = "/images/";

export const CATALOG: GarmentProduct[] = [
  {
    id: "washed-black-zip-jacket",
    sku: "SV2-KN-01",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "CHARCOAL BRUSHED WOOL-BLEND KNIT CREWNECK",
    category: "KNITWEAR",
    price: 1699,
    compareAt: null,
    badge: computeBadge(1699, null, "NEW"),
    scarcity: "Only 4 left",
    swatches: ["#52555a", "#26282b"],
    swatchDetails: [
      { hex: "#52555a", name: "Brushed Charcoal", filterStyle: "none" },
      {
        hex: "#26282b",
        name: "Deep Graphite",
        filterStyle: "brightness(0.76) contrast(1.12)",
      },
    ],
    image: `${IMAGE_BASE}washed_black_zip_jacket_1795380641700.jpg`,
    hoverImage: `${ASSET_BASE}washed-black-zip-jacket-back.webp`,
    fabricWeight: "5-Gauge Brushed Knit",
    composition: "65% Brushed Wool, 35% Combed Cotton",
    washProcess: "Soft Brushed Melange Finish",
    fitProfile: "Boxy Raglan Cropped Sweater",
    description:
      "Heavyweight charcoal grey brushed knit crewneck finished with thick 2×2 ribbed collar, cuffs, and waist hem that sits cleanly over layered tees and wide denim.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "canvas-utility-work-jacket",
    sku: "SV2-ST-02",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "CHARCOAL KNIT & INDIGO WIDE DENIM STUDIO SET",
    category: "SETS",
    price: 2899,
    compareAt: 3199,
    badge: computeBadge(2899, 3199, "SALE"),
    scarcity: "Few Left · 7 in S",
    swatches: ["#52555a", "#4b6982"],
    swatchDetails: [
      { hex: "#52555a", name: "Charcoal / Vintage Indigo", filterStyle: "none" },
      {
        hex: "#4b6982",
        name: "Darker Wash Edition",
        filterStyle: "brightness(0.88) contrast(1.08)",
      },
    ],
    image: `${IMAGE_BASE}canvas_utility_work_jacket_1795380639705.jpg`,
    hoverImage: `${IMAGE_BASE}washed_black_zip_jacket_1795380641700.jpg`,
    fabricWeight: "5-Gauge Knit + 14.5 oz Denim",
    composition: "Wool-Cotton Knit Top · 100% Cotton Indigo Denim",
    washProcess: "Brushed Knit & Mid-Indigo Stone Wash",
    fitProfile: "Boxy Cropped Top + Baggy Full-Length Denim",
    description:
      "Complete two-piece Giza studio rotation pairing our brushed charcoal raglan crewneck with relaxed mid-indigo baggy jeans for an effortless head-to-toe proportion.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "raw-seam-washed-jacket",
    sku: "SV2-KN-03",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "ESPRESSO RIBBED HEAVYWEIGHT KNIT SWEATER",
    category: "KNITWEAR",
    price: 1599,
    compareAt: 1899,
    badge: computeBadge(1599, 1899, "SALE"),
    scarcity: "Selling Fast",
    swatches: ["#5c372a", "#2b1d17", "#7d5444"],
    swatchDetails: [
      { hex: "#5c372a", name: "Roasted Espresso", filterStyle: "none" },
      {
        hex: "#2b1d17",
        name: "Dark Cacao",
        filterStyle: "brightness(0.76) contrast(1.14)",
      },
      {
        hex: "#7d5444",
        name: "Sun-Faded Rust",
        filterStyle: "brightness(1.14) saturate(1.12)",
      },
    ],
    image: `${IMAGE_BASE}raw_seam_washed_jacket_1795380641609.jpg`,
    hoverImage: `${ASSET_BASE}raw-seam-washed-jacket-back.webp`,
    fabricWeight: "5-Gauge Vertical Rib Knit",
    composition: "85% Combed Egyptian Cotton, 15% Merino Wool",
    washProcess: "Garment-Dyed Enzyme Softening",
    fitProfile: "Dropped-Shoulder Boxy Ribbed Cut",
    description:
      "Deep espresso brown vertical-rib crewneck knitted with dropped shoulders, chunky mock-ribbed neckline, and wide tubular cuffs that hold architectural structure.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "padded-collar-bomber-jacket",
    sku: "SV2-KN-04",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "OLIVE CHUNKY FISHERMAN RAGLAN KNIT SWEATER",
    category: "KNITWEAR",
    price: 1899,
    compareAt: null,
    badge: computeBadge(1899, null, "LIMITED"),
    scarcity: "Only 3 left",
    swatches: ["#4d5d3b", "#2d3425"],
    swatchDetails: [
      { hex: "#4d5d3b", name: "Moss Olive", filterStyle: "none" },
      {
        hex: "#2d3425",
        name: "Deep Pine",
        filterStyle: "brightness(0.78) contrast(1.12)",
      },
    ],
    image: `${IMAGE_BASE}padded_collar_bomber_jacket_1795380644376.jpg`,
    hoverImage: `${ASSET_BASE}padded-collar-bomber-jacket-back.webp`,
    fabricWeight: "3-Gauge Heavy Fisherman Rib",
    composition: "75% Heavy Cotton Yarn, 25% Brushed Wool",
    washProcess: "Cold-Enzyme Softener Wash",
    fitProfile: "Voluminous Raglan-Sleeve Knit",
    description:
      "Tactile olive green fisherman-ribbed sweater engineered on 3-gauge looms with full-fashioned raglan shoulder seams, plush balloon sleeves, and dense ribbed trims.",
    availableSizes: ["S", "M", "L"],
  },
  {
    id: "washed-black-barrel-jeans",
    sku: "SV2-BT-05",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "WASHED CHARCOAL BARREL-LEG WIDE DENIM",
    category: "BOTTOMS",
    price: 1499,
    compareAt: null,
    badge: computeBadge(1499, null, "NEW"),
    scarcity: "In Stock",
    swatches: ["#595b5e", "#262729"],
    swatchDetails: [
      { hex: "#595b5e", name: "Stone-Washed Charcoal", filterStyle: "none" },
      {
        hex: "#262729",
        name: "Smoked Carbon",
        filterStyle: "brightness(0.72) contrast(1.16)",
      },
    ],
    image: `${IMAGE_BASE}washed_black_barrel_jeans_1795380642089.jpg`,
    hoverImage: `${ASSET_BASE}raw-seam-washed-jacket-back.webp`,
    fabricWeight: "15 oz Heavy Slub Denim",
    composition: "100% Rigid Ring-Spun Cotton Denim",
    washProcess: "Mineral Stone-Wash & Tonal Seam Fade",
    fitProfile: "Wide Architectural Barrel-Leg",
    description:
      "Five-pocket washed charcoal denim cut with generous hip and thigh room that arcs smoothly into a structured barrel leg with tonal contrast stitching.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "heavyweight-black-pullover-hoodie",
    sku: "SV2-TP-06",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "VOID BLACK HEAVYWEIGHT BOXY T-SHIRT",
    category: "TOPS",
    price: 799,
    compareAt: null,
    badge: computeBadge(799, null, "NEW"),
    scarcity: "Few Left",
    swatches: ["#0b0b0c", "#3a3c40"],
    swatchDetails: [
      { hex: "#0b0b0c", name: "Void Jet Black", filterStyle: "none" },
      {
        hex: "#3a3c40",
        name: "Sun-Faded Slate",
        filterStyle: "brightness(1.3) contrast(0.86)",
      },
    ],
    image: `${IMAGE_BASE}heavyweight_black_pullover_hoodie_1795380640121.jpg`,
    hoverImage: `${ASSET_BASE}canvas-utility-work-jacket-back.webp`,
    fabricWeight: "320 GSM Heavy Jersey",
    composition: "100% Combed Egyptian Cotton",
    washProcess: "Pre-Shrunk Matte Carbon Dye",
    fitProfile: "Oversized Dropped-Shoulder Boxy Tee",
    description:
      "Essential heavyweight pitch-black boxy tee featuring elbow-grazing wide sleeves, a thick 2.5cm stay-flat ribbed crew collar, and dry-hand 320 GSM cotton drape.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "washed-stand-collar-leather-jacket",
    sku: "SV2-ST-07",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "ESPRESSO KNIT & CHARCOAL BARREL DENIM FULL SET",
    category: "SETS",
    price: 2799,
    compareAt: 3199,
    badge: computeBadge(2799, 3199, "SALE"),
    scarcity: "Only 2 left",
    swatches: ["#5c372a", "#595b5e"],
    swatchDetails: [
      { hex: "#5c372a", name: "Espresso / Stone Charcoal", filterStyle: "none" },
      {
        hex: "#595b5e",
        name: "Deep Noir Tint",
        filterStyle: "brightness(0.84) contrast(1.1)",
      },
    ],
    image: `${IMAGE_BASE}washed_stand_collar_leather_jacket_1795380641764.jpg`,
    hoverImage: `${IMAGE_BASE}raw_seam_washed_jacket_1795380641609.jpg`,
    fabricWeight: "5-Gauge Knit + 15 oz Denim",
    composition: "Cotton-Merino Rib Knit · 100% Cotton Barrel Denim",
    washProcess: "Garment-Dyed Rib & Stone-Washed Charcoal",
    fitProfile: "Cropped Boxy Knit + Stacked Barrel Jeans",
    description:
      "Signature concrete-lineup pairing uniting our roasted espresso vertical-rib sweater with stone-washed charcoal barrel denim designed to stack over heavy footwear.",
    availableSizes: ["M", "L", "XL"],
  },
  {
    id: "faded-charcoal-drop-shoulder-hoodie",
    sku: "SV2-TP-08",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "HEATHER ASH HEAVYWEIGHT FLEECE CREWNECK",
    category: "TOPS",
    price: 1399,
    compareAt: null,
    badge: computeBadge(1399, null, "NEW"),
    scarcity: "Selling Fast",
    swatches: ["#b5b8bc", "#6e7176"],
    swatchDetails: [
      { hex: "#b5b8bc", name: "Heather Ash Grey", filterStyle: "none" },
      {
        hex: "#6e7176",
        name: "Concrete Slate",
        filterStyle: "brightness(0.76) contrast(1.12)",
      },
    ],
    image: `${IMAGE_BASE}faded_charcoal_drop_shoulder_hoodie_1795380642213.jpg`,
    hoverImage: `${ASSET_BASE}heavyweight-black-pullover-hoodie-back.webp`,
    fabricWeight: "500 GSM Brushed Fleece",
    composition: "100% Heavyweight Egyptian Cotton",
    washProcess: "Soft Melange Pre-Wash",
    fitProfile: "Oversized Dropped-Shoulder Crewneck",
    description:
      "Ultra-plush 500 GSM heather grey fleece sweatshirt cut with generous dropped shoulders, deep ribbed cuffs, and a clean collar engineered for layering over crisp white tees.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "washed-ribbed-knit-crewneck",
    sku: "SV2-ST-09",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "OLIVE RAGLAN KNIT & CORDUROY TROUSER FULL SET",
    category: "SETS",
    price: 3199,
    compareAt: null,
    badge: computeBadge(3199, null, "LIMITED"),
    scarcity: "Only 5 left",
    swatches: ["#4d5d3b", "#644b3c"],
    swatchDetails: [
      { hex: "#4d5d3b", name: "Moss Olive / Earth Corduroy", filterStyle: "none" },
      {
        hex: "#644b3c",
        name: "Deep Woodland",
        filterStyle: "brightness(0.84) contrast(1.1)",
      },
    ],
    image: `${IMAGE_BASE}washed_ribbed_knit_crewneck_1795380642062.jpg`,
    hoverImage: `${IMAGE_BASE}padded_collar_bomber_jacket_1795380644376.jpg`,
    fabricWeight: "3-Gauge Rib Knit + 12 oz Corduroy",
    composition: "Cotton-Wool Fisherman Knit · 100% Cotton 8-Wale Corduroy",
    washProcess: "Enzyme Softened Knit & Brushed Corduroy",
    fitProfile: "Relaxed Raglan Sweater + Wide-Leg Trouser",
    description:
      "Complete earthy autumn-winter look pairing our 3-gauge olive fisherman raglan knit with rich espresso-brown wide-wale corduroy trousers for textured volume.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "distressed-black-terry-crewneck",
    sku: "SV2-ST-10",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "PITCH BOXY TEE & ICE-WASH BAGGY DENIM SET",
    category: "SETS",
    price: 2199,
    compareAt: null,
    badge: computeBadge(2199, null, "LIMITED"),
    scarcity: "Few Left",
    swatches: ["#0b0b0c", "#8eb0ca"],
    swatchDetails: [
      { hex: "#0b0b0c", name: "Void Black / Ice Wash", filterStyle: "none" },
    ],
    image: `${IMAGE_BASE}distressed_black_terry_crewneck_1795380641382.jpg`,
    hoverImage: `${IMAGE_BASE}heavyweight_black_pullover_hoodie_1795380640121.jpg`,
    fabricWeight: "320 GSM Jersey + 14 oz Denim",
    composition: "100% Combed Egyptian Cotton",
    washProcess: "Matte Jet Dye & Ice-Bleach Stone Wash",
    fitProfile: "Wide Boxy Tee + Loose Skater-Fit Denim",
    description:
      "High-contrast street uniform combining our heavyweight pitch-black boxy T-shirt with ultra-relaxed ice-blue washed baggy jeans for clean daily rotation.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "washed-striped-longsleeve-tee",
    sku: "SV2-ST-11",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "ASH FLEECE CREWNECK & VINTAGE WASH DENIM SET",
    category: "SETS",
    price: 2599,
    compareAt: 2899,
    badge: computeBadge(2599, 2899, "SALE"),
    scarcity: "In Stock",
    swatches: ["#b5b8bc", "#6f8da3"],
    swatchDetails: [
      { hex: "#b5b8bc", name: "Heather Ash / Vintage Blue", filterStyle: "none" },
      {
        hex: "#6f8da3",
        name: "Cool Mist Tint",
        filterStyle: "brightness(1.06) contrast(1.04)",
      },
    ],
    image: `${IMAGE_BASE}washed_striped_longsleeve_tee_1795380640604.jpg`,
    hoverImage: `${IMAGE_BASE}faded_charcoal_drop_shoulder_hoodie_1795380642213.jpg`,
    fabricWeight: "500 GSM Fleece + 14.5 oz Denim",
    composition: "100% Egyptian Cotton Fleece & Rigid Cotton Denim",
    washProcess: "Soft Brushed Melange & Whiskered Vintage Wash",
    fitProfile: "Oversized Crewneck + Wide-Leg Vintage Jeans",
    description:
      "Relaxed studio uniform combining our heavyweight heather ash fleece crewneck with sun-faded vintage blue wide jeans that break cleanly over low-top sneakers.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "crimson-washed-boxy-tee",
    sku: "SV2-TP-12",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "OPTIC WHITE HEAVYWEIGHT BOXY T-SHIRT",
    category: "TOPS",
    price: 699,
    compareAt: 849,
    badge: computeBadge(699, 849, "SALE"),
    scarcity: "Few Left",
    swatches: ["#f5f5f3", "#c8c9cb", "#18181a"],
    swatchDetails: [
      { hex: "#f5f5f3", name: "Optic Chalk White", filterStyle: "none" },
      {
        hex: "#c8c9cb",
        name: "Concrete Mist",
        filterStyle: "brightness(0.9) contrast(1.02)",
      },
      {
        hex: "#18181a",
        name: "Washed Slate",
        filterStyle: "brightness(0.62) contrast(1.18)",
      },
    ],
    image: `${IMAGE_BASE}crimson_washed_boxy_tee_1795380645755.jpg`,
    hoverImage: `${ASSET_BASE}crimson-washed-boxy-tee-back.webp`,
    fabricWeight: "320 GSM Heavy Jersey",
    composition: "100% Carded Egyptian Cotton",
    washProcess: "Optic Enzyme Pre-Wash",
    fitProfile: "Wide Dropped-Shoulder Boxy Tee",
    description:
      "Crisp optic-white heavyweight T-shirt cut from opaque 320 GSM cotton jersey with a structured high-rib neckline, wide half sleeves, and clean boxy hem.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "olive-waxed-trench-coat",
    sku: "SV2-ST-13",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "OPTIC WHITE TEE & SAND-WASH BAGGY DENIM SET",
    category: "SETS",
    price: 2299,
    compareAt: null,
    badge: computeBadge(2299, null, "LIMITED"),
    scarcity: "Only 2 left",
    swatches: ["#f5f5f3", "#7d8885"],
    swatchDetails: [
      { hex: "#f5f5f3", name: "Optic White / Sand-Tint Denim", filterStyle: "none" },
      {
        hex: "#7d8885",
        name: "Muted Stone",
        filterStyle: "brightness(0.92) contrast(1.06)",
      },
    ],
    image: `${IMAGE_BASE}olive_waxed_trench_coat_1795389830191.jpg`,
    hoverImage: `${IMAGE_BASE}crimson_washed_boxy_tee_1795380645755.jpg`,
    fabricWeight: "320 GSM Jersey + 15 oz Denim",
    composition: "100% Heavyweight Egyptian Cotton",
    washProcess: "Optic Wash & Dirty-Sand Whisker Fade",
    fitProfile: "Boxy Tee + Extra-Wide Puddle-Hem Denim",
    description:
      "Head-to-toe warm-weather uniform pairing our opaque optic-white boxy tee with heavily whiskered sand-tinted wide-leg jeans engineered for dramatic floor drape.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "tactical-nylon-cargo-pants",
    sku: "SV2-BT-14",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "ESPRESSO WIDE-WALE CORDUROY TROUSERS",
    category: "BOTTOMS",
    price: 1699,
    compareAt: null,
    badge: computeBadge(1699, null, "NEW"),
    scarcity: "Selling Fast",
    swatches: ["#644b3c", "#3b2c23"],
    swatchDetails: [
      { hex: "#644b3c", name: "Earth Brown Corduroy", filterStyle: "none" },
      {
        hex: "#3b2c23",
        name: "Deep Espresso",
        filterStyle: "brightness(0.76) contrast(1.12)",
      },
    ],
    image: `${IMAGE_BASE}tactical_nylon_cargo_pants_1795389829679.jpg`,
    hoverImage: `${ASSET_BASE}padded-collar-bomber-jacket-back.webp`,
    fabricWeight: "12 oz 8-Wale Corduroy",
    composition: "100% Structured Combed Cotton Corduroy",
    washProcess: "Garment-Washed Velvet Softening",
    fitProfile: "Relaxed Full-Length Wide Trouser",
    description:
      "Heavy earth-brown wide-wale corduroy trousers cut with deep slant hip pockets, a clean zip fly, and fluid wide legs that pair naturally with chunky knitwear.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "bone-thermal-waffle-longsleeve",
    sku: "SV2-BT-15",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "SAND-WASHED WHISKERED WIDE-LEG DENIM",
    category: "BOTTOMS",
    price: 1599,
    compareAt: 1849,
    badge: computeBadge(1599, 1849, "SALE"),
    scarcity: "In Stock",
    swatches: ["#7d8885", "#4c5452"],
    swatchDetails: [
      { hex: "#7d8885", name: "Dirty Sand-Tint Indigo", filterStyle: "none" },
      {
        hex: "#4c5452",
        name: "Smoked Vintage Grey",
        filterStyle: "brightness(0.76) contrast(1.12)",
      },
    ],
    image: `${IMAGE_BASE}bone_thermal_waffle_longsleeve_1795389830098.jpg`,
    hoverImage: `${ASSET_BASE}crimson-washed-boxy-tee-back.webp`,
    fabricWeight: "15 oz Heavy Vintage Denim",
    composition: "100% Unsanforized Cotton Denim",
    washProcess: "Hand-Whiskered Dirty-Sand Overdye",
    fitProfile: "Extra-Wide Architectural Baggy Cut",
    description:
      "Statement vintage-fade denim featuring pronounced horizontal lap whiskering, dusty sand-tinted thigh highlights, and a sweeping wide-leg silhouette.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "utility-padded-work-vest",
    sku: "SV2-BT-16",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "MID-INDIGO RELAXED WIDE-LEG DENIM",
    category: "BOTTOMS",
    price: 1449,
    compareAt: null,
    badge: computeBadge(1449, null, "NEW"),
    scarcity: "Only 4 left",
    swatches: ["#4b6982", "#263747"],
    swatchDetails: [
      { hex: "#4b6982", name: "Mid-Indigo Stone Wash", filterStyle: "none" },
      {
        hex: "#263747",
        name: "Raw Deep Indigo",
        filterStyle: "brightness(0.76) contrast(1.14)",
      },
    ],
    image: `${IMAGE_BASE}utility_padded_work_vest_1795389829187.jpg`,
    hoverImage: `${ASSET_BASE}washed-black-zip-jacket-back.webp`,
    fabricWeight: "14.5 oz Ring-Spun Denim",
    composition: "100% Combed Egyptian Cotton",
    washProcess: "Classic Enzyme Stone-Wash",
    fitProfile: "Relaxed Mid-Rise Wide Jeans",
    description:
      "Everyday mid-indigo wide-leg jeans with classic five-pocket hardware, reinforced belt loops, and natural thigh fading built for daily styling with knits or tees.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "charcoal-pleated-wide-trousers",
    sku: "SV2-BT-17",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "VINTAGE FADED LIGHT-INDIGO BAGGY DENIM",
    category: "BOTTOMS",
    price: 1499,
    compareAt: 1749,
    badge: computeBadge(1499, 1749, "SALE"),
    scarcity: "Few Left",
    swatches: ["#7492a8", "#4e6475"],
    swatchDetails: [
      { hex: "#7492a8", name: "Sun-Faded Light Indigo", filterStyle: "none" },
      {
        hex: "#4e6475",
        name: "Weathered Slate Blue",
        filterStyle: "brightness(0.8) contrast(1.12)",
      },
    ],
    image: `${IMAGE_BASE}charcoal_pleated_wide_trousers_1795389829250.jpg`,
    hoverImage: `${ASSET_BASE}heavyweight-black-pullover-hoodie-back.webp`,
    fabricWeight: "14 oz Soft-Hand Denim",
    composition: "100% Ring-Spun Cotton Denim",
    washProcess: "Sun-Bleach & Soft Lap Whiskering",
    fitProfile: "Loose Straight-to-Wide Baggy Fit",
    description:
      "Softly faded light-indigo baggy jeans washed for a broken-in vintage handfeel, featuring subtle top-thigh whiskering and relaxed volume from waist to cuff.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "washed-slate-fleece-shorts",
    sku: "SV2-BT-18",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "ICE-WASH OVERSIZED SKATER DENIM",
    category: "BOTTOMS",
    price: 1449,
    compareAt: null,
    badge: computeBadge(1449, null, "NEW"),
    scarcity: "In Stock",
    swatches: ["#8eb0ca", "#6b8499"],
    swatchDetails: [
      { hex: "#8eb0ca", name: "Sky Ice-Wash Blue", filterStyle: "none" },
      {
        hex: "#6b8499",
        name: "Washed Glacier",
        filterStyle: "brightness(0.84) contrast(1.1)",
      },
    ],
    image: `${IMAGE_BASE}washed_slate_fleece_shorts_1795389829914.jpg`,
    hoverImage: `${ASSET_BASE}canvas-utility-work-jacket-back.webp`,
    fabricWeight: "13.5 oz Combed Cotton Denim",
    composition: "100% Heavyweight Cotton",
    washProcess: "Ice-Bleach Marble Enzyme Wash",
    fitProfile: "Ultra-Loose Oversized Skater Cut",
    description:
      "Light ice-blue marble-washed denim cut with a relaxed rise and wide flowing leg opening that drapes cleanly over white leather sneakers.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "waxed-canvas-messenger-bag",
    sku: "SV2-BT-19",
    brand: LINE_B,
    brandLabel: `${BRAND_NAME} · ${LINE_B}`,
    name: "CHARCOAL STACKED-HEM BARREL DENIM (BOOT CUT)",
    category: "BOTTOMS",
    price: 1549,
    compareAt: null,
    badge: computeBadge(1549, null, "LIMITED"),
    scarcity: "Only 5 left",
    swatches: ["#55575a", "#222326"],
    swatchDetails: [
      { hex: "#55575a", name: "Washed Concrete Grey", filterStyle: "none" },
      {
        hex: "#222326",
        name: "Pitch Carbon",
        filterStyle: "brightness(0.72) contrast(1.18)",
      },
    ],
    image: `${IMAGE_BASE}waxed_canvas_messenger_bag_1795389829713.jpg`,
    hoverImage: `${ASSET_BASE}raw-seam-washed-jacket-back.webp`,
    fabricWeight: "15 oz Heavy Slub Denim",
    composition: "100% Rigid Cotton Denim",
    washProcess: "Heavy Stone-Wash & Curved Seam Fade",
    fitProfile: "Curved Outseam Stacked Barrel Leg",
    description:
      "Architectural curved-seam barrel jeans engineered with extra inseam volume at the ankle so the stone-washed charcoal denim stacks cleanly over chunky leather boots.",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "chunky-ribbed-wool-beanie",
    sku: "SV2-BT-20",
    brand: LINE_A,
    brandLabel: `${BRAND_NAME} · ${LINE_A}`,
    name: "EARTH BROWN FULL-DRAPE WIDE CORDUROY TROUSERS",
    category: "BOTTOMS",
    price: 1649,
    compareAt: 1899,
    badge: computeBadge(1649, 1899, "SALE"),
    scarcity: "In Stock",
    swatches: ["#644b3c", "#3f2e24"],
    swatchDetails: [
      { hex: "#644b3c", name: "Roasted Umber Cord", filterStyle: "none" },
      {
        hex: "#3f2e24",
        name: "Dark Chestnut",
        filterStyle: "brightness(0.78) contrast(1.14)",
      },
    ],
    image: `${IMAGE_BASE}chunky_ribbed_wool_beanie_1795389829323.jpg`,
    hoverImage: `${ASSET_BASE}padded-collar-bomber-jacket-back.webp`,
    fabricWeight: "12 oz Heavy Cotton Corduroy",
    composition: "100% Combed Wide-Wale Cotton Corduroy",
    washProcess: "Brushed Soft-Pile Garment Wash",
    fitProfile: "Extra-Long Full-Drape Wide Hem",
    description:
      "Plush earth-brown corduroy trousers cut with a wide, puddle-ready hem opening crafted to drape smoothly over rugged suede hiking boots and chunky silhouettes.",
    availableSizes: ["S", "M", "L", "XL"],
  },
];

export const HERO_LINEUP_IDS: readonly string[] = [
  "washed-black-zip-jacket",
  "raw-seam-washed-jacket",
  "padded-collar-bomber-jacket",
  "heavyweight-black-pullover-hoodie",
];

export const LOOKS: readonly LookItem[] = [
  {
    code: "LOOK 01 // STUDIO EDIT",
    title: "CHARCOAL KNIT + WIDE DENIM",
    img: `${ASSET_BASE}washed-black-zip-jacket-back.webp`,
    productId: "canvas-utility-work-jacket",
  },
  {
    code: "LOOK 02 // STREET ROTATION",
    title: "BOXY BLACK TEE + BAGGY DENIM",
    img: `${ASSET_BASE}canvas-utility-work-jacket-back.webp`,
    productId: "distressed-black-terry-crewneck",
  },
  {
    code: "LOOK 03 // CONCRETE LINEUP",
    title: "ESPRESSO KNIT + BARREL DENIM",
    img: `${ASSET_BASE}raw-seam-washed-jacket-back.webp`,
    productId: "washed-stand-collar-leather-jacket",
  },
  {
    code: "LOOK 04 // NIGHT ARCHIVE",
    title: "OLIVE RAGLAN + CORDUROY TROUSER",
    img: `${ASSET_BASE}padded-collar-bomber-jacket-back.webp`,
    productId: "washed-ribbed-knit-crewneck",
  },
];
