import React, { useEffect, useState } from 'react';
import styleWiseService from '../services/GET SERVICE/getService';

const Coords = () => {
    const [coords, setCoords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCoordsData = async () => {
        setLoading(true);
        try {
            const response = await styleWiseService.getCoordsStyles();
            setCoords(response.data);
        } catch (error) {
            console.error('Error fetching coords:', error);
            setError(error.message || 'Failed to fetch coordinate styles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoordsData();
    }, []);



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                        Coord Sets
                    </h2>
                    <p className="text-gray-600">Manage your coordinated style collections with precision</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
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

                {/* Data Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-purple-50 to-cyan-50">
                                    <tr>
                                        {['No.', 'Style #', 'Set Name', 'Style 1', 'Style 2', 'Color 1', 'Color 2', 'MRP', 'Designer', 'Created'].map((header) => (
                                            <th
                                                key={header}
                                                scope="col"
                                                className="px-6 py-4 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {coords.length > 0 ? (
                                        coords.map((coord, index) => (
                                            <tr
                                                key={coord.coordStyleNumber}
                                                className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-cyan-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                                                    {coord.coordStyleNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800  ">
                                                    <span className=''>{coord.coordSetName.substr(0, 30) + "..."}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-600">
                                                    {coord.styleNumbers[0]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-600">
                                                    {coord.styleNumbers[1]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-xs transition-all hover:shadow-sm"
                                                        style={{
                                                            backgroundColor: coord.colors[0]?.hex || '#e9d5ff',
                                                            color: getContrastColor(coord.colors[0]?.hex)
                                                        }}
                                                    >
                                                        {coord.colors[0] || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-xs transition-all hover:shadow-sm"
                                                        style={{
                                                            backgroundColor: coord.colors[1]?.hex || '#a5f3fc',
                                                            color: getContrastColor(coord.colors[1]?.hex)
                                                        }}
                                                    >
                                                        {coord.colors[1] || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {coord.mrp}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {coord.createdBy}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(coord.createdAt)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-8 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="mt-4 text-lg font-medium text-gray-600">No coordinate sets found</p>
                                                    <p className="text-sm text-gray-500 mt-1">Create your first coord set to get started</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Enhanced contrast function with fallbacks
function getContrastColor(hexColor) {
    if (!hexColor) return '#000000';

    try {
        // Convert hex to RGB
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Return black for light colors, white for dark colors
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    } catch {
        return '#000000';
    }
}

export default Coords;