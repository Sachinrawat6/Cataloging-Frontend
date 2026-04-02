import Papa from 'papaparse';

const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL'];

const sizeData = {
  XXS: [],
  XS: [],
  S: [],
  M: [],
  L: [],
  XL: [],
  XXL: [],
  XXXL: [],
  XXXXL: [],
  XXXXXL: [],
};

// Across Shoulder 0
sizeData.XXS.push(13.5);
sizeData.XS.push(13.5);
sizeData.S.push(14);
sizeData.M.push(14.5);
sizeData.L.push(15);
sizeData.XL.push(15.5);
sizeData.XXL.push(16);
sizeData.XXXL.push(16.5);
sizeData.XXXXL.push(17);
sizeData.XXXXXL.push(17.5);

// Bust 1
sizeData.XXS.push(33.5);
sizeData.XS.push(35.5);
sizeData.S.push(37.5);
sizeData.M.push(39.5);
sizeData.L.push(41.5);
sizeData.XL.push(43.5);
sizeData.XXL.push(45.5);
sizeData.XXXL.push(47.5);
sizeData.XXXXL.push(49.5);
sizeData.XXXXXL.push(51.5);

// Chest 2
sizeData.XXS.push(32.5);
sizeData.XS.push(34.5);
sizeData.S.push(36.5);
sizeData.M.push(38.5);
sizeData.L.push(40.5);
sizeData.XL.push(42.5);
sizeData.XXL.push(44.5);
sizeData.XXXL.push(46.5);
sizeData.XXXXL.push(48.5);
sizeData.XXXXXL.push(50.5);

// Waist 3
sizeData.XXS.push(25.5);
sizeData.XS.push(27.5);
sizeData.S.push(29.5);
sizeData.M.push(31.5);
sizeData.L.push(33.5);
sizeData.XL.push(35.5);
sizeData.XXL.push(37.5);
sizeData.XXXL.push(39.5);
sizeData.XXXXL.push(41.5);
sizeData.XXXXXL.push(43.5);

// Hips 4
sizeData.XXS.push(35.5);
sizeData.XS.push(37.5);
sizeData.S.push(39.5);
sizeData.M.push(41.5);
sizeData.L.push(43.5);
sizeData.XL.push(45.5);
sizeData.XXL.push(47.5);
sizeData.XXXL.push(49.5);
sizeData.XXXXL.push(51.5);
sizeData.XXXXXL.push(53.5);

// Myntra dropdown color
const Prominent_Colour = [
  'Red',
  'Blue',
  'Green',
  'Black',
  'Purple',
  'White',
  'Pink',
  'Grey',
  'Brown',
  'Yellow',
  'Orange',
  'Navy Blue',
  'Maroon',
  'Cream',
  'Silver',
  'Gold',
  'Tan',
  'Beige',
  'Peach',
  'Multi',
  'Copper',
  'Steel',
  'Olive',
  'Khaki',
  'Rose',
  'Taupe',
  'Off White',
  'Metallic',
  'Charcol',
  'Grey Melange',
  'Turquoise Blue',
  'Coffee Brown',
  'Sea Green',
  'Lavender',
  'Lime Green',
  'Magenta',
  'Burgundy',
  'Teal',
  'Nude',
  'Bronze',
  'Fluorescent Green',
  'Rust',
  'Mustard',
  'NA',
  'Mauve',
  'Coral',
  'Rose Gold',
  'Assorted',
  'Champagne',
  'Fuchsia',
  'Violet',
  'Camel Brown',
  'Transparent',
];
const Fabric_Dresses = [
  'Cotton',
  'Other',
  'Polyester',
  'Nylon',
  'Viscose Rayon',
  'Synthetic',
  'Cashmere',
  'Linen',
  'Silk',
  'Wool',
  'Linen Blend',
  'Tencel',
  'Acrylic',
  'Modal',
  'Ramie',
  'Leather',
  'Bemberg',
  'Khadi',
  'Pure Wool',
  'Wool Blend',
  'Liva',
  'Brasso',
  'Jacquard',
  'Livaeco',
  'Polyester PU Coated',
  'Georgette',
  'Organic Cotton',
  'Bamboo',
  'Poly Silk',
];
const Fabric_Type_Dresses = [
  'Chiffon',
  'Georgette',
  'Denim',
  'Net',
  'Lace',
  'Crepe',
  'Satin',
  'Jacquard',
  'Cotton',
  'Linen',
  'Knitted',
  'Velvet',
  'NA',
  'Scuba',
  'Liva',
  'Dobby',
  'Corduroy',
  'Cotton Cambric',
  'Chambray',
  'Schiffli',
];
const Occasion_Values = ['Casual', 'Formal', 'Party', 'Maternity', 'Sports'];
const Neckline_Values = [
  'V-Neck',
  'Round Neck',
  'Boat Neck',
  'Halter Neck',
  'Off-Shoulder',
  'Strapless',
  'Square Neck',
  'Shirt Collar',
  'Mock Neck',
  'One Shoulder',
  'Cowl Neck',
  'Mandarin Collar',
  'Scoop Neck',
  'Peter Pan Collar',
  'Sweetheart Neck',
  'Tie-Up Neck',
  'Shoulder Straps',
  'Keyhole Neck',
  'Choker Neck',
  'Hood',
  'Asymmetric Neck',
  'Above the Keyboard Collar',
  'High Neck',
  'Plunge Neck',
  'Scarf Neck',
];

