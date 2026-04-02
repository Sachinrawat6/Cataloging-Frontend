import React, { useEffect, useState } from 'react';
import styleWiseService from '../services/GET SERVICE/getService';
import styleWisePostService from '../services/POST SERVICE/postServices';
import { Link } from 'react-router-dom';

const Relisted = () => {
    const [relisted, setRelisted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        oldSku: '',
        newSku: '',
        imageLink: '',
        createdBy: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRelisted = async () => {
        setLoading(true);
        try {
            const response = await styleWiseService.getRelistedStyles(query);
            const workingWithFilterAndWithout = !Array.isArray(response.data) ? [response.data] : response.data
            setRelisted(workingWithFilterAndWithout);
        } catch (error) {
            console.error('Error fetching coords:', error);
            setError(error.message || 'Failed to fetch relisted styles');
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilter = () => {
        window.location.reload();
    }

    useEffect(() => {
        fetchRelisted();
    }, []);

    const handleSearch = () => {
        fetchRelisted();
    }



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleEditClick = (relist) => {
        setEditingId(relist._id);
        setEditFormData({
            oldSku: relist.oldSku,
            newSku: relist.newSku,
            imageLink: relist.imageLink,
            createdBy: relist.createdBy || ''
        });
    };

    const handleCancelClick = () => {
        setEditingId(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleUpdate = async (id) => {
        try {
            const response = await styleWisePostService.updateRelistStyle(id, editFormData);
            console.log(response.data);
            await fetchRelisted();
            setEditingId(null);
        } catch (error) {
            console.log("Failed to update", error);
        }
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    };

    const closeImageModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {/* Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        <button
                            onClick={closeImageModal}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex justify-center items-center h-full">
                            <img
                                src={selectedImage}
                                alt="Product Preview"
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                            Relisted Styles
                        </h2>

                    </div>
                    <div>
                        <input type="search" placeholder='Search by old sku'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='border border-purple-400 py-2 px-4 rounded-xl outline-purple-600 duration-75 cursor-pointer'
                        />
                        {relisted.length === 1 ? (
                            <button
                                onClick={handleClearFilter}
                                className='bg-red-400 py-2 px-4 rounded ml-2 text-white hover:bg-red-500 duration-75 cursor pointer'>Clear</button>
                        ) : (
                            <button
                                onClick={handleSearch}
                                className='bg-purple-400 py-2 px-4 rounded ml-2 text-white hover:bg-purple-500 duration-75 cursor pointer'>Search</button>
                        )}
                    </div>
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
                                        {['No.', 'Old Sku#', 'New Sku# ', 'Product Image', 'Designer', 'Created', "Action"].map((header) => (
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
                                    {relisted?.length > 0 ? (
                                        relisted?.map((relist, index) => (
                                            <tr
                                                key={relist._id}
                                                className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-cyan-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                </td>

                                                {/* Old SKU */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === relist._id ? (
                                                        <input
                                                            type="text"
                                                            name="oldSku"
                                                            value={editFormData.oldSku}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-purple-600 font-medium">
                                                            {relist.oldSku}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* New SKU */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === relist._id ? (
                                                        <input
                                                            type="text"
                                                            name="newSku"
                                                            value={editFormData.newSku}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {relist.newSku}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Image Link */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === relist._id ? (
                                                        <input
                                                            type="text"
                                                            name="imageLink"
                                                            value={editFormData.imageLink}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        // <div className="cursor-pointer" onClick={() => openImageModal(relist.imageLink)}>
                                                        //     <Link to={relist.imageLink} target='_blank'>
                                                        //         <img
                                                        //             src={relist.imageLink}
                                                        //             alt="product"
                                                        //             className="w-20 h-20 object-cover rounded-md shadow-sm hover:shadow-md transition-shadow"
                                                        //         />
                                                        //     </Link>
                                                        // </div>
                                                        <div>
                                                            <Link
                                                                className='text-white bg-purple-400 px-2 rounded-xl py-1 text-xs hover:bg-purple-500 duration-75 ease-in'
                                                                to={relist.imageLink} target="_blank">
                                                                Viw Image
                                                            </Link>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Designer */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === relist._id ? (
                                                        <input
                                                            type="text"
                                                            name="createdBy"
                                                            value={editFormData.createdBy}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-600">
                                                            {relist?.createdBy || "Unknown"}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Created Date */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(relist.createdAt)}
                                                </td>

                                                {/* Action Buttons */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                                                    {editingId === relist._id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdate(relist._id)}
                                                                className="bg-green-500 py-2 px-4 rounded-md shadow text-white font-medium hover:bg-green-600 transition-colors"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelClick}
                                                                className="bg-gray-400 py-2 px-4 rounded-md shadow text-white font-medium hover:bg-gray-500 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditClick(relist)}
                                                            className="bg-yellow-400 py-2 px-4 rounded-md shadow text-black font-medium hover:bg-yellow-500 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="mt-4 text-lg font-medium text-gray-600">No relisted found</p>
                                                    <p className="text-sm text-gray-500 mt-1">Create your first relist style get started</p>
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

export default Relisted;