import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import styleWisePostService from '../services/POST SERVICE/postServices';

const RelistUploadPage = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setError(null);
        setSuccess(null);
        const uploadedFile = e.target.files[0];

        if (!uploadedFile) return;

        const fileType = uploadedFile.name.split('.').pop().toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(fileType)) {
            setError('Please upload a valid CSV or Excel file');
            return;
        }

        setFile(uploadedFile);
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (fileType === 'csv') {
                    Papa.parse(e.target.result, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (results) => {
                            if (results.errors.length > 0) {
                                setError('Error parsing CSV file');
                                console.error('CSV parse errors:', results.errors);
                                setLoading(false);
                                return;
                            }

                            try {
                                const payload = results.data.map(row => ({
                                    oldSku: Number(row["Old Sku"] || row["oldSku"] || row["Old_Sku"] || ''),
                                    newSku: Number(row["New Sku"] || row["newSku"] || row["New_Sku"] || ''),
                                    imageLink: row["Image Link"] || row["imageLink"] || row["Image_Link"] || ''
                                }));

                                // Validate the transformed data
                                const invalidRows = payload.filter(item =>
                                    isNaN(item.oldSku) ||
                                    isNaN(item.newSku) ||
                                    !item.imageLink
                                );

                                if (invalidRows.length > 0) {
                                    setError(`Found ${invalidRows.length} rows with invalid data. Please check SKU values and image links.`);
                                    console.error('Invalid rows:', invalidRows);
                                    setLoading(false);
                                    return;
                                }

                                setData(payload);
                            } catch (transformError) {
                                setError('Error transforming CSV data');
                                console.error('Data transformation error:', transformError);
                            }
                            setLoading(false);
                        },
                        error: (error) => {
                            setError('Error parsing CSV file');
                            console.error('CSV parse error:', error);
                            setLoading(false);
                        }
                    });
                } else {
                    // Handle Excel files
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const excelData = XLSX.utils.sheet_to_json(firstSheet);

                    try {
                        const payload = excelData.map(row => ({
                            oldSku: Number(row["Old Sku"] || row["oldSku"] || row["Old_Sku"] || ''),
                            newSku: Number(row["New Sku"] || row["newSku"] || row["New_Sku"] || ''),
                            imageLink: row["Image Link"] || row["imageLink"] || row["Image_Link"] || 'NA'
                        }));

                        // Validate the transformed data
                        const invalidRows = payload.filter(item =>
                            isNaN(item.oldSku) ||
                            isNaN(item.newSku) ||
                            !item.imageLink
                        );

                        if (invalidRows.length > 0) {
                            setError(`Found ${invalidRows.length} rows with invalid data. Please check SKU values and image links.`);
                            console.error('Invalid rows:', invalidRows);
                            setLoading(false);
                            return;
                        }

                        setData(payload);
                    } catch (transformError) {
                        setError('Error transforming Excel data');
                        console.error('Data transformation error:', transformError);
                    }
                    setLoading(false);
                }
            } catch (err) {
                setError('Error processing file');
                console.error('File processing error:', err);
                setLoading(false);
            }
        };

        if (fileType === 'csv') {
            reader.readAsText(uploadedFile);
        } else {
            reader.readAsBinaryString(uploadedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const event = {
                target: {
                    files: e.dataTransfer.files
                }
            };
            handleFileChange(event);
        }
    };

    const handleSubmit = async () => {
        if (data.length === 0) {
            setError('No valid data to upload');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = data.map(item => ({
                oldSku: item.oldSku || item['Old SKU'] || '',
                newSku: item.newSku || item['New SKU'] || '',
                imageLink: item.imageLink || item['Image URL'] || '',
                createdBy: item.createdBy || item['Created By'] || 'Admin'
            }));

            const response = await styleWisePostService.createRelistStyles(payload);

            if (response.success) {
                setSuccess(`Successfully created ${response.data.length} relisted styles`);
                setData([]);
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setError(response.message || 'Failed to create relisted styles');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during upload');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    const requiredColumns = [
        { name: 'oldSku', displayName: 'Old SKU', description: 'The original SKU number' },
        { name: 'newSku', displayName: 'New SKU', description: 'The new SKU number' },
        { name: 'imageLink', displayName: 'Image URL', description: 'URL of the product image' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Bulk Relisted Style Upload</h1>
                    <p className="text-gray-600">
                        Upload a CSV or Excel file to create multiple relisted styles at once
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Required Columns</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Column Name
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requiredColumns.map((col) => (
                                    <tr key={col.name}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {col.displayName}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                            {col.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div
                    className="mb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="p-8 text-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-lg font-medium text-gray-700">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    CSV or Excel files only
                                </p>
                                {loading && (
                                    <div className="mt-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                {file && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">{file.name}</span>
                                <span className="text-gray-500 text-sm ml-2">
                                    ({Math.round(file.size / 1024)} KB)
                                </span>
                            </div>
                            <span className="text-green-500 text-sm">
                                {data.length} records found
                            </span>
                        </div>
                    </div>
                )}

                {data.length > 0 && (
                    <div className="mb-6 overflow-x-auto">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Preview</h2>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {Object.keys(data[0]).map((key) => (
                                            <th
                                                key={key}
                                                scope="col"
                                                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.slice(0, 5).map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).map((value, j) => (
                                                <td
                                                    key={j}
                                                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-500"
                                                >
                                                    {value || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {data.length > 5 && (
                                        <tr>
                                            <td
                                                colSpan={Object.keys(data[0]).length}
                                                className="px-4 py-2 text-center text-sm text-gray-500"
                                            >
                                                ... and {data.length - 5} more records
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!file || data.length === 0 || loading}
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${(!file || data.length === 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </span>
                        ) : 'Upload Styles'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RelistUploadPage;