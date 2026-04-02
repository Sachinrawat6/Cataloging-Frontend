import Papa from "papaparse";

const sizes = [
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "XXXXL",
    "XXXXXL",
];

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
const Prominent_Colour = ["Red", "Blue", "Green", "Black", "Purple", "White", "Pink", "Grey", "Brown", "Yellow", "Orange", "Navy Blue", "Maroon", "Cream", "Silver", "Gold", "Tan", "Beige", "Peach", "Multi", "Copper", "Steel", "Olive", "Khaki", "Rose", "Taupe", "Off White", "Metallic", "Charcol", "Grey Melange", "Turquoise Blue", "Coffee Brown", "Sea Green", "Lavender", "Lime Green", "Magenta", "Burgundy", "Teal", "Nude", "Bronze", "Fluorescent Green", "Rust", "Mustard", "NA", "Mauve", "Coral", "Rose Gold", "Assorted", "Champagne", "Fuchsia", "Violet", "Camel Brown", "Transparent"];
const Fabric_Dresses = ["Cotton", "Other", "Polyester", "Nylon", "Viscose Rayon", "Synthetic", "Cashmere", "Linen", "Silk", "Wool", "Linen Blend", "Tencel", "Acrylic", "Modal", "Ramie", "Leather", "Bemberg", "Khadi", "Pure Wool", "Wool Blend", "Liva", "Brasso", "Jacquard", "Livaeco", "Polyester PU Coated", "Georgette", "Organic Cotton", "Bamboo", "Poly Silk"];
const Fabric_Type_Dresses = ["Chiffon", "Georgette", "Denim", "Net", "Lace", "Crepe", "Satin", "Jacquard", "Cotton", "Linen", "Knitted", "Velvet", "NA", "Scuba", "Liva", "Dobby", "Corduroy", "Cotton Cambric", "Chambray", "Schiffli"];
const Occasion_Values = ["Casual", "Formal", "Party", "Maternity", "Sports"];
const Neckline_Values = [
    "V-Neck",
    "Round Neck",
    "Boat Neck",
    "Halter Neck",
    "Off-Shoulder",
    "Strapless",
    "Square Neck",
    "Shirt Collar",
    "Mock Neck",
    "One Shoulder",
    "Cowl Neck",
    "Mandarin Collar",
    "Scoop Neck",
    "Peter Pan Collar",
    "Sweetheart Neck",
    "Tie-Up Neck",
    "Shoulder Straps",
    "Keyhole Neck",
    "Choker Neck",
    "Hood",
    "Asymmetric Neck",
    "Above the Keyboard Collar",
    "High Neck",
    "Plunge Neck",
    "Scarf Neck"
];

const Patterns_Values = [
    "Checked",
    "Solid",
    "Striped",
    "Printed",
    "Embroidered",
    "Self Design",
    "Embellished",
    "Colourblocked",
    "Dyed"
];

const Closure_Values = ["Zip", "Concealed Zip", "Button", "Hook and Eye", "NA"];






const generateMyntraCoordsListingFile = (coords, selectedData) => {

    const csvHeaders = [
        "styleId",
        "styleGroupId",
        "vendorSkuCode",
        "vendorArticleNumber",
        "vendorArticleName",
        "brand",
        "Manufacturer Name and Address with Pincode",
        "Packer Name and Address with Pincode",
        "Importer Name and Address with Pincode",
        "Country Of Origin",
        "Country Of Origin2",
        "Country Of Origin3",
        "Country Of Origin4",
        "Country Of Origin5",
        "articleType",
        "Brand Size",
        "Standard Size",
        "is Standard Size present on Label",
        "Brand Colour (Remarks)",
        "GTIN",
        "HSN",
        "SKUCode",
        "MRP",

        "AgeGroup",
        "Prominent Colour",
        "Second Prominent Colour",
        "Third Prominent Colour",
        "FashionType",
        "Usage",
        "Year",
        "season",
        "Product Details",

        "styleNote",
        "materialCareDescription",
        "sizeAndFitDescription",
        "productDisplayName",
        "tags",
        "addedDate",
        "Color Variant GroupId",
        "Occasion",

        "Sleeve Length",
        "Neck",
        "Top Fabric",
        "Bottom Fabric",
        "Top Type",
        "Bottom Type",
        "Top Pattern",
        "Bottom Pattern",

        "Bottom Closure",
        "Add-Ons",
        "Wash Care",
        "Character",
        "Lining",

        "Number of Pockets",
        "Trends",
        "Sustainable",
        "Number of Items",
        "Top Closure",
        "Net Quantity Unit",

        "Theme",
        "Stitch",
        "Collection Name",
        "Package Contains",

        "BIS Expiry Date",
        "BIS Certificate Image URL",
        "BIS Certificate Number",

        "Net Quantity",

        "Across Shoulder ( Inches )",
        "Bust ( Inches )",
        "Chest ( Inches )",
        "Front Length ( Inches )",

        "Garment Waist ( Inches )",
        "Inseam Length ( Inches )",
        "Outseam Length ( Inches )",

        "Rise ( Inches )",
        "Sleeve-Length ( Inches )",
        "To Fit Bust ( Inches )",
        "To Fit Hip ( Inches )",
        "To Fit Waist ( Inches )",

        "Front Image",
        "Side Image",
        "Back Image",
        "Detail Angle",
        "Look Shot Image",
        "Additional Image 1",
        "Additional Image 2"
    ];






    const sizeMapping = {
        XXS: "XXS",
        XS: "XS",
        S: "S",
        M: "M",
        L: "L",
        XL: "1XL",
        XXL: "2XL",
        XXXL: "3XL",
        XXXXL: "4XL",
        XXXXXL: "5XL",
    };

    try {
        const newsizes = Object.keys(sizeMapping);


        const csvData = coords.flatMap(coord => {
            const [style1Num, style2Num] = coord.styleNumbers;
            const style1 = selectedData.find(s => s.styleNumber === style1Num);
            const style2 = selectedData.find(s => s.styleNumber === style2Num);

            if (!style1 || !style2) return [];






            // **************************** style Group id generation ************************************



            // color mapping start here 

            let prominentColor = "";

            for (let color of Prominent_Colour) {
                if (color.trim().toLowerCase() === style1.stylePrimaryColor.trim().toLowerCase()) {
                    prominentColor = color;
                    break;
                } else {
                    if (style1.stylePrimaryColor.trim().toLowerCase() === "gray") {
                        prominentColor = "Grey";
                        break;
                    } else if (style1.stylePrimaryColor.trim().toLowerCase() === "lavender blush") {
                        prominentColor = "Lavender";
                        break;
                    } else if (style1.stylePrimaryColor.trim().toLowerCase() === "turquoise") {
                        prominentColor = "Turquoise Blue";
                        break;
                    } else if (style1.stylePrimaryColor.trim().toLowerCase() === "sky blue") {
                        prominentColor = "Blue";
                        break;
                    } else if (style1.stylePrimaryColor.toLowerCase().includes("green")) {
                        prominentColor = "Green";
                        break;
                    } else if (style1.stylePrimaryColor.trim().toLowerCase() === "neon yellow") {
                        prominentColor = "Yellow";
                        break;
                    } else if (style1.stylePrimaryColor.trim().toLowerCase() === "ivory") {
                        prominentColor = "Off White";
                        break;
                    } else if (style1.stylePrimaryColor.toLowerCase().includes("navy")) {
                        prominentColor = "Navy Blue";
                        break;
                    } else if (style1.stylePrimaryColor.toLowerCase().includes("wine")) {
                        prominentColor = "Burgundy";
                        break;
                    } else if (style1.stylePrimaryColor.toLowerCase().includes("royal blue")) {
                        prominentColor = "Blue";
                        break;
                    }

                    else {
                        prominentColor = "NA";
                    }
                }
            }

            // ***************************// end of color mapping *********************

            // ****************************** // Season mapping ****************************
            let season = "";

            if (style1.season && style1.season.toLowerCase().includes("summer")) {
                season = "Summer";
            } else if (style1.season && style1.season.toLowerCase().includes("winter")) {
                season = "Winter";
            } else if (style1.season && style1.season.toLowerCase().includes("spring")) {
                season = "Spring";
            } else if (style1.season && style1.season.toLowerCase().includes("fall")) {
                season = "Fall";
            }

            //  ******************************** end of season mapping *****************************************

            // **************************** start of fabric mapping ************************************

            let mappedfabric1 = "";

            for (let fabric of Fabric_Dresses) {
                if (style1.fabrics[0].name.toLowerCase().trim() === fabric) {
                    mappedfabric1 = fabric;
                    break;
                }
                else {

                    if (style1.fabrics[0].name.toLowerCase().trim().includes("crepe")
                        || style1.fabrics[0].name.toLowerCase().trim().includes("net")
                        || style1.fabrics[0].name.toLowerCase().trim().includes("chiffon")

                    ) {
                        mappedfabric1 = "Polyester";
                        break;
                    }
                    else {
                        mappedfabric1 = "Other";

                    }
                }
            }


            let mappedfabric2 = "";

            for (let fabric of Fabric_Dresses) {
                if (style2.fabrics[0].name.toLowerCase().trim() === fabric) {
                    mappedfabric2 = fabric;
                    break;
                }
                else {

                    if (style2.fabrics[0].name.toLowerCase().trim().includes("crepe")
                        || style2.fabrics[0].name.toLowerCase().trim().includes("net")
                        || style2.fabrics[0].name.toLowerCase().trim().includes("chiffon")

                    ) {
                        mappedfabric2 = "Polyester";
                        break;
                    }
                    else {
                        mappedfabric2 = "Other";

                    }
                }
            }


            // **************************** end of fabric mapping ************************************

            // **************************** start of fabricType mapping ************************************

            let mappedfabricType = "NA";
            for (let fabricTypeDress of Fabric_Type_Dresses) {
                if (style1.fabrics[0].name && style1.fabrics[0].name.trim().toLowerCase() === fabricTypeDress.toLowerCase()) {
                    mappedfabricType = fabricTypeDress;
                    break;
                }
            }

            // **************************** end of fabricType mapping ************************************
            // **************************** start of fabricType mapping ************************************
            let mappedOccasion = "";
            for (const occasion of Occasion_Values) {
                if (style1.occasion && style1.occasion.toLowerCase().trim().includes(occasion.toLowerCase())) {
                    mappedOccasion = occasion
                    break;
                }

            }

            // **************************** end of fabricType mapping ************************************
            // **************************** start of neckline mapping ************************************

            let mappedNeckline = "";
            for (const neckline of Neckline_Values) {
                if (style1.neckStyle && style1.neckStyle.toLowerCase().trim().includes(neckline.toLowerCase())) {
                    mappedNeckline = neckline;
                    break;

                }
                else if (style1.neckStyle.toLowerCase().trim() === "classic shirt") {
                    mappedNeckline = "Shirt Collar";
                    break;
                }
                else if (style1.neckStyle.toLowerCase().trim() === "spaghetti strap") {
                    mappedNeckline = "Shoulder Straps";
                    break;
                }
                else if (style1.neckStyle.toLowerCase().trim() === "v-neck" || style1.neckStyle.toLowerCase().trim() === "v neck") {
                    mappedNeckline = "V-Neck";
                    break;
                }

            }
            // **************************** end of neckline mapping ************************************
            // **************************** start of pattern mapping ************************************

            let mappedPattern1 = "Self Design";
            for (const pattern of Patterns_Values) {
                if (style1.prints.toLowerCase().trim().includes(pattern.toLowerCase())) {
                    mappedPattern1 = pattern;
                    break;
                }

            }


            let mappedPattern2 = "Self Design";
            for (const pattern of Patterns_Values) {
                if (style2.prints.toLowerCase().trim().includes(pattern.toLowerCase())) {
                    mappedPattern2 = pattern;
                    break;
                }

            }
            // **************************** end of pattern mapping ************************************

            // **************************** start of sleeve length mapping ************************************
            // Mapping object
            const sleeveMapping = {
                "Full": "Long Sleeves",
                "Three Quarter": "Three-Quarter Sleeves",
                "Half": "Short Sleeves",
                "Short": "Short Sleeves",
                "Quarter": "Three-Quarter Sleeves",
                "Elbow Length": "Three-Quarter Sleeves",
                "Sleeveless": "Sleeveless",
                "Above Elbow Length": "Three-Quarter Sleeves",
            };


            // **************************** end of sleeve length mapping ************************************


            // **************************** start of closure mapping ************************************

            let mappedClosure1 = 'NA';
            for (const closure of Closure_Values) {
                if (style1.closure.toLowerCase().trim().includes(closure.toLowerCase())) {
                    mappedClosure1 = closure;
                    break;
                }
                else if (style1.closure.toLowerCase().trim() === "hook & eye") {
                    mappedClosure1 = "Hook and Eye";
                    break;
                }
                else if (style1.closure.toLowerCase().trim() === "not applicable") {
                    mappedClosure1 = 'NA';
                    break;
                }
            }

            let mappedClosure2 = 'NA';
            for (const closure of Closure_Values) {
                if (style2.closure.toLowerCase().trim().includes(closure.toLowerCase())) {
                    mappedClosure2 = closure;
                    break;
                }
                else if (style2.closure.toLowerCase().trim() === "hook & eye") {
                    mappedClosure2 = "Hook and Eye";
                    break;
                }
                else if (style2.closure.toLowerCase().trim() === "not applicable") {
                    mappedClosure2 = 'NA';
                    break;
                }
            }

            // **************************** end of closure mapping ************************************
            // **************************** start of wash care mapping ************************************
            const WashCare_Values = ["Hank Wash", "Machine Wash", "Dry Clean"];
            let mappedWashCare = "Machine Wash";
            for (const washcare of WashCare_Values) {
                if (style1.washCare.toLowerCase().trim().includes(washcare.toLocaleLowerCase())) {
                    mappedWashCare = washcare;
                    break;
                }
            }

            // **************************** end of wash care mapping ************************************

            // Dynamic Front Length Calculation
            const input = {
                front_length: Number(style1?.measurements.frontLengthXS),
                Sleeve_Length_inches_XS: Number(style1.measurements.sleeveLengthXS)
            }

            function addFrontLengthValue(index) {
                if (input?.front_length > 0) {
                    return input?.front_length + (index - 1) * 0.5;
                } else {
                    return "";
                }
            }

            let mappedBottom = {
                "Trouser": "Trousers",
                "Pant": "Trousers",
                "Plazzo": "Plazzos"
            }



            // Coord details
            const price = coord.mrp || (style1.mrp || 0) + (style2.mrp || 0);
            const fabric = mappedfabricType[style1.fabricType] || style1.fabricType || "";
            // const color = `${[style1.stylePrimaryColor] || style1.stylePrimaryColor}`;
            const desc = `${style1.styleDescription}`;


            return newsizes.map((size, index) => {
                const mappedSize = sizeMapping[size];
                const styleGroupId = Math.floor(index) + 1;
                return {
                    "styleId": "",
                    "styleGroupId": styleGroupId,
                    "vendorSkuCode": `${coord.coordStyleNumber}-${style1.stylePrimaryColor}-${mappedSize}`,
                    "vendorArticleNumber": coord.coordStyleNumber || "",
                    "vendorArticleName": coord.coordSetName || "",
                    "brand": "Qurvii",
                    "Manufacturer Name and Address with Pincode": "B-149, Sector 6, Noida, UP 201301, India",
                    "Packer Name and Address with Pincode": "B-149, Sector 6, Noida, UP 201301, India",
                    "Importer Name and Address with Pincode": "",
                    "Country Of Origin": "India",
                    "Country Of Origin2": "",
                    "Country Of Origin3": "",
                    "Country Of Origin4": "",
                    "Country Of Origin5": "",
                    "articleType": "Co-Ords",
                    "Brand Size": mappedSize,
                    "Standard Size": mappedSize === "1XL" ? "XL" : mappedSize === "2XL" ? "XXL" : mappedSize,
                    "is Standard Size present on Label": "Yes",
                    "Brand Colour (Remarks)": prominentColor || "",
                    "GTIN": "",
                    "HSN": "62114290",
                    "SKUCode": "",
                    "MRP": price || "",
                    "AgeGroup": "Adults-Women",
                    "Prominent Colour": prominentColor,
                    "Second Prominent Colour": "",
                    "Third Prominent Colour": "",
                    "FashionType": "Fashion",
                    "Usage": "",
                    "Year": new Date().getFullYear() || "",
                    "season": season,
                    "Product Details": desc || "",
                    "styleNote": "",
                    "materialCareDescription": fabric || "",
                    "sizeAndFitDescription": "",
                    "productDisplayName": "",
                    "tags": "",
                    "addedDate": "",
                    "Color Variant GroupId": "",
                    "Fabric": mappedfabricType,
                    "Occasion": mappedOccasion,
                    "Sleeve Length": sleeveMapping[style1.sleeveLength.trim()] || "",
                    "Neck": mappedNeckline || style1.neckStyle || "",
                    "Top Fabric": mappedfabric1 || style1.fabrics[0]?.name,
                    "Bottom Fabric": mappedfabric2 || style2.fabrics[0]?.name,
                    "Top Type": style1.styleType,
                    "Bottom Type": mappedBottom[style2.styleType] || style2.styleType,
                    "Top Pattern": mappedPattern1 || style1.prints,
                    "Bottom Pattern": mappedPattern2 || style2.prints,
                    "Bottom Closure": mappedClosure2 || style2.closure || "Slip-On",
                    "Add-Ons": "NA",
                    "Wash Care": mappedWashCare,
                    "Character": "",
                    "Lining": style1.lining?.toLowerCase().includes("without") ? "NA" : "Has a lining",
                    "Number of Pockets": "NA",
                    "Trends": "",
                    "Sustainable": "",
                    "Number of Items": 2,
                    "Top Closure": mappedClosure1 || style1.closure,
                    "Net Quantity Unit": "Piece",
                    "Theme": "",
                    "Stitch": "",
                    "Collection Name": "",
                    "Package Contains": `1 ${style1.styleType}, 1 ${style2.styleType}`,
                    "BIS Expiry Date": "",
                    "BIS Certificate Image URL": "",
                    "BIS Certificate Number": "",
                    "Net Quantity": 1,
                    "Across Shoulder ( Inches )": sizeData[size]?.[0] ?? "",
                    "Bust ( Inches )": sizeData[size]?.[1] ?? "",
                    "Chest ( Inches )": sizeData[size]?.[2] ?? "",
                    "Front Length ( Inches )": addFrontLengthValue(sizes.indexOf(size)),
                    "Garment Waist ( Inches )": "",
                    "Inseam Length ( Inches )": "",
                    "Outseam Length ( Inches )": "",
                    "Rise ( Inches )": "",
                    "Sleeve-Length ( Inches )": "",
                    "To Fit Bust ( Inches )": "",
                    "To Fit Hip ( Inches )": "",
                    "To Fit Waist ( Inches )": "",
                    "Front Image": "",
                    "Side Image": "",
                    "Back Image": "",
                    "Detail Angle": "",
                    "Look Shot Image": "",
                    "Additional Image 1": "",
                    "Additional Image 2": ""
                };
            })

        });

        const csv = Papa.unparse({
            fields: csvHeaders,
            data: csvData,
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Myntra_Coords_listing.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.log("Failed to download listing file", error);
    }
};

export { generateMyntraCoordsListingFile };
