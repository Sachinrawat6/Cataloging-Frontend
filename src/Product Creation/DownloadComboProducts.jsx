import Papa from "papaparse";

const downloadComboProducts = (coords, selectedData) => {

    const csvHeaders = [
        "Name",
        "Combo SKU Code",
        "Combo Package Dimensions",
        "Combo Product Weight",
        "Combo Product Category",
        "Combo Color",
        "Combo Size",
        "Combo Brand",
        "Combo Selling Price",
        "Combo Shipping Mode",
        "Combo Image Url",
        "HSN Code",
        "GST Tax Name",
        "Child SKU Code 1",
        "Child SKU Qty 1",
        "Child SKU Price 1",
        "Child SKU Code 2",
        "Child SKU Qty 2",
        "Child SKU Price 2",
        "Child SKU Code 3",
        "Child SKU Qty 3",
        "Child SKU Price 3",
        "Child SKU Code 4",
        "Child SKU Qty 4",
        "Child SKU Price 4",
        "Child SKU Code 5",
        "Child SKU Qty 5",
        "Child SKU Price 5",
        "Child SKU Code 6",
        "Child SKU Qty 6",
        "Child SKU Price 6",
        "Child SKU Code 7",
        "Child SKU Qty 7",
        "Child SKU Price 7",
        "Child SKU Code 8",
        "Child SKU Qty 8",
        "Child SKU Price 8",
        "Child SKU Code 9",
        "Child SKU Qty 9",
        "Child SKU Price 9",
        "Child SKU Code 10",
        "Child SKU Qty 10",
        "Child SKU Price 10"

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

    try {
        const newsizes = Object.keys(sizeMapping);


        const csvData = coords.flatMap(coord => {
            const [style1Num, style2Num] = coord.styleNumbers;
            const style1 = selectedData.find(s => s.styleNumber === style1Num);
            const style2 = selectedData.find(s => s.styleNumber === style2Num);

            if (!style1 || !style2) return [];

            // Coord details
            const price = coord.mrp || (style1.mrp || 0) + (style2.mrp || 0);



            return newsizes.map((size, index) => {
                const mappedSize = sizeMapping[size];

                return {
                    "Name": coord?.coordSetName || "",
                    "Combo SKU Code": `${coord.coordStyleNumber}-${style1.stylePrimaryColor}-${mappedSize}`,
                    "Combo Package Dimensions": "35X35X4",
                    "Combo Product Weight": 400,
                    "Combo Product Category": "Coord Set",
                    "Combo Color": style1.stylePrimaryColor || "",
                    "Combo Size": mappedSize,
                    "Combo Brand": "Qurvii",
                    "Combo Selling Price": price || "",
                    "Combo Shipping Mode": "",
                    "Combo Image Url": "",
                    "HSN Code": 62043300,
                    "GST Tax Name": "GST_5_12",
                    "Child SKU Code 1": `${style1.styleNumber}-${style1.stylePrimaryColor}-${mappedSize}`,
                    "Child SKU Qty 1": 1,
                    "Child SKU Price 1": "",
                    "Child SKU Code 2": `${style2.styleNumber}-${style2.stylePrimaryColor}-${mappedSize}`,
                    "Child SKU Qty 2": 1,
                    "Child SKU Price 2": "",
                    "Child SKU Code 3": "",
                    "Child SKU Qty 3": "",
                    "Child SKU Price 3": "",
                    "Child SKU Code 4": "",
                    "Child SKU Qty 4": "",
                    "Child SKU Price 4": "",
                    "Child SKU Code 5": "",
                    "Child SKU Qty 5": "",
                    "Child SKU Price 5": "",
                    "Child SKU Code 6": "",
                    "Child SKU Qty 6": "",
                    "Child SKU Price 6": "",
                    "Child SKU Code 7": "",
                    "Child SKU Qty 7": "",
                    "Child SKU Price 7": "",
                    "Child SKU Code 8": "",
                    "Child SKU Qty 8": "",
                    "Child SKU Price 8": "",
                    "Child SKU Code 9": "",
                    "Child SKU Qty 9": "",
                    "Child SKU Price 9": "",
                    "Child SKU Code 10": "",
                    "Child SKU Qty 10": "",
                    "Child SKU Price 10": ""
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
        link.download = "BulkCreateComboProducts.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.log("Failed to download listing file", error);
    }
};

export { downloadComboProducts };
