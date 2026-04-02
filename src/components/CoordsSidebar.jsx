import React, { useState } from 'react';
import {
  FiShoppingBag,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiStar,
  FiShoppingCart,
  FiTag,
  FiX,
  FiUpload,
  FiDownload,
} from 'react-icons/fi';
import * as XLSX from 'xlsx';
import generateNykaaCooordsListing from '../catalog/coords/nykaa/coords/NykaaCoordsListing';
import { generateMyntraCoordsListingFile } from '../catalog/coords/myntra/MyntraCoordsListing';
import generateShopifyCooordsListing from '../catalog/coords/shopify/ShopifyCoordsListing';
import generateTatacliqCoordsListing from '../catalog/coords/tatacliq/TatacliqCoordsListing';
import generateShoppersStopCoordsListing from '../catalog/coords/shoppersstop/ShoppersStopCoordsListing';
import generateAjioCoordsListing from '../catalog/coords/ajio/AjioCoordsListing';
import { generateMyntraCoordsPlusListingFile } from '../catalog/coords/myntra/MyntraCoordsPlusListing';
import generateAjioCoordsPlusListing from '../catalog/coords/ajio/AjioCoordsPlusListing';
import generateTatacliqCoordsPlusListing from '../catalog/coords/tatacliq/TatacliqCoordsPlusListing';
import generateShoppersStopCoordsPlusListing from '../catalog/coords/shoppersstop/ShopperstopCoordsPlusListing';

