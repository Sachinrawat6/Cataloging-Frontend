import Papa from "papaparse";

const generateShoppersStopCoordsListing = (coords, selectedData) => {
    const csvHeaders = [
        "STOCK",
        "HSN",
        "MRP",
        "Attribute",
        "L3/L4 Code",
        "Season",
        "Style Code",
        "Master SKU",
        "Old SKU",
        "EAN",
        "Brand",
        "SIZE",
        "Brand Size",
        "SAP Colour",
        "Color Family",
        "Product Type",
        "Product Title",
        "Collection Name",
        "Product Description",
        "Gender",
        "Fabric",
        "Fabric Composition",
        "Pattern",
        "Specific Pattern",
        "Fit",
        "Occasion",
        "Closure Type",
        "Length",
        "Sleeves",
        "Sleeve Style",
        "Neckline",
        "Collar",
        "Waist Rise",
        "Wash",
        "Bottom Type",
        "Knit/Woven",
        "Pack of",
        "Package Contents",
        "Embroidery Type",
        "Embellishment",
        "Pockets",
        "Stretchable",
        "Hemline",
        "materialCareDescription",
        "Store/Dropship",
        "Search Keyword",
        "Country of Origin",
        "Manufacturer Name With Full Address , phone no and email id",
        "Importer Name With Full Address , phone no and email id",
        "Packer Name With Full Address , phone no and email id",
        "Size",
        "Brand Size",
        "Bust",
        "Across Shoulder",
        "To Fit Waist",
        "Front Length",
        "Inseam Length",
        "Outseam Length",
        "Waist",
        "Hips",
        "Image Reference number / Name",
        "Image Reference number / Name 2",
        "Image Reference number / Name 3",
        "Image Reference number / Name 4",
        "Image Reference number / Name 5",
    ];
    const sizeMapping = {
        XXS: "XXS",
        XS: "XS",
        S: "S",
        M: "M",
        L: "L",
        XL: "XL",
        XXL: "2XL",
        XXXL: "3XL",
        XXXXL: "4XL",
        XXXXXL: "5XL",
    };

    const newsizes = Object.keys(sizeMapping); // ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"]

    const csvData = coords.flatMap((coord) => {
        const [style1Num, style2Num] = coord.styleNumbers;
        const style1 = selectedData.find(s => s.styleNumber === style1Num);
        const style2 = selectedData.find(s => s.styleNumber === style2Num);


        if (!style1 || !style2) return [];

        // Convert size to 2XL, 3XL, etc.




        let seasonYear = new Date().getFullYear();

        //   **********************Fitting mapping ***************************************

        let fittingType = "Regular fit";

        if (style1.fittingType && typeof style1.fittingType === "string") {
            const fit = style1.fittingType.toLowerCase(); // Convert to lowercase for case-insensitive comparison
            if (fit.includes("relaxed")) {
                fittingType = "Relaxed Fit";
            } else if (fit.includes("slim")) {
                fittingType = "Slim fit";
            }
        }

        //   ********************** end of Fitting mapping ***************************************


        //   ********************** start of occasion mapping ***************************************


        let occasion = "Casual Wear";

        if (style1.occasion && typeof style1.occasion === "string") {
            const occasionText = style1.occasion.toLowerCase(); // Convert to lowercase for case-insensitive matching

            if (
                occasionText.includes("evening") ||
                occasionText.includes("festival")
            ) {
                occasion = "Evening Wear";
            } else if (occasionText.includes("casual")) {
                occasion = "Casual Wear";
            }
        }

        //   ********************** end of occasion mapping ***************************************

        //   ********************** start of pattern  mapping ***************************************

        const patternList = [
            "Print",
            "Solid",
            "Lace",
            "Stripes",
            "Paisley",
            "Floral",
            "Pin Stripes",
            "Geometric",
            "Checks",
            "Embroidery",
            "Metallic",
            "Embellished",
            "Polka Dot",
            "Animal Print",
            "Other",
            "Color-Block",
            "Structured",
        ];

        let patternType = "";

        if (style1.prints && typeof style1.prints === "string") {
            const patternText = style1.prints.toLowerCase(); // Normalize input for case-insensitive comparison

            if (patternText === "leopard" || patternText === "animal") {
                patternType = "Animal Print";
            } else if (patternText === "polka") {
                patternType = "Polka Dot";
            } else if (patternText === "check") {
                patternType = "Checks";
            } else if (patternText === "stripe") {
                patternType = "Stripes";
            } else {
                // Find a match in patternList
                patternType =
                    patternList.find((pattern) =>
                        patternText.includes(pattern.toLowerCase())
                    ) || "";
            }
        }




        const price = coord.mrp || (style1.mrp || 0) + (style2.mrp || 0);

        return newsizes.map((size) => {

            const mappedSize = sizeMapping[size];

            return {
                STOCK: "",
                HSN: "62114290",
                MRP: price || "",
                Attribute: "",
                "L3/L4 Code": "",
                Season: seasonYear,
                "Style Code": coord.coordStyleNumber,
                "Master SKU": `${coord.coordStyleNumber}-${style1.stylePrimaryColor}-${mappedSize}`,
                "Old SKU": "",
                EAN: `${coord.coordStyleNumber}${style1.stylePrimaryColor}${mappedSize}`,
                Brand: "Qurvii",
                SIZE: mappedSize,
                "Brand Size": mappedSize,
                "SAP Colour": style1.stylePrimaryColor,
                "Color Family": style1.stylePrimaryColor,
                "Product Type": "Co-ords",
                "Product Title": coord.coordSetName,
                "Collection Name": "",
                "Product Description": "update this later ",
                Gender: "Women",
                Fabric: style1.fabrics[0]?.name,
                "Fabric Composition": "",
                Pattern: patternType || style1.prints,
                "Specific Pattern": "",
                Fit: fittingType || style1.fittingType,
                Occasion: occasion,
                "Closure Type": style1.closure,
                Length: "",
                Sleeves: style1.sleeveLength || "",
                "Sleeve Style": "",
                Neckline: style1.neckStyle || "",
                Collar: style1.collarType || "",
                "Waist Rise": "Mid Rise",
                Wash: style1.primaryColorShade || "Light Wash",
                "Bottom Type": style2.styleType || "",
                "Knit/Woven": "Woven",
                "Pack of": 2,
                "Package Contents": `1 ${style1.styleType}, 1 ${style2.styleType}`,
                "Embroidery Type": "",
                Embellishment: "",
                Pockets: "",
                Stretchable: "No",
                Hemline: "",
                materialCareDescription: style1.washCare,
                "Store/Dropship": "Dropship",
                "Search Keyword": "",
                "Country of Origin": "India",
                "Manufacturer Name With Full Address , phone no and email id": "Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com",
                "Importer Name With Full Address , phone no and email id": "Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com",
                "Packer Name With Full Address , phone no and email id": "Qurvii, B-149 2nd floor sector 6, Noida, Pincode 201301, Email- logistics@qurvii.com",
                Size: mappedSize,
                "Brand Size": mappedSize,
                Bust: 0,
                "Across Shoulder": 0,
                "To Fit Waist": 0,
                "Front Length": 0,
                "Inseam Length": 0,
                "Outseam Length": 0,
                Waist: 0,
                Hips: 0,
                "Image Reference number / Name": "",
                "Image Reference number / Name 2": "",
                "Image Reference number / Name 3": "",
                "Image Reference number / Name 4": "",
                "Image Reference number / Name 5": "",
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
    link.download = "shoppersstop_Coords_listing.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default generateShoppersStopCoordsListing;
