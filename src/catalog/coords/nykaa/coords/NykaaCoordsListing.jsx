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

// Across Shoulder
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

// Bust
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

// Chest
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

// Dynamic Front Length Calculation
function addFrontLength(input) {
    if (input.Front_Length_inches_XS > 0) {
        sizes.forEach((size, index) => {
            sizeData[size].push(input.Front_Length_inches_XS + (index - 1) * 0.5);
        });
    } else {
        sizes.forEach((size) => sizeData[size].push(""));
    }
}

// Dynamic Sleeve Length Calculation
function addSleeveLength(input) {
    if (input.Sleeve_Length_inches_XS > 0) {
        sizes.forEach((size, index) => {
            sizeData[size].push(input.Sleeve_Length_inches_XS + (index - 1) * 0.25);
        });
    } else {
        sizes.forEach((size) => sizeData[size].push(""));
    }
}

// Waist
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

// Hips
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

// Inseam Length
const inseamLength = {
    XXS: 29,
    XS: 29.25,
    S: 29.5,
    M: 29.75,
    L: 30,
    XL: 30.25,
    XXL: 30.5,
    XXXL: 30.75,
    XXXXL: 31,
    XXXXXL: 31.25,
};

// Outseam Length
const outseamLength = {
    XXS: 41,
    XS: 41,
    S: 41,
    M: 41,
    L: 41,
    XL: 41,
    XXL: 41,
    XXXL: 41,
    XXXXL: 41,
    XXXXXL: 41,
};

// Example usage
const input = {
    Front_Length_inches_XS: 32,
    Sleeve_Length_inches_XS: 24,
};

addFrontLength(input);
addSleeveLength(input);




