import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import styleWisePostService from '../services/POST SERVICE/postServices';

const CoordsUploadPage = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setError(null);
        setSuccess(null);
        const uploadedFile = e.target.files[0];

        if (!uploadedFile) return;

        const fileType = uploadedFile.name.split('.').pop().toLowerCase();
        if (fileType !== 'csv') {
            setError('Please upload a valid CSV file');
            return;
        }

        setFile(uploadedFile);
        setLoading(true);

        Papa.parse(uploadedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    if (results.errors.length > 0) {
                        setError('Error parsing CSV file');
                        console.error('CSV parse errors:', results.errors);
                        return;
                    }

                    // Transform CSV data to backend format
                    const transformedData = results.data.map(row => {
                        // Collect style numbers from multiple columns
                        const styleNumbers = [
                            row["Style1"],
                            row["Style2"],

                        ].filter(Boolean).map(num => parseInt(num.trim(), 10));

                        // Collect colors from multiple columns
                        const colors = [
                            row["Color1"],
                            row["Color2"]
                        ].filter(Boolean).map(color => color.trim());

                        return {
                            coordStyleNumber: parseInt(row["Coord Style Number"], 10) || null,
                            styleNumbers,
                            coordSetName: row["Coord Set Name"]?.trim() || '',
                            createdBy: row["Designer"] || "",
                            mrp: row["Mrp"] || 0,
                            colors,

                        };
                    });

                    // Validate the data
                    const invalidRows = transformedData.filter(item =>
                        isNaN(item.coordStyleNumber) ||
                        item.styleNumbers.some(isNaN) ||
                        !item.coordSetName ||
                        item.colors.length === 0
                    );

                    if (invalidRows.length > 0) {
                        setError(`Found ${invalidRows.length} invalid rows. Please check your data.`);
                        console.error('Invalid rows:', invalidRows);
                        return;
                    }

                    setData(transformedData);
                    setSuccess(`Successfully parsed ${transformedData.length} coordinate sets`);
                } catch (err) {
                    setError('Error processing CSV data');
                    console.error('Data processing error:', err);
                } finally {
                    setLoading(false);
                }
            },
            error: (error) => {
                setError('Error reading CSV file');
                console.error('CSV read error:', error);
                setLoading(false);
            }
        });
    };


    const handleSubmit = async () => {
        if (data.length === 0) {
            setError('No valid data to upload');
            return;
        }

        setLoading(true);
        try {
            // Here you would typically call your API
            await styleWisePostService.createCoordsStyles(data);
            console.log('Data to be submitted:', data);
            setSuccess(`Successfully processed ${data.length} coordinate sets`);
            setData([]);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError('Failed to upload coordinate sets');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    const requiredColumns = [
        { name: 'Coord Style Number', description: 'Main coordinate style number (numeric)' },
        { name: 'Style1', description: 'First style like (17063)' },
        { name: 'Style2', description: 'Second style like (17064)' },
        { name: 'Coord Set Name', description: 'Coord title ' },
        { name: 'Color1', description: 'First color like (Blue)' },
        { name: 'Color2', description: 'Second color like  (Blue)' },
        { name: 'Mrp', description: 'Coord Mrp in number (5425)' },
        { name: 'Designer', description: 'Fill your name || Default (Admin)' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Bulk Coordinate Styles Upload</h1>
                    <p className="text-gray-600">
                        Upload a CSV file to create multiple coordinate style sets at once
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
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Required CSV Format</h2>
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
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Example
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requiredColumns.map((col) => (
                                    <tr key={col.name}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {col.name}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                            {col.description}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                            {col.name === 'coordStyleNumber' && '101'}
                                            {col.name === 'styleNumbers' && '"201,202,203"'}
                                            {col.name === 'coordSetName' && '"Summer Set"'}
                                            {col.name === 'colors' && '"Red,Blue,Green"'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors p-8 text-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv"
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                            {loading ? (
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            ) : (
                                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            )}
                            <p className="text-lg font-medium text-gray-700">
                                {loading ? 'Processing file...' : 'Click to upload CSV'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Only CSV files are accepted
                            </p>
                        </div>
                    </label>
                </div>

                {file && !loading && (
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
                                {data.length} coordinate sets found
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
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Coord Style #
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Set Name
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Style Numbers
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Colors
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.slice(0, 5).map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {item.coordStyleNumber}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {item.coordSetName}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {item.styleNumbers.join(', ')}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {item.colors.join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                    {data.length > 5 && (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-2 text-center text-sm text-gray-500">
                                                ... and {data.length - 5} more coordinate sets
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <div>
                        <a href="./coordsUpload.csv" className='py-2 px-4 rounded bg-purple-400 text-purple-900 hover:bg-purple-500 duration-75 ease-in cursor-pointer'>Download Sample</a>
                    </div>
                    <button
                        onClick={() => {
                            setData([]);
                            setFile(null);
                            setError(null);
                            setSuccess(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Clear
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
                                Processing...
                            </span>
                        ) : 'Upload Coordinate Sets'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoordsUploadPage;