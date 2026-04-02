import Papa from 'papaparse';

const generateShoppersStopMaternityListing = (selectedData) => {
  const csvHeaders = [
    'STOCK',
    'HSN',
    'MRP',
    'Attribute',
    'L3/L4 Code',
    'Season',
    'Style Code',
    'Master SKU',
    'Old SKU',
    'EAN',
    'Brand',
    'SIZE',
    'Brand Size',
    'SAP Colour',
    'Color Family',
    'Product Type',
    'Product Title',
    'Collection Name',
    'Product Description',
    'Gender',
    'Fabric',
    'Fabric Composition',
    'Pattern',
    'Specific Pattern',
    'Fit',
    'Occasion',
    'Closure Type',
    'Length',
    'Sleeves',
    'Sleeve Style',
    'Neckline',
    'Collar',
    'Waist Rise',
    'Wash',
    'Bottom Type',
    'Knit/Woven',
    'Pack of',
    'Package Contents',
    'Embroidery Type',
    'Embellishment',
    'Pockets',
    'Stretchable',
    'Hemline',
    'materialCareDescription',
    'Store/Dropship',
    'Search Keyword',
    'Country of Origin',
    'Manufacturer Name With Full Address , phone no and email id',
    'Importer Name With Full Address , phone no and email id',
    'Packer Name With Full Address , phone no and email id',
    'Size',
    'Brand Size',
    'Bust',
    'Across Shoulder',
    'To Fit Waist',
    'Front Length',
    'Inseam Length',
    'Outseam Length',
    'Waist',
    'Hips',
    'Image Reference number / Name',
    'Image Reference number / Name 2',
    'Image Reference number / Name 3',
    'Image Reference number / Name 4',
    'Image Reference number / Name 5',
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

  const sizes = Object.keys(sizeMapping); // ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"]

  const csvData = selectedData.flatMap((product) =>
    sizes.map((size) => {
      const mappedSize = sizeMapping[size]; // Convert size to 2XL, 3XL, etc.

      let product_category = {
        Dress: 'Dresses',
        Top: 'Tops',
        Shirt: 'Shirts',
        Jacket: 'Jackets',
        Coat: 'Coats',
        Plazzo: 'Plazzoes',
        Shrug: 'Shrugs',
      };

      let category_name = typeof product.styleType === 'string' ? product.styleType.trim() : '';
      let productCategory = product_category[category_name] || product.styleType;

      let seasonYear = new Date().getFullYear();

      //   **********************Fitting mapping ***************************************
      let fittingType = 'Regular fit';

      if (product.fittingType && typeof product.fittingType === 'string') {
        const fit = product.fittingType.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        if (fit.includes('relaxed')) {
          fittingType = 'Relaxed Fit';
        } else if (fit.includes('slim')) {
          fittingType = 'Slim fit';
        }
      }

      //   ********************** end of Fitting mapping ***************************************

      //   ********************** start of occasion mapping ***************************************

      let occasion = 'Casual Wear';

      if (product.occasion && typeof product.occasion === 'string') {
        const occasionText = product.occasion.toLowerCase(); // Convert to lowercase for case-insensitive matching

        if (occasionText.includes('evening') || occasionText.includes('festival')) {
          occasion = 'Evening Wear';
        } else if (occasionText.includes('casual')) {
          occasion = 'Casual Wear';
        }
      }

      //   ********************** end of occasion mapping ***************************************

      //   ********************** start of pattern  mapping ***************************************

      const patternList = [
        'Print',
        'Solid',
        'Lace',
        'Stripes',
        'Paisley',
        'Floral',
        'Pin Stripes',
        'Geometric',
        'Checks',
        'Embroidery',
        'Metallic',
        'Embellished',
        'Polka Dot',
        'Animal Print',
        'Other',
        'Color-Block',
        'Structured',
      ];

      let patternType = '';

      if (product.prints && typeof product.prints === 'string') {
        const patternText = product.prints.toLowerCase(); // Normalize input for case-insensitive comparison

        if (patternText === 'leopard' || patternText === 'animal') {
          patternType = 'Animal Print';
        } else if (patternText === 'polka') {
          patternType = 'Polka Dot';
        } else if (patternText === 'check') {
          patternType = 'Checks';
        } else if (patternText === 'stripe') {
          patternType = 'Stripes';
        } else {
          // Find a match in patternList
          patternType =
            patternList.find((pattern) => patternText.includes(pattern.toLowerCase())) || '';
        }
      }

      return {
        STOCK: '',
        HSN: '62114290',
        MRP: product.mrp,
        Attribute: '',
        'L3/L4 Code': '',
        Season: seasonYear,
        'Style Code': `6${product.styleNumber}`,
        'Master SKU': `6${product.styleNumber}-${product.stylePrimaryColor}-${mappedSize}`,
        'Old SKU': '',
        EAN: `6${product.styleNumber}${product.stylePrimaryColor}${mappedSize}`,
        Brand: 'Qurvii',
        SIZE: mappedSize,
        'Brand Size': mappedSize,
        'SAP Colour': product.stylePrimaryColor,
        'Color Family': product.stylePrimaryColor,
        'Product Type': product.styleType,
        'Product Title': product.styleName,
        'Collection Name': '',
        'Product Description': product.styleDescription,
        Gender: 'Women',
        Fabric: product.fabrics[0]?.name,
        'Fabric Composition': '',
        Pattern: patternType || product.prints,
        'Specific Pattern': '',
        Fit: fittingType || product.fittingType,
        Occasion: occasion,
        'Closure Type': product.closure,
        Length: '',
        Sleeves: product.sleeveLength || '',
        'Sleeve Style': '',
        Neckline: product.neckStyle || '',
        Collar: product.collarType || '',
        'Waist Rise': 'Mid Rise',
        Wash: product.primaryColorShade || 'Light Wash',
        'Bottom Type': '',
        'Knit/Woven': 'Woven',
        'Pack of': 1,
        'Package Contents': `1 ${product.styleType}`,
        'Embroidery Type': '',
        Embellishment: '',
        Pockets: '',
        Stretchable: 'No',
        Hemline: '',
        materialCareDescription: product.washCare,
        'Store/Dropship': 'Dropship',
        'Search Keyword': '',
        'Country of Origin': 'India',
        'Manufacturer Name With Full Address , phone no and email id':
          'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com',
        'Importer Name With Full Address , phone no and email id':
          'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com',
        'Packer Name With Full Address , phone no and email id':
          'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com',
        Size: mappedSize,
        'Brand Size': mappedSize,
        Bust: 0,
        'Across Shoulder': 0,
        'To Fit Waist': 0,
        'Front Length': 0,
        'Inseam Length': 0,
        'Outseam Length': 0,
        Waist: 0,
        Hips: 0,
        'Image Reference number / Name': '',
        'Image Reference number / Name 2': '',
        'Image Reference number / Name 3': '',
        'Image Reference number / Name 4': '',
        'Image Reference number / Name 5': '',
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
  link.download = 'shoppersStop_listing.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { generateShoppersStopMaternityListing };
