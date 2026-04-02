// import Papa from 'papaparse';

// const generateTatacliqMaternityListing = (selectedData) => {
//   const csvHeaders = [
//     'SKUCODE*',
//     'CATEGORY_NAME',
//     'inventorydetails',
//     'HSNCODE*',
//     '#ATTR_colorapparel_Color*',
//     '#ATTR_menpattern_Pattern',
//     '#ATTR_sizechart_Size Chart*',
//     '#ATTR_washcare_Wash Care*',
//     '#ATTR_washcare_Wash*',
//     '#ATTR_others1apparel_Care',
//     '#ATTR_stylecode_Style Code*',
//     '#ATTR_fittopwearmen_Fit*',
//     '#ATTR_mencasualtopwearsize_Size*',
//     '#ATTR_fabricapparel_Fabric*',
//     'SKUCODE*',
//     '#ATTR_waistrise_Waist Rise*',
//     '#ATTR_denimtreatments_Denim Treatments*',
//     '#ATTR_withblouse_With Blouse*',
//     '#ATTR_wiring_Wiring*',
//     '#ATTR_bracoverage_Coverage*',
//     '#ATTR_padding_Padding*',
//     'TITLE*',
//     'DESCRIPTION*',
//     'PBIIDENTITYCODE*',
//     'PBIIDENTITYVALUE*',
//     '#ATTR_menfabric_Fabric Family*',
//     '#ATTR_mencasualtopwearcollarneck_Neck/Collar*',
//     '#ATTR_brand_Brand*',
//     '#ATTR_mensleeve_Sleeve*',
//     '#ATTR_occasion_Occasion*',
//     '#ATTR_colorfamilyapparel_Color Family*',
//     '#ATTR_trousertype_Trouser Type*',
//     '#ATTR_pocketapparel_Pocket',
//     '#ATTR_brieftype_Brief Type*',
//     '#ATTR_bratype_Bra Type*',
//     '#ATTR_nightweartype_Nightwear Type',
//     '#ATTR_dresslength_Dress Length*',
//     '#ATTR_skirtlength_Skirt Length*',
//     'VIDEOURL',
//     'COUNTRYOFMANUFACTURER',
//     '#ATTR_multipack_Multi Pack*',
//     '#ATTR_mrp_MRP [INR]*',
//     '#ATTR_packquantity_Pack Quantity',
//     '#ATTR_mensetcontents_Set Contents*',
//     '#ATTR_setitems_Set Items*',
//     '#ATTR_dressshape_Dress Shape',
//     '#ATTR_skirtshape_Skirt Shape',
//     '#ATTR_shapeapparel_Shape',
//     '#ATTR_collectiondateapparel_Collection Date',
//     '#ATTR_collectionapparel_Collection',
//     '#ATTR_collectioninfoapparel_Collection Info',
//     '#ATTR_seasonapparel_Season',
//     'PRODUCTUPLOADSTATUS*',
//     'NAME*',
//     'MINIDESCRIPTION',
//     'METATITLE',
//     'METAKEYWORD',
//     'METADESCRIPTION',
//     'TAGS',
//     'STARTDATE*',
//     'ENDDATE*',
//     'REVIEW',
//     'PITIMAGE*',
//     'IMAGEPRIORITY',
//     'LENGTH',
//     'WIDTH',
//     'HEIGHT',
//     'WEIGHT',
//     '#ATTR_upSellAssociatedProducts_Up Sell - Associated Products',
//     '#ATTR_stylenote_Style Note*',
//     '#ATTR_crossSellAssociatedProductStatus_Cross Sell - Associated Product Status',
//     '#ATTR_ageband_Age Band*',
//     '#ATTR_brandDescription_Brand Description*',
//     '#ATTR_featureapparel_Feature',
//     '#ATTR_weightapparel_Weight*',
//     '#ATTR_sellerAssociationStatus_Seller Product Association Status*',
//     '#ATTR_upSellAssociatedProductStatus_Up Sell - Associated Product Status',
//     '#ATTR_warrantyType_Warranty Type*',
//     '#ATTR_leadTimeForTheSKUHomeDelivery_Lead time for the SKU -  Home Delivery [No. of days]*',
//     '#ATTR_unisexapparel_Unisex',
//     '#ATTR_crossSellAssociatedProducts_Cross Sell - Associated Products',
//     '#ATTR_leadvariantid_Lead Variant ID',
//     '#ATTR_displayproduct_Display Product Name*',
//     '#ATTR_modelfit_Model Fit*',
//     '#ATTR_packcolor_Pack Color',
//     '#ATTR_warrantyTimePeriod_Warranty Time Period [Months]*',
//     '#ATTR_storyname_Story Name',
//     '#ATTR_tshirttype_Tshirt Type',
//     '#ATTR_brandfitname_Brand Fit Name',
//     '#ATTR_apparelsports_Sports',
//     '#ATTR_sockusage_Usage',
//     '#ATTR_womensetcontents_Set Contents*',
//     '#ATTR_sleepwearcoverage_Length',
//     '#ATTR_cut_Cut',
//     'PBIIDENTITYCODE_2',
//     'PBIIDENTITYVALUE_2',
//     'PBIIDENTITYCODE_3',
//     'PBIIDENTITYVALUE_3',
//     '#ATTR_others3apparel_Others 3',
//     '#ATTR_others2apparel_Others 2',
//     'Inventory',
//     'Sub Brand',
//     'Manufacturer Details',
//     'Packer Details',
//     'Importer Details',
//     'Country of origin',
//     'Image link 1',
//     'Image link 2',
//     'Image link 3',
//     'Image link 4',
//     'Image link 5',
//   ];

