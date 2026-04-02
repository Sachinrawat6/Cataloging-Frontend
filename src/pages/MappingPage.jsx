import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const MappingPage = () => {
  const [mappedStyle, setMappedStyle] = useState({});
  const [googleSheetData, setGoogleSheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [mappingOutput, setMappingOutput] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState(null);
  const [relistedStyles, setRelistedStyles] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  const sheetId = '1SIP3Glxo5vkL0Jvx9ulj0p6xZoOh0ruzRtIqzldmb8E';
  const apiKey = 'AIzaSyAGjWAyG29vKBgiYVSXCn08cu5ym6FwiQs';

  // Cache for Google Sheets data
  const [dataCache, setDataCache] = useState({
    mapping: null,
    catalogue: null,
    timestamp: null,
  });

  // Function to ensure style number is string
  const ensureString = useCallback((value) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }, []);

  // New function to apply special style number rules

  const applySpecialStyleRules = useCallback(
    (styleNumber) => {
      if (!styleNumber) return styleNumber;

      console.log('inside applying filter', styleNumber);
      const styleStr = ensureString(styleNumber);

      // First check if this is a relisted style
      const relistedMatch = relistedStyles.find((s) => s.newSku === Number(styleStr));
      if (relistedMatch) {
        console.log(`Found relisted style: ${styleStr} -> ${relistedMatch.oldSku}`);
        return String(relistedMatch.oldSku);
      }

      // Rule 1: If style number starts with 8, replace with 1
      if (styleStr.startsWith('8')) {
        return '1' + styleStr.slice(1);
      }

      // Rule 2: If style number starts with 5, replace with 3
      if (styleStr.startsWith('5')) {
        return '3' + styleStr.slice(1);
      }

      // Rule 3: If style number starts with 6 and length is 6, remove the first 6
      if (styleStr.startsWith('6') && styleStr.length === 6) {
        return styleStr.slice(1); // Remove first character '6'
      }

      return styleStr;
    },
    [ensureString, relistedStyles]
  );

  // Function to convert size format (standardize size formats)
  const standardizeSize = useCallback((size) => {
    if (!size) return size;

    const sizeMap = {
      '1XL': 'XL',
      '2XL': '2XL',
      '3XL': '3XL',
      '4XL': '4XL',
      '5XL': '5XL',
      XXS: 'XXS',
      XS: 'XS',
      S: 'S',
      M: 'M',
      L: 'L',
      XL: 'XL',
      XXL: '2XL',
    };

    const upperSize = size.toUpperCase();
    return sizeMap[upperSize] || size;
  }, []);

  // Function to process SKU with mapping and special rules
  const processSkuWithMapping = useCallback(
    (sku, mappingType = 'original') => {
      if (!sku) return '';

      const parts = sku.split('-').map((part) => ensureString(part));

      if (parts.length === 0) return sku;

      let styleNumber = parts[0];
      const restParts = parts.slice(1);

      // Apply special style rules first
      styleNumber = applySpecialStyleRules(styleNumber);

      if (mappingType === 'qurvii') {
        // Check if style number exists in mappedStyle
        if (mappedStyle[styleNumber]) {
          styleNumber = ensureString(mappedStyle[styleNumber]);
          // Apply special rules again after mapping
          styleNumber = applySpecialStyleRules(styleNumber);
        }
      }

      // Process the remaining parts for size standardization
      const processedRest = restParts.map((part) => {
        const possibleSize = part.toUpperCase();
        if (
          ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '1XL', '2XL'].includes(
            possibleSize
          )
        ) {
          return standardizeSize(part);
        }
        return part;
      });

      return [styleNumber, ...processedRest].join('-');
    },
    [mappedStyle, ensureString, applySpecialStyleRules, standardizeSize]
  );

  // Optimized data fetching with caching
  const fetchMapping = useCallback(
    async (forceRefresh = false) => {
      // Check cache first (5 minutes TTL)
      if (!forceRefresh && dataCache.mapping && dataCache.timestamp) {
        const cacheAge = Date.now() - dataCache.timestamp;
        if (cacheAge < 5 * 60 * 1000) {
          // 5 minutes

          setMappedStyle(dataCache.mapping);
          return dataCache.mapping;
        }
      }

      const range = 'style mapping!A1:C';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const mapping = {};

        response.data.values.slice(1).forEach((row) => {
          const style = ensureString(row[0]);
          const mapped = ensureString(row[2]);

          if (style && mapped) {
            mapping[mapped] = style;
          }
        });

        setMappedStyle(mapping);

        // Update cache
        setDataCache((prev) => ({
          ...prev,
          mapping,
          timestamp: Date.now(),
        }));

        return mapping;
      } catch (error) {
        console.error('Error fetching mapping:', error);
        setError('Failed to load mapping data');
        throw error;
      }
    },
    [sheetId, apiKey, ensureString, dataCache]
  );

  const fetchGoogleSheetData = useCallback(
    async (forceRefresh = false) => {
      // Check cache first
      if (!forceRefresh && dataCache.catalogue && dataCache.timestamp) {
        const cacheAge = Date.now() - dataCache.timestamp;
        if (cacheAge < 5 * 60 * 1000) {
          setGoogleSheetData(dataCache.catalogue);
          return dataCache.catalogue;
        }
      }

      const range = 'catalogue tracker!A1:C';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const result = response.data.values.slice(1).map((row) => ({
          styleNumber: ensureString(row[0]),
          checked: row[1] || '',
          color: row[2] || '',
        }));

        setGoogleSheetData(result);

        // Update cache
        setDataCache((prev) => ({
          ...prev,
          catalogue: result,
          timestamp: Date.now(),
        }));

        return result;
      } catch (error) {
        console.error('Error fetching catalogue:', error);
        setError('Failed to load catalogue data');
        throw error;
      }
    },
    [sheetId, apiKey, ensureString, dataCache]
  );

  // relisted styles
  const fetchRelisted = useCallback(
    async (forceRefresh = false) => {
      // Check cache first
      if (!forceRefresh && dataCache.catalogue && dataCache.timestamp) {
        const cacheAge = Date.now() - dataCache.timestamp;
        if (cacheAge < 5 * 60 * 1000) {
          setGoogleSheetData(dataCache.catalogue);
          return dataCache.catalogue;
        }
      }

      const range = 'style mapping!F1:I';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

      try {
        const response = await axios.get(url);

        const result = response.data.values.slice(1).map((row) => ({
          oldSku: Number(row[0]),
          newSku: Number(row[3]),
        }));

        setRelistedStyles(result);

        // Update cache
        setDataCache((prev) => ({
          ...prev,
          relisted: result,
          timestamp: Date.now(),
        }));

        return result;
      } catch (error) {
        console.error('Error fetching relisted:', error);
        setError('Failed to load relisted data');
        throw error;
      }
    },
    [sheetId, apiKey, ensureString, dataCache]
  );

  const getData = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchMapping(forceRefresh),
          fetchGoogleSheetData(forceRefresh),
          fetchRelisted(forceRefresh),
        ]);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data from Google Sheets');
      } finally {
        setLoading(false);
      }
    },
    [fetchMapping, fetchGoogleSheetData]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  // Handle CSV file upload with progress
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadProgress(0);
    setError(null);

    const reader = new FileReader();

    reader.onloadstart = () => {
      setUploadProgress(10);
    };

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 90;
        setUploadProgress(Math.min(90, progress));
      }
    };

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        setCsvData(parsedData);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(null), 1000);
        setActiveTab('mapping');
      } catch (error) {
        console.error('Error parsing file:', error);
        setError('Failed to parse file. Please check the format.');
        setUploadProgress(null);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setUploadProgress(null);
    };

    reader.readAsBinaryString(file);
  }, []);

  // Generate mapping file
  const generateMapping = useCallback(
    (mappingType = 'original') => {
      const output = csvData.map((row) => {
        const channelListingSkuCode = ensureString(
          row['Channel Listing SKU Code'] || row['Channel Listing SkuCode'] || ''
        );
        const channelListingId = ensureString(row['Channel Listing Id'] || '');

        let productSkuCode = processSkuWithMapping(channelListingSkuCode, mappingType);

        return {
          'Channel Listing SKU Code': channelListingSkuCode,
          'Channel Listing Id': channelListingId,
          'Product SkuCode': productSkuCode,
        };
      });

      setMappingOutput(output);
      return output;
    },
    [csvData, ensureString, processSkuWithMapping]
  );

  // Export to Excel
  const exportToExcel = useCallback(
    (mappingType = 'original') => {
      try {
        const output = generateMapping(mappingType);

        const ws = XLSX.utils.json_to_sheet(output);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Mapping');

        const filename = 'ChannelListingMappingToProductSKU.csv';

        XLSX.writeFile(wb, filename);
      } catch (error) {
        console.error('Error exporting:', error);
        setError('Failed to export file');
      }
    },
    [generateMapping]
  );

  // Demo function to test with sample data
  const testWithSampleData = useCallback(() => {
    const sampleData = [
      { 'Channel Listing SKU Code': '24090-Rust-M', 'Channel Listing Id': '129122171' },
      { 'Channel Listing SKU Code': '24090-Rust-S', 'Channel Listing Id': '129122167' },
      { 'Channel Listing SKU Code': '24090-Rust-2XL', 'Channel Listing Id': '129122186' },
      { 'Channel Listing SKU Code': '24090-Rust-XS', 'Channel Listing Id': '129122164' },
      { 'Channel Listing SKU Code': '24090-Rust-XXS', 'Channel Listing Id': '129122158' },
      { 'Channel Listing SKU Code': '24090-Rust-5XL', 'Channel Listing Id': '129122197' },
      { 'Channel Listing SKU Code': '24090-Rust-XL', 'Channel Listing Id': '129122182' },
      // Test cases for special rules
      { 'Channel Listing SKU Code': '81234-Red-M', 'Channel Listing Id': '100000001' },
      { 'Channel Listing SKU Code': '55678-Blue-L', 'Channel Listing Id': '100000002' },
      { 'Channel Listing SKU Code': '612006-Green-XL', 'Channel Listing Id': '100000003' },
    ];
    setCsvData(sampleData);
    setActiveTab('mapping');
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!mappingOutput.length) return null;

    const total = mappingOutput.length;
    const modified = mappingOutput.filter(
      (r) => r['Product SkuCode'] !== r['Channel Listing SKU Code']
    ).length;
    const styleChanged = mappingOutput.filter(
      (r) => r['Product SkuCode'].split('-')[0] !== r['Channel Listing SKU Code'].split('-')[0]
    ).length;
    const sizeChanged = mappingOutput.filter(
      (r) =>
        r['Product SkuCode'] !== r['Channel Listing SKU Code'] &&
        r['Product SkuCode'].split('-')[0] === r['Channel Listing SKU Code'].split('-')[0]
    ).length;

    return { total, modified, styleChanged, sizeChanged };
  }, [mappingOutput]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SKU Mapping Tool</h1>
            </div>
            <button
              onClick={() => getData(true)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg
                className={`-ml-1 mr-2 h-5 w-5 text-gray-500 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-sm text-blue-700">Loading data from Google Sheets...</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <svg
                className="inline-block w-5 h-5 mr-2 -mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('mapping')}
              disabled={!csvData.length}
              className={`${
                activeTab === 'mapping'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                !csvData.length && 'opacity-50 cursor-not-allowed'
              }`}
            >
              <svg
                className="inline-block w-5 h-5 mr-2 -mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Generate Mapping
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`${
                activeTab === 'rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <svg
                className="inline-block w-5 h-5 mr-2 -mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Mapping Rules
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'upload' && (
            <div>
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Upload your file</h3>
                <p className="mt-1 text-sm text-gray-500">CSV or Excel files with SKU data</p>

                <div className="mt-6">
                  <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    <svg
                      className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Select File
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadProgress !== null && (
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                {csvData.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">{csvData.length}</span> records loaded
                      successfully
                    </p>
                    <button
                      onClick={() => setActiveTab('mapping')}
                      className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      Continue to Mapping →
                    </button>
                  </div>
                )}
              </div>

              {/* Sample Data Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  Don't have a file? Try with sample data:
                </p>
                <button
                  onClick={testWithSampleData}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-0.5 mr-2 h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Load Sample Data
                </button>
              </div>
            </div>
          )}

          {activeTab === 'mapping' && csvData.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Generate Mapping</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => exportToExcel('original')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Original Mapping
                  </button>
                  <button
                    onClick={() => exportToExcel('qurvii')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Qurvii Desi To Qurvii Mapping
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Records</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Modified</dt>
                      <dd className="mt-1 text-3xl font-semibold text-blue-600">
                        {stats.modified}
                      </dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Style Changes</dt>
                      <dd className="mt-1 text-3xl font-semibold text-purple-600">
                        {stats.styleChanged}
                      </dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Size Changes</dt>
                      <dd className="mt-1 text-3xl font-semibold text-green-600">
                        {stats.sizeChanged}
                      </dd>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {mappingOutput.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Preview (First 10 rows)
                  </h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Channel SKU
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Channel ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product SKU
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mappingOutput.slice(0, 10).map((row, index) => {
                          const isModified =
                            row['Product SkuCode'] !== row['Channel Listing SKU Code'];
                          const styleChanged =
                            row['Product SkuCode'].split('-')[0] !==
                            row['Channel Listing SKU Code'].split('-')[0];

                          return (
                            <tr key={index} className={isModified ? 'bg-green-50' : ''}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                {row['Channel Listing SKU Code']}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                {row['Channel Listing Id']}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                {row['Product SkuCode']}
                                {isModified && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Modified
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {isModified ? (
                                  styleChanged ? (
                                    <span className="text-purple-600">Style Changed</span>
                                  ) : (
                                    <span className="text-green-600">Size Standardized</span>
                                  )
                                ) : (
                                  <span className="text-gray-400">No Change</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Active Mapping Rules</h3>

              <div className="space-y-4">
                {/* Size Conversion Rules */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Size Standardization</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="text-sm">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">1XL</span> →{' '}
                      <span className="font-mono bg-blue-100 px-2 py-1 rounded">XL</span>
                    </div>

                    <div className="text-sm">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">XXL</span> →{' '}
                      <span className="font-mono bg-blue-100 px-2 py-1 rounded">2XL</span>
                    </div>
                  </div>
                </div>

                {/* Special Style Rules */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Special Style Number Rules</h4>
                  <div className="space-y-2">
                    <div className="text-sm p-2 bg-gray-50 rounded">
                      <span className="font-medium">Rule 1:</span> Style numbers starting with{' '}
                      <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">8</span> → replace
                      with <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">1</span>
                      <div className="mt-1 text-xs text-gray-500">Example: 81234 → 11234</div>
                    </div>
                    <div className="text-sm p-2 bg-gray-50 rounded">
                      <span className="font-medium">Rule 2:</span> Style numbers starting with{' '}
                      <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">5</span> → replace
                      with <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">3</span>
                      <div className="mt-1 text-xs text-gray-500">Example: 55678 → 35678</div>
                    </div>
                    <div className="text-sm p-2 bg-gray-50 rounded">
                      <span className="font-medium">Rule 3:</span> Style numbers starting with{' '}
                      <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">6</span> and
                      length 6 → remove first digit
                      <div className="mt-1 text-xs text-gray-500">Example: 612006 → 12006</div>
                    </div>
                  </div>
                </div>

                {/* Google Sheets Mapping */}
                {Object.keys(mappedStyle).length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Google Sheets Style Mapping</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {Object.entries(mappedStyle)
                        .slice(0, 12)
                        .map(([style, mapped]) => (
                          <div
                            key={style}
                            className="text-sm p-2 bg-gray-50 rounded flex items-center justify-between"
                          >
                            <span className="font-mono">{style}</span>
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                            <span className="font-mono text-blue-600">{mapped}</span>
                          </div>
                        ))}
                    </div>
                    {Object.keys(mappedStyle).length > 12 && (
                      <p className="mt-2 text-xs text-gray-500">
                        ... and {Object.keys(mappedStyle).length - 12} more mappings
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MappingPage;
