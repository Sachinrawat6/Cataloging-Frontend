import Papa from 'papaparse';

/* ════════════════════════════════════════════════════════════════════════
 *  FILTER MAPPING & GROUPING ENGINE
 *  ------------------------------------------------------------------------
 *  Raw product attributes are grouped into clean filter values AT GENERATION
 *  TIME and written to filter.* metafields. No post-processing script needed.
 *
 *   - Each attribute has an ordered list of [keyword, group] rules.
 *   - First keyword found inside the (lowercased) raw value wins, so put the
 *     MOST SPECIFIC phrases first ("royal blue" before "blue").
 *   - Values matching no rule are omitted from the filter.
 *   - custom.* metafields keep the RAW detail (product page).
 *     filter.* metafields hold the GROUPED values (Search & Discovery).
 *
 *  To add a new filter: write its *_RULES list, add one line to FILTER_ATTRS,
 *  and create the matching filter.* metafield definition in Shopify.
 * ════════════════════════════════════════════════════════════════════════ */

const COLOR_RULES = [
  ['off white', 'Ivory'],
  ['jet black', 'Black'],
  ['royal blue', 'Royal Blue'],
  ['sky blue', 'Sky Blue'],
  ['powder blue', 'Sky Blue'],
  ['navy', 'Navy'],
  ['lime green', 'Lime Green'],
  ['mint green', 'Mint'],
  ['bottle green', 'Green'],
  ['sea green', 'Green'],
  ['mint', 'Mint'],
  ['olive', 'Olive'],
  ['teal', 'Teal'],
  ['turquoise', 'Turquoise'],
  ['cobalt', 'Blue'],
  ['blue', 'Blue'],
  ['maroon', 'Maroon'],
  ['burgundy', 'Burgundy'],
  ['wine', 'Wine'],
  ['rust', 'Rust'],
  ['red', 'Red'],
  ['fuchsia', 'Fuchsia'],
  ['fucia', 'Fuchsia'],
  ['magenta', 'Fuchsia'],
  ['peach', 'Peach'],
  ['blush', 'Pink'],
  ['rose', 'Pink'],
  ['pink', 'Pink'],
  ['mustard', 'Mustard'],
  ['yellow', 'Yellow'],
  ['coral', 'Orange'],
  ['orange', 'Orange'],
  ['green', 'Green'],
  ['charcoal', 'Grey'],
  ['grey', 'Grey'],
  ['gray', 'Grey'],
  ['ivory', 'Ivory'],
  ['cream', 'Ivory'],
  ['white', 'White'],
  ['black', 'Black'],
  ['camel', 'Beige'],
  ['khaki', 'Beige'],
  ['tan', 'Beige'],
  ['nude', 'Beige'],
  ['beige', 'Beige'],
  ['brown', 'Brown'],
  ['lilac', 'Lilac'],
  ['lavender', 'Lilac'],
  ['purple', 'Purple'],
  ['violet', 'Purple'],
  ['multicolour', 'Multicolor'],
  ['multicolor', 'Multicolor'],
  ['multi', 'Multicolor'],
];

const FABRIC_RULES = [
  ['moss crepe', 'Moss Crepe'],
  ['french crepe', 'Crepe'],
  ['silk crepe', 'Crepe'],
  ['crepe', 'Crepe'],
  ['georgette', 'Georgette'],
  ['poplin', 'Poplin'],
  ['cotton slub', 'Cotton'],
  ['slub', 'Cotton'],
  ['mulmul', 'Cotton'],
  ['cambric', 'Cotton'],
  ['muslin', 'Cotton'],
  ['chambray', 'Cotton'],
  ['cotton', 'Cotton'],
  ['rayon', 'Rayon'],
  ['silk', 'Silk'],
  ['satin', 'Satin'],
  ['lycra', 'Lycra'],
  ['spandex', 'Lycra'],
  ['sherpa', 'Fleece'],
  ['fleece', 'Fleece'],
  ['linen', 'Linen'],
  ['velvet', 'Velvet'],
  ['chiffon', 'Chiffon'],
  ['organza', 'Organza'],
  ['tulle', 'Tulle'],
  ['net', 'Net'],
  ['lace', 'Lace'],
  ['jersey', 'Jersey'],
  ['knit', 'Knit'],
  ['wool', 'Wool'],
  ['denim', 'Denim'],
  ['modal', 'Modal'],
  ['viscose', 'Viscose'],
  ['corduroy', 'Corduroy'],
  ['terry', 'Terry'],
  ['schiffli', 'Schiffli'],
  ['tencel', 'Tencel'],
  ['polyester', 'Polyester'],
];

const FIT_RULES = [
  ['fit & flare', 'Fit & Flare'],
  ['fit and flare', 'Fit & Flare'],
  ['flare', 'Fit & Flare'],
  ['bodycon', 'Bodycon'],
  ['oversize', 'Oversize'],
  ['oversized', 'Oversize'],
  ['slim', 'Slim'],
  ['fitted', 'Slim'],
  ['loose', 'Loose'],
  ['relaxed', 'Relaxed'],
  ['regular', 'Regular'],
];

const PATTERN_RULES = [
  ['solid', 'Solid'],
  ['plain', 'Solid'],
  ['floral', 'Floral'],
  ['flower', 'Floral'],
  ['stripe', 'Stripe'],
  ['polka', 'Polka'],
  ['abstract', 'Abstract'],
  ['geometric', 'Geometric'],
  ['tropical', 'Tropical'],
  ['leopard', 'Animal'],
  ['zebra', 'Animal'],
  ['cheetah', 'Animal'],
  ['tiger', 'Animal'],
  ['snake', 'Animal'],
  ['animal', 'Animal'],
  ['gingham', 'Check'],
  ['houndstooth', 'Check'],
  ['plaid', 'Check'],
  ['tartan', 'Check'],
  ['check', 'Check'],
  ['paisley', 'Paisley'],
  ['camo', 'Camouflage'],
  ['heart', 'Heart'],
  ['embroider', 'Embroidered'],
  ['schiffli', 'Embroidered'],
];

// Stubs — define a rules list + uncomment the FILTER_ATTRS line to activate.
const NECK_RULES = [
  ['wide collar v', 'V Neck'],
  ['v neck', 'V Neck'],
  ['round neck', 'Round Neck'],
  ['square neck', 'Square Neck'],
  ['sweet heart', 'Sweetheart Neck'],
  ['sweetheart', 'Sweetheart Neck'],
  ['halter', 'Halter Neck'],
  ['off shoulder', 'Off Shoulder'],
  ['one shoulder', 'One Shoulder'],
  ['boat', 'Boat Neck'],
  ['mandarin', 'Mandarin Collar'],
  ['banded', 'Banded Collar'],
  ['shawl', 'Shawl Collar'],
  ['classic shirt', 'Collared'],
  ['classic collar', 'Collared'],
  ['shirt collar', 'Collared'],
  ['collared', 'Collared'],
  ['peter pan', 'Peter Pan Collar'],
  ['peterpan', 'Peter Pan Collar'],
  ['button front', 'Button Front'],
  ['hooded', 'Hooded'],
];

const SLEEVE_RULES = [
  ['sleeveless', 'Sleeveless'],
  ['cap', 'Cap'],
  ['above elbow', 'Above Elbow Length'],
  ['elbow', 'Elbow Length'],
  ['three quarter', 'Three Quarter'],
  ['quarter', 'Quarter'],
  ['short', 'Short'],
  ['half', 'Half'],
  ['full', 'Full'],
  ['long', 'Full'],
];

const OCCASION_RULES = [
  ['smart casual', 'Smart Casual'],
  ['casual', 'Casual'],
  ['office', 'Office'],
  ['formal', 'Office'],
  ['semi formal', 'Office'],
  ['party', 'Party'],
  ['evening', 'Evening'],
  ['festive', 'Festive'],
  ['festival', 'Festive'],
  ['beach', 'Beach'],
  ['resort', 'Beach'],
  ['active', 'Active'],
  ['daily', 'Daily'],
  ['day', 'Daily'],
  ['night', 'Night'],
];

// Noise tokens that must never become a filter value.
const DROP = new Set([
  '3',
  'pastel',
  'pastels',
  'na',
  'n/a',
  'not applicable',
  'none',
  'other',
  'dark',
  'light',
  'bright',
  'new basics',
  'western',
  'fusion',
  'classic',
]);