const Patterns_Values = [
  'Checked',
  'Solid',
  'Striped',
  'Printed',
  'Embroidered',
  'Self Design',
  'Embellished',
  'Colourblocked',
  'Dyed',
];
const Fit_Shirts = ['Regular Fit', 'Slim Fit', 'Skinny Fit', 'Tailored Fit', 'Boxy'];
const Closure_Values = ['Zip', 'Concealed Zip', 'Button', 'Hook and Eye', 'NA'];
const Weave_Pattern = [
  'Denim',
  'Chambray',
  'Oxford',
  'Twill',
  'Regular',
  'Corduroy',
  'Knitted',
  'Flannel',
  'Seersucker',
];

const generateMyntraCoatMaternityListingFile = (selectedData, csvHeaders) => {
  const sizeMapping = {
    XXS: 'XXS',
    XS: 'XS',
    S: 'S',
    M: 'M',
    L: 'L',
    XL: '1XL',
    XXL: '2XL',
    XXXL: '3XL',
    XXXXL: '4XL',
    XXXXXL: '5XL',
  };

  try {
    const sizes = Object.keys(sizeMapping);
    const csvData = selectedData
      .filter(
        (product) => product.styleType.toLowerCase().trim() === 'coat'
        //  &&      product.occasion?.trim()?.toLowerCase()?.split(',')?.includes('maternity')
      )
      .flatMap((product, index) =>
        sizes.map((size) => {
          const mappedSize = sizeMapping[size]; // Convert size to 2XL, 3XL, etc.

          // **************************** style Group id generation ************************************

          const styleGroupId = Math.floor(index) + 1;

          // color mapping start here

          let prominentColor = '';

          for (let color of Prominent_Colour) {
            if (color.trim().toLowerCase() === product.stylePrimaryColor.trim().toLowerCase()) {
              prominentColor = color;
              break;
            } else {
              if (product.stylePrimaryColor.trim().toLowerCase() === 'gray') {
                prominentColor = 'Grey';
                break;
              } else if (product.stylePrimaryColor.trim().toLowerCase() === 'lavender blush') {
                prominentColor = 'Lavender';
                break;
              } else if (product.stylePrimaryColor.trim().toLowerCase() === 'turquoise') {
                prominentColor = 'Turquoise Blue';
                break;
              } else if (product.stylePrimaryColor.trim().toLowerCase() === 'sky blue') {
                prominentColor = 'Blue';
                break;
              } else if (product.stylePrimaryColor.toLowerCase().includes('green')) {
                prominentColor = 'Green';
                break;
              } else if (product.stylePrimaryColor.trim().toLowerCase() === 'neon yellow') {
                prominentColor = 'Yellow';
                break;
              } else if (product.stylePrimaryColor.trim().toLowerCase() === 'ivory') {
                prominentColor = 'Off White';
                break;
              } else if (product.stylePrimaryColor.toLowerCase().includes('navy')) {
                prominentColor = 'Navy Blue';
                break;
              } else if (product.stylePrimaryColor.toLowerCase().includes('wine')) {
                prominentColor = 'Burgundy';
                break;
              } else if (product.stylePrimaryColor.toLowerCase().includes('royal blue')) {
                prominentColor = 'Blue';
                break;
              } else {
                prominentColor = 'NA';
              }
            }
          }

          // ***************************// end of color mapping *********************

          // ****************************** // Season mapping ****************************
          let season = '';

          if (product.season && product.season.toLowerCase().includes('summer')) {
            season = 'Summer';
          } else if (product.season && product.season.toLowerCase().includes('winter')) {
            season = 'Winter';
          } else if (product.season && product.season.toLowerCase().includes('spring')) {
            season = 'Spring';
          } else if (product.season && product.season.toLowerCase().includes('fall')) {
            season = 'Fall';
          }

          //  ******************************** end of season mapping *****************************************

          // **************************** start of fabric mapping ************************************

          let mappedfabric = '';

          for (let fabric of Fabric_Dresses) {
            if (product.fabrics[0]?.name.toLowerCase().trim() === fabric) {
              mappedfabric = fabric;
              break;
            } else {
              if (
                product.fabrics[0]?.name.toLowerCase().trim().includes('crepe') ||
                product.fabrics[0]?.name.toLowerCase().trim().includes('net') ||
                product.fabrics[0]?.name.toLowerCase().trim().includes('chiffon')
              ) {
                mappedfabric = 'Polyester';
                break;
              } else {
                mappedfabric = 'Other';
              }
            }
          }
          // **************************** end of fabric mapping ************************************

          // **************************** start of fabricType mapping ************************************

          let mappedfabricType = 'NA';
          for (let fabricTypeDress of Fabric_Type_Dresses) {
            if (
              product.fabric &&
              product.fabric.trim().toLowerCase() === fabricTypeDress.toLowerCase()
            ) {
              mappedfabricType = fabricTypeDress;
              break;
            }
          }

          // **************************** end of fabricType mapping ************************************
          // **************************** start of fabricType mapping ************************************
          let mappedOccasion = '';
          for (const occasion of Occasion_Values) {
            if (
              product.occasion &&
              product.occasion.toLowerCase().trim().includes(occasion.toLowerCase())
            ) {
              mappedOccasion = occasion;
              break;
            }
          }

          // **************************** end of fabricType mapping ************************************
          // **************************** start of neckline mapping ************************************

          let mappedNeckline = '';
          for (const neckline of Neckline_Values) {
            if (
              product.neckStyle &&
              product.neckStyle.toLowerCase().trim().includes(neckline.toLowerCase())
            ) {
              mappedNeckline = neckline;
              break;
            } else if (product.neckStyle.toLowerCase().trim() === 'classic shirt') {
              mappedNeckline = 'Shirt Collar';
              break;
            } else if (product.neckStyle.toLowerCase().trim() === 'spaghetti strap') {
              mappedNeckline = 'Shoulder Straps';
              break;
            } else if (
              product.neckStyle.toLowerCase().trim() === 'v-neck' ||
              product.neckStyle.toLowerCase().trim() === 'v neck'
            ) {
              mappedNeckline = 'V-Neck';
              break;
            }
          }
          // **************************** end of neckline mapping ************************************
          // **************************** start of pattern mapping ************************************

          let mappedPattern = 'Self Design';
          for (const pattern of Patterns_Values) {
            if (product.prints.toLowerCase().trim().includes(pattern.toLowerCase())) {
              mappedPattern = pattern;
              break;
            }
          }
          // **************************** end of pattern mapping ************************************

          // **************************** start of sleeve length mapping ************************************
          // Mapping object
          const sleeveMapping = {
            Full: 'Long Sleeves',
            'Three Quarter': 'Three-Quarter Sleeves',
            Half: 'Short Sleeves',
            Short: 'Short Sleeves',
            Quarter: 'Three-Quarter Sleeves',
            'Elbow Length': 'Three-Quarter Sleeves',
            Sleeveless: 'Sleeveless',
            'Above Elbow Length': 'Three-Quarter Sleeves',
          };

          // **************************** end of sleeve length mapping ************************************

          // **************************** start of fit mapping ************************************
          let mappedFit = 'Regular Fit';
          for (const fit of Fit_Shirts) {
            if (fit.toLowerCase() === product.fittingType.toLowerCase().trim()) {
              mappedFit = fit;
              break;
            }
          }

          // **************************** start of closure mapping ************************************

          let mappedClosure = 'NA';
          for (const closure of Closure_Values) {
            if (product.closure.toLowerCase().trim().includes(closure.toLowerCase())) {
              mappedClosure = closure;
              break;
            } else if (product.closure.toLowerCase().trim() === 'hook & eye') {
              mappedClosure = 'Hook and Eye';
              break;
            } else if (product.closure.toLowerCase().trim() === 'not applicable') {
              mappedClosure = 'NA';
              break;
            }
          }

          // **************************** end of closure mapping ************************************
          // **************************** start of wash care mapping ************************************
          const WashCare_Values = ['Hank Wash', 'Machine Wash', 'Dry Clean'];
          let mappedWashCare = 'Machine Wash';
          for (const washcare of WashCare_Values) {
            if (product.washCare.toLowerCase().trim().includes(washcare.toLocaleLowerCase())) {
              mappedWashCare = washcare;
              break;
            }
          }

          // **************************** end of wash care mapping ************************************

          // Dynamic Front Length Calculation
          const input = {
            front_length: Number(product?.measurements.frontLengthXS),
            Sleeve_Length_inches_XS: Number(product.measurements.sleeveLengthXS),
          };

          function addFrontLengthValue(index) {
            if (input?.front_length > 0) {
              return input?.front_length + (index - 1) * 0.5;
            } else {
              return '';
            }
          }

          const productData = {
            styleId: '',
            styleGroupId: styleGroupId,
            vendorSkuCode: `6${product.styleNumber}-${product.stylePrimaryColor}-${mappedSize}`,
            vendorArticleNumber: `6${product.styleNumber}` || '',
            vendorArticleName: product.styleName || '',
            brand: 'Qurvii',
            'Manufacturer Name and Address with Pincode':
              'Qurvii, B-149, Sector 6, Noida, UP 201301, India',
            'Packer Name and Address with Pincode':
              'Qurvii, B-149, Sector 6, Noida, UP 201301, India',
            'Importer Name and Address with Pincode': '',
            'Country Of Origin': 'India',
            'Country Of Origin2': '',
            'Country Of Origin3': '',
            'Country Of Origin4': '',
            'Country Of Origin5': '',
            articleType: 'Coats',
            'Brand Size': mappedSize,
            'Standard Size':
              mappedSize === '1XL' ? 'XL' : mappedSize === '2XL' ? 'XXL' : mappedSize,
            'is Standard Size present on Label': 'Yes',
            'Brand Colour (Remarks)': product.stylePrimaryColor || '',
            GTIN: '',
            HSN: '62114290',
            SKUCode: '',
            MRP: product.mrp || '',
            AgeGroup: 'Adults-Women',
            'Prominent Colour': prominentColor,
            'Second Prominent Colour': '',
            'Third Prominent Colour': '',
            FashionType: 'Fashion',
            Usage: '',
            Year: Number(new Date().getFullYear()) || '',
            season: season,
            'Product Details': product.styleDescription || '',
            styleNote: '',
            materialCareDescription: product.fabrics[0]?.name || '',
            sizeAndFitDescription: '',

            productDisplayName: '',
            tags: '',
            addedDate: '',
            'Color Variant GroupId': '',
            Occasion: 'Maternity',
            Pattern: mappedPattern,
            Fabric: mappedfabric,
            'Fabric 2': '',
            'Fabric 3': '',
            'Sleeve Length': sleeveMapping[product.sleeveLength.trim()] || 'Sleeveless',
            Collar: '',
            Hood: '',
            Length: '',
            Fit: mappedFit,
            Type: '',
            Closure: mappedClosure,
            'Surface Styling': '',
            'Lining Fabric': '',
            'Body or Garment Size': 'To-Fit Denotes Body Measurements in',
            'Wash Care': mappedWashCare,
            Sustainable: '',
            'Number of Pockets': '',
            'Net Quantity Unit': 'Piece',
            Trends: '',
            Personalization: '',

            'Net Quantity': 1,
            'Across Shoulder ( Inches )': sizeData[size]?.[0] ?? '',
            'Bust ( Inches )': sizeData[size]?.[1] ?? '',
            'Chest ( Inches )': sizeData[size]?.[2] ?? '',
            'Front Length ( Inches )': addFrontLengthValue(sizes.indexOf(size)),
            'Sleeve-Length ( Inches )': '',
            'To Fit Bust ( Inches )': '',
            'To Fit Waist ( Inches )': '',
            'Waist ( Inches )': sizeData[size]?.[3] ?? '',

            'Front Image': '',
            'Side Image': '',
            'Back Image': '',
            'Detail Angle': '',
            'Look Shot Image': '',
            'Additional Image 1': '',
            'Additional Image 2': '',
          };
          return productData;
        })
      );

    const csv = Papa.unparse({
      fields: csvHeaders,
      data: csvData,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Myntra_Coat_listing.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log('Failed to download listing file', error);
  }
};

export { generateMyntraCoatMaternityListingFile };
