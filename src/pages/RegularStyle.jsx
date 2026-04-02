import React, { useEffect, useState } from 'react';
import styleWiseService from '../services/GET SERVICE/getService';
import productService from '../services/api/porductService';

const RegularStyle = () => {
    const [styles, setStyles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [expandedStyle, setExpandedStyle] = useState(null);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [urlOpening, setUrlOpening] = useState(false);
    const [product, setProduct] = useState([]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getProduct();
            setProduct(response);
        } catch (error) {
            console.error("Failed to fetch product :: error :: ", error);
        } finally {
            setLoading(false);
        }



    }



    const fetchRegularStyles = async () => {
        setLoading(true);
        try {
            const response = await styleWiseService.getRegularStyles(query, page);
            const convertToArrayIsResponseIsObject = response.data.styles ? response.data.styles : (!Array.isArray(response.data) ? [response.data] : response.data);
            setLastPage(response.data.styles && Math.floor(response.data.pagination.totalRecords / 100));
            setStyles(convertToArrayIsResponseIsObject);
        } catch (error) {
            console.error("Error fetching styles:", error);
            setError(error.message || "Failed to fetch styles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchRegularStyles();
    }, [page]);



    const formatCurrency = (amount, currency = 'INR') => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleExpand = (id) => {
        setExpandedStyle(expandedStyle === id ? null : id);
    };

    const renderField = (label, value, className = "") => {
        return (
            <div className={`mb-4 ${className}`}>
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                    {value || value === 0 ? value.toString() : 'N/A'}
                </dd>
            </div>
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRegularStyles();
        setLastPage(1);
        setPage(1)
    }

    const handleClearFilter = (e) => {
        setQuery("");
        window.location.reload();
    }

    // pagination buttons logics here 

    const handleNextPage = () => {
        setPage((prev) => page <= lastPage ? prev + 1 : prev);
    }

    const handlePreviosPage = () => {
        setPage((prev) => page > 1 ? prev - 1 : 1);
    }


    const openProductToNewTab = (styleNumber) => {
        setUrlOpening(true);
        try {
            console.log(styleNumber)
            const matchedProduct = product.find((style) => style.style_code == styleNumber)
            console.log(matchedProduct);
            if (!matchedProduct) {
                alert("Style id not found");
                return
            }
            window.open(`https://www.myntra.com/dresses/qurvii/qurvii-floral-print-flared-sleeves-midi-wrap-dress/${matchedProduct.style_id}/buy`)
        } catch (error) {
            console.log("Failed to open images :: error :: ", error);
        }
        finally {
            setUrlOpening(false);
        }
    }

    const renderSectionHeader = (title) => {
        return (
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                {title}
            </h3>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Regular Styles</h1>
                        <p className="text-gray-600">Detailed view of all styles in qurvii collection</p>


                        <p className='text-purple-400 text-xl mt-4'> Showing Page : {page} of {lastPage || 1} </p>

                    </div>
                    {/* search bar  */}
                    <div className='flex gap-2'>

                        <form onSubmit={handleSearch} >
                            <input type="number"
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                                placeholder='Search by style number ... '
                                className='border py-2 px-4  rounded-md border-purple-400 outline-purple-400 cursor-pointer'
                            />

                        </form>
                        <button
                            onClick={handleClearFilter}
                            className='py-2 px-4 bg-red-300 hover:bg-red-400 duration-75 text-gray-800 cursor-pointer'> Clear</button>
                    </div>

                </div>

                {/* pagination  */}
                <div className='flex justify-between p-2 items-center bg-gray-100 mb-2'>
                    <button
                        onClick={handlePreviosPage}
                        disabled={page === 1}
                        className={` 
            ${page === 1 ? "cursor-not-allowed bg-gray-200" : "bg-purple-100 hover:bg-purple-200 cursor-pointer"} 
                     py-2 px-4 rounded-md duration-75 ease-in
  `}
                    >

                        Previous </button>
                    <button
                        disabled={page === lastPage + 1}
                        onClick={handleNextPage}
                        className={` 
            ${page === lastPage + 1 ? "cursor-not-allowed bg-gray-200" : "bg-purple-100 hover:bg-purple-200 cursor-pointer"} 
                     py-2 px-4 rounded-md duration-75 ease-in
  `}
                    >
                        Next
                    </button>

                </div>


                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : error ? (
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
                ) : (
                    <div className="bg-white shadow-xs rounded-lg overflow-hidden">
                        {styles.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {styles.map((style) => (
                                    <li key={style._id} className="p-6">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-4">

                                                    <div>
                                                        <h2 className="text-xl font-bold text-gray-900">
                                                            {style.styleName || 'Unnamed Style'}
                                                        </h2>
                                                        <p className="text-sm text-gray-500 mt-3">
                                                            Style #: {style.styleNumber || 'N/A'} |
                                                            Type: <span className='text-xs text-purple-900 bg-purple-100 py-1 px-2 rounded-xl'>{style.styleType || 'N/A'} </span>  |
                                                            Checked : <span className={`text-xs ${style.checked ? "bg-green-100 text-green-900" : "bg-gray-100"} py-1 px-2 rounded-xl`}>{style.checked ? "YES" : "NO"} </span>

                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleExpand(style._id)}
                                                className="mt-4 md:mt-0 cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
                                            >
                                                {expandedStyle === style._id ? 'Hide Details' : 'Show Details'}
                                            </button>

                                            <button
                                                onClick={() => openProductToNewTab(style.styleNumber)}
                                                className="mt-4 ml-2 md:mt-0 cursor-pointer px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
                                            >
                                                {urlOpening ? "Opening product..." : "View Product Image"}
                                            </button>
                                        </div>

                                        {expandedStyle === style._id && (
                                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {/* Basic Information */}
                                                <div>
                                                    {renderSectionHeader('Basic Information')}
                                                    {renderField('Style Number', style.styleNumber)}
                                                    {renderField('Style Name', style.styleName)}
                                                    {renderField('Description', style.styleDescription)}
                                                    {renderField('Line', style.line)}
                                                    {renderField('Pattern Number', style.patternNumber)}
                                                    {renderField('Sleeve Pattern', style.sleevePatternNumber)}
                                                    {renderField('Style Type', style.styleType)}
                                                    {renderField('Dress Type', style.dressType)}
                                                    {renderField('Season', style.season)}
                                                    {renderField('Occasion', style.occasion)}
                                                    {renderField('Main Trend', style.mainTrend)}
                                                    {renderField('Created By', style.createdBy)}
                                                    {renderField('Created At', formatDate(style.createdAt))}
                                                    {renderField('Updated At', formatDate(style.updatedAt))}
                                                </div>

                                                {/* Design Details */}
                                                <div>
                                                    {renderSectionHeader('Design Details')}
                                                    {renderField('Primary Color', style.stylePrimaryColor)}
                                                    {renderField('Primary Shade', style.primaryColorShade)}
                                                    {renderField('Secondary Color', style.styleSecondaryColor)}
                                                    {renderField('Prints', style.prints)}
                                                    {renderField('Neck Style', style.neckStyle)}
                                                    {renderField('Collar Type', style.collarType)}
                                                    {renderField('Sleeve Type', style.sleeveType)}
                                                    {renderField('Sleeve Length', style.sleeveLength)}
                                                    {renderField('Fitting Type', style.fittingType)}
                                                    {renderField('Hemline', style.hemline)}
                                                    {renderField('Dress Length', style.dressLength)}
                                                    {renderField('Transparency', style.transparency)}
                                                    {renderField('Lining', style.lining)}
                                                    {renderField('Closure', style.closure)}
                                                    {renderField('Wash Care', style.washCare)}
                                                    {renderField('Organic/Sustainable', style.organicSustainable ? 'Yes' : 'No')}
                                                    {renderField('LogId', style.logId)}
                                                </div>

                                                {/* Measurements */}
                                                <div>
                                                    {renderSectionHeader('Measurements (XS)')}
                                                    {style.measurements && (
                                                        <>
                                                            {renderField('Bust', style.measurements.bustXS)}
                                                            {renderField('Chest', style.measurements.chestXS)}
                                                            {renderField('Front Length', style.measurements.frontLengthXS)}
                                                            {renderField('Hips', style.measurements.hips)}
                                                            {renderField('Waist', style.measurements.waistXS)}
                                                            {renderField('Across Shoulder', style.measurements.acrossShoulderXS)}
                                                            {renderField('Sleeve Length', style.measurements.sleeveLengthXS)}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Materials */}
                                                <div>
                                                    {renderSectionHeader('Materials')}
                                                    {renderField('Fabric Type', style.fabricType)}
                                                    {style.fabrics?.length > 0 && (
                                                        <div className="mb-4">
                                                            <dt className="text-sm font-medium text-gray-500">Fabrics</dt>
                                                            <dd className="mt-1">
                                                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                                                    {style.fabrics.map((fabric, index) => (
                                                                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                                            <div className="w-0 flex-1 flex items-center">
                                                                                <span className="ml-2 flex-1 w-0 truncate">
                                                                                    {fabric.name} ({fabric.number})
                                                                                </span>
                                                                            </div>
                                                                            <div className="ml-4 flex-shrink-0">
                                                                                <span className="text-gray-500">
                                                                                    {fabric.quantityMeters}m @ {formatCurrency(fabric.ratePerMeter)}
                                                                                </span>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </dd>
                                                        </div>
                                                    )}
                                                    {style.accessories?.length > 0 && (
                                                        <div className="mb-4">
                                                            <dt className="text-sm font-medium text-gray-500">Accessories</dt>
                                                            <dd className="mt-1">
                                                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                                                    {style.accessories.map((accessory, index) => (
                                                                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                                            <div className="w-0 flex-1 flex items-center">
                                                                                <span className="ml-2 flex-1 w-0 truncate">
                                                                                    {accessory.type} ({accessory.number})
                                                                                </span>
                                                                            </div>
                                                                            <div className="ml-4 flex-shrink-0">
                                                                                <span className="text-gray-500">
                                                                                    {accessory.quantity} @ {formatCurrency(accessory.rate)}
                                                                                </span>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </dd>
                                                        </div>
                                                    )}
                                                    {renderField('Dyeing Cost', formatCurrency(style.dyeingCost))}
                                                    {renderField('Labor Hours', style.laborHours)}
                                                </div>

                                                {/* Pricing */}
                                                <div>
                                                    {renderSectionHeader('Pricing')}
                                                    {style.cost && (
                                                        <>
                                                            {renderField('Fabric Cost', formatCurrency(style.cost.fabricCost))}
                                                            {renderField('Accessory Cost', formatCurrency(style.cost.accessoryCost))}
                                                            {renderField('Labor Cost', formatCurrency(style.cost.laborCost))}
                                                            {renderField('Dyeing Cost', formatCurrency(style.cost.dyeingCost))}
                                                            {renderField('Packing Cost', formatCurrency(style.cost.packingCost))}
                                                            {renderField('Total Cost (INR)', formatCurrency(style.cost.totalCostINR))}
                                                            {renderField('Total Cost (USD)', formatCurrency(style.cost.totalCostUSD, 'USD'))}
                                                        </>
                                                    )}
                                                    {renderField('MRP', formatCurrency(style.mrp))}
                                                    {renderField('MSRP (USD)', formatCurrency(style.msrpUSD, 'USD'))}
                                                </div>

                                                {/* Discounts */}
                                                <div>
                                                    {renderSectionHeader('Discounts')}
                                                    {style.discounts && (
                                                        <>
                                                            {renderField('Discount %', style.discounts.discountPercent ? `${style.discounts.discountPercent}%` : 'N/A')}
                                                            {renderField('Discount Amount', formatCurrency(style.discounts.discountRupees))}
                                                            {renderField('Target SPI', formatCurrency(style.discounts.targetSPINR))}
                                                            {renderField('First Discount Price', formatCurrency(style.discounts.firstDiscountedPrice))}
                                                            {renderField('First Discount Amount', formatCurrency(style.discounts.firstDiscountRs))}
                                                            {renderField('Second Discount Price', formatCurrency(style.discounts.secondDiscountedPrice))}
                                                            {renderField('Second Discount Amount', formatCurrency(style.discounts.secondDiscountRs))}
                                                            {renderField('Clearance Price', formatCurrency(style.discounts.clearancePrice))}
                                                            {renderField('Clearance Discount', formatCurrency(style.discounts.clearanceDiscountRs))}
                                                            {renderField('Outlet Price', formatCurrency(style.discounts.outletPrice))}
                                                        </>
                                                    )}
                                                    {renderField('Discount Percentage', style.discountPercentage ? `${style.discountPercentage}%` : 'N/A')}
                                                </div>

                                                {/* Inventory */}
                                                <div>
                                                    {renderSectionHeader('Inventory')}
                                                    {renderField('Exact Inventory', style.exactInventory)}
                                                    {renderField('Premium Style', style.premiumStyle ? 'Yes' : 'No')}
                                                    {renderField('Inactive', style.inactive ? 'Yes' : 'No')}
                                                    {renderField('Checked', style.checked ? 'Yes' : 'No')}
                                                    {renderField('Email', style.emailAddress)}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="mt-4 text-lg font-medium text-gray-600">No styles found</p>
                                    <p className="text-sm text-gray-500 mt-1">Create your first style to get started</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegularStyle;