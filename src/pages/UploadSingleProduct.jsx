import React, { useEffect, useState } from 'react';
import { FiUploadCloud, FiFile, FiX, FiCheck } from 'react-icons/fi';
import Sidebar from '../components/CatalogSideBar';
import CatalogDetails from '../components/CatalogDetails';
import styleWiseService from '../services/GET SERVICE/getService';
import { downloadSingleProduct } from '../Product Creation/DownloadSingleProduct';

const UploadSingleProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [payload, setPayload] = useState([]);
    const [brand, setBrand] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, success, error

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'text/csv') {
            processFile(droppedFile);
        } else {
            setError('Please upload a valid CSV file');
        }
    };

    const processFile = (file) => {
        setFile(file);
        setFileName(file.name);
        setUploadStatus('processing');
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvData = e.target.result;
                const rows = csvData.split('\n');

                // Find the Style Number column index
                const headers = rows[0].split(',').map(header => header.trim());
                const styleNumberIndex = headers.findIndex(header =>
                    header.toLowerCase().includes('style') && header.toLowerCase().includes('number')
                );

                if (styleNumberIndex === -1) {
                    throw new Error('CSV file must contain a "Style Number" column');
                }

                // Extract style numbers from the column
                const styleNumbers = [];
                for (let i = 1; i < rows.length; i++) {
                    if (rows[i].trim()) {
                        const columns = rows[i].split(',').map(col => col.trim());
                        if (columns[styleNumberIndex]) {
                            styleNumbers.push(columns[styleNumberIndex]);
                        }
                    }
                }

                if (styleNumbers.length === 0) {
                    throw new Error('No style numbers found in the CSV file');
                }

                const updatedStyleNumbers = styleNumbers.map((s) =>
                    s?.startsWith("8") ? "1" + s.slice(1) : s
                );
                setPayload(updatedStyleNumbers);
                setUploadStatus('success');
            } catch (err) {
                setError(err.message);
                setUploadStatus('error');
                setFile(null);
                setFileName('');
            }
        };

        reader.onerror = () => {
            setError('Error reading file');
            setUploadStatus('error');
            setFile(null);
            setFileName('');
        };

        reader.readAsText(file);
    };

    const removeFile = () => {
        setFile(null);
        setFileName('');
        setPayload([]);
        setUploadStatus('idle');
        setError(null);
    };

    const fetchStyleDetails = async () => {
        if (payload.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            // const mappedPayload = payload.map((s))
            const response = await styleWiseService.uploadAndGetStyleDetails(payload);
            console.log(response.data);
            setData(response.data);
        } catch (err) {
            setError('Failed to fetch style details. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (payload.length > 0) {
            fetchStyleDetails();
        }
    }, [payload]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {payload.length === 0 ? (
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Styles CSV</h2>
                        <p className="text-gray-600">Upload a CSV file containing Style Numbers to create single products</p>
                    </div>
                    <div>
                        <select
                            onChange={(e) => setBrand(e.target.value)}
                            className='py-4 bg-gray-100 rounded-md py-2 px-4 mb-2 outline-gray-300 cursor-pointer'>
                            <option value="">Select Brand </option>
                            <option value="Qurvii">Qurvii </option>
                            <option value="Qurvii+">Qurvii+</option>
                            <option value="Qurvii Desi">Qurvii Desi</option>
                            <option value="RoadStar">RoadStar</option>
                        </select>
                    </div>
                    {brand && (
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <div className="flex flex-col items-center justify-center space-y-4">
                                <FiUploadCloud className={`h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />

                                <div className="flex flex-col items-center">
                                    <p className="font-medium text-gray-700">
                                        {isDragging ? 'Drop your CSV file here' : 'Drag & drop your CSV file'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                                </div>

                                <p className="text-xs text-gray-500">CSV files only</p>
                            </div>
                        </div>
                    )}

                    {uploadStatus === 'processing' && (
                        <div className="mt-6 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-600">Processing file...</span>
                        </div>
                    )}

                    {file && uploadStatus === 'success' && (
                        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiFile className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-green-800 font-medium">{fileName}</span>
                                    <FiCheck className="h-5 w-5 text-green-500 ml-2" />
                                </div>
                                <button
                                    onClick={removeFile}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-green-600 text-sm mt-1">
                                Successfully processed {payload.length} style numbers
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <FiX className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-red-800">{error}</span>
                            </div>
                        </div>
                    )}

                    {brand && (
                        <div className="mt-8 bg-blue-50 rounded-lg p-4">
                            <h3 className="font-medium text-purple-800 mb-2">CS File Requirements</h3>
                            <ul className="text-sm text-purple-600 list-disc pl-5 space-y-1">
                                <li>File must be in CSV format</li>
                                <li>Must contain a column named "Style Number" (case insensitive)</li>
                                <li>Each row should contain a unique style number</li>

                            </ul>
                            <div className='mt-4'>
                                <a className='py-2 px-4 font-medium bg-purple-400 rounded-md hover:bg-purple-500 duration-75 ease-in' href="./STYLES_SAMPLE_TEMPLATE.csv">Download Sample File</a>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className='flex flex-col w-full h-[90vh]'>
                    <div className='mx-auto   p-4 ' >
                        <button
                            onClick={() => downloadSingleProduct(data, brand)}
                            className='bg-teal-400 text-white truncate rounded-xl py-4 cursor-pointer hover:bg-teal-500 duration-75 ease-in px-4'> Download Single Product</button>
                    </div>
                    <div className='w-full'>
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                <span className="ml-3 text-gray-600">Loading style details...</span>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
                                <div className="flex items-center">
                                    <FiX className="h-5 w-5 text-red-500 mr-2" />
                                    <span className="text-red-800">{error}</span>
                                </div>
                            </div>
                        ) : (
                            <CatalogDetails data={data} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadSingleProduct;