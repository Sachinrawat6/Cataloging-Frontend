import Papa from 'papaparse';

const generateShopifyUSListing = (selectedData) => {
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
    'Variant Inventory Tracker',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Inventory Qty',
    'Variant Inventory Adjust',
    'Metafield:custom.fabric [string]',
    'Metafield:custom.pattern [string]',
    'Metafield:custom.fit [string]',
    'Metafield:custom.sleeve [string]',
    'Metafield:custom.lining [string]',
    'Metafield:custom.wash_care [string]',
    'Metafield:custom.transparency [string]',
    'Metafield:custom.closure [string]',
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
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      let time = `${day.toString().length === 1 ? `0${day}` : day}${month.toString().length === 1 ? `0${month}` : month}${year}`;

      const tag = `${product.stylePrimaryColor},${product.styleType},${product.fabricType},${product.prints?.replaceAll('/', ',')},${product.occasion?.replaceAll('/', ',')},${product.neckStyle},${product.mainTrend},${product.fittingType},${product.collarType},${product.sleeveType},${product.sleeveLength},${product.season?.replaceAll('/', ',')},${product.hemline},${product.transparency},${product.washCare},${product.dressType},${product.shirtType},${product.primaryColorShade}`;

      return {
        Handle: product.styleName.trim().toLowerCase().replace(/\s+/g, '-') + '-' + String(time),
        Command: 'MERGE',
        Title: product.styleName || '',
        'Body HTML': product.styleDescription || '',
        Vendor: 'Qurvii',
        Type: product.styleType,
        // Tags: `Qurvii Women, ${product.stylePrimaryColor}, ${product.prints},${product?.season},${product?.occasion} women's fashion, casual wear, women's clothing, ${product.styleType}, New Arrivals , New Arrival`,
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
        'Variant SKU': `${product.styleNumber}-${product.stylePrimaryColor}-${mappedSize}`,
        'Variant Weight': 0,
        'Variant Weight Unit': 'g',
        'Variant HS Code': '',
        'Variant Country of Origin': 'India',
        'Variant Province of Origin': '',
        'Variant Price': product.msrpUSD,
        'Variant Compare At Price': product.msrpUSD,
        'Variant Cost': '',
        'Variant Requires Shipping': true,
        'Variant Taxable': true,
        'Variant Tax Code': '',
        'Variant Barcode': '',
        'Variant Image': '',
        'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Inventory Qty': 100,
        'Variant Inventory Adjust': 0,
        'Metafield:custom.fabric [string]': product.fabrics[0]?.name,
        'Metafield:custom.pattern [string]': product.prints,
        'Metafield:custom.fit [string]': product.fittingType,
        'Metafield:custom.sleeve [string]': product.sleeveLength || 'Sleeveless',
        'Metafield:custom.lining [string]': product?.lining || '',
        'Metafield:custom.wash_care [string]': product.washCare,
        'Metafield:custom.transparency [string]': product?.transparency || '',
        'Metafield:custom.closure [string]': product?.closure
          .toLowerCase()
          .trim()
          .includes('not applicable')
          ? 'Other'
          : product?.closure || '',
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
  link.download = 'Shopify_US_Listing.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { generateShopifyUSListing };
