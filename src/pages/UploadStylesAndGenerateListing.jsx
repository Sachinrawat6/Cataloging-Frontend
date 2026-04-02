import React, { useEffect, useState } from 'react';
import { FiUploadCloud, FiFile, FiX, FiCheck, FiChevronDown } from 'react-icons/fi';
import Sidebar from '../components/CatalogSideBar';
import CatalogDetails from '../components/CatalogDetails';
import styleWiseService from '../services/GET SERVICE/getService';

const UploadStylesAndGenerateListing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [payload, setPayload] = useState([]);
  const [notApproved, setNotApproved] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, success, error

  // New state for multi-select selections
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Dropdown open states
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

  const channels = ['myntra', 'nykaa', 'shopify', 'tatacliq', 'shopifyus', 'ajio', 'shopperstop'];
  // const brands = ['qurvii', 'qurvii+', 'qurvii desi', 'maternity'];
  const brands = ['qurvii', 'qurvii+', 'maternity'];

  // Check if at least one channel and one brand are selected
  const isSelectionComplete = selectedChannels.length > 0 && selectedBrands.length > 0;

  // Handle channel selection
  const handleChannelSelect = (channel) => {
    setSelectedChannels((prev) => {
      if (prev.includes(channel)) {
        return prev.filter((c) => c !== channel);
      } else {
        return [...prev, channel];
      }
    });
    setError(null);
  };

  // Handle brand selection
  const handleBrandSelect = (brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
    setError(null);
  };

  // Remove a single channel
  const removeChannel = (channelToRemove) => {
    setSelectedChannels((prev) => prev.filter((c) => c !== channelToRemove));
  };

  // Remove a single brand
  const removeBrand = (brandToRemove) => {
    setSelectedBrands((prev) => prev.filter((b) => b !== brandToRemove));
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedChannels([]);
    setSelectedBrands([]);
  };

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

    if (!isSelectionComplete) {
      setError('Please select at least one channel and one brand before uploading');
      return;
    }

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      processFile(droppedFile);
    } else {
      setError('Please upload a valid CSV file');
    }
  };

  const handleUploadClick = () => {
    if (!isSelectionComplete) {
      setError('Please select at least one channel and one brand before uploading');
      return;
    }
    document.getElementById('file-upload').click();
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
        const headers = rows[0].split(',').map((header) => header.trim());
        const styleNumberIndex = headers.findIndex(
          (header) =>
            header.toLowerCase().includes('style') && header.toLowerCase().includes('number')
        );

        if (styleNumberIndex === -1) {
          throw new Error('CSV file must contain a "Style Number" column');
        }

        // Extract style numbers from the column
        const styleNumbers = [];
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].trim()) {
            const columns = rows[i].split(',').map((col) => col.trim());
            if (columns[styleNumberIndex]) {
              styleNumbers.push(columns[styleNumberIndex]);
            }
          }
        }

        if (styleNumbers.length === 0) {
          throw new Error('No style numbers found in the CSV file');
        }

        setPayload(styleNumbers);
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
      const response = await styleWiseService.uploadAndGetStyleDetails(payload);
      console.log('uploaded details', response.data);
      const check_marked_style = response?.data
        ?.filter((style) => style.checked)
        ?.sort((a, b) => b.styleNumber - a.styleNumber);
      const not_marked_style = response?.data
        ?.filter((style) => !style.checked)
        ?.sort((a, b) => b.styleNumber - a.styleNumber);
      console.log('Filtered styles', check_marked_style);
      console.log('Not approved styles', not_marked_style);

      // Add selected channels and brands to each style object
      const stylesWithSelections = check_marked_style?.map((style) => ({
        ...style,
        selectedChannels,
        selectedBrands,
      }));

      const notApprovedWithSelections = not_marked_style?.map((style) => ({
        ...style,
        selectedChannels,
        selectedBrands,
      }));

      setData(stylesWithSelections);
      setNotApproved(notApprovedWithSelections);
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.channel-dropdown')) {
        setIsChannelDropdownOpen(false);
      }
      if (!event.target.closest('.brand-dropdown')) {
        setIsBrandDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {payload.length === 0 ? (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          {/* Multi-select Section */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Channel Multi-select */}
            <div className="space-y-2 channel-dropdown relative">
              <label className="block text-sm font-medium text-gray-700">
                Select Channels <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(Multiple allowed)</span>
              </label>

              {/* Selected channels display */}
              <div
                className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg cursor-pointer flex flex-wrap gap-2 items-center"
                onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
              >
                {selectedChannels.length > 0 ? (
                  <>
                    {selectedChannels.map((channel) => (
                      <span
                        key={channel}
                        className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {channel.toUpperCase()}
                        <FiX
                          className="ml-1 h-3 w-3 cursor-pointer hover:text-purple-600"
                          onClick={() => removeChannel(channel)}
                        />
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="text-gray-400">Click to select channels</span>
                )}
                <FiChevronDown className="ml-auto h-4 w-4 text-gray-400" />
              </div>

              {/* Dropdown menu */}
              {isChannelDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {channels.map((channel) => (
                    <label
                      key={channel}
                      className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedChannels.includes(channel)}
                        onChange={() => handleChannelSelect(channel)}
                        className="mr-3 h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{channel.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Multi-select */}
            <div className="space-y-2 brand-dropdown relative">
              <label className="block text-sm font-medium text-gray-700">
                Select Brands <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(Multiple allowed)</span>
              </label>

              {/* Selected brands display */}
              <div
                className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg cursor-pointer flex flex-wrap gap-2 items-center"
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
              >
                {selectedBrands.length > 0 ? (
                  <>
                    {selectedBrands.map((brand) => (
                      <span
                        key={brand}
                        className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {brand.toUpperCase()}
                        <FiX
                          className="ml-1 h-3 w-3 cursor-pointer hover:text-purple-600"
                          onClick={() => removeBrand(brand)}
                        />
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="text-gray-400">Click to select brands Or Collection</span>
                )}
                <FiChevronDown className="ml-auto h-4 w-4 text-gray-400" />
              </div>

              {/* Dropdown menu */}
              {isBrandDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandSelect(brand)}
                        className="mr-3 h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{brand.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clear all selections button */}
          {(selectedChannels.length > 0 || selectedBrands.length > 0) && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={clearAllSelections}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Clear All Selections
              </button>
            </div>
          )}

          {/* Selection Status */}
          {!isSelectionComplete && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Please select at least one channel and one brand to enable file upload
              </p>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Styles CSV</h2>
            <p className="text-gray-600">
              Upload a CSV file containing Style Numbers to generate product listings
            </p>
            {isSelectionComplete && (
              <div className="text-sm text-green-600 mt-2">
                <p>✓ Ready to upload for:</p>
                <div className="flex flex-wrap gap-2 justify-center mt-1">
                  <span className="bg-green-100 px-2 py-1 rounded">
                    Channels: {selectedChannels.map((c) => c.toUpperCase()).join(', ')}
                  </span>
                  <span className="bg-green-100 px-2 py-1 rounded">
                    Brands: {selectedBrands.map((b) => b.toUpperCase()).join(', ')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              !isSelectionComplete
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={isSelectionComplete ? handleDragOver : null}
            onDragLeave={isSelectionComplete ? handleDragLeave : null}
            onDrop={isSelectionComplete ? handleDrop : null}
            onClick={isSelectionComplete ? handleUploadClick : null}
          >
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              disabled={!isSelectionComplete}
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <FiUploadCloud
                className={`h-12 w-12 ${
                  !isSelectionComplete
                    ? 'text-gray-300'
                    : isDragging
                      ? 'text-blue-500'
                      : 'text-gray-400'
                }`}
              />

              <div className="flex flex-col items-center">
                <p
                  className={`font-medium ${
                    !isSelectionComplete ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {!isSelectionComplete
                    ? 'Select channels and brands first'
                    : isDragging
                      ? 'Drop your CSV file here'
                      : 'Drag & drop your CSV file'}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    !isSelectionComplete ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {isSelectionComplete
                    ? 'or click to browse'
                    : 'Complete selections to enable upload'}
                </p>
              </div>

              <p className={`text-xs ${!isSelectionComplete ? 'text-gray-400' : 'text-gray-500'}`}>
                CSV files only
              </p>
            </div>
          </div>

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
                <button onClick={removeFile} className="text-gray-500 hover:text-gray-700">
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Successfully processed {payload.length} style numbers
              </p>
              <div className="text-green-600 text-sm mt-2">
                <p>Channels: {selectedChannels.map((c) => c.toUpperCase()).join(', ')}</p>
                <p>Brands: {selectedBrands.map((b) => b.toUpperCase()).join(', ')}</p>
              </div>
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

          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-800 mb-2">CSV File Requirements</h3>
            <ul className="text-sm text-purple-600 list-disc pl-5 space-y-1">
              <li>File must be in CSV format</li>
              <li>Must contain a column named "Style Number" (case insensitive)</li>
              <li>Each row should contain a unique style number</li>
            </ul>
            <div className="mt-4">
              <a
                className="inline-block py-2 px-4 font-medium bg-purple-400 text-white rounded-md hover:bg-purple-500 duration-75 ease-in"
                href="./STYLES_SAMPLE_TEMPLATE.csv"
                download
              >
                Download Sample File
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-[90vh]">
          <div className="w-64 border-r-2 border-purple-400">
            <Sidebar
              data={data}
              selectedChannels={selectedChannels}
              selectedBrands={selectedBrands}
            />
          </div>
          <div className="w-full">
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
              <CatalogDetails
                data={data}
                not_approved={notApproved}
                selectedChannels={selectedChannels}
                selectedBrands={selectedBrands}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadStylesAndGenerateListing;
