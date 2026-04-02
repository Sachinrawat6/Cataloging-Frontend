import Papa from "papaparse"

const generateShopifyCooordsListing = (coords, selectedData) => {
    const csvHeaders = [
        "Handle",
        "Command",
        "Title",
        "Body HTML",
        "Vendor",
        "Type",
        "Tags",
        "Tags Command",
        "Status",
        "Published",
        "Published At",
        "Published Scope",
        "Template Suffix",
        "Gift Card",
        "Category: ID",
        "Category: Name",
        "Category",
        "Custom Collections",
        "Image Attachment",
        "Image Src",
        "Image Command",
        "Image Position",
        "Title 1",
        "Variant ID",
        "Variant Command",
        "Option1 Name",
        "Option1 Value",
        "Option2 Name",
        "Option2 Value",
        "Option3 Name",
        "Option3 Value",
        "Variant Generate From Options",
        "Variant Position",
        "Variant SKU",
        "Variant Weight",
        "Variant Weight Unit",
        "Variant HS Code",
        "Variant Country of Origin",
        "Variant Province of Origin",
        "Variant Price",
        "Variant Compare At Price",
        "Variant Cost",
        "Variant Requires Shipping",
        "Variant Taxable",
        "Variant Tax Code",
        "Variant Barcode",
        "Variant Image",
        "Variant Inventory Tracker",
        "Variant Inventory Policy",
        "Variant Fulfillment Service",
        "Variant Inventory Qty",
        "Variant Inventory Adjust",
        "Metafield:custom.fabric [string]",
        "Metafield:custom.pattern [string]",
        "Metafield:custom.fit [string]",
        "Metafield:custom.sleeve [string]",
        "Metafield:custom.lining [string]",
        "Metafield:custom.wash_care [string]",
        "Metafield:custom.transparency [string]",
        "Metafield:custom.closure [string]",
    ];


    const sizeMapping = {
        XXS: "XXS", XS: "XS", S: "S", M: "M", L: "L", XL: "XL",
        XXL: "2XL", XXXL: "3XL", XXXXL: "4XL", XXXXXL: "5XL",
    };
    const newsizes = Object.keys(sizeMapping);


    const csvData = coords.flatMap(coord => {
        const [style1Num, style2Num] = coord.styleNumbers;
        const style1 = selectedData.find(s => s.styleNumber === style1Num);
        const style2 = selectedData.find(s => s.styleNumber === style2Num);

        if (!style1 || !style2) return [];

        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let time = `${day.toString().length === 1 ? `0${day}` : day}${month.toString().length === 1 ? `0${month}` : month}${year}`


        const tag = `${style1.stylePrimaryColor},${style1.styleType},${style1.fabricType},${style1.prints?.replaceAll("/", ",")},${style1.occasion?.replaceAll("/", ",")},${style1.neckStyle},${style1.mainTrend},${style1.fittingType},${style1.collarType},${style1.sleeveType},${style1.sleeveLength},${style1.season?.replaceAll("/", ",")},${style1.hemline},${style1.transparency},${style1.washCare},${style1.dressType},${style1.shirtType},${style1.primaryColorShade}`
        // Coord details
        const price = coord.mrp || (style1.mrp || "") + (style2.mrp || "");
        return newsizes.map((size, index) => {
            const mappedSize = sizeMapping[size];
            return {
                Handle: coord.coordSetName.trim().toLowerCase().replace(/\s+/g, "-") + "-" + String(time),
                Command: "MERGE",
                Title: coord.coordSetName || "",
                "Body HTML": style1.styleDescription || "",
                Vendor: "Qurvii",
                Type: "Co-ords",
                // Tags: `Qurvii Women, ${style1.stylePrimaryColor}, ${style1.prints}, Co-ords, Coords, women's fashion, casual wear, women's clothing, ${style1.styleType}, New Arrivals , New Arrival`,
                Tags: `Qurvii Women, ${tag.toLowerCase()}, Co-ords, Coords , women's fashion, casual wear, women's clothing, New Arrivals, New Arrival`,
                "Tags Command": "",
                Status: "active",
                Published: true,
                "Published At": "",
                "Published Scope": "",
                "Template Suffix": "",
                "Gift Card": "",
                "Category: ID": "",
                "Category: Name": "",
                Category: "",
                "Custom Collections": "",
                "Image Attachment": "",
                "Image Src": "",
                "Image Command": "",
                "Image Position": "",
                "Title 1": coord.coordSetName || "",
                "Variant ID": "",
                "Variant Command": "",
                "Option1 Name": "SIZE",
                "Option1 Value": mappedSize || "",
                "Option2 Name": "",
                "Option2 Value": "",
                "Option3 Name": "",
                "Option3 Value": "",
                "Variant Generate From Options": "",
                "Variant Position": "",
                "Variant SKU": `${coord.coordStyleNumber}-${style1.stylePrimaryColor}-${mappedSize}`,
                "Variant Weight": 0,
                "Variant Weight Unit": "g",
                "Variant HS Code": "",
                "Variant Country of Origin": "India",
                "Variant Province of Origin": "",
                "Variant Price": price,
                "Variant Compare At Price": price,
                "Variant Cost": "",
                "Variant Requires Shipping": true,
                "Variant Taxable": true,
                "Variant Tax Code": "",
                "Variant Barcode": "",
                "Variant Image": "",
                "Variant Inventory Tracker": "shopify",
                "Variant Inventory Policy": "deny",
                "Variant Fulfillment Service": "manual",
                "Variant Inventory Qty": 100,
                "Variant Inventory Adjust": 0,
                "Metafield:custom.fabric [string]": style1.fabrics[0]?.name,
                "Metafield:custom.pattern [string]": style1.prints,
                "Metafield:custom.fit [string]": style1.fittingType,
                "Metafield:custom.sleeve [string]": style1.sleeveLength || "Sleeveless",
                "Metafield:custom.lining [string]": style1?.lining || "",
                "Metafield:custom.wash_care [string]": style1.washCare,
                "Metafield:custom.transparency [string]": style1?.transparency || "",
                "Metafield:custom.closure [string]": style1?.closure.toLowerCase().trim().includes("not applicable") ? "Other" : style1?.closure || "",
            };
        });
    });

    const csv = Papa.unparse({ fields: csvHeaders, data: csvData });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Shopify_Coords_Listing.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default generateShopifyCooordsListing;