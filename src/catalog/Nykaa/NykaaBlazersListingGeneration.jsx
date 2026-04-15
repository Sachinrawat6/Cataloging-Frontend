import Papa from 'papaparse';

// ─── Constants ───────────────────────────────────────────────────────────────

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL'];

const SIZE_LABEL_MAP = {
  XXS: 'XXS',
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: '2XL',
  XXXL: '3XL',
  XXXXL: '4XL',
  XXXXXL: '5XL',
};

const buildGradedValues = (xsValue, increment) =>
  Object.fromEntries(SIZES.map((size, i) => [size, xsValue + (i - 1) * increment]));

const buildSizeData = ({ frontLengthXS = 0, sleeveLengthXS = 0 } = {}) => {
  const shoulder = buildGradedValues(13.5, 0.5);
  const bust = buildGradedValues(33.5, 2);
  const chest = buildGradedValues(32.5, 2);
  const waist = buildGradedValues(25.5, 2);
  const hips = buildGradedValues(35.5, 2);
  const frontLength = frontLengthXS > 0 ? buildGradedValues(frontLengthXS, 0.5) : null;
  const sleeveLen = sleeveLengthXS > 0 ? buildGradedValues(sleeveLengthXS, 0.25) : null;

  return Object.fromEntries(
    SIZES.map((size) => [
      size,
      {
        shoulder: shoulder[size],
        bust: bust[size],
        chest: chest[size],
        waist: waist[size],
        hips: hips[size],
        frontLength: frontLength ? frontLength[size] : '',
        sleeveLength: sleeveLen ? sleeveLen[size] : '',
      },
    ])
  );
};

// ─── Lookup Maps ─────────────────────────────────────────────────────────────

const SLEEVE_TYPE_MAP = {
  Full: 'Full Sleeves',
  'Three Quarter': 'Three Fourth Sleeves',
  Half: 'Half Sleeves',
  Short: 'Half Sleeves',
  Quarter: 'Half Sleeves',
  'Elbow Length': 'Half Sleeves',
  'Above Elbow Length': 'Half Sleeves',
};

const FITTING_TYPE_MAP = {
  'Loose Fit': 'Loose',
  'Slim Fit': 'Slim',
  'Stretch Fit': 'Bodycon',
  Oversized: 'Oversized',
  'Fit & Flare': 'Flared',
};

const REGULAR_FIT_VALUES = new Set([
  'Regular Fit',
  'Regular Fit, Loose Fit',
  'Regular Fit, Western',
  'Regular Fit, Loose Fit, Classic',
  'Regular Fit, Loose Fit, Western',
  'Regular Fit, Western, Relaxed',
  'Regular Fit, Loose Fit, Relaxed',
  'Regular Fit, Relaxed',
  'Regular Fit, Slim Fit, Relaxed',
  'Regular Fit, Slim Fit, Western, Classic',
  'Regular Fit, Slim Fit, Classic',
  'Regular Fit, Loose Fit, Western, Relaxed',
  'Regular Fit, Western, Fusion',
  'Regular Fit, Loose Fit, Western, Fusion',
]);

const RELAXED_FIT_VALUES = new Set([
  'Relaxed Fit',
  'Regular Fit, Western',
  'Other',
  'Loose Fit, Western, Fusion',
  'Loose Fit, Western, Relaxed',
  'Loose Fit, Western, Fusion, Relaxed',
  'Slim Fit, Relaxed',
  'Western, Fusion, Relaxed',
]);

const NECK_STYLE_MAP = {
  'V Neck': 'V-Neck',
  'Wide Collar V Neck': 'V-Neck',
  'Shawl Collar': 'Shawl Lapel',
  Shawl: 'Shawl Lapel',
  'Mandarin Collar': 'Mandarin Neck',
  'Tie or Bow': 'Tie Up Neck',
};

const COLOR_MAP = {
  Multi: 'Multi-color',
  Navy: 'Navy Blue',
  Gray: 'Grey',
  'fuchia pink': 'Pink',
  'Fucia Pink': 'Pink',
  'Fuchia Pink': 'Pink',
  'Fuchia pink': 'Pink',
  'fucia pink': 'Pink',
  'Mint Green': 'Green',
  'mint green': 'Green',
};

