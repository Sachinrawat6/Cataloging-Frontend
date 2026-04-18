import Papa from 'papaparse';

// ─── Static lookup tables — defined once, never recreated per call ────────────

const SIZE_MAPPING = {
  XXS: 'XXS',
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
  XXXL: '3XL',
  XXXXL: '4XL',
  XXXXXL: '5XL',
};
const SIZES = Object.keys(SIZE_MAPPING);

const SEASON_KEYWORDS = { summer: 'Summer', winter: 'Winter', spring: 'Spring', fall: 'Fall' };

const COLOR_FAMILY = new Set([
  'Aqua',
  'Beige',
  'Black',
  'Blue',
  'Bronze',
  'Brown',
  'Copper',
  'Cream',
  'Gold',
  'Green',
  'Grey',
  'Khaki',
  'Magenta',
  'Maroon',
  'Metallic',
  'Multi',
  'Mustard',
  'Navy',
  'Nude',
  'Olive',
  'Orange',
  'Peach',
  'Pink',
  'Purple',
  'Red',
  'Rust',
  'Silver',
  'Tan',
  'Teal',
  'White',
  'Yellow',
  'Clear',
  'Rose Gold',
  'Fuchsia',
  'Charcoal',
  'Coffee',
  'Grey Melange',
  'Lime',
  'Off White',
  'Turquoise',
  'Coral',
  'Burgundy',
  'Indigo',
  'Ecru',
  'Lavender',
  'Violet',
  'Wine',
  'Mauve',
  'Sea Green',
  'Taupe',
]);

const COLOR_MAPPING = {
  Gray: 'Grey',
  'Lavender Blush': 'Lavender',
  'Sky Blue': 'Blue',
  'Mint Green': 'Green',
  'Neon Yellow': 'Yellow',
  Ivory: 'Off White',
  'Royal Blue': 'Blue',
};

// ── Full Ajio fabric dropdown ─────────────────────────────────────────────────
const FABRIC_LIST = new Set([
  'Acrylic',
  'Art Silk',
  'Banarasi',
  'Cambric',
  'Chanderi',
  'Chiffon',
  'Corduroy',
  'Cotton',
  'Crepe',
  'Denim',
  'Dobby',
  'Dupion',
  'Fleece',
  'Georgette',
  'Ikat',
  'Jacquard',
  'Kanjeevaram',
  'Leather',
  'Linen',
  'Modal',
  'Muslin',
  'Mysore Silk',
  'Net',
  'Nylon',
  'Organza',
  'Paithani',
  'Pashmina',
  'Polyester',
  'PU',
  'Raw Silk',
  'Rayon',
  'Satin',
  'Silk',
  'Synthetic',
  'Tanchoi',
  'Tussar',
  'Velvet',
  'Viscose',
  'Wool',
  'Bagru',
  'Baluchari',
  'Bamboo',
  'Bandhej',
  'Batik',
  'Brocade',
  'Canvas',
  'Cashmere',
  'Chambray',
  'Cheesecloth',
  'Chenille',
  'Dharmavaram',
  'Excel',
  'Flannel',
  'Flex',
  'Gadwal',
  'Ghatchola',
  'Handloom',
  'HerringBone',
  'Houndstooth',
  'Jamdani',
  'Jamevar',
  'Kantha',
  'Khadi',
  'Knit',
  'Kosa',
  'Lace',
  'LambsWool',
  'Linen Blend',
  'Lurex',
  'Maheshwari',
  'Mangalgiri',
  'Merino',
  'Mohair',
  'Munga',
  'Narayanpet',
  'Organdie',
  'Organic Cotton',
  'Others',
  'Patola',
  'Phulkari',
  'Pochampally',
  'Poplin',
  'Ramie',
  'Sambalpuri',
  'Seersucker',
  'Shantoon',
  'Slub',
  'Tabby',
  'Taffeta',
  'Tangail',
  'Tant',
  'Tencel',
  'Terry',
  'Twill',
  'Velour',
  'Venkatagiri',
  'Voile',
  'Liva',
  'Lyocell',
  'Chinlon',
  'Elastane',
  'Hemp',
  'Mesh',
  'Microfibre',
  'Polyamide',
  'PU Coated Polyester',
  'Technical Fabric',
  'Terry Rayon',
]);

// ── Pre-sorted for includes matching — longer names checked first ─────────────
// This ensures "Organic Cotton" matches before "Cotton", "Art Silk" before "Silk", etc.
const FABRIC_LIST_SORTED = [...FABRIC_LIST].sort((a, b) => b.length - a.length);