//   const sizeMapping = {
//     XXS: 'XXS',
//     XS: 'XS',
//     S: 'S',
//     M: 'M',
//     L: 'L',
//     XL: 'XL',
//     XXL: '2XL',
//     XXXL: '3XL',
//     XXXXL: '4XL',
//     XXXXXL: '5XL',
//   };

//   const sizes = Object.keys(sizeMapping); // ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"]

//   const csvData = selectedData.flatMap((product) =>
//     sizes.map((size) => {
//       const mappedSize = sizeMapping[size]; // Convert size to 2XL, 3XL, etc.

//       let product_category = {
//         Dress: 'Dresses',
//         Top: 'Tops',
//         Shirt: 'Shirts',
//         Jacket: 'Jackets',
//         Coat: 'Coats',
//         Plazzo: 'Plazzoes',
//         Shrug: 'Shrugs',
//       };

//       let category_name = typeof product.styleType === 'string' ? product.styleType.trim() : '';
//       let productCategory = product_category[category_name] || product.styleType;

//       let seasonYear = new Date().getFullYear();

//       //   **********************Fitting mapping ***************************************

//       const fittingTypeMap = {
//         'Loose Fit': 'Loose fit',
//         'Regular Fit': 'Regular fit',
//         'Slim Fit': 'Slim fit',
//         'Relaxed Fit': 'Relaxed Fit',
//         'Stretch Fit': 'Slim fit',
//         Oversized: 'Loose if',
//         'Regular Fit, Loose Fit': 'Regular fit',
//         'Regular Fit, Western': 'Regular fit',
//         'Regular Fit, Loose Fit, Classic': 'Regular fit',
//         'Regular Fit, Loose Fit, Western': 'Regular fit',
//         'Regular Fit, Western, Relaxed': 'Regular fit',
//         'Regular Fit, Loose Fit, Relaxed': 'Regular fit',
//         'Regular Fit, Relaxed': 'Regular fit',
//         'Regular Fit, Slim Fit, Relaxed': 'Regular fit',
//         'Regular Fit, Slim Fit, Western, Classic': 'Regular fit',
//         'Regular Fit, Slim Fit, Classic': 'Regular fit',
//         'Loose Fit, Western, Fusion': 'Loose fit',

//         'Regular Fit, Loose Fit, Western, Relaxed': 'Regular fit',
//         'Loose Fit, Western, Relaxed': 'Loose fit',
//         'Loose Fit, Western, Fusion, Relaxed': 'Loose fit',
//         'Slim Fit, Relaxed': 'Slim fit',
//         'Regular Fit, Western, Regular fit': '',
//         'Western, Fusion, Relaxed': 'Relaxed Fit',
//         'Regular Fit, Loose Fit, Western, Fusion': 'Regular fit',
//         'Fit & Flare': 'Flare fit',
//         Bodycon: 'Bodycon',
//       };

//       //   ********************** end of Fitting mapping ***************************************

//       //   ********************** start of occasion mapping ***************************************

//       let occasion = 'Casual Wear';

//       if (product.occasion && typeof product.occasion === 'string') {
//         const occasionText = product.occasion.toLowerCase(); // Convert to lowercase for case-insensitive matching

//         if (occasionText.includes('evening') || occasionText.includes('festival')) {
//           occasion = 'Evening Wear';
//         } else if (occasionText.includes('casual')) {
//           occasion = 'Casual Wear';
//         }
//       }

//       //   ********************** end of occasion mapping ***************************************

//       //   ********************** start of pattern  mapping ***************************************

//       const patternList = [
//         'Print',
//         'Solid',
//         'Lace',
//         'Stripes',
//         'Paisley',
//         'Floral',
//         'Pin Stripes',
//         'Geometric',
//         'Checks',
//         'Embroidery',
//         'Metallic',
//         'Embellished',
//         'Polka Dot',
//         'Animal Print',
//         'Other',
//         'Color-Block',
//         'Structured',
//       ];

//       let patternType = '';

//       if (product.prints && typeof product.prints === 'string') {
//         const patternText = product.prints.toLowerCase(); // Normalize input for case-insensitive comparison

//         if (patternText === 'leopard' || patternText === 'animal') {
//           patternType = 'Animal Print';
//         } else if (patternText === 'polka') {
//           patternType = 'Polka Dot';
//         } else if (patternText === 'check') {
//           patternType = 'Checks';
//         } else if (patternText === 'stripe') {
//           patternType = 'Stripes';
//         } else {
//           // Find a match in patternList
//           patternType =
//             patternList.find((pattern) => patternText.includes(pattern.toLowerCase())) || '';
//         }
//       }

//       // ********************* sleeve mapping  *********************

//       let mappedSleeve = {
//         Full: 'Full Sleeves',
//         'Three Quarter': '3/4th sleeves',
//         Half: 'Short sleeves',
//         Quarter: 'Full Sleeves',
//         Sleeveless: 'Sleeveless',
//         Short: 'Short sleeves',
//         'Elbow Length': 'Elbow sleeves',
//         'Above Elbow Length': 'Elbow sleeves',
//       };

//       // ********************* end sleeve mapping  *********************

//       // ********************* start neck mapping  *********************

//       let neckMapping = {
//         'Banded Collar': 'Band Neck',
//         'Boat Neck': 'Boat neck',
//         'Button Front': 'Others',
//         'Classic Shirt': 'Shirt collar',
//         'Classic Shirt Collar': 'Shirt collar',
//         'Cowl Neck': 'Cowl neck',
//         'Crew Neck': 'Others',
//         'Halter Neck': 'Halter neck',
//         Hooded: 'Others',
//         'Mandarin Collar': 'Mandarin collar',
//         'Not Applicable': 'Others',
//         'Off Shoulder': 'Off Shoulder',
//         'One Shoulder': 'One Shoulder',
//         'Option 33': 'Others',
//         Other: 'Others',
//         Peterpan: 'Peter pan collar',
//         'Round Neck': 'Round neck',
//         Shawl: 'Shawl neck',
//         'Shawl Collar': 'Shawl neck',
//         'Spaghetti Strap': 'Others',
//         'Square Neck': 'Square neck',
//         'Sweat heart Neck': 'Sweet heart',
//         'Tie or Bow': 'Others',
//         Tuxedo: 'Others',
//         'V Neck': 'V neck',
//         'Wide Collar Neck': 'Others',
//       };

//       // ********************* end neck mapping  *********************

//       // ********************* start color family mapping  *********************

//       let colorFamily = '';
//       if (product.stylePrimaryColor.toLowerCase().trim().includes(' pink')) {
//         colorFamily = 'Pink';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('lavendar')) {
//         colorFamily = 'Purple';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('lavender')) {
//         colorFamily = 'Purple';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('wine')) {
//         colorFamily = 'Maroon';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('olive')) {
//         colorFamily = 'Khaki';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('gray')) {
//         colorFamily = 'Grey';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('burgundy')) {
//         colorFamily = 'Maroon';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('magenta')) {
//         colorFamily = 'Pink';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes(' yellow')) {
//         colorFamily = 'Yellow';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes(' blue')) {
//         colorFamily = 'Blue';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('rust')) {
//         colorFamily = 'Orange';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes(' green')) {
//         colorFamily = 'Green';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('teal')) {
//         colorFamily = 'Turquoise';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('lavender blush')) {
//         colorFamily = 'Purple';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('mustard')) {
//         colorFamily = 'Yellow';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('ivory')) {
//         colorFamily = 'White';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('mauve')) {
//         colorFamily = 'Pink';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes(' white')) {
//         colorFamily = 'White';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes(' brown')) {
//         colorFamily = 'Brown';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('caramel')) {
//         colorFamily = 'Peach';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes('fucia')) {
//         colorFamily = 'Pink';
//       } else if (product.stylePrimaryColor.toLowerCase().trim().includes(' orange')) {
//         colorFamily = 'Orange';
//       } else {
//         colorFamily = product.stylePrimaryColor;
//       }