const FABRIC_MAP = {
  'French crepe': 'Poly Silk',
  'Navy french crepe': 'Poly Silk',
  'French Crepe': 'Poly Silk',
  'French Crepe Silk': 'Poly Silk',
  'Poly Crepe': 'Poly Silk',
  'Poly Silk': 'Poly Silk',
  'Burfi silk': 'Silk',
  'Burfii silk': 'Silk',
  'Burfi Silk': 'Silk',
  'Off-white burfi silk': 'Silk',
  'Gray barfi silk': 'Silk',
  'Red barfi silk': 'Silk',
  'Roman Silk': 'Silk',
  'Amalfi silk': 'Silk',
  'Noritake silk': 'Silk',
  'Navy Noritake silk': 'Silk',
  'Turquoise green Noritake silk': 'Silk',
  'Turquoise blue Noritake silk': 'Silk',
  'Orange Noritake silk': 'Silk',
  'Vamika crepe': 'Crepe',
  'Vamika Crepe': 'Crepe',
  'Capri Crepe': 'Crepe',
  'Mint green bubble crepe': 'Crepe',
  'Navy stripe crepe': 'Crepe',
  'Black Stripes crepe': 'Crepe',
  'Black stripe crepe': 'Crepe',
  'Pleated mustard Crepe': 'Crepe',
  'Solid black Crepe': 'Crepe',
  'Solid navy blue crepe': 'Crepe',
  'Solid red crepe': 'Crepe',
  'Yellow heart print crepe': 'Crepe',
  'Red crepe': 'Crepe',
  'Black crepe': 'Crepe',
  'Polka dot crepe': 'Crepe',
  'Polka crepe': 'Crepe',
  Crepe: 'Crepe',
  'Crepe silk': 'Crepe',
  'White crepe': 'Crepe',
  'Printed crepe': 'Crepe',
  'Wine Stripe Crepe': 'Crepe',
  'Blue-White stripe crepe': 'Crepe',
  'Lime yellow bird printed crepe': 'Crepe',
  'Mustard leopard print crepe': 'Crepe',
  'Floral crepe': 'Crepe',
  'Floral print crepe': 'Crepe',
  'Black floral crepe': 'Crepe',
  'Animal print crepe': 'Crepe',
  'Solid Crepe': 'Crepe',
  'Wine floral crepe': 'Crepe',
  'Red floral print Crepe': 'Crepe',
  Harnaz: 'Georgette',
  Cosmic: 'Georgette',
  'Harnaz Georgette': 'Georgette',
  Georgette: 'Georgette',
  Satin: 'Satin',
  'Black Satin': 'Satin',
  'Beige-Black leopard print satin': 'Satin',
  'Floral print Satin': 'Satin',
  'Digital printed Satin': 'Satin',
  'Floral Satin': 'Satin',
  'Moss crepe': 'Moss Crepe',
  'Sea green moss crepe': 'Moss Crepe',
  'Royal blue moss crepe': 'Moss Crepe',
  'Black moss crepe': 'Moss Crepe',
  'Gray moss crepe': 'Moss Crepe',
  'Teal Moss crepe': 'Moss Crepe',
  'Maroon heather moss crepe': 'Moss Crepe',
  Telsa: 'Lycra',
  Lycra: 'Lycra',
  'Telsa Lycra': 'Lycra',
  Rayon: 'Rayon',
  Reyon: 'Rayon',
  'Crinkle Rayon': 'Rayon',
  'Rayon Twill': 'Rayon',
  'Geometric printed Rayon': 'Rayon',
  'Printed Rayon': 'Rayon',
  Jersey: 'Jersey',
  'Cotton Slub': 'Cotton',
  'Cotton slub': 'Cotton',
  Cotton: 'Cotton',
  'Printed Cotton': 'Cotton',
  'Blue-White floral cotton': 'Cotton',
  'White & black border printed cotton': 'Cotton',
  Velvet: 'Velvet',
  Velvit: 'Velvet',
  Fleece: 'Fleece',
  'Anti-Piling Fleece': 'Fleece',
  'Wine Anti-Pilling Fleece': 'Fleece',
  'Sherpa Fleece': 'Fleece',
  Wool: 'Wool',
  'Black plaid wool': 'Wool',
  'Brown plaid wool': 'Wool',
  'Black Nep wool': 'Wool',
  'Black and white houndstooth wool': 'Wool',
  Suede: 'Suede',
  'Couture soft': 'Suede',
  'Rabbit fur': 'Fur',
  Net: 'Net',
  'Net Fabric': 'Net',
  Sequins: 'Sequin',
  Poplin: 'Poplin',
  Chambray: 'Chambray',
  Twill: 'Twill',
  Chiffon: 'Chiffon',
  Rib: 'Rib',
};

const SEASON_MAP = {
  'Summer,Spring': 'Spring/Summer',
  'Summer, Spring': 'Spring/Summer',
  Summer: 'Summer',
  Fall: 'Winter',
  fall: 'Winter',
  Spring: 'Spring',
  'Winter, Fall': 'Winter',
  Winter: 'Winter',
  'Spring, Fall': 'Spring',
  'Autum/ Fall': 'Autumn',
  'Summer, Fall': 'Summer',
  'Summer, Spring, Fall': 'Spring/Summer',
  'Summer, Winter, Fall': 'Autumn/Winter',
  'Summer, Winter, Spring, Fall': 'Spring/Summer',
};

const PATTERN_MAP = {
  Solid: 'Solid/Plain',
  'Solid,': 'Solid/Plain',
  solid: 'Solid/Plain',
  'Solid, Floral': 'Solid/Plain',
  'Solid, Stripe': 'Solid/Plain',
  'Solid, Pastels': 'Solid/Plain',
  'Solid, Pastels, Floral': 'Solid/Plain',
  'Solid, Brocade': 'Solid/Plain',
  'Solid, printed': 'Solid/Plain',
  'Solid, Check': 'Solid/Plain',
  'Solid, Heart': 'Solid/Plain',
  'Solid, Abstract': 'Solid/Plain',
  'Solid, Paisley': 'Solid/Plain',
  'Solid, Geometric': 'Solid/Plain',
  'Solid/Plain, Floral': 'Solid/Plain, Floral',
  'Solid/Plain, Stripes': 'Solid/Plain, Floral',
  'Solid/Plain, Abstract': 'Solid/Plain, Floral',
  'Animal, Floral': 'Animal Print',
  'Animal, Pastels': 'Animal Print',
  'Animal, Leopard': 'Animal Print',
  'Solid, Animal, Leopard': 'Animal Print',
  Zebra: 'Animal Print',
  'Animal Print': 'Animal Print',
  'Solid, Zebra': 'Animal Print',
  cow: 'Animal Print',
  'Tie & dye': 'Tie & Dye',
  'tie & dye': 'Tie & Dye',
  'Tie & Dye': 'Tie & Dye',
  Polka: 'Polka Dots',
  'Polka Dots': 'Polka Dots',
  'multi dot print': 'Polka Dots',
  'Stripe, Polka': 'Stripes',
  Stripe: 'Stripes',
  Tropical: 'Nature',
  Nature: 'Nature',
  'Tropical, Stripe': 'Nature',
  Abstract: 'Abstract',
  'Abstract, Pastels': 'Abstract',
  'Abstract, Tropical': 'Abstract',
  Geometric: 'Geometric',
  'Geometric, Pastels': 'Geometric',
  'Geometric, Polka': 'Geometric',
  'Marbel print': 'Printed',
  Printed: 'Printed',
  'Hounds tooth': 'Printed',
  Camouflage: 'Printed',
  'Panel print': 'Printed',
  Check: 'Printed',
  'Check, Plaid': 'Printed',
  'Swiss dott': 'Printed',
  'Border print': 'Printed',
  'Pastels, Printed': 'Printed',
  'Pastels, Polka': 'Printed',
  Pastels: 'Printed',
  Plaid: 'Printed',
  Embroidered: 'Embroidered',
  'Pastels, Swiss-dot': 'Textured',
  'Swiss-dot': 'Textured',
  COLORBLOCK: 'Colorblock',
};

const OCCASION_MAP = {
  Festival: 'Festive Wear',
  'Casual, Festival': 'Festive Wear',
  'Casual, Festival, Smart Casual': 'Festive Wear',
  'Casual, Festival, Day, Smart Casual': 'Festive Wear',
  'Casual, Festival, Smart Casual, Active': 'Festive Wear',
  'Semi Formal': 'Semi Formal',
  'Semi Formal, Smart Casual': 'Semi Formal',
  'Semi Formal, Office, Smart Casual': 'Semi Formal',
  'Semi Formal, Office, Daily': 'Semi Formal',
  'Semi Formal, Office, Night, Smart Casual': 'Semi Formal',
  Active: 'Sporty',
};

// ─── Pure Transform Helpers ───────────────────────────────────────────────────

const mapFittingType = (fittingType) => {
  if (REGULAR_FIT_VALUES.has(fittingType)) return 'Regular';
  if (RELAXED_FIT_VALUES.has(fittingType)) return 'Relaxed';
  return FITTING_TYPE_MAP[fittingType] ?? fittingType;
};