// ── Your internal fabric names → Ajio dropdown values ────────────────────────
// Keys are lowercased + trimmed for case-insensitive lookup
const FABRIC_MAPPING = {
  silk: 'Silk',
  crepe: 'Crepe',
  'crepe silk': 'Crepe',
  georgette: 'Georgette',
  'georgette cosmic': 'Georgette',
  satin: 'Satin',
  'satin crush': 'Satin',
  'satin silk': 'Satin',
  'silk crepe': 'Crepe',
  'silk blend': 'Silk',
  'poly silk': 'Silk',
  'summer cool': 'Others',
  rayon: 'Rayon',
  'rayon twill': 'Rayon',
  'crinkle rayon': 'Rayon',
  lycra: 'Elastane',
  'lycra telsa': 'Elastane',
  'lycra scrubble': 'Elastane',
  'lycra valentino': 'Elastane',
  'lycra rib': 'Elastane',
  jersey: 'Knit',
  'jersey lycra': 'Knit',
  rib: 'Knit',
  cotton: 'Cotton',
  'cotton slub': 'Slub',
  'cotton blend': 'Cotton',
  'mul cotton': 'Muslin',
  mulmul: 'Muslin',
  chiffon: 'Chiffon',
  velvet: 'Velvet',
  suede: 'Others',
  fleece: 'Fleece',
  'anti-piling fleece': 'Fleece',
  'sherpa fleece': 'Fleece',
  sherpa: 'Fleece',
  other: 'Others',
  wool: 'Wool',
  'swiss dott': 'Others',
  'swiss dot': 'Others',
  'moss crepe': 'Crepe',
  'french crepe': 'Crepe',
  'poly crepe': 'Crepe',
  net: 'Net',
  poplin: 'Poplin',
  sequins: 'Others',
  viscose: 'Viscose',
  twill: 'Twill',
  telsa: 'Others',
  scrubble: 'Others',
  valentino: 'Others',
  'barfi/kitkat': 'Others',
  linen: 'Linen',
  brocade: 'Brocade',
  organza: 'Organza',
  crochet: 'Others',
  'mul mul': 'Muslin',
};

// ── Other mappings ─────────────────────────────────────────────────────────────
const PATTERN_LIST = new Set([
  'Solid',
  'Stripes',
  'Textured',
  'Tie & Dye',
  'Typographic',
  'Applique',
  'Self-design',
  'Abstract',
  'Animal',
  'Aztec',
  'Block Print',
  'Cartoon',
  'Chevrons',
  'Geometric',
  'Graphic',
  'Heathered',
  'Indian',
  'Leaf',
  'Micro Print',
  'Nailhead',
  'Novelty',
  'Numeric',
  'Paisley',
  'Quilted',
  'Reptilian',
  'Tropical',
  'Baroque',
  'Embroidery',
  'Holographic',
  'Monochrome',
  'Nautical',
  'Others',
  'Ribbed',
  'Ruffles',
  'Colourblock',
  'Crochet',
  'Patch-work',
  'Camouflage',
  'Checks',
  'Embellished',
  'Floral',
  'Lace',
  'Ombre-dyed',
  'Polka-dot',
  'Washed',
  'Tribal',
]);

const PATTERN_MAPPING = { Ombre: 'Ombre-dyed', Polka: 'Polka-dot', Leopard: 'Animal' };

const WASH_CARE_MAPPING = {
  'Machine Wash': 'Machine wash',
  'Dry Clean Only': 'Dry clean',
  'Hand Wash': 'Hand wash',
};

const FITTING_TYPE_MAPPING = {
  'loose fit': 'Loose Fit',
  'regular fit': 'Regular Fit',
  'slim fit': 'Slim Fit',
  'relaxed fit': 'Relaxed Fit',
  'stretch fit': 'Extra Slim Fit',
  oversized: 'Oversized Fit',

  'regular fit, loose fit': 'Regular Fit',
  'regular fit, western': 'Regular Fit',
  other: 'Regular Fit',
  'regular fit, loose fit, classic': 'Regular Fit',
  'regular fit, loose fit, western': 'Regular Fit',
  'regular fit, western, relaxed': 'Regular Fit',
  'regular fit, loose fit, relaxed': 'Regular Fit',
  'regular fit, relaxed': 'Regular Fit',
  'regular fit, slim fit, relaxed': 'Regular Fit',
  'regular fit, slim fit, western, classic': 'Regular Fit',
  'regular fit, slim fit, classic': 'Regular Fit',

  'loose fit, western, fusion': 'Loose Fit',
  'regular fit, loose fit, western, relaxed': 'Regular Fit',
  'loose fit, western, relaxed': 'Loose Fit',
  'loose fit, western, fusion, relaxed': 'Loose Fit',

  'slim fit, relaxed': 'Slim Fit',
  'regular fit, western, fusion': 'Regular Fit',
  'western, fusion, relaxed': 'Relaxed Fit',
  'regular fit, loose fit, western, fusion': 'Regular Fit',

  'fit & flare': 'Oversized Fit',
  ' fit & flare': 'Oversized Fit', // extra space case
  bodycon: 'Extra Slim Fit',
};

const NORMAL_TO_MAPPED_NECKLINE = {
  'v neck': 'V-neck',
  'button front': 'Button-down',
  'classic shirt': 'Collar',
  'shawl collar': 'Lapel',
  'not applicable': 'Other',
  shawl: 'Lapel',
  'square neck': 'Square',
  'mandarin collar': 'Mandarin',
  'round neck': 'Round',
  'off shoulder': 'Off Shoulder',
  hooded: 'Hooded',
  'boat neck': 'Boat',
  'classic collar': 'Collar',
  'classic shirt collar': 'Collar',
  other: 'Other',
  'banded collar': 'Band Collar',
  'sweat heart neck': 'Sweetheart',
  'one shoulder': 'One Shoulder',
  'crew neck': 'Crew',
  peterpan: 'Peter Pan Collar',
  'wide collar v neck': 'V-neck',
  'tie or bow': 'Tie-up',
  'halter neck': 'Halter',
  tuxedo: 'Other',
  'option 33': 'Other',
  'cowl neck': 'Cowl',
  'spaghetti strap': 'Other',
  'keyhole neck': 'Halter',
  hoodie: 'Hooded',
  na: 'Other',
  'notch collar': 'Other',
  notch: 'Other',
  'scoop neck': 'Scoop',
};

const SLEEVE_LENGTH_MAPPING = {
  full: 'Full-length',
  'three quarter': '3/4th sleeve',
  half: 'Short sleeve',
  short: 'Short',
  quarter: 'Full-length',
  'elbow length': 'Elbow-length sleeve',
  sleeveless: 'Sleeveless',
  'above elbow length': 'Elbow-length sleeve',
  'half ': 'Short sleeve', // extra space case
};
// ─── Pure mapping helpers ─────────────────────────────────────────────────────

const mapSeason = (season) => {
  if (!season?.trim()) return '';
  const lower = season.toLowerCase();
  for (const [keyword, label] of Object.entries(SEASON_KEYWORDS)) {
    if (lower.includes(keyword)) return label;
  }
  return '';
};

const mapColorShade = (color) =>
  color?.trim() ? (color.trim().toLowerCase() === 'pastel' ? 'Light' : 'Dark') : '';

const mapProminentColor = (color) => {
  if (!color?.trim()) return '';
  const trimmed = color.trim();
  return COLOR_FAMILY.has(trimmed) ? trimmed : (COLOR_MAPPING[trimmed] ?? '');
};

const mapFabric = (rawFabric) => {
  if (!rawFabric?.trim()) return 'Others';

  const trimmed = rawFabric.trim();
  const key = trimmed.toLowerCase();

  // 1. Explicit internal-name → Ajio mapping (handles Lycra→Elastane, Jersey→Knit, etc.)
  if (FABRIC_MAPPING[key]) return FABRIC_MAPPING[key];

  // 2. Case-insensitive exact match against the Ajio dropdown
  for (const fabric of FABRIC_LIST) {
    if (fabric.toLowerCase() === key) return fabric;
  }

  // 3. Includes match — "black moss crepe" contains "crepe" → Crepe
  //                     "Floral screen printed cotton" contains "cotton" → Cotton
  //                     "Black Big Butta Brocade" contains "brocade" → Brocade
  //    Longest name wins: "Organic Cotton" matched before "Cotton"
  for (const fabric of FABRIC_LIST_SORTED) {
    if (key.includes(fabric.toLowerCase())) return fabric;
  }

  return 'Others';
};

const mapFittingType = (value) => {
  if (!value) return 'Regular Fit';

  const key = value.toLowerCase().trim();

  return FITTING_TYPE_MAPPING[key] || 'Regular Fit';
};

const mapPattern = (prints) => {
  if (!prints?.trim()) return 'Others';
  const trimmed = prints.trim();
  for (const pattern of PATTERN_LIST) {
    if (trimmed.toLowerCase().includes(pattern.toLowerCase())) return pattern;
  }
  return PATTERN_MAPPING[trimmed] ?? 'Others';
};

const mapNeckline = (value) => {
  if (!value) return 'Other';

  return NORMAL_TO_MAPPED_NECKLINE[value.toLowerCase().trim()] || 'Other';
};

const mapSleeveLength = (value) => {
  if (!value) return 'Sleeveless';

  const key = value.toLowerCase().trim();

  return SLEEVE_LENGTH_MAPPING[key] || 'Sleeveless';
};
// ─── Main generator ───────────────────────────────────────────────────────────

const generateAjioTopstListing = (selectedData, header) => {
  const year = new Date().getFullYear(); // computed once, not per row

  const csvData = selectedData
    .filter((p) => p.styleType === 'Top' || p.styleType.toLowerCase().includes('top'))
    .flatMap((product) =>
      SIZES.map((size) => {
        const mappedSize = SIZE_MAPPING[size];
        const fabricRaw = product.fabrics[0]?.name ?? '';
        const primaryColor = product.stylePrimaryColor?.trim() ?? '';

        return {
          '*Style Code': product.styleNumber,
          '*Style Description': product.styleDescription,
          '*Item SKU': `${product.styleNumber}-${primaryColor}-${mappedSize}`,
          '*Brand': 'Qurvii',
          '*EAN': `${product.styleNumber}${primaryColor}${mappedSize}`,
          '*TD': '0',
          '*MRP': product.mrp || 0,
          '*HSN': '62114290',
          '*Product Groups': 'Casual',
          '*Fashion Groups': 'Fashion',
          '*Season Code': mapSeason(product.season),
          '*Season Year': year,
          '*Size': mappedSize,
          '*articleDimensionsUnitHeight': 1,
          '*articleDimensionsUnitLength': 1,
          '*articleDimensionsUnitWidth': 1,
          '*articleDimensionsUnitLengthUOM': 'CM',
          '*articleDimensionsUnitWeight': 200,
          '*articleDimensionsUnitWeightUOM': 'GRAM',
          '*packageDimensionsHeight': 4,
          '*packageDimensionsLength': 30,
          '*packageDimensionsWidth': 17,
          '*packageDimensionsLengthUOM': 'CM',
          '*packageDimensionsWeight': 300,
          '*packageDimensionsWeightUOM': 'GRAM',
          'Additional Information 1':
            'Our clothes are specially designed for women with curves. Before placing an order, please refer to our Size Chart',
          'Additional Information 2': '',
          'Additional Information 3': '',
          Character: '',
          '*Component Count': 1,
          '*Country of Origin': 'India',
          'Hidden Detail': '',
          Highlight: '',
          'Imported By':
            'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301,Email -logistics@qurvii.com',
          'Manufactured By':
            'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301,Email -logistics@qurvii.com',
          '*Marketed By':
            'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301,Email -logistics@qurvii.com',
          Mood: '',
          'Sold By': '',
          'Multi Brick': '',
          'Multi Segment': 'Women',
          'Multi Vertical': 'Western Wear',
          '*Net Quantity': '1N',
          '*Package Contains': `1 ${product.styleType}`,
          'Size Tip': '',
          USP: '',
          'Trend Theme': '',
          Accent: '',
          '*Color Family': mapProminentColor(primaryColor) || primaryColor,
          'Color Shade': mapColorShade(primaryColor),
          Disclaimer: '',
          '*Fabric Detail': fabricRaw,
          '*Fabric Type': mapFabric(fabricRaw),
          '*Pattern': mapPattern(product.prints),
          '*Primary Color': primaryColor,
          'Secondary Color': '',
          '*Size Format': 'IN',
          '*Size Group': 'Regular',
          '*Wash Care': WASH_CARE_MAPPING[product.washCare?.trim()] ?? 'Not Specified',
          Care: '',
          'Size worn by Model': '',
          'Stock Type': '',
          '*Fitting': mapFittingType(product.fittingType),
          'IND_PT(ONLY FOR INTERNAL USE)': '',
          'Product Name': product.styleType || '',
          '*Length': 'Medium',
          '*Neckline': mapNeckline(product.neckStyle),
          '*Sleeve Length': mapSleeveLength(product.sleeveLength?.trim()),
          'Sleeve Type': '',
          Sport: '',
          '*StandardSize': mappedSize,
          '*Style Type': 'Regular',
        };
      })
    );

  // Map each row object to ordered column values
  const csvRows = csvData.map((row) => header.map((col) => row[col] ?? ''));

  const csv = Papa.unparse({ fields: header, data: csvRows });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ajio_tops_listing.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // ← clean up blob URL immediately after click
};

export default generateAjioTopstListing;
