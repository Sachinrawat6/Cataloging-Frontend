import Papa from 'papaparse';

const generateTatacliqListing = (selectedData) => {
  const csvHeaders = [
    'SKUCODE',
    'CATEGORY_NAME',
    'inventorydetails',
    'HSNCODE',
    '#ATTR_colorapparel_Color',
    '#ATTR_menpattern_Pattern',
    '#ATTR_sizechart_Size Chart',
    '#ATTR_washcare_Wash Care',
    '#ATTR_stylecode_Style Code',
    '#ATTR_fittopwearmen_Fit',
    '#ATTR_mencasualtopwearsize_Size',
    '#ATTR_fabricapparel_Fabric',
    '#ATTR_waistrise_Waist Rise',
    '#ATTR_denimtreatments_Denim Treatments',
    'TITLE',
    'DESCRIPTION',
    'PBIIDENTITYCODE',
    'PBIIDENTITYVALUE',
    '#ATTR_menfabric_Fabric Family',
    '#ATTR_mencasualtopwearcollarneck_Neck/Collar',
    '#ATTR_brand_Brand',
    '#ATTR_mensleeve_Sleeve',
    '#ATTR_occasion_Occasion',
    '#ATTR_colorfamilyapparel_Color Family',
    '#ATTR_trousertype_Trouser Type',
    '#ATTR_brieftype_Brief Type',
    'VIDEOURL',
    '#ATTR_multipack_Multi Pack',
    '#ATTR_mrp_MRP [INR]',
    '#ATTR_packquantity_Pack Quantity',
    '#ATTR_mensetcontents_Set Contents',
    '#ATTR_setitems_Set Items',
    '#ATTR_collectionapparel_Collection',
    '#ATTR_seasonapparel_Season',
    'LENGTH',
    'WIDTH',
    'HEIGHT',
    'WEIGHT',
    '#ATTR_ageband_Age Band',
    '#ATTR_brandDescription_Brand Description',
    '#ATTR_weightapparel_Weight',
    '#ATTR_sellerAssociationStatus_Seller Product Association Status',
    '#ATTR_warrantyType_Warranty Type',
    '#ATTR_leadTimeForTheSKUHomeDelivery_Lead time for the SKU - Home Delivery [No. of days]',
    '#ATTR_unisexapparel_Unisex',
    '#ATTR_leadvariantid_Lead Variant ID',
    '#ATTR_displayproduct_Display Product Name',
    '#ATTR_modelfit_Model Fit',
    '#ATTR_packcolor_Pack Color',
    '#ATTR_warrantyTimePeriod_Warranty Time Period [Months]',
    '#ATTR_tshirttype_Tshirt Type',
    'Product Type',
  ];

  // ==================== HSN MAPPING ====================
  // Structure: hsnMapping[garmentGroup][fabricFamily] = HSN code
  // garmentGroup is derived from styleType, fabricFamily from fabric name

  const hsnMapping = {
    Dress: {
      Cotton: '61044200',
      Silk: '62044300',
      Wool: '62044200',
      Synthetic: '61044300',
      Blended: '61044400',
    },
    'Shirt Dress': {
      Cotton: '61044200',
      Silk: '62044300',
      Wool: '62044200',
      Synthetic: '61044300',
      Blended: '61044400',
    },
    Kaftan: {
      Cotton: '61044200',
      Silk: '62044300',
      Wool: '62044200',
      Synthetic: '61044300',
      Blended: '61044400',
    },
    Top: {
      Cotton: '62063000',
      Silk: '62064000',
      Wool: '62062000',
      Synthetic: '61061000',
      Blended: '61062000',
    },
    Shirt: {
      Cotton: '62063000',
      Silk: '62064000',
      Wool: '62062000',
      Synthetic: '61061000',
      Blended: '61062000',
    },
    Skirt: {
      Cotton: '62045200',
      Silk: '62045300',
      Wool: '62045200',
      Synthetic: '61045300',
      Blended: '61045400',
    },
    Pant: {
      Cotton: '62046200',
      Silk: '62046300',
      Wool: '62046200',
      Synthetic: '61046300',
      Blended: '61046400',
    },
    Trouser: {
      Cotton: '62046200',
      Silk: '62046300',
      Wool: '62046200',
      Synthetic: '61046300',
      Blended: '61046400',
    },
    Plazzo: {
      Cotton: '62046200',
      Silk: '62046300',
      Wool: '62046200',
      Synthetic: '61046300',
      Blended: '61046400',
    },
    Jacket: {
      Cotton: '62033200',
      Silk: '62033300',
      Wool: '62033100',
      Synthetic: '62043400',
      Blended: '62044400',
    },
    Coat: {
      Cotton: '62033200',
      Silk: '62033300',
      Wool: '62033100',
      Synthetic: '62043400',
      Blended: '62044400',
    },
    // Hoodie / Sweatshirt / Shrug — not in the provided table, fallback used
  };

  /**
   * Normalises a raw fabric name into one of the 5 fabric families:
   * Cotton | Silk | Wool | Synthetic | Blended
   */
  const getFabricFamily = (fabricName = '') => {
    const f = fabricName.toLowerCase().trim();

    if (f.includes('cotton')) return 'Cotton';
    if (
      f.includes('silk') ||
      f.includes('satin') ||
      f.includes('chiffon') ||
      f.includes('georgette')
    )
      return 'Silk';
    if (f.includes('wool') || f.includes('fleece') || f.includes('knit')) return 'Wool';
    if (
      f.includes('polyester') ||
      f.includes('nylon') ||
      f.includes('acrylic') ||
      f.includes('spandex') ||
      f.includes('lycra') ||
      f.includes('viscose') ||
      f.includes('rayon')
    )
      return 'Synthetic';
    if (f.includes('blend') || f.includes('mix') || f.includes('linen')) return 'Blended';

    // Default fallback
    return 'Blended';
  };

  /**
   * Returns the correct HSN code for a product.
   * Falls back to '62114290' if no mapping found.
   */
  const getHsnCode = (styleType = '', fabricName = '') => {
    const garmentMap = hsnMapping[styleType?.trim()];
    if (!garmentMap) return '62114290'; // fallback for unmapped garment types

    const fabricFamily = getFabricFamily(fabricName);
    return garmentMap[fabricFamily] || '62114290';
  };
  // ==================== END HSN MAPPING ====================

  const sizeMapping = {
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

  const sizes = Object.keys(sizeMapping);

  const csvData = selectedData.flatMap((product) =>
    sizes.map((size) => {
      const mappedSize = sizeMapping[size];

      let product_category = {
        dress: 'AWWDressmaterial',
        top: 'AWWTopsandtees',
        shirt: 'AWWcasualshirts',
        jacket: 'AWWFormalcoatsjackets',
        coat: 'AWWFormalcoatsjackets',
        plazzo: 'AWWSTrackpants',
        pant: 'AWWSTrackpants',
        shorts: 'AWWShorts',
        short: 'AWWShorts',
        'night dress': 'AWWDressmaterial',
        trouser: 'AWWSTrackpants',
        shrug: 'AWWShrugsandcardigans',
        skirt: 'AWWSkirts',
        kaftan: 'AWWDressmaterial',
        'shirt dress': 'AWWDressmaterial',
        hoodie: 'AWWSweatshirtsandhoodies',
        sweatshirt: 'AWWSweatshirtsandhoodies',
        blazer: 'AWWCasualjacketsandblazers',
      };

      let category_name =
        typeof product.styleType === 'string' ? product.styleType?.toLowerCase()?.trim() : '';
      let productCategory = product_category[category_name] || product.styleType;

      let seasonYear = new Date().getFullYear();

      const fittingTypeMap = {
        'Loose Fit': 'Relaxed Fit',
        'Regular Fit': 'Regular Fit',
        'Slim Fit': 'Slim Fit',
        'Relaxed Fit': 'Relaxed Fit',
        'Stretch Fit': 'Slim Fit',
        Oversized: 'Relaxed Fit',
        'Regular Fit, Loose Fit': 'Regular Fit',
        'Regular Fit, Western': 'Regular Fit',
        'Regular Fit, Loose Fit, Classic': 'Regular Fit',
        'Regular Fit, Loose Fit, Western': 'Regular Fit',
        'Regular Fit, Western, Relaxed': 'Regular Fit',
        'Regular Fit, Loose Fit, Relaxed': 'Regular Fit',
        'Regular Fit, Relaxed': 'Regular Fit',
        'Regular Fit, Slim Fit, Relaxed': 'Regular Fit',
        'Regular Fit, Slim Fit, Western, Classic': 'Regular Fit',
        'Regular Fit, Slim Fit, Classic': 'Regular Fit',
        'Loose Fit, Western, Fusion': 'Relaxed Fit',
        'Regular Fit, Loose Fit, Western, Relaxed': 'Regular Fit',
        'Loose Fit, Western, Relaxed': 'Relaxed Fit',
        'Loose Fit, Western, Fusion, Relaxed': 'Relaxed Fit',
        'Slim Fit, Relaxed': 'Slim Fit',
        'Regular Fit, Western, Regular fit': 'Regular Fit',
        'Western, Fusion, Relaxed': 'Relaxed Fit',
        'Regular Fit, Loose Fit, Western, Fusion': 'Regular Fit',
        'Fit & Flare': 'Flared Fit',
        Bodycon: 'Slim Fit',
      };

      let occasion = 'Casual Wear';
      if (product.occasion && typeof product.occasion === 'string') {
        const occasionText = product.occasion.toLowerCase();
        if (occasionText.includes('evening') || occasionText.includes('festival')) {
          occasion = 'Evening Wear';
        } else if (occasionText.includes('casual')) {
          occasion = 'Casual Wear';
        }
      }

      // ==================== PRINT → TATACLIQ PATTERN MAPPING ====================
      // Valid Tatacliq dropdown values:
      // Print | Solid | Lace | Stripes | Paisley | Floral | Pin Stripes | Geometric |
      // Checks | Embroidery | Metallic | Embellished | Polka Dot | Animal Print |
      // Other | Color-Block | Structured

      // Exact match map — raw print value (lowercased & trimmed) → Tatacliq value
      const exactPrintMap = {
        // Solid variants
        solid: 'Solid',
        'bandhani solid': 'Solid',
        'solid,': 'Solid',
        'solid, pastels': 'Solid',
        'solid, pastels, floral': 'Floral',
        'solid, brocade': 'Solid',
        'solid, printed': 'Print',
        'solid, paisley': 'Paisley',
        'solid, geometric': 'Geometric',
        'solid, heart': 'Print',
        'solid, abstract': 'Print',
        'solid, zebra': 'Animal Print',
        'solid, leopard': 'Animal Print',
        'solid, animal, leopard': 'Animal Print',
        'solid, animal': 'Animal Print',
        'solid, check': 'Checks',
        'solid, tropical': 'Print',
        'solid, polka': 'Polka Dot',
        'solid, polka, camouflage': 'Polka Dot',
        'solid, tie and dye print': 'Other',

        // Floral variants
        floral: 'Floral',
        'floral solid': 'Floral',
        'floral, polka': 'Floral',
        'floral, stripe': 'Floral',
        'abstract, floral': 'Floral',
        'abstract, tropical, floral': 'Floral',
        'ikat paisley, floral': 'Floral',
        'pastels, floral': 'Floral',
        'abstract, pastels, floral': 'Floral',

        // Stripe variants
        stripe: 'Stripes',
        striped: 'Stripes',
        'chevron stripe': 'Stripes',
        'tropical, stripe': 'Stripes',
        'pastels, stripe': 'Stripes',
        'geometric, stripe': 'Stripes',
        'check, stripe': 'Stripes',
        'animal, stripe': 'Stripes',
        'stripe, heart print': 'Stripes',
        'stripe, polka': 'Polka Dot',

        // Animal print variants
        animal: 'Animal Print',
        'animal, floral': 'Animal Print',
        'animal, pastels': 'Animal Print',
        'animal,': 'Animal Print',
        'animal, zebra': 'Animal Print',
        'animal, leopard': 'Animal Print',
        leopard: 'Animal Print',
        zebra: 'Animal Print',
        tiger: 'Animal Print',
        cow: 'Animal Print',

        // Polka dot variants
        polka: 'Polka Dot',
        'polka dots': 'Polka Dot',
        'polka dot': 'Polka Dot',
        'polka dot print': 'Polka Dot',
        'multi dot print': 'Polka Dot',
        'swiss-dot': 'Polka Dot',
        'swiss dott': 'Polka Dot',
        'pastels, swiss-dot': 'Polka Dot',
        'pastels, polka': 'Polka Dot',
        'geometric, polka': 'Polka Dot',

        // Checks variants
        checked: 'Checks',
        check: 'Checks',
        'check, plaid': 'Checks',
        plaid: 'Checks',
        gingham: 'Checks',
        'hounds tooth': 'Checks',
        houndstooth: 'Checks',

        // Geometric variants
        geometric: 'Geometric',
        'geometric floral': 'Geometric',
        'geometric, pastels': 'Geometric',
        'geometric, embroidered': 'Embroidery',
        'abstract, geometric': 'Geometric',

        // Paisley variants
        paisley: 'Paisley',
        'paisley animal': 'Paisley',
        'ajrakh paisley': 'Paisley',
        'ikat paisley': 'Paisley',
        'solid, paisley': 'Paisley',

        // Embroidery / Embellished
        embellished: 'Embellished',
        embroidered: 'Embroidery',
        schiffli: 'Embroidery',
        'thread work': 'Embroidery',
        zari: 'Embroidery',
        sequenced: 'Embellished',

        // Abstract / Print
        abstract: 'Print',
        'abstract,': 'Print',
        'abstract, pastels': 'Print',
        'abstract, tropical': 'Print',
        'abstract, zebra': 'Animal Print',
        tropical: 'Print',
        'digital printed': 'Print',
        graphic: 'Print',
        'ethnic motifs': 'Print',
        'ikat print': 'Print',
        ajrakh: 'Print',
        printed: 'Print',
        'pastels, printed': 'Print',
        print: 'Print',
        'panel print': 'Print',
        'border print': 'Print',
        'bird print': 'Print',
        'face print': 'Print',
        'cherry print': 'Print',
        'heart print': 'Print',
        hearts: 'Print',
        heart: 'Print',
        'sunglass print': 'Print',
        'block print': 'Print',

        // Color-Block
        colourblocked: 'Color-Block',
        colorblock: 'Color-Block',
        'color-block': 'Color-Block',
        colorblocked: 'Color-Block',

        // Tie & Dye variants
        'tie & dye': 'Other',
        'tie-dye': 'Other',
        'tie dye': 'Other',
        'tie and dye': 'Other',
        'tie & dye pattern': 'Other',

        // Specialty / Other
        leheriya: 'Other',
        tribal: 'Other',
        camouflage: 'Other',
        quirky: 'Other',
        ombre: 'Other',
        pastels: 'Other',
        'marbel print': 'Other',
        'woven design': 'Other',
        tweed: 'Structured',
        net: 'Other',
        lace: 'Lace',
        transparent: 'Other',
        perforated: 'Other',
        faded: 'Other',
        batik: 'Other',
        ikat: 'Other',
        'pastels,': 'Other',
      };

      /**
       * Maps a raw print value to a valid Tatacliq pattern dropdown value.
       * Strategy:
       *  1. Exact match (case-insensitive, trimmed)
       *  2. Keyword-priority scan across the raw value
       *  3. Fallback → 'Print'
       */
      const getPatternType = (rawPrint = '') => {
        if (!rawPrint || typeof rawPrint !== 'string') return 'Print';

        const normalised = rawPrint.toLowerCase().trim();

        // 1. Exact match
        if (exactPrintMap[normalised]) return exactPrintMap[normalised];

        // 2. Keyword priority scan (order matters — more specific first)
        const keywordPriority = [
          { keywords: ['leopard', 'tiger', 'zebra', 'cow', 'animal'], value: 'Animal Print' },
          { keywords: ['polka', 'swiss-dot', 'swiss dott', 'dot'], value: 'Polka Dot' },
          {
            keywords: ['embroidered', 'embroidery', 'schiffli', 'zari', 'thread work'],
            value: 'Embroidery',
          },
          { keywords: ['sequenced', 'embellished'], value: 'Embellished' },
          { keywords: ['lace'], value: 'Lace' },
          { keywords: ['paisley', 'ajrakh'], value: 'Paisley' },
          { keywords: ['floral'], value: 'Floral' },
          {
            keywords: ['check', 'plaid', 'gingham', 'houndstooth', 'hounds tooth'],
            value: 'Checks',
          },
          { keywords: ['geometric'], value: 'Geometric' },
          { keywords: ['stripe', 'striped', 'chevron'], value: 'Stripes' },
          { keywords: ['colorblock', 'colourblock', 'color-block'], value: 'Color-Block' },
          {
            keywords: ['tie & dye', 'tie-dye', 'tie dye', 'tie and dye', 'leheriya', 'bandhani'],
            value: 'Other',
          },
          { keywords: ['tweed', 'structured'], value: 'Structured' },
          {
            keywords: [
              'ikat',
              'batik',
              'block print',
              'digital',
              'tribal',
              'ethnic',
              'ombre',
              'camouflage',
            ],
            value: 'Print',
          },
          { keywords: ['solid'], value: 'Solid' },
          {
            keywords: [
              'abstract',
              'tropical',
              'graphic',
              'panel',
              'border',
              'bird',
              'face',
              'cherry',
              'heart',
              'sunglass',
              'print',
              'printed',
            ],
            value: 'Print',
          },
        ];

        for (const { keywords, value } of keywordPriority) {
          if (keywords.some((kw) => normalised.includes(kw))) return value;
        }

        // 3. Fallback
        return 'Print';
      };

      const patternType = getPatternType(product.prints);
      // ==================== END PRINT MAPPING ====================

      const sleeveMapping = {
        Full: 'Long Sleeves',
        'Three Quarter': 'Three-Quarter Sleeves',
        Half: 'Short Sleeves',
        Short: 'Short Sleeves',
        Quarter: 'Three-Quarter Sleeves',
        'Elbow Length': 'Three-Quarter Sleeves',
        Sleeveless: 'Sleeveless',
        'Above Elbow Length': 'Short Sleeves',
      };

      // function to map value
      function mapSleeve(value) {
        return sleeveMapping[value] || 'Sleeveless'; // fallback if not found
      }

      // ==================== NECK MAPPING ====================
      // Valid Tatacliq dropdown values:
      // Band Collar | Boat Neck | Cowl Neck | Mandarin Collar | Halter Neck | Off-Shoulder |
      // Round Neck | Scoop Neck | Shawl Neck | Shirt Collar | Square Neck | Sweetheart Neck |
      // Keyhole Neck | V-Neck | Tie-Up Neck | Stylised Neck | Shoulder Straps | Strapless |
      // Lapel Collar | Hooded | One Shoulder | High Neck | Others

      const neckMapping = {
        // V Neck variants
        'V Neck': 'V-Neck',
        'Wide Collar V Neck': 'V-Neck',

        // Boat Neck
        'Boat Neck': 'Boat Neck',

        // Classic Shirt / Shirt Collar
        'Classic Shirt': 'Shirt Collar',
        'Classic Shirt Collar': 'Shirt Collar',
        'Classic Collar': 'Shirt Collar',
        'Button Front': 'Shirt Collar',

        // Shawl
        'Shawl Collar': 'Shawl Neck',
        Shawl: 'Shawl Neck',

        // Mandarin / Band
        'Mandarin Collar': 'Mandarin Collar',
        'Banded Collar': 'Band Collar',

        // Not Applicable / NA
        'Not Applicable': 'Others',
        NA: 'Others',

        // Halter
        'Halter Neck': 'Halter Neck',

        // Off Shoulder
        'Off Shoulder': 'Off-Shoulder',
        'Off-Shoulder': 'Off-Shoulder',

        // Square Neck
        'Square Neck': 'Square Neck',

        // Round Neck
        'Round Neck': 'Round Neck',

        // Scoop Neck — no direct input but kept for safety
        'Scoop Neck': 'Scoop Neck',

        // Sweetheart
        'Sweat heart Neck': 'Sweetheart Neck',
        'Sweetheart Neck': 'Sweetheart Neck',

        // Keyhole
        'Keyhole neck': 'Keyhole Neck',
        'Keyhole Neck': 'Keyhole Neck',

        // Hooded
        Hooded: 'Hooded',
        hoodie: 'Hooded',

        // One Shoulder
        'One Shoulder': 'One Shoulder',

        // Tie-Up Neck
        'Tie or Bow': 'Tie-Up Neck',
        'Tie-Up Neck': 'Tie-Up Neck',

        // Lapel / Notch Collar
        Tuxedo: 'Lapel Collar',
        'Notch Collar': 'Lapel Collar',
        Notch: 'Lapel Collar',

        // Shoulder Straps
        'Spaghetti Strap': 'Shoulder Straps',

        // Cowl Neck
        'Cowl Neck': 'Cowl Neck',

        // High Neck
        'Crew Neck': 'High Neck',

        // Peter Pan — no exact Tatacliq equivalent, Stylised Neck is closest
        Peterpan: 'Stylised Neck',

        // Catchall Others
        'Option 33': 'Others',
        Other: 'Others',
        'Wide Collar Neck': 'Others',
      };

      const getNeckType = (rawNeck = '') => {
        if (!rawNeck || typeof rawNeck !== 'string') return 'Others';
        const trimmed = rawNeck.trim();

        // 1. Exact match (case-sensitive first)
        if (neckMapping[trimmed]) return neckMapping[trimmed];

        // 2. Case-insensitive exact match
        const lower = trimmed.toLowerCase();
        const found = Object.entries(neckMapping).find(([key]) => key.toLowerCase() === lower);
        if (found) return found[1];

        // 3. Fallback
        return 'Others';
      };
      // ==================== END NECK MAPPING ====================

      let colorFamily = '';
      if (product.stylePrimaryColor.toLowerCase().trim().includes(' pink')) {
        colorFamily = 'Pink';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('lavendar')) {
        colorFamily = 'Purple';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('lavender')) {
        colorFamily = 'Purple';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('wine')) {
        colorFamily = 'Maroon';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('olive')) {
        colorFamily = 'Khaki';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('gray')) {
        colorFamily = 'Grey';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('burgundy')) {
        colorFamily = 'Maroon';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('magenta')) {
        colorFamily = 'Pink';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes(' yellow')) {
        colorFamily = 'Yellow';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes(' blue')) {
        colorFamily = 'Blue';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('rust')) {
        colorFamily = 'Orange';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('green')) {
        colorFamily = 'Green';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('teal')) {
        colorFamily = 'Turquoise';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('lavender blush')) {
        colorFamily = 'Purple';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('mustard')) {
        colorFamily = 'Yellow';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('ivory')) {
        colorFamily = 'White';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('mauve')) {
        colorFamily = 'Pink';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('white')) {
        colorFamily = 'White';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('brown')) {
        colorFamily = 'Brown';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('caramel')) {
        colorFamily = 'Peach';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('fucia')) {
        colorFamily = 'Pink';
      } else if (product.stylePrimaryColor.toLowerCase().trim().includes('orange')) {
        colorFamily = 'Orange';
      } else {
        colorFamily = product.stylePrimaryColor;
      }

      // Resolve HSN dynamically
      const fabricName = product.fabrics?.[0]?.name || '';
      const hsnCode = getHsnCode(product.styleType, fabricName);

      return {
        SKUCODE: `${product.styleNumber}-${product.stylePrimaryColor}-${mappedSize}`,
        CATEGORY_NAME: productCategory,
        inventorydetails: '',
        HSNCODE: hsnCode,
        '#ATTR_colorapparel_Color': product.stylePrimaryColor,
        '#ATTR_menpattern_Pattern': patternType,
        '#ATTR_sizechart_Size Chart': '',
        '#ATTR_washcare_Wash Care': product.washCare,
        '#ATTR_stylecode_Style Code': `AW${seasonYear.toString().slice(2)}${product.patternNumber}`,
        '#ATTR_fittopwearmen_Fit': fittingTypeMap[product.fittingType] || 'Regular Fit',
        '#ATTR_mencasualtopwearsize_Size': mappedSize,
        '#ATTR_fabricapparel_Fabric': product.fabricType,
        '#ATTR_waistrise_Waist Rise': 'Mid Rise',
        '#ATTR_denimtreatments_Denim Treatments': 'Other',
        TITLE: `Qurvii ${product.stylePrimaryColor}  ${product.fittingType} ${product.styleName}`,
        DESCRIPTION: product.styleDescription,
        PBIIDENTITYCODE: 'MPN',
        PBIIDENTITYVALUE: `${product.styleNumber}${product.stylePrimaryColor}${mappedSize}`,
        '#ATTR_menfabric_Fabric Family': fabricName || 'not found',
        '#ATTR_mencasualtopwearcollarneck_Neck/Collar': getNeckType(product.neckStyle),
        '#ATTR_brand_Brand': 'Qurvii',
        '#ATTR_mensleeve_Sleeve': mapSleeve(product.sleeveLength),
        '#ATTR_occasion_Occasion': occasion,
        '#ATTR_colorfamilyapparel_Color Family': colorFamily,
        '#ATTR_trousertype_Trouser Type': '',
        '#ATTR_brieftype_Brief Type': '',
        VIDEOURL: '',
        '#ATTR_multipack_Multi Pack': 'No',
        '#ATTR_mrp_MRP [INR]': product.mrp,
        '#ATTR_packquantity_Pack Quantity': '1',
        '#ATTR_mensetcontents_Set Contents': '',
        '#ATTR_setitems_Set Items': '',
        '#ATTR_collectionapparel_Collection': '',
        '#ATTR_seasonapparel_Season': `AW${seasonYear.toString().slice(2)}`,
        LENGTH: '30',
        WIDTH: '17',
        HEIGHT: '4',
        WEIGHT: '150',
        '#ATTR_ageband_Age Band': '18-45',
        '#ATTR_brandDescription_Brand Description': 'Qurvii',
        '#ATTR_weightapparel_Weight': '',
        '#ATTR_sellerAssociationStatus_Seller Product Association Status': 'No',
        '#ATTR_warrantyType_Warranty Type': 'NA',
        '#ATTR_leadTimeForTheSKUHomeDelivery_Lead time for the SKU - Home Delivery [No. of days]':
          '',
        '#ATTR_unisexapparel_Unisex': '',
        '#ATTR_leadvariantid_Lead Variant ID': '',
        '#ATTR_displayproduct_Display Product Name': `Qurvii ${product.stylePrimaryColor} ${product.fittingType} ${product.styleName}`,
        '#ATTR_modelfit_Model Fit': 'Model is 5ft 9in tall and is wearing size XS',
        '#ATTR_packcolor_Pack Color': '',
        '#ATTR_warrantyTimePeriod_Warranty Time Period [Months]': '',
        '#ATTR_tshirttype_Tshirt Type': '',
        'Product Type': product.styleType,
      };
    })
  );

  const csv = Papa.unparse({
    fields: csvHeaders,
    data: csvData,
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tatacliq_listing.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default generateTatacliqListing;