const CooordsSidebar = ({ data, coords }) => {
  const [openChannels, setOpenChannels] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleChannel = (channel) => {
    if (openChannels.includes(channel)) {
      setOpenChannels(openChannels.filter((item) => item !== channel));
    } else {
      setOpenChannels([...openChannels, channel]);
    }
  };

  const handleCategoryClick = (channelName, category) => {
    setSelectedCategory({
      channel: channelName,
      type: category.type,
      action: category.action,
      actionWithHeaders: category.actionWithHeaders, // Add this line
    });
    setUploadedFile(null);
    setHeaders([]);
    setFileData(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet =
          // openChannels[0]?.toLowerCase() === 'tatacliq'
          openChannels[0]?.toLowerCase()?.split(' ').includes('tatacliq')
            ? workbook.Sheets[workbook.SheetNames[0]]
            : workbook.Sheets[workbook.SheetNames[1]]; // Change to first sheet
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log('Excel data loaded:', jsonData);
        if (jsonData.length > 1) {
          // First row is headers
          const extractedHeaders =
            // openChannels[0]?.toLowerCase() === 'tatacliq'
            openChannels[0]?.toLowerCase()?.split(' ').includes('tatacliq')
              ? jsonData[5].filter((header) => header && header.trim() !== '')
              : jsonData[2].filter((header) => header && header.trim() !== '');
          console.log('Extracted headers:', extractedHeaders);
          setHeaders(extractedHeaders);
          setFileData(jsonData.slice(1)); // Rest as data
        } else if (jsonData.length === 1) {
          // Only headers row
          const extractedHeaders = jsonData[0].filter((header) => header && header.trim() !== '');
          console.log('Only headers found:', extractedHeaders);
          setHeaders(extractedHeaders);
          setFileData([]);
        } else {
          alert('No data found in the Excel file');
          setUploadedFile(null);
        }
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading Excel file. Please check the format.');
        setUploadedFile(null);
      }
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleGenerateWithHeaders = () => {
    if (!selectedCategory || !uploadedFile) {
      alert('Please upload a template file first');
      return;
    }

    if (headers.length === 0) {
      alert('No headers found in the uploaded file. Please check the file format.');
      return;
    }

    try {
      // Check if we have a special handler for headers
      if (selectedCategory.actionWithHeaders) {
        // Call the special function that accepts headers
        selectedCategory.actionWithHeaders(data, headers);
      } else {
        // For other categories, use the original data format
        const dataWithHeaders = {
          data: data,
          headers: headers,
          fileData: fileData,
          uploadedFile: uploadedFile,
        };
        selectedCategory.action(dataWithHeaders);
      }
    } catch (error) {
      console.error('Error generating listing:', error);
      alert(`Error generating file: ${error.message}`);
    }
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setUploadedFile(null);
    setHeaders([]);
    setFileData(null);
  };

  const channels = [
    {
      name: 'Myntra',
      icon: <FiShoppingBag className="text-pink-500" />,
      categories: [
        ,
        { type: 'Qurvii', action: () => generateMyntraCoordsListingFile(coords, data) },
        { type: 'Qurvii+', action: () => generateMyntraCoordsPlusListingFile(coords, data) },
      ],
    },

    {
      name: 'Nykaa',
      icon: <FiStar className="text-purple-500" />,
      categories: [{ type: 'Co-ords', action: () => generateNykaaCooordsListing(coords, data) }],
    },
    {
      name: 'Ajio',
      icon: <FiTag className="text-blue-500" />,
      categories: [
        { type: 'Qurvii', action: () => generateAjioCoordsListing(coords, data) },
        { type: 'Qurvii+', action: () => generateAjioCoordsPlusListing(coords, data) },
      ],
    },

    {
      name: 'Shopify',
      icon: <FiShoppingCart className="text-green-500" />,
      categories: [{ type: 'Download', action: () => generateShopifyCooordsListing(coords, data) }],
    },
    {
      name: 'TataCliq',
      icon: <FiGrid className="text-red-500" />,
      categories: [
        { type: 'Qurvii', action: () => generateTatacliqCoordsListing(coords, data) },
        { type: 'Qurvii+', action: () => generateTatacliqCoordsPlusListing(coords, data) },
      ],
    },
    {
      name: 'ShopperStop',
      icon: <FiShoppingBag className="text-yellow-500" />,
      categories: [
        { type: 'Qurvii', action: () => generateShoppersStopCoordsListing(coords, data) },
        { type: 'Qurvii+', action: () => generateShoppersStopCoordsPlusListing(coords, data) },
      ],
    },
  ];

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar Toggle Button (visible on mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay (for mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      {/* <div
        className={`fixed md:relative w-64 bg-white shadow-xs  z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 h-full overflow-y-auto border-r-2 border-purple-400`}
      >
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <FiGrid className="mr-2 text-indigo-600" />
            Channels
          </h1>
        </div>

        <div className="p-4">
          {channels.map((channel, index) => (
            <div key={index} className="mb-2">
              <div
                className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  // If channel has categories, toggle the dropdown
                  if (channel.categories.length > 0) {
                    toggleChannel(channel.name);
                  } else {
                    // If no categories, execute channel action directly
                    if (channel.action) channel.action();
                  }
                }}
              >
                <div className="flex items-center">
                  {channel.icon}
                  <span className="ml-2 font-medium text-gray-700">{channel.name}</span>
                </div>
                {channel.categories.length > 0 &&
                  (openChannels.includes(channel.name) ? (
                    <FiChevronDown className="text-gray-500" />
                  ) : (
                    <FiChevronRight className="text-gray-500" />
                  ))}
              </div>

              {openChannels.includes(channel.name) && channel.categories.length > 0 && (
                <div className="ml-8 mt-1 mb-3 border-l-2 border-gray-200 pl-4 py-2 space-y-2">
                  {channel.categories.map((category, catIndex) => (
                    <div
                      key={catIndex}
                      className="flex items-center py-2 px-3 rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling to parent
                        category.action();
                      }}
                    >
                      <div className="grid grid-cols-2 items-center">
                        <span
                          className={` ${category.type.toLowerCase().trim() === 'qurvii + section' ? 'border-b-2 border-b-purple-500 text-purple-500' : ''}} text-sm`}
                        >
                          {category.type}
                        </span>
                        <span className="ml-2 text-center font-medium text-purple-700 text-xs bg-purple-100 rounded-full py-1 px-2">
                          {(data.length > 0 &&
                            data.filter((style) =>
                              style.styleType
                                ?.toLowerCase()
                                .trim()
                                .includes(category.type.toLowerCase())
                            ).length) ||
                            ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">Q</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Qurvii</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div> */}
      {/* Main Container with Two Columns */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div
          className={`fixed md:relative w-64 bg-white shadow-xs z-40 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 h-full overflow-y-auto border-r-2 border-purple-400`}
        >
          <div className="p-5 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <FiGrid className="mr-2 text-indigo-600" />
              Channels
            </h1>
          </div>

          <div className="p-4">
            {channels.map((channel, index) => (
              <div key={index} className="mb-2">
                <div
                  className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleChannel(channel.name)}
                >
                  <div className="flex items-center">
                    {channel.icon}
                    <span className="ml-2 font-medium text-gray-700">{channel.name}</span>
                  </div>
                  {channel.categories.length > 0 &&
                    (openChannels.includes(channel.name) ? (
                      <FiChevronDown className="text-gray-500" />
                    ) : (
                      <FiChevronRight className="text-gray-500" />
                    ))}
                </div>

                {openChannels.includes(channel.name) && channel.categories.length > 0 && (
                  <div className="ml-8 mt-1 mb-3 border-l-2 border-gray-200 pl-4 py-2 space-y-2">
                    {channel.categories.map((category, catIndex) => (
                      <div
                        key={catIndex}
                        className="flex items-center py-2 px-3 rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(channel.name, category);
                        }}
                      >
                        <div className="grid grid-cols-2 items-center w-full">
                          <span className="text-sm truncate">{category.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">Q</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Qurvii</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Excel Upload & Processing */}
      <div className="p-6 w-[86vw] left-65 mx-auto absolute h-[65vh] mt-25 ">
        {selectedCategory ? (
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory.channel} - {selectedCategory.type}
                </h2>
                <p className="text-gray-600 mt-1">
                  Upload Excel template and generate listing with data
                </p>
              </div>
              <button
                onClick={handleClearSelection}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Clear selection"
              >
                <FiX className="text-gray-500 text-xl" />
              </button>
            </div>

            <div className="space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <FiUpload className="text-4xl text-gray-400 mx-auto mb-4" />

                {!uploadedFile ? (
                  <>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <div className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                        <FiUpload className="mr-2" />
                        Upload {selectedCategory.channel} Excel Template
                      </div>
                    </label>
                    <p className="text-gray-500 mt-4 text-sm">
                      Upload .xlsx, .xls, or .csv template file
                    </p>
                  </>
                ) : (
                  <div className="text-left">
                    <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FiUpload className="text-green-500 mr-3 text-xl" />
                        <div>
                          <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                          <p className="text-sm text-gray-600">
                            {(uploadedFile.size / 1024).toFixed(2)} KB • Uploaded successfully
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setHeaders([]);
                          setFileData(null);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    {isProcessing ? (
                      <div className="mt-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Processing file...</p>
                      </div>
                    ) : (
                      headers.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-medium text-gray-700 mb-3">Detected Headers:</h3>
                          <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                            <div className="flex flex-wrap gap-2">
                              {headers.map((header, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-1"
                                >
                                  {header}
                                  <span className="ml-1 text-blue-600">({index + 1})</span>
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Found {headers.length} columns and {fileData?.length || 0} rows of data
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Headers will be passed to the listing generator function
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Data Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Template Headers</p>
                  <p className="text-2xl font-bold text-blue-700">{headers.length}</p>
                  {headers.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">Will be passed to generator</p>
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Data Rows</p>
                  <p className="text-2xl font-bold text-green-700">{fileData?.length || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Your Products</p>
                  <p className="text-2xl font-bold text-purple-700">{data.length}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleGenerateWithHeaders}
                  disabled={!uploadedFile || isProcessing || headers.length === 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium ${
                    !uploadedFile || isProcessing || headers.length === 0
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  } transition-colors`}
                >
                  <FiDownload />
                  {uploadedFile && headers.length > 0
                    ? `Generate with ${headers.length} Headers`
                    : 'Generate & Download File'}
                </button>
              </div>

              {uploadedFile && headers.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        The generated file will use the {headers.length} headers from your uploaded
                        template.
                        <span className="font-semibold">
                          {' '}
                          For {`${selectedCategory.channel} ${selectedCategory.type}`} , headers
                          will be passed directly to the generator function.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CooordsSidebar;