/* ── Registry: the single place to add/remove filter attributes ───────────── */
const FILTER_ATTRS = [
  {
    key: 'color',
    multi: true,
    rules: COLOR_RULES,
    read: (p) => [p.stylePrimaryColor, p.primaryColorShade],
  },
  {
    key: 'fabric',
    multi: false,
    rules: FABRIC_RULES,
    read: (p) => [p.fabrics?.[0]?.name, p.fabricType],
  },
  {
    key: 'fit',
    multi: false,
    rules: FIT_RULES,
    read: (p) => [p.fittingType],
    priority: ['Fit & Flare', 'Bodycon', 'Slim', 'Loose', 'Relaxed', 'Oversize', 'Regular'],
  },
  { key: 'pattern', multi: true, rules: PATTERN_RULES, read: (p) => [p.prints] },

  // ── To extend, create the filter.* metafield definition in Shopify, then uncomment ──
  // { key: "neckline", multi: false, rules: NECK_RULES,     read: (p) => [p.neckStyle, p.collarType] },
  // { key: "sleeve",   multi: false, rules: SLEEVE_RULES,   read: (p) => [p.sleeveLength, p.sleeveType] },
  // { key: "occasion", multi: true,  rules: OCCASION_RULES, read: (p) => [p.occasion] },
];

const LIST_SEP = '\n'; // Matrixify separates list-metafield values with a newline inside the cell.

function mapToken(token, rules) {
  const t = String(token || '')
    .toLowerCase()
    .trim();
  if (!t || DROP.has(t)) return null;
  for (const [needle, group] of rules) if (t.includes(needle)) return group;
  return null;
}

function groupAttr(product, attr) {
  const raw = attr.read(product).filter(Boolean).join(',');
  const groups = [];
  for (const part of String(raw).split(/[,/|]+/)) {
    const g = mapToken(part, attr.rules);
    if (g && !groups.includes(g)) groups.push(g);
  }
  if (attr.multi) return groups;
  if (!groups.length) return [];
  if (attr.priority) {
    const hit = attr.priority.find((p) => groups.includes(p));
    if (hit) return [hit];
  }
  return [groups[0]];
}

// Returns { "Metafield:filter.color [list.string]": "Red\nPink", ... }
function buildFilterFields(product) {
  const row = {};
  for (const attr of FILTER_ATTRS) {
    const groups = groupAttr(product, attr);
    row[`Metafield:filter.${attr.key} [${attr.multi ? 'list.string' : 'string'}]`] = attr.multi
      ? groups.join(LIST_SEP)
      : groups[0] || '';
  }
  return row;
}

const FILTER_HEADERS = FILTER_ATTRS.map(
  (a) => `Metafield:filter.${a.key} [${a.multi ? 'list.string' : 'string'}]`
);

/* ════════════════════════════════════════════════════════════════════════
 *  DYNAMIC DESCRIPTION BUILDER
 *  Uses FABRIC_RULES / FIT_RULES groups (via groupAttr) for the "feel" lines.
 *  Missing attributes drop their line/phrase automatically.
 * ════════════════════════════════════════════════════════════════════════ */

const escapeHtml = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const clean = (v) => {
  const s = String(v ?? '').trim();
  if (!s || DROP.has(s.toLowerCase())) return '';
  return s;
};

const titleCase = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const joinList = (arr) =>
  arr.length <= 1 ? arr[0] || '' : `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`;

// Fabric group -> feel line. Add a new fabric here with one line.
const FABRIC_FEEL = {
  Silk: 'smooth, naturally lustrous, premium to the touch',
  Satin: 'smooth with a soft sheen and fluid drape',
  Cotton: 'soft, breathable, comfortable all day',
  Rayon: 'light, soft and easy-flowing',
  Viscose: 'light, soft and easy-flowing',
  Linen: 'airy, breathable, with a natural textured look',
  Georgette: 'light, flowy with a slightly crinkled texture',
  Chiffon: 'sheer-light, airy and graceful in movement',
  Crepe: 'soft with a subtle texture and fluid fall',
  'Moss Crepe': 'soft with a subtle texture and fluid fall',
  Poplin: 'crisp, smooth and lightweight',
  Denim: 'sturdy, structured and long-lasting',
  Velvet: 'plush, soft and rich to the touch',
  Knit: 'stretchy, soft and comfortable',
  Jersey: 'stretchy, soft and comfortable',
  Wool: 'warm, cosy and insulating',
  Fleece: 'warm, cosy and insulating',
  Lace: 'delicate with an intricate finish',
  Modal: 'silky-soft and breathable',
  Tencel: 'silky-soft and breathable',
  Lycra: 'stretchy and comfortable with good recovery',
  Polyester: 'smooth, durable and easy to maintain',
};

// Fit group -> fit line
const FIT_FEEL = {
  Loose: 'easy through the body',
  Relaxed: 'relaxed and comfortable through the body',
  Regular: 'true to size, neither tight nor loose',
  Slim: 'close to the body without being restrictive',
  Bodycon: 'hugs the body and follows your shape',
  Oversize: 'roomy, with a deliberately generous silhouette',
  'Fit & Flare': 'fitted at the top and flaring out below',
};

// Data values: opaque / semi sheer / sheer
const TRANSPARENCY_MAP = {
  opaque: 'Opaque',
  'semi sheer': 'Semi-sheer',
  sheer: 'Sheer',
};

// Data values: with / without
const LINING_MAP = {
  with: 'Lined',
  without: 'Unlined',
};

const fabricAttr = FILTER_ATTRS.find((a) => a.key === 'fabric');
const fitAttr = FILTER_ATTRS.find((a) => a.key === 'fit');

const buildDescriptionHTML = (p) => {
  const type = clean(p.styleType).toLowerCase() || 'piece';
  const color = clean(p.stylePrimaryColor).toLowerCase();

  // Fabric
  const fabricRaw = clean(p.fabrics?.[0]?.name) || clean(p.fabricType);
  const fabricGroup = groupAttr(p, fabricAttr)[0];
  const fabricName = (fabricGroup || fabricRaw || '').toLowerCase();
  const fabricFeel = FABRIC_FEEL[fabricGroup] || '';

  // Fit
  const fitRaw = clean(p.fittingType);
  const fitGroup = groupAttr(p, fitAttr)[0];
  const fitLabel = fitRaw
    ? /\bfit$/i.test(fitRaw) || /\bfit\b/i.test(fitRaw)
      ? titleCase(fitRaw)
      : `${titleCase(fitRaw)} Fit`
    : '';
  const fitFeel = FIT_FEEL[fitGroup] || '';

  // Transparency & lining
  const trRaw = clean(p.transparency).toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
  const liningRaw = clean(p.lining).toLowerCase().replace(/\s+/g, ' ');

  const transparency = !trRaw
    ? ''
    : TRANSPARENCY_MAP[trRaw] ||
      (trRaw.includes('semi')
        ? 'Semi-sheer'
        : trRaw.includes('sheer')
          ? 'Sheer'
          : trRaw.includes('opaque')
            ? 'Opaque'
            : '');

  // NOTE: check 'without' BEFORE 'with' (without also starts with with)
  const lining = !liningRaw
    ? ''
    : LINING_MAP[liningRaw] ||
      (liningRaw.startsWith('without') ? 'Unlined' : liningRaw.startsWith('with') ? 'Lined' : '');

  const trLining = [transparency, lining].filter(Boolean).join('. ');

  // Care
  const care = clean(p.washCare);

  // Occasion
  const occasions = String(p.occasion || '')
    .split(/[,/|]+/)
    .map((o) => clean(o).toLowerCase())
    .filter(Boolean);
  const occasionLine =
    occasions.length === 0 || occasions.length >= 4
      ? 'Versatile enough for most occasions.'
      : `Made for ${joinList(occasions)}.`;

  // Intro paragraph
  const intro =
    `A straightforward ${[fabricName, type].filter(Boolean).join(' ')}` +
    `${color ? ` in ${color}` : ''}. ` +
    `${fitLabel ? `${fitLabel} cut, proper construction,` : 'Proper construction,'} ` +
    `and a shape that accommodates real bodies through a real day. ` +
    `No gimmicks — just a well-made ${type}. ${occasionLine}`;

  // Detail list
  const items = [
    fabricRaw && [
      'Fabric',
      [titleCase(fabricGroup || fabricRaw), fabricFeel].filter(Boolean).join(', '),
    ],
    fitLabel && ['Fit', [fitLabel, fitFeel].filter(Boolean).join(', ')],
    trLining && ['Transparency &amp; lining', trLining],
    care && ['Care', care],
  ].filter(Boolean);

  const list = items.length
    ? `<ul>${items.map(([l, v]) => `<li><b>${l}:</b> ${escapeHtml(v)}</li>`).join('')}</ul>`
    : '';

  // Closing paragraph (same for every product)
  const closing =
    '<p>Sizes XXS to 5XL, with no price difference between them. Use our detailed size chart on the product page to match your measurements to the right size. Returns are free if the fit is not right.</p>';

  return `<p>${escapeHtml(intro)}</p>${list}${closing}`;
};

