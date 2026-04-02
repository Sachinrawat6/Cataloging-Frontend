import { useEffect, useState } from "react";
import Papa from "papaparse";
import styleWiseService from "../services/GET SERVICE/getService";
// import CooordsSidebar from "../../components/CoordsSidebar";
import CatalogDetails from "../components/CatalogDetails";
import { downloadComboProducts } from "../Product Creation/DownloadComboProducts";
// import styleWiseService from "../../services/GET SERVICE/getService";

const UploadComboProduct = () => {
    const [loading, setLoading] = useState(false);
    const [styles, setStyles] = useState([]);
    const [coords, setCoords] = useState([]);
    const [error, setError] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [notApproved, setNotApproved] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchCoords = async (data) => {
        try {
            const response = await styleWiseService.uploadAndGetCoordsDetails(data);

            setCoords(response.data);

            // Collect all style numbers (style1 + style2)
            const style1 = response.data.map((s) => s.styleNumbers[0]);
            const style2 = response.data.map((s) => s.styleNumbers[1]);
            const styles = [...style1, ...style2].filter(Boolean);

            await fetchAllStyles(styles);
        } catch (error) {
            console.error("Failed to fetch coords data :: ", error);
            setError("Failed to fetch coordination data");
        }
    };

    const fetchAllStyles = async (data) => {
        setLoading(true);
        try {
            const response = await styleWiseService.uploadAndGetStyleDetails(data);
            // setStyles(response.data || []);

            const approved_mark_styles = response?.data?.filter((style) => style.checked);
            const not_approved_mark_styles = response?.data?.filter((style) => !style.checked);

            setStyles(approved_mark_styles);
            setNotApproved(not_approved_mark_styles)
            console.log("Approved styles", approved_mark_styles);
            console.log("Not approved styles", not_approved_mark_styles);
        } catch (error) {
            console.error("Failed to fetch styles :: error :: ", error);
            setError("Failed to load styles: " + (error?.message || error));
        } finally {
            setLoading(false);
        }
    };

    console.log("coords")

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setError(null);

        if (!file) return;

        // File type validation
        if (!file.name.toLowerCase().endsWith(".csv")) {
            setError("Please upload a valid CSV file");
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ",",
            complete: async (result) => {
                try {
                    if (result.errors && result.errors.length > 0) {
                        setError("Error parsing CSV: " + result.errors[0].message);
                        return;
                    }

                    // Extract style numbers safely
                    const extracted = result.data
                        .map((row) => {
                            const val =
                                row["Coord Style Number"] ||
                                row["Style Number"] ||
                                row["CoordStyleNumber"];

                            if (!val) return null;
                            const num = Number(String(val).trim());
                            return isNaN(num) ? null : num;
                        })
                        .filter((num) => num !== null);

                    if (extracted.length === 0) {
                        setError("No valid style numbers found in the CSV");
                        return;
                    }

                    setFileData(extracted);
                    await fetchCoords(extracted);
                } catch (err) {
                    console.error("Processing error:", err);
                    setError("Something went wrong while processing the file");
                }
            },
            error: (error) => {
                console.error("PapaParse error:", error);
                setError("Error reading file: " + error.message);
            },
        });
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileData([]);
        setCoords([]);
        setStyles([]);
        setError(null);
    };

    return (
        <div className="flex flex-col  min-h-screen bg-gray-50">
            {/* Sidebar */}
            {coords.length > 0 && (
                <div className="mt-10 py-4 bg-white w-full flex justify-center z-10">
                    {/* <CooordsSidebar coords={coords} data={styles} /> */}
                    <button
                        onClick={() => downloadComboProducts(coords, styles)}
                        className="bg-purple-400 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-purple-500 ease-in duration-75">
                        Download
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 ">
                        Create Combo Products
                    </h1>
                </div>

                {/* File Upload Section */}
                <div className="bg-white rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Upload Coordination Styles
                    </h2>

                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <input
                                type="file"
                                id="file-upload"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                                accept=".csv"
                            />
                            <label
                                htmlFor="file-upload"
                                className="block w-full py-3 px-4 border-2 border-dashed border-purple-300 rounded-lg text-center hover:border-purple-500 transition-colors cursor-pointer"
                            >
                                <span className="text-purple-600 font-medium">Choose CSV file</span>
                                <span className="text-gray-500 ml-2">or drag and drop</span>
                            </label>
                        </div>
                        <div>
                            {!selectedFile && (
                                <a
                                    className="bg-purple-400 text-white font-medium py-2 px-4 rounded hover:bg-purple-500 ease-in duration-75"
                                    href="../Coords_Template.csv">Download Sample File</a>
                            )}

                            {selectedFile && (
                                <button
                                    onClick={handleRemoveFile}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {selectedFile && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg
                                        className="w-6 h-6 text-purple-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <span className="text-gray-700 font-medium">
                                        {selectedFile.name}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                </span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        <span className="ml-3 text-gray-600">Loading styles...</span>
                    </div>
                )}

                {/* Results Section */}
                {!loading && styles.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <CatalogDetails data={styles} not_approved={notApproved} />
                    </div>
                )}

                {/* Empty State */}
                {!loading && !selectedFile && styles.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-xs">
                        <svg
                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            No data uploaded yet
                        </h3>
                        <p className="text-gray-500">Upload a CSV file to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadComboProduct;