//       return {
//         'SKUCODE*': `6${product.styleNumber}-${product.stylePrimaryColor}-${mappedSize}`,
//         CATEGORY_NAME: productCategory,
//         inventorydetails: '',
//         'HSNCODE*': '62114290',
//         '#ATTR_colorapparel_Color*': product.stylePrimaryColor,
//         '#ATTR_menpattern_Pattern': patternType || product.prints,
//         '#ATTR_sizechart_Size Chart*': '',
//         '#ATTR_washcare_Wash Care*': product.washCare,
//         '#ATTR_washcare_Wash*': '',
//         '#ATTR_others1apparel_Care': '',
//         '#ATTR_stylecode_Style Code*': `6${product.styleNumber}`,
//         '#ATTR_fittopwearmen_Fit*': fittingTypeMap[product.fittingType] || 'Regular fit',
//         '#ATTR_mencasualtopwearsize_Size*': mappedSize,
//         '#ATTR_fabricapparel_Fabric*': product.fabrics[0]?.name,
//         'SKUCODE*': `6${product.styleNumber}-${product.stylePrimaryColor}-${mappedSize}`,
//         '#ATTR_waistrise_Waist Rise*': 'Mid rise',
//         '#ATTR_denimtreatments_Denim Treatments*': 'Other',
//         '#ATTR_withblouse_With Blouse*': 'No',
//         '#ATTR_wiring_Wiring*': '',
//         '#ATTR_bracoverage_Coverage*': '',
//         '#ATTR_padding_Padding*': '',
//         'TITLE*': product.styleName,
//         'DESCRIPTION*': product.styleDescription,
//         'PBIIDENTITYCODE*': '',
//         'PBIIDENTITYVALUE*': '',
//         '#ATTR_menfabric_Fabric Family*': product.fabrics[0]?.name || 'not found',
//         '#ATTR_mencasualtopwearcollarneck_Neck/Collar*': neckMapping[product.neckStyle] || 'Others',
//         '#ATTR_brand_Brand*': 'Qurvii',
//         '#ATTR_mensleeve_Sleeve*': mappedSleeve[product.sleeveLength] || 'Sleeveless',
//         '#ATTR_occasion_Occasion*': occasion,
//         '#ATTR_colorfamilyapparel_Color Family*': colorFamily,
//         '#ATTR_trousertype_Trouser Type*': '',
//         '#ATTR_pocketapparel_Pocket': '',
//         '#ATTR_brieftype_Brief Type*': '',
//         '#ATTR_bratype_Bra Type*': '',
//         '#ATTR_nightweartype_Nightwear Type': '',
//         '#ATTR_dresslength_Dress Length*': '',
//         '#ATTR_skirtlength_Skirt Length*': '',
//         VIDEOURL: '',
//         COUNTRYOFMANUFACTURER: '',
//         '#ATTR_multipack_Multi Pack*': 'No',
//         '#ATTR_mrp_MRP [INR]*': product.mrp,
//         '#ATTR_packquantity_Pack Quantity': '1',
//         '#ATTR_mensetcontents_Set Contents*': '',
//         '#ATTR_setitems_Set Items*': '',
//         '#ATTR_dressshape_Dress Shape': '',
//         '#ATTR_skirtshape_Skirt Shape': '',
//         '#ATTR_shapeapparel_Shape': '',
//         '#ATTR_collectiondateapparel_Collection Date': '',
//         '#ATTR_collectionapparel_Collection': '',
//         '#ATTR_collectioninfoapparel_Collection Info': '',
//         '#ATTR_seasonapparel_Season': `AW${seasonYear}`,
//         'PRODUCTUPLOADSTATUS*': '',
//         'NAME*': product.styleType,
//         MINIDESCRIPTION: '',
//         METATITLE: '',
//         METAKEYWORD: '',
//         METADESCRIPTION: '',
//         TAGS: '',
//         'STARTDATE*': '',
//         'ENDDATE*': '',
//         REVIEW: '',
//         'PITIMAGE*': '',
//         IMAGEPRIORITY: '',
//         LENGTH: '30',
//         WIDTH: '17',
//         HEIGHT: '4',
//         WEIGHT: '150',
//         '#ATTR_upSellAssociatedProducts_Up Sell - Associated Products': '',
//         '#ATTR_stylenote_Style Note*': '',
//         '#ATTR_crossSellAssociatedProductStatus_Cross Sell - Associated Product Status': '',
//         '#ATTR_ageband_Age Band*': '18-45',
//         '#ATTR_brandDescription_Brand Description*': 'Qurvii',
//         '#ATTR_featureapparel_Feature': '',
//         '#ATTR_weightapparel_Weight*': '',
//         '#ATTR_sellerAssociationStatus_Seller Product Association Status*': 'No',
//         '#ATTR_upSellAssociatedProductStatus_Up Sell - Associated Product Status': '',
//         '#ATTR_warrantyType_Warranty Type*': 'NA',
//         '#ATTR_leadTimeForTheSKUHomeDelivery_Lead time for the SKU -  Home Delivery [No. of days]*':
//           '',
//         '#ATTR_unisexapparel_Unisex': '',
//         '#ATTR_crossSellAssociatedProducts_Cross Sell - Associated Products': '',
//         '#ATTR_leadvariantid_Lead Variant ID': '',
//         '#ATTR_displayproduct_Display Product Name*': '',
//         '#ATTR_modelfit_Model Fit*': 'Model is 5ft 9in tall and is wearing size XS',
//         '#ATTR_packcolor_Pack Color': '',
//         '#ATTR_warrantyTimePeriod_Warranty Time Period [Months]*': '',
//         '#ATTR_storyname_Story Name': '',
//         '#ATTR_tshirttype_Tshirt Type': '',
//         '#ATTR_brandfitname_Brand Fit Name': '',
//         '#ATTR_apparelsports_Sports': '',
//         '#ATTR_sockusage_Usage': '',
//         '#ATTR_womensetcontents_Set Contents*': '',
//         '#ATTR_sleepwearcoverage_Length': '',
//         '#ATTR_cut_Cut': '',
//         PBIIDENTITYCODE_2: '',
//         PBIIDENTITYVALUE_2: '',
//         PBIIDENTITYCODE_3: '',
//         PBIIDENTITYVALUE_3: '',
//         '#ATTR_others3apparel_Others 3': '',
//         '#ATTR_others2apparel_Others 2': '',
//         Inventory: '',
//         'Sub Brand': '',
//         'Manufacturer Details':
//           'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com',
//         'Packer Details':
//           'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com',
//         'Importer Details':
//           'Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com',
//         'Country of origin': 'India',
//       };
//     })
//   );