/* ════════════════════════════════════════════════════════════════════════ */

/* ── SEO Title & Description Builder ───────────────────────────────────── */
const buildSEO = (p) => {
  const type = titleCase(clean(p.styleType) || 'Top');
  const color = titleCase(clean(p.stylePrimaryColor));
  const fabric = groupAttr(p, fabricAttr)[0] || '';

  // Pattern: pehla raw value, Solid/Plain skip
  const patternRaw = clean(String(p.prints || '').split(/[,/|]+/)[0]);
  const pattern = /solid|plain/i.test(patternRaw) ? '' : titleCase(patternRaw);

  const sleeve = titleCase(clean(p.sleeveType));

  const fitRaw = clean(p.fittingType);
  const fit = fitRaw
    ? /\bfit\b/i.test(fitRaw)
      ? titleCase(fitRaw)
      : `${titleCase(fitRaw)} Fit`
    : '';

  // ── SEO Title: 60 char ke andar rakhne ke liye detail kam karta jaata hai ──
  const suffix = ' for Women | XXS-5XL | Qurvii';
  const titleOptions = [
    [color, pattern, fabric, type],
    [color, fabric, type],
    [color, type],
    [type],
  ].map((parts) => parts.filter(Boolean).join(' ') + suffix);
  const seoTitle =
    titleOptions.find((t) => t.length <= 60) || titleOptions[titleOptions.length - 1];

  // ── SEO Description: 155 char ke andar ──
  const head = `${[color, fabric, type.toLowerCase()].filter(Boolean).join(' ')} for women in sizes XXS to 5XL.`;
  const tail = 'Same price every size. Free shipping.';
  const descOptions = [
    [head, sleeve && `${sleeve}.`, fit && `${fit}.`, tail],
    [head, fit && `${fit}.`, tail],
    [head, tail],
  ].map((parts) => parts.filter(Boolean).join(' '));
  const seoDescription =
    descOptions.find((d) => d.length <= 155) || descOptions[descOptions.length - 1];

  return { seoTitle, seoDescription };
};