const generateNykaaCooordsListing = (coords, selectedData) => {
    console.log("Coords:", coords);
    console.log("Selected Styles:", selectedData);

    const csvHeaders = [
        "Vendor SKU Code", "Gender", "Brand Name", "Style Code", "Product Name", "Description", "Price",
        "Color", "Country of Origin", "Manufacturer Name", "Manufacturer Address", "Ean Codes", "brand size",
        "Design Code", "Multipack Set", "Occasion", "Season", "Care Instruction", "Ships In", "HSN Codes",
        "Pack Contains", "Net Qty", "Material", "Disclaimer", "Sets Subcategory", "Neckline",
        "Responsibility Criteria", "Pattern", "Collections Function", "Pocket Description", "Closure",
        "Fit", "Model details", "Sleeve length Type", "Leg Style", "Rise Style", "Age",
        "Bust For Body", "Chest For Body", "Waist For Body", "Hip For Body", "Bust for Garment",
        "Chest for Garment", "Waist for Garment", "Hip for Garment", "Shoulder for Garment",
        "Sleeve Length", "Bottom Length for Garment", "Shoulder For Body",
        "Inseam For Body", "Inseam for Garment", "Length For Body", "Bottom Length For Body",
        "Front Image", "Back Image", "Additional Image 1", "Additional Image 2",
        "Additional Image 3", "Additional Image 4", "Additional Image 5", "Additional Image 6",
        "Additional Image 7", "Additional Image 8"
    ];

    const sizeMapping = {
        XXS: "XXS", XS: "XS", S: "S", M: "M", L: "L", XL: "XL",
        XXL: "2XL", XXXL: "3XL", XXXXL: "4XL", XXXXXL: "5XL",
    };
    const newsizes = Object.keys(sizeMapping);

    // Fabric + Color Mapping from your old code
    const fabricMapping = { "French crepe": "Poly Silk", Crepe: "Crepe", Rayon: "Rayon", Silk: "Silk", Cotton: "Cotton", Georgette: "Georgette" };
    const colorMapping = { "Multi": "Multi-color", "Navy": "Navy Blue", "Gray": "Grey", "Mint Green": "Green" };

    const csvData = coords.flatMap(coord => {
        const [style1Num, style2Num] = coord.styleNumbers;
        const style1 = selectedData.find(s => s.styleNumber === style1Num);
        const style2 = selectedData.find(s => s.styleNumber === style2Num);

        if (!style1 || !style2) return [];

        // Sleeve length mapping
        let sleevType = "";

        if (style1.sleeveLength.trim() === "Full") {
            sleevType = "Full Sleeves";
        } else if (style1.sleeveLength.trim() === "Three Quarter") {
            sleevType = "Three Fourth Sleeves";
        } else if (
            style1.sleeveLength.trim() === "Half" ||
            style1.sleeveLength.trim() === "Short" ||
            style1.sleeveLength.trim() === "Quarter" ||
            style1.sleeveLength.trim() === "Elbow Length" ||
            style1.sleeveLength.trim() === "Above Elbow Length"
        ) {
            sleevType = "Half Sleeves";
        }
        else {
            sleevType = style1.sleeveLength.trim();
        }

        // End of sleeve length mapping


        // Fitting type mapping
        if (style1.fittingType === "Loose Fit") {
            style1.fittingType = "Loose";
        } else if (
            [
                "Regular Fit",
                "Regular Fit, Loose Fit",
                "Regular Fit, Western",
                "Regular Fit, Loose Fit, Classic",
                "Regular Fit, Loose Fit, Western",
                "Regular Fit, Western, Relaxed",
                "Regular Fit, Loose Fit, Relaxed",
                "Regular Fit, Relaxed",
                "Regular Fit, Slim Fit, Relaxed",
                "Regular Fit, Slim Fit, Western, Classic",
                "Regular Fit, Slim Fit, Classic",
                "Regular Fit, Loose Fit, Western, Relaxed",
                "Regular Fit, Western, Fusion",
                "Regular Fit, Loose Fit, Western, Fusion",
            ].includes(style1.fittingType)
        ) {
            style1.fittingType = "Regular";
        } else if (
            [
                "Relaxed Fit",
                "Regular Fit, Western",
                "Other",
                "Loose Fit, Western, Fusion",
                "Loose Fit, Western, Relaxed",
                "Loose Fit, Western, Fusion, Relaxed",
                "Slim Fit, Relaxed",
                "Western, Fusion, Relaxed",
            ].includes(style1.fittingType)
        ) {
            style1.fittingType = "Relaxed";
        } else if (style1.fittingType === "Slim Fit") {
            style1.fittingType = "Slim";
        } else if (style1.fittingType === "Stretch Fit") {
            style1.fittingType = "Bodycon";
        } else if (style1.fittingType === "Oversized") {
            style1.fittingType = "Oversized";
        } else if (style1.fittingType === "Fit & Flare") {
            style1.fittingType = "Flared";
        }


        // Neck Style mapping
        const neckStyleMapping = {
            "V Neck": "V-Neck",
            "Wide Collar V Neck": "V-Neck",
            "Shawl Collar": "Shawl Lapel",
            Shawl: "Shawl Lapel",
            "Mandarin Collar": "Mandarin Neck",
            "Tie or Bow": "Tie Up Neck",
            "Classic Shirt": "Collar Neck",
            "Spaghetti Strap": "Strapless/Tube",
        };

        // Update product necline if a match exists
        let mappedNeck = ""
        mappedNeck = neckStyleMapping[style1.neckStyle] || style1.neckStyle;

        // color mapping start here 

        const colorMapping = {
            "Multi": "Multi-color",
            "Navy": "Navy Blue",
            "Gray": "Grey",
            "fuchia pink": "Pink",
            "Fucia Pink": "Pink",
            "Fuchia Pink": "Pink",
            "Fuchia pink": "Pink",
            "fucia pink": "Pink",
            "Mint Green": "Green",
            "mint green": "Green"
        }

        style1.stylePrimaryColor = colorMapping[style1.stylePrimaryColor] || style1.stylePrimaryColor;

        // end of color mapping 


        // Fabric material mapping
        const fabricMapping = {
            "French crepe": "Poly Silk",
            "Navy french crepe": "Poly Silk",
            "French Crepe": "Poly Silk",
            "French Crepe Silk": "Poly Silk",
            "Burfi silk": "Silk",
            "Burfii silk": "Silk",
            "Burfi Silk": "Silk",
            "Vamika crepe": "Crepe",
            "Vamika Crepe": "Crepe",
            "Capri Crepe": "Crepe",
            "Mint green bubble crepe": "Crepe",
            "Navy stripe crepe": "Crepe",
            "Black Stripes crepe": "Crepe",
            "Black stripe crepe": "Crepe",
            "Pleated mustard Crepe": "Crepe",
            "Solid black Crepe": "Crepe",
            "Solid navy blue crepe": "Crepe",
            "Solid red crepe": "Crepe",
            "Yellow heart print crepe": "Crepe",
            "Red crepe": "Crepe",
            "Black crepe": "Crepe",
            "Polka dot crepe": "Crepe",
            "Polka crepe": "Crepe",
            Crepe: "Crepe",
            "Crepe silk": "Crepe",
            "White crepe": "Crepe",
            "Printed crepe": "Crepe",
            "Wine Stripe Crepe": "Crepe",
            "Blue-White stripe crepe": "Crepe",
            "Lime yellow bird printed crepe": "Crepe",
            "Mustard leopard print crepe": "Crepe",
            "Floral crepe": "Crepe",
            "Floral print crepe": "Crepe",
            "Black floral crepe": "Crepe",
            "Animal print crepe": "Crepe",
            "Solid Crepe": "Crepe",
            "Wine floral crepe": "Crepe",
            "Red floral print Crepe": "Crepe",
            Harnaz: "Georgette",
            Cosmic: "Georgette",
            "Harnaz Georgette": "Georgette",
            Georgette: "Georgette",
            Satin: "Satin",
            "Black Satin": "Satin",
            "Beige-Black leopard print satin": "Satin",
            "Floral print Satin": "Satin",
            "Digital printed Satin": "Satin",
            "Floral Satin": "Satin",
            "Roman Silk": "Silk",
            "Amalfi silk": "Silk",
            "Noritake silk": "Silk",
            "Navy Noritake silk": "Silk",
            "Turquoise green Noritake silk": "Silk",
            "Turquoise blue Noritake silk": "Silk",
            "Orange Noritake silk": "Silk",
            "Off-white burfi silk": "Silk",
            "Gray barfi silk": "Silk",
            "Red barfi silk": "Silk",
            "Moss crepe": "Moss Crepe",
            "Sea green moss crepe": "Moss Crepe",
            "Royal blue moss crepe": "Moss Crepe",
            "Black moss crepe": "Moss Crepe",
            "Gray moss crepe": "Moss Crepe",
            "Teal Moss crepe": "Moss Crepe",
            "Maroon heather moss crepe": "Moss Crepe",
            Telsa: "Lycra",
            Lycra: "Lycra",
            "Telsa Lycra": "Lycra",
            Rayon: "Rayon",
            Reyon: "Rayon",
            "Crinkle Rayon": "Rayon",
            "Rayon Twill": "Rayon",
            "Geometric printed Rayon": "Rayon",
            "Printed Rayon": "Rayon",
            Jersey: "Jersey",
            "Cotton Slub": "Cotton",
            "Cotton slub": "Cotton",
            Cotton: "Cotton",
            "Printed Cotton": "Cotton",
            "Blue-White floral cotton": "Cotton",
            "White & black border printed cotton": "Cotton",
            Velvet: "Velvet",
            Velvit: "Velvet",
            Fleece: "Fleece",
            "Anti-Piling Fleece": "Fleece",
            "Wine Anti-Pilling Fleece": "Fleece",
            "Sherpa Fleece": "Fleece",
            Wool: "Wool",
            "Black plaid wool": "Wool",
            "Brown plaid wool": "Wool",
            "Black Nep wool": "Wool",
            "Black and white houndstooth wool": "Wool",
            Suede: "Suede",
            "Rabbit fur": "Fur",
            "Couture soft": "Suede",
            Net: "Net",
            "Net Fabric": "Net",
            Sequins: "Sequin",
            "Poly Crepe": "Poly Silk",
            "Poly Silk": "Poly Silk",
            Poplin: "Poplin",
            Chambray: "Chambray",
            Twill: "Twill",
            Chiffon: "Chiffon",
            Rib: "Rib",
        };

        // Season mapping
        let season = "";
        const seasonMapping = {
            "Summer,Spring": "Spring/Summer",
            "Summer, Spring": "Spring/Summer",
            Summer: "Summer",
            Fall: "Winter",
            fall: "Winter",
            Spring: "Spring",
            "Winter, Fall": "Winter",
            Winter: "Winter",
            "Spring, Fall": "Spring",
            "Autum/ Fall": "Autumn",
            "Summer, Fall": "Summer",
            "Summer, Spring, Fall": "Spring/Summer",
            "Summer, Winter, Fall": "Autumn/Winter",
            "Summer, Winter, Spring, Fall": "Spring/Summer",
        };

        // Update product season
        if (seasonMapping[style1.season]) {
            season = seasonMapping[style1.season];
        }

        // Pattern mapping
        const patternMapping = {
            Solid: "Solid/Plain",
            "Solid,": "Solid/Plain",
            solid: "Solid/Plain",
            "Solid, Floral": "Solid/Plain",
            "Solid, Stripe": "Solid/Plain",
            "Solid, Pastels": "Solid/Plain",
            "Solid, Pastels, Floral": "Solid/Plain",
            "Solid, Brocade": "Solid/Plain",
            "Solid, printed": "Solid/Plain",
            "Solid, Check": "Solid/Plain",
            "Solid, Heart": "Solid/Plain",
            "Solid, Abstract": "Solid/Plain",
            "Solid, Paisley": "Solid/Plain",
            "Solid, Geometric": "Solid/Plain",
            "Solid/Plain, Floral": "Solid/Plain, Floral",
            "Solid/Plain, Stripes": "Solid/Plain, Floral",
            "Solid/Plain, Abstract": "Solid/Plain, Floral",
            "Animal, Floral": "Animal Print",
            "Animal, Pastels": "Animal Print",
            "Animal, Leopard": "Animal Print",
            "Solid, Animal, Leopard": "Animal Print",
            "Tie & dye": "Tie & Dye",
            "tie & dye": "Tie & Dye",
            "Tie & Dye": "Tie & Dye",
            Polka: "Polka Dots",
            "Polka Dots": "Polka Dots",
            Tropical: "Nature",
            Nature: "Nature",
            "Tropical, Stripe": "Nature",
            Abstract: "Abstract",
            "Abstract, Pastels": "Abstract",
            "Abstract, Tropical": "Abstract",
            Geometric: "Geometric",
            "Geometric, Pastels": "Geometric",
            "Geometric, Polka": "Geometric",
            Zebra: "Animal Print",
            "Animal Print": "Animal Print",
            "Solid, Zebra": "Animal Print",
            "Marbel print": "Printed",
            Printed: "Printed",
            "Hounds tooth": "Printed",
            Camouflage: "Printed",
            "Panel print": "Printed",
            Check: "Printed",
            "Check, Plaid": "Printed",
            "Swiss dott": "Printed",
            "Border print": "Printed",
            "Pastels, Printed": "Printed",
            "Pastels, Polka": "Printed",
            Pastels: "Printed",
            Plaid: "Printed",
            Embroidered: "Embroidered",
            "multi dot print": "Polka Dots",
            cow: "Animal Print",
            "Pastels, Swiss-dot": "Textured",
            "Swiss-dot": "Textured",
            COLORBLOCK: "Colorblock",
            Stripe: "Stripes",
            Leopard: "Animal Print"
        };

        // Update product pattern if a match exists
        let prints = ""
        prints = patternMapping[style1.prints] || style1.prints;

        // Occasion mapping
        const occasionMapping = {
            "Evening, Party, Festival": "Evening Wear",
            "Evening, Party, Casual, Festival": "Evening Wear",
            "Evening, Party, Casual, Festival, Night": "Evening Wear",
            "Evening, Party, Casual, Office, Daily, Festival, Night":
                "Evening Wear",
            "Evening, Festival, Party": "Evening Wear",
            "Evening, Party, Festival, Smart Casual": "Evening Wear",
            "Party, Festival": "Evening Wear",
            "Festival, Party": "Evening Wear",
            "Casual, Daily, Day, Smart Casual": "Casual",
            "Evening, Casual, Beach, Smart Casual": "Evening Wear",

            Festival: "Festive Wear",
            "Casual, Festival": "Festive Wear",
            "Casual, Festival, Smart Casual": "Festive Wear",
            "Casual, Festival, Day, Smart Casual": "Festive Wear",
            "Casual, Festival, Smart Casual, Active": "Festive Wear",

            "Evening, Party, Casual, Night": "Casual",
            "Casual, Daily, Day, Smart Casual, Active": "Casual",
            "Casual, Daily, Beach, Smart Casual": "Casual",
            "Casual, Daily, Night, Day, Smart Casual, Active": "Casual",
            "Casual, Daily, Smart Casual, Active": "Casual",
            "Casual, Daily, Smart Casual": "Casual",
            "Casual, Daily, Night": "Casual",
            "Casual, Office, Daily": "Casual",
            "Casual, Office, Daily, Smart Casual": "Casual",
            "Casual, Smart Casual, Active": "Casual",
            "Casual, Daily, Beach": "Casual",
            "Casual, Formal, Day": "Casual",
            "Casual, Daily": "Casual",
            "Casual, Formal, Semi Formal": "Casual",
            "Casual, Day, Smart Casual, Active": "Casual",
            "Casual, Day, Smart Casual": "Casual",
            "Casual, Formal, Daily, Beach": "Casual",
            "Casual, Formal, Semi Formal, Daily, Day, Smart Casual": "Casual",
            "Casual, Formal, Semi Formal, Daily, Beach": "Casual",
            "Casual, Formal": "Casual",
            "Casual, Semi Formal, Daily, Day, Smart Casual": "Casual",
            "Casual, Office, Smart Casual": "Casual",
            "Casual, Office": "Casual",
            "Casual, Office, Beach": "Casual",
            "Casual, Beach": "Casual",
            "Casual, Office, Day": "Casual",
            "Casual, Office, Active": "Casual",

            "Evening, Festival, Night, Day, Smart Casual": "Evening Wear",
            "Evening, Festival, Smart Casual, Active": "Evening Wear",
            "Evening, Casual, Smart Casual, Active, Outerwear": "Evening Wear",
            "Evening, Smart Casual": "Evening Wear",
            "Evening, Festival, Night, Smart Casual, Active": "Evening Wear",
            "Evening, Party, Smart Casual, Night": "Evening Wear",
            "Evening, Festival, Night": "Evening Wear",

            "Semi Formal": "Semi Formal",
            "Semi Formal, Smart Casual": "Semi Formal",
            "Semi Formal, Office, Smart Casual": "Semi Formal",
            "Semi Formal, Office, Daily": "Semi Formal",
            "Semi Formal, Office, Night, Smart Casual": "Semi Formal",

            Active: "Sporty",
            Evening: "Evening Wear",
        };

        // Update product occasion if a match exists
        let mappedOcaasion = occasionMapping[style1.occasion];
        if (style1.occasion.toLowerCase().trim().includes("party")) {
            mappedOcaasion = "Party"
        }
        else if (style1.occasion.toLowerCase().trim().includes("casual")) {
            mappedOcaasion = "Casual";
        }
        else if (style1.occasion.toLowerCase().trim().includes("evening")) {
            mappedOcaasion = "Evening Wear";
        }

        // Coord details
        const price = coord.mrp || (style1.mrp || 0) + (style2.mrp || 0);
        const fabric = fabricMapping[style1.fabricType] || style1.fabricType || "";
        const color = `${colorMapping[style1.stylePrimaryColor] || style1.stylePrimaryColor}`;
        const desc = `${style1.styleDescription}`;

        return newsizes.map((size, index) => {
            const mappedSize = sizeMapping[size];
            return {
                "Vendor SKU Code": `${coord.coordStyleNumber}-${color}-${mappedSize}`,
                Gender: "Women",
                "Brand Name": "Qurvii",
                "Style Code": coord.coordStyleNumber,
                "Product Name": coord.coordSetName,
                Description: desc,
                Price: price,
                Color: color,
                "Country of Origin": "India",
                "Manufacturer Name": "Qurvii",
                "Manufacturer Address": "B-149, Sector 6, Noida, UP 201301, India",
                "Ean Codes": "",
                "brand size": mappedSize,
                "Design Code": "",
                "Multipack Set": "Combo",
                Occasion: mappedOcaasion || style2.occasion || "",
                Season: season || style2.season || "",
                "Care Instruction": style1.washCare || style2.washCare || "",
                "Ships In": 2,
                "HSN Codes": "62044490",
                "Pack Contains": "1 Top, 1 Bottom",
                "Net Qty": "2N",
                Material: fabricMapping[fabric] || style1.fabricType,
                Disclaimer: "Qurvii styles specially for curvy women of all sizes. Please check our size chart before ordering",
                "Sets Subcategory": "Co-ord Set",
                Neckline: mappedNeck || "",
                Pattern: prints || style2.prints || "",
                Closure: style1.closure || style2.closure || "",
                Fit: style1.fittingType || style2.fittingType || "",
                "Model details": "Model is 5ft 9in tall and is wearing size XS",
                "Sleeve length Type": sleevType || "Sleeveless",
                "Leg Style": "",
                "Rise Style": "Mid Waist",
                Age: "",
                "Bust For Body": sizeData[size]?.[1] ?? "",
                "Chest For Body": sizeData[size]?.[2] ?? "",
                "Waist For Body": sizeData[size]?.[5] ?? "",
                "Hip For Body": sizeData[size]?.[6] ?? "",
                "Bust for Garment": sizeData[size]?.[1] ?? "",
                "Chest for Garment": sizeData[size]?.[2] ?? "",
                "Waist for Garment": sizeData[size]?.[5] ?? "",
                "Hip for Garment": sizeData[size]?.[6] ?? "",
                "Shoulder for Garment": sizeData[size]?.[0] ?? "",
                "Sleeve Length": style1.measurements?.sleeveLengthXS || "",
                "Bottom Length for Garment": "",
                "Shoulder For Body": sizeData[size]?.[0] ?? "",
                "Inseam For Body": inseamLength[sizes[index]],
                "Inseam for Garment": inseamLength[sizes[index]],
                "Length For Body": sizeData[size]?.[3] ?? "",
                "Bottom Length For Body": "",
                "Front Image": "",
                "Back Image": "",
                "Additional Image 1": "",
                "Additional Image 2": "",
                "Additional Image 3": "",
                "Additional Image 4": "",
                "Additional Image 5": "",
                "Additional Image 6": "",
                "Additional Image 7": "",
                "Additional Image 8": ""
            };
        });
    });

    const csv = Papa.unparse({ fields: csvHeaders, data: csvData });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Nykaa_Coords_Listing.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default generateNykaaCooordsListing;