//   const csv = Papa.unparse({
//     fields: csvHeaders,
//     data: csvData,
//   });

//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'tatacliq_listing.csv';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export default generateTatacliqMaternityListing;

import Papa from 'papaparse';

const generateTatacliqMaternityListing = (selectedData) => {
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

  const sizes = Object.keys(sizeMapping); // ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"]

  const csvData = selectedData.flatMap((product) =>
    sizes.map((size) => {
      const mappedSize = sizeMapping[size]; // Convert size to 2XL, 3XL, etc.

      let product_category = {
        Dress: 'AWWDressmaterial',
        Top: 'AWWTopsandtees',
        Shirt: 'AWWcasualshirts',
        Jacket: 'AWWFormalcoatsjackets',
        Coat: 'AWWFormalcoatsjackets',
        Plazzo: 'AWWSTrackpants',
        Shrug: 'AWWShrugsandcardigans',
        Skirt: 'AWWSkirts',
        Kaftan: 'AWWDressmaterial',
        'Shirt Dress': 'AWWDressmaterial',
      };

      let category_name = typeof product.styleType === 'string' ? product.styleType.trim() : '';
      let productCategory = product_category[category_name] || product.styleType;

      let seasonYear = new Date().getFullYear();

      //   **********************Fitting mapping ***************************************

      const fittingTypeMap = {
        'Loose Fit': 'Loose fit',
        'Regular Fit': 'Regular fit',
        'Slim Fit': 'Slim fit',
        'Relaxed Fit': 'Relaxed Fit',
        'Stretch Fit': 'Slim fit',
        Oversized: 'Loose if',
        'Regular Fit, Loose Fit': 'Regular fit',
        'Regular Fit, Western': 'Regular fit',
        'Regular Fit, Loose Fit, Classic': 'Regular fit',
        'Regular Fit, Loose Fit, Western': 'Regular fit',
        'Regular Fit, Western, Relaxed': 'Regular fit',
        'Regular Fit, Loose Fit, Relaxed': 'Regular fit',
        'Regular Fit, Relaxed': 'Regular fit',
        'Regular Fit, Slim Fit, Relaxed': 'Regular fit',
        'Regular Fit, Slim Fit, Western, Classic': 'Regular fit',
        'Regular Fit, Slim Fit, Classic': 'Regular fit',
        'Loose Fit, Western, Fusion': 'Loose fit',

        'Regular Fit, Loose Fit, Western, Relaxed': 'Regular fit',
        'Loose Fit, Western, Relaxed': 'Loose fit',
        'Loose Fit, Western, Fusion, Relaxed': 'Loose fit',
        'Slim Fit, Relaxed': 'Slim fit',
        'Regular Fit, Western, Regular fit': '',
        'Western, Fusion, Relaxed': 'Relaxed Fit',
        'Regular Fit, Loose Fit, Western, Fusion': 'Regular fit',
        'Fit & Flare': 'Flare fit',
        Bodycon: 'Bodycon',
      };

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

      // ********************* sleeve mapping  *********************

      let mappedSleeve = {
        Full: 'Full Sleeves',
        'Three Quarter': '3/4th sleeves',
        Half: 'Short sleeves',
        Quarter: 'Full Sleeves',
        Sleeveless: 'Sleeveless',
        Short: 'Short sleeves',
        'Elbow Length': 'Elbow sleeves',
        'Above Elbow Length': 'Elbow sleeves',
      };

      // ********************* end sleeve mapping  *********************

      // ********************* start neck mapping  *********************

      let neckMapping = {
        'Banded Collar': 'Band Neck',
        'Boat Neck': 'Boat neck',
        'Button Front': 'Others',
        'Classic Shirt': 'Shirt collar',
        'Classic Shirt Collar': 'Shirt collar',
        'Cowl Neck': 'Cowl neck',
        'Crew Neck': 'Others',
        'Halter Neck': 'Halter neck',
        Hooded: 'Others',
        'Mandarin Collar': 'Mandarin collar',
        'Not Applicable': 'Others',
        'Off Shoulder': 'Off Shoulder',
        'One Shoulder': 'One Shoulder',
        'Option 33': 'Others',
        Other: 'Others',
        Peterpan: 'Peter pan collar',
        'Round Neck': 'Round neck',
        Shawl: 'Shawl neck',
        'Shawl Collar': 'Shawl neck',
        'Spaghetti Strap': 'Others',
        'Square Neck': 'Square neck',
        'Sweat heart Neck': 'Sweet heart',
        'Tie or Bow': 'Others',
        Tuxedo: 'Others',
        'V Neck': 'V neck',
        'Wide Collar Neck': 'Others',
      };

      // ********************* end neck mapping  *********************

      // ********************* start color family mapping  *********************

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

      return {
        SKUCODE: `6${product.styleNumber}-${product.stylePrimaryColor}-${mappedSize}`,
        CATEGORY_NAME: productCategory,
        inventorydetails: '',
        HSNCODE: '62114290',
        '#ATTR_colorapparel_Color': product.stylePrimaryColor,
        '#ATTR_menpattern_Pattern': patternType || product.prints,
        '#ATTR_sizechart_Size Chart': '',
        '#ATTR_washcare_Wash Care': product.washCare,
        '#ATTR_stylecode_Style Code': product.styleNumber,
        '#ATTR_fittopwearmen_Fit': fittingTypeMap[product.fittingType] || 'Regular Fit',
        '#ATTR_mencasualtopwearsize_Size': mappedSize,
        '#ATTR_fabricapparel_Fabric': product.fabrics[0]?.name,

        '#ATTR_waistrise_Waist Rise': 'Mid rise',
        '#ATTR_denimtreatments_Denim Treatments': 'Other',

        TITLE: product.styleName,
        DESCRIPTION: product.styleDescription,

        PBIIDENTITYCODE: '',
        PBIIDENTITYVALUE: '',

        '#ATTR_menfabric_Fabric Family': product.fabrics[0]?.name || 'not found',
        '#ATTR_mencasualtopwearcollarneck_Neck/Collar': neckMapping[product.neckStyle] || 'Others',
        '#ATTR_brand_Brand': 'Qurvii',
        '#ATTR_mensleeve_Sleeve': mappedSleeve[product.sleeveLength] || 'Sleeveless',
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

export default generateTatacliqMaternityListing;