const generateShopifyListing = (selectedData) => {
  const csvHeaders = [
    'Handle',
    'Command',
    'Title',
    'Body HTML',
    'Vendor',
    'Type',
    'Tags',
    'Tags Command',
    'Status',
    'Published',
    'Published At',
    'Published Scope',
    'Template Suffix',
    'Gift Card',
    'Category: ID',
    'Category: Name',
    'Category',
    'Custom Collections',
    'Image Attachment',
    'Image Src',
    'Image Command',
    'Image Position',
    'Image Alt Text',
    'Title 1',
    'Variant ID',
    'Variant Command',
    'Option1 Name',
    'Option1 Value',
    'Option2 Name',
    'Option2 Value',
    'Option3 Name',
    'Option3 Value',
    'Variant Generate From Options',
    'Variant Position',
    'Variant SKU',
    'Variant Weight',
    'Variant Weight Unit',
    'Variant HS Code',
    'Variant Country of Origin',
    'Variant Province of Origin',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Cost',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Variant Tax Code',
    'Variant Barcode',
    'Variant Image',
    'SEO Title',
    'SEO Description',
    'Variant Inventory Tracker',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Inventory Qty',
    'Variant Inventory Adjust',
    // ── custom.* = raw product detail (shown on the product page) ──
    'Metafield:custom.fabric [string]',
    'Metafield:custom.pattern [string]',
    'Metafield:custom.fit [string]',
    'Metafield:custom.sleeve [string]',
    'Metafield:custom.lining [string]',
    'Metafield:custom.wash_care [string]',
    'Metafield:custom.transparency [string]',
    'Metafield:custom.closure [string]',
    // ── filter.* = grouped values (single source of truth for Search & Discovery) ──
    ...FILTER_HEADERS,
  ];

  const sizeMapping = {
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

  const sizes = Object.keys(sizeMapping);

  // Date suffix for handle (DDMMYYYY) — computed once, same for every row
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const time = `${day}${month}${year}`;

  const csvData = selectedData.flatMap((product) => {
    // Computed ONCE per product, then repeated on each size row.
    const filterFields = buildFilterFields(product);
    const bodyHtml = buildDescriptionHTML(product);
    const { seoTitle, seoDescription } = buildSEO(product);

    const tag = [
      product.stylePrimaryColor,
      product.styleType,
      product.fabricType,
      product.prints?.replaceAll('/', ','),
      product.occasion?.replaceAll('/', ','),
      product.neckStyle,
      product.mainTrend,
      product.fittingType,
      product.collarType,
      product.sleeveType,
      product.sleeveLength,
      product.season?.replaceAll('/', ','),
      product.hemline,
      product.transparency,
      product.washCare,
      product.dressType,
      product.shirtType,
      product.primaryColorShade,
    ]
      .filter(Boolean)
      .join(',');

    const handle = (product.styleName || '').trim().toLowerCase().replace(/\s+/g, '-') + '-' + time;

    return sizes.map((size) => {
      const mappedSize = sizeMapping[size];

      return {
        Handle: handle,
        Command: 'MERGE',
        Title: product.styleName || '',
        'Body HTML': bodyHtml,
        Vendor: 'Qurvii',
        Type: product.styleType || '',
        Tags: `Qurvii Women, ${tag.toLowerCase()}, women's fashion, casual wear, women's clothing, New Arrivals, New Arrival`,
        'Tags Command': '',
        Status: 'active',
        Published: true,
        'Published At': '',
        'Published Scope': '',
        'Template Suffix': '',
        'Gift Card': '',
        'Category: ID': '',
        'Category: Name': '',
        Category: '',
        'Custom Collections': '',
        'Image Attachment': '',
        'Image Src': '',
        'Image Command': '',
        'Image Position': '',
        'Image Alt Text': product.styleName || '',
        'Title 1': product.styleName || '',
        'Variant ID': '',
        'Variant Command': '',
        'Option1 Name': 'SIZE',
        'Option1 Value': mappedSize || '',
        'Option2 Name': '',
        'Option2 Value': '',
        'Option3 Name': '',
        'Option3 Value': '',
        'Variant Generate From Options': '',
        'Variant Position': '',
        'Variant SKU': `${product.styleNumber || ''}-${product.stylePrimaryColor || ''}-${mappedSize}`,
        'Variant Weight': 0,
        'Variant Weight Unit': 'g',
        'Variant HS Code': '',
        'Variant Country of Origin': 'India',
        'Variant Province of Origin': '',
        'Variant Price': product.mrp || 0,
        'Variant Compare At Price': product.mrp || 0,
        'Variant Cost': '',
        'Variant Requires Shipping': true,
        'Variant Taxable': true,
        'Variant Tax Code': '',
        'Variant Barcode': '',
        'Variant Image': '',
        'SEO Title': seoTitle || '',
        'SEO Description': seoDescription || '',
        'Variant Inventory Tracker': 'shopify',

        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Inventory Qty': 100,
        'Variant Inventory Adjust': 0,
        // custom.* = raw detail
        'Metafield:custom.fabric [string]': product.fabrics?.[0]?.name || '',
        'Metafield:custom.pattern [string]': product.prints || '',
        'Metafield:custom.fit [string]': product.fittingType || '',
        'Metafield:custom.sleeve [string]': product.sleeveLength || 'Sleeveless',
        'Metafield:custom.lining [string]': product?.lining || '',
        'Metafield:custom.wash_care [string]': product.washCare || '',
        'Metafield:custom.transparency [string]': product?.transparency || '',
        'Metafield:custom.closure [string]': product?.closure
          ? product.closure.toLowerCase().trim().includes('not applicable')
            ? 'Other'
            : product.closure
          : '',
        // filter.* = grouped, ready for Search & Discovery
        ...filterFields,
      };
    });
  });

  const csv = Papa.unparse({
    fields: csvHeaders,
    data: csvData,
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Shopify_Listing.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export { generateShopifyListing };