const mapOccasion = (occasion) => {
  const lower = occasion.toLowerCase().trim();
  if (lower.includes('party')) return 'Party';
  if (lower.includes('evening')) return 'Evening Wear';
  if (lower.includes('casual')) return 'Casual';
  return OCCASION_MAP[occasion] ?? occasion;
};

const isBlazer = (styleType = '') => ['blazer', 'blazers'].includes(styleType.toLowerCase().trim());

// ─── Main Export ──────────────────────────────────────────────────────────────

const generateNykaaBlazerListing = (selectedData, headers) => {
  const csvData = selectedData
    .filter((p) => isBlazer(p.styleType))
    .flatMap((product) => {
      // ── Per-product sizeData — frontLength ab sahi aayegi ──
      const sizeData = buildSizeData({
        frontLengthXS: product.measurements?.frontLengthXS ?? 0,
        sleeveLengthXS: product.measurements?.sleeveLengthXS ?? 0,
      });

      return SIZES.map((size) => {
        const mappedSize = SIZE_LABEL_MAP[size];
        const measurements = sizeData[size];
        const fabric = product.fabrics?.[0]?.name ?? '';

        const sleeveType = SLEEVE_TYPE_MAP[product.sleeveLength] ?? 'Sleeveless';
        const fittingType = mapFittingType(product.fittingType);
        const neckStyle = NECK_STYLE_MAP[product.neckStyle] ?? product.neckStyle;
        const color = COLOR_MAP[product.stylePrimaryColor] ?? product.stylePrimaryColor;
        const material = FABRIC_MAP[fabric] ?? fabric;
        const season = SEASON_MAP[product.season] ?? product.season;
        const pattern = PATTERN_MAP[product.prints] ?? product.prints;
        const occasion = mapOccasion(product.occasion ?? '');
        const closure = product.closure?.toLowerCase().trim().includes('not applicable')
          ? 'Other'
          : product.closure;

        return {
          'Vendor SKU Code': `${product.styleNumber}-${color}-${mappedSize}`,
          Gender: 'Women',
          'Brand Name': 'Qurvii',
          'Style Code': product.styleNumber ?? '',
          'Product Name': product.styleName ?? '',
          Description: product.styleDescription ?? '',
          Price: product.mrp ?? '',
          Color: color,
          'Country of Origin': 'India',
          'Manufacturer Name': 'Qurvii',
          'Manufacturer Address': 'B-149, Sector 6, Noida, UP 201301, India',
          'Ean Codes': '',
          'brand size': mappedSize,
          'brand  size': mappedSize,
          'Design Code': '',
          'Multipack Set': 'Single',
          Occasion: occasion,
          'Category Classification': 'Westernwear',
          Season: season,
          'Care Instruction': product.washCare ?? '',
          'Ships In': 2,
          'HSN Codes': product.hsn ?? '62044490',
          'Pack Contains': product.styleType ? `1 ${product.styleType}` : '',
          'Net Qty': 1,
          Material: material,
          Disclaimer:
            'Qurvii styles specially for curvy women of all sizes. Your size in our brand might be different from the other brands. Please check our size chart before ordering',
          'Character/Collection Shop': product.character_shop ?? '',
          Neckline: neckStyle,
          'Responsibility Criteria': product.responsibility_criteria ?? '',
          Pattern: pattern,
          'Collections Function': product.collections_function ?? '',
          'Pocket Description': product.pocket_description ?? '',
          Activity: '',
          'Type of Work': '',
          Closure: closure,
          Fit: fittingType,
          'Model details': 'Model is 5ft 9in tall and is wearing size XS',
          'Sleeve length Type': sleeveType,
          Age: '',
          'Length (Inches)': measurements.frontLength,
          'Bust For Body (Inches)': measurements.bust,
          'Chest For Body (Inches)': measurements.chest,
          'Waist For Body (Inches)': measurements.waist,
          'Bust for Garment (Inches)': measurements.bust,
          'Chest for Garment (Inches)': measurements.chest,
          'Waist for Garment (Inches)': measurements.waist,
          'Shoulder for Garment (Inches)': measurements.shoulder,
          'Sleeve Length (Inches)': product.measurements?.sleeveLengthXS ?? 0,
          'Shoulder For Body (Inches)': measurements.shoulder,
          'Age Group': '',
          'Length For Body (Inches)': measurements.frontLength,
        };
      });
    });

  const csv = Papa.unparse({ fields: headers, data: csvData });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Nykaa_blazer_listing.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { generateNykaaBlazerListing };
