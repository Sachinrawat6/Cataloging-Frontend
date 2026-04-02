import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

const StyleUploader = () => {
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);

    // Batch size for chunked uploads
    const BATCH_SIZE = 50;

    const safeNumber = (value) => {
        if (value === "" || value === undefined || value === null) return 0;
        let str = String(value).trim();
        str = str.replace(/[₹,%?\s]/g, "").replace(/,/g, "");
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num;
    };

    const safeBoolean = (value) => {
        if (typeof value === "boolean") return value;
        if (typeof value === "string") {
            return value.toLowerCase() === "true" || value.toLowerCase() === "yes";
        }
        return Boolean(value);
    };

    let currentLogId = Date.now();

    const transformCSVRowToStyle = (row) => {
        return {
            styleNumber: row["Style Number"] || "",
            styleSketchImageLink: row["Style Sketch/Image Link"] || "",
            line: row["Line?"] || "",
            patternNumber: row["Pattern Number"] || "",
            sleevePatternNumber: row["Sleeve Pattern Number"] || "",
            styleType: row["Style Type"] || "",
            stylePrimaryColor: row["Style Primary Color"] || "",
            styleSecondaryColor: row["Style Secondary Color"] || "",
            primaryColorShade: row["Primary Color Shade"] || "",
            fabricType: row["Fabric Type"] || "",
            styleName: row["Style Name"] || "",
            styleDescription: row["Style Description"] || "",

            fabrics: [
                {
                    name: row["Fabric 1 Name"] || "",
                    status: row["Fabric 1 Status"] || "",
                    quantityMeters: safeNumber(row["Fabric 1 Quantity (in meter)"]),
                    ratePerMeter: safeNumber(row["Fabric 1 Rate (Rs per meter)"]),
                    number: row["Fabric 1 Number"] || "",
                },
                {
                    name: row["Fabric 2 Name"] || "",
                    status: row["Fabric 2 Status"] || "",
                    quantityMeters: safeNumber(row["Fabric 2 Quantity (in meter)"]),
                    ratePerMeter: safeNumber(row["Fabric 2 Rate (Rs per meter)"]),
                    number: row["Fabric 2 Number"] || "",
                },
                {
                    name: row["Fabric 3 Name"] || "",
                    status: row["Fabric 3 Status"] || "",
                    quantityMeters: safeNumber(row["Fabric 3 Quantity (in meter)"]),
                    ratePerMeter: safeNumber(row["Fabric 3 Rate (Rs per meter)"]),
                    number: row["Fabric 3 Number"] || "",
                },
            ].filter((f) => f.name),

            accessories: [
                {
                    type: row["Accessory 1 Type"] || "",
                    status: row["Accessory 1 Status"] || "",
                    quantity: safeNumber(row["Accessory 1 Quantity"]),
                    rate: safeNumber(row["Accessory 1 Rate"]),
                    number: row["Accessory 1 Number"] || "",
                },
                {
                    type: row["Accessory 2 Type"] || "",
                    status: row["Accessory 2 Status"] || "",
                    quantity: safeNumber(row["Accessory 2 Quantity"]),
                    rate: safeNumber(row["Accessory 2 Rate"]),
                    number: row["Accessory 2 Number"] || "",
                },
                {
                    type: row["Accessory 3 Type"] || "",
                    status: row["Accessory 3 Status"] || "",
                    quantity: safeNumber(row["Accessory 3 Quantity"]),
                    rate: safeNumber(row["Accessory 3 Rate"]),
                    number: row["Accessory 3 Number"] || "",
                },
            ].filter((a) => a.type),

            dyeingCost: safeNumber(row["Dyeing Cost"]),
            laborHours: safeNumber(row["Labor (hours)"]),
            prints: row["Prints"] || "",
            occasion: row["Occasion"] || "",
            neckStyle: row["Neck Style"] || "",
            mainTrend: row["Main Trend"] || "",
            fittingType: row["Fitting Type"] || "",
            collarType: row["Collar Type"] || "",
            sleeveType: row["Sleeve Type"] || "",
            sleeveLength: row["Sleeve Length"] || "",
            season: row["Season"] || "",
            hemline: row["Hemline"] || "",
            transparency: row["Transparency"] || "",
            lining: row["Lining"] || "",
            washCare: row["Wash Care"] || "",
            closure: row["Closure"] || "",

            measurements: {
                bustXS: safeNumber(row["Bust (Inches) - XS"]),
                chestXS: safeNumber(row["Chest (inches) - XS"]),
                frontLengthXS: safeNumber(row["Front Length (inches) - XS"]),
                hips: safeNumber(row["Hips (inches)"]),
                waistXS: safeNumber(row["Waist (inches) - XS"]),
                acrossShoulderXS: safeNumber(row["Across Shoulder (inches) - XS"]),
                sleeveLengthXS: safeNumber(row["Sleeve Length (inches) - XS"]),
            },

            organicSustainable: safeBoolean(row["Organic/Sustainable?"]),
            dressType: row["Dress Type"] || "",
            shirtType: row["Shirt Type"] || "",
            dressLength: row["Dress Length"] || "",
            emailAddress: row["Email Address"] || "",

            cost: {
                fabricCost: safeNumber(row["Fabric Cost"]),
                accessoryCost: safeNumber(row["Accessory Cost"]),
                laborCost: safeNumber(row["Labor Cost"]),
                dyeingCost: safeNumber(row["Dyeing Cost"]),
                packingCost: safeNumber(row["Packing Cost"]),
                totalCostUSD: safeNumber(row["Total Cost (USD)"]),
                totalCostINR: safeNumber(row["Total Cost (INR)"]),
            },

            discounts: {
                discountPercent: safeNumber(row["Discount (%)"]),
                discountRupees: safeNumber(row["Discount Rupees"]),
                targetSPINR: safeNumber(row["Target SP (INR)"]),
                firstDiscountedPrice: safeNumber(row["1st Discounted Price"]),
                firstDiscountRs: safeNumber(row["1st Discount (Rs)"]),
                secondDiscountedPrice: safeNumber(row["2nd Discounted Price"]),
                secondDiscountRs: safeNumber(row["2nd Discount (Rs)"]),
                clearancePrice: safeNumber(row["Clearance Price"]),
                clearanceDiscountRs: safeNumber(row["Clerance Discount (Rs)"]),
                outletPrice: safeNumber(row["Outlet Price"]),
            },

            mrp: safeNumber(row["MRP"]),
            styleStatus: row["Style Status"] || "Draft",
            msrpUSD: safeNumber(row["MSRP (USD)"]),
            discountPercentage: safeNumber(row["Discount %"]),
            premiumStyle: safeBoolean(row["Premium Style?"]),
            exactInventory: safeNumber(row["Exact Inventory"]),
            inactive: safeBoolean(row["Inactive"]),
            checked: safeBoolean(row["Checked"]),
            photo: row["Photo"] || "",
            createdBy: "system",
            logId: Number(currentLogId)
        };
    };

    const uploadDetailstoStyleLog = async (data) => {
        try {
            // const response = await axios.post("http://localhost:5000/api/v1/stylewise/create-log", data)
            const response = await axios.post("https://stylewise-backend-uqx8.onrender.com/api/v1/stylewise/create-log", data)

            console.log(response)
        } catch (error) {
            console.log("Failed to save details to style logs.", error);
        }
    }

    const uploadBatch = async (batch, totalBatches) => {
        try {
            const response = await axios.post(
                "https://stylewise-backend-uqx8.onrender.com/api/v1/stylewise/regular-style/create",
                // "http://localhost:5000/api/v1/stylewise/regular-style/create",
                batch,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    timeout: 60000, // 60 seconds timeout per batch
                }
            );

            setProcessedCount(prev => prev + batch.length);
            setProgress(Math.min(100, (processedCount + batch.length) / (totalBatches * BATCH_SIZE) * 100));

            return { success: true, data: response.data };
        } catch (err) {
            console.error("Batch upload error:", err);
            return {
                success: false,
                error: err.response?.data?.message || err.message
            };
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setError("");
        setSuccess("");
        setProgress(0);
        setProcessedCount(0);

        try {
            // First parse the entire CSV
            const parseResult = await new Promise((resolve, reject) => {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: resolve,
                    error: reject,
                });
            });

            if (parseResult.errors.length > 0) {
                throw new Error("CSV parsing errors occurred");
            }

            const allStyles = parseResult.data.map(row => transformCSVRowToStyle(row));
            const totalStyles = allStyles.length;

            // Process in batches
            const batches = [];
            for (let i = 0; i < totalStyles; i += BATCH_SIZE) {
                batches.push(allStyles.slice(i, i + BATCH_SIZE));
            }

            let successfulUploads = 0;
            const errors = [];

            // Process batches sequentially
            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                const result = await uploadBatch(batch, batches.length);

                if (result.success) {
                    successfulUploads += batch.length;
                } else {
                    errors.push({
                        batch: i + 1,
                        error: result.error,
                        records: batch.map(s => s.styleNumber)
                    });
                }
            }

            // Final result
            if (errors.length === 0 && !error) {
                setSuccess(`Successfully uploaded all ${totalStyles} styles`);
                const payload = {
                    season: allStyles[0].season || "NA",
                    totalStyles: allStyles.length,
                    createdBy: allStyles[0].createdBy,
                    logId: allStyles[0].logId
                }
                uploadDetailstoStyleLog(payload)
            } else {
                setSuccess(`Uploaded ${successfulUploads} of ${totalStyles} styles successfully`);
                setError(`${errors.length} batches failed. First error: ${errors[0].error}`);
                console.error("Failed batches:", errors);
            }

        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message || "Upload failed");
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Style Upload</h1>

            <div className="mb-4">
                <label className="block mb-2 font-medium">CSV File:</label>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full border p-2 rounded"
                    disabled={loading}
                />
            </div>

            {loading && (
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span>Processing... ({processedCount} records)</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-100 text-red-800 rounded">{error}</div>
            )}
            {(success && !error) && (
                <div className="p-3 bg-green-100 text-green-800 rounded">{success}</div>
            )}

            <div className="mt-6 p-4 bg-gray-100 rounded">
                <h2 className="font-bold mb-2">CSV Upload Notes:</h2>
                <ul className="list-disc pl-5">
                    <li>Large files will be processed in batches of {BATCH_SIZE} records</li>
                    <li>Upload progress will be shown during processing</li>
                    <li>Partial successes will be reported</li>
                    <li>Check browser console for detailed error logs</li>
                    <li className="mt-2 list-none">
                        <a
                            className="bg-purple-400 py-2 px-4 rounded-md text-white font-bold hover:bg-purple-500 duration-75 ease-in"
                            href="/STYLEWISE_SAMPLE_SHEET.csv">Download Sample</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default StyleUploader;