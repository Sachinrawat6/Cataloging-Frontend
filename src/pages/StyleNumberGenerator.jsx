import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// ============== Constants ==============
const SHEET_CONFIG = {
  id: '1SIP3Glxo5vkL0Jvx9ulj0p6xZoOh0ruzRtIqzldmb8E',
  apiKey: 'AIzaSyAGjWAyG29vKBgiYVSXCn08cu5ym6FwiQs',
  range: 'NEW STYLE GENERATOR!',
};

const BRAND_CONFIG = {
  Qurvii: {
    startNum: 12100,
    lastNum: 12999,
    sheetColumn: 'A',
    category: 'Qurvii',
  },
  'Qurvii Desi': {
    startNum: 24000,
    lastNum: 24999,
    sheetColumn: 'B',
    category: 'Qurvii Desi',
  },
  Coords: {
    startNum: 30000,
    lastNum: 30999,
    sheetColumn: 'C',
    category: 'Co-ords',
  },
  'Qurvii Desi Coords': {
    startNum: 90000,
    lastNum: 90999,
    sheetColumn: 'D',
    category: 'Qurvii Desi Co-ords',
  },
};

// ============== Custom Hooks ==============
const useGoogleSheetsData = (brands) => {
  const [sheetData, setSheetData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchColumnData = useCallback(async (column, brandKey) => {
    try {
      const range = `${SHEET_CONFIG.range}${column}2:${column}`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_CONFIG.id}/values/${range}?key=${SHEET_CONFIG.apiKey}`;

      const response = await axios.get(url);
      const values = response.data.values || [];

      return {
        brand: brandKey,
        styles: values
          .map(([value]) => Number(value))
          .filter(Boolean)
          .sort((a, b) => b - a),
      };
    } catch (err) {
      console.error(`Failed to fetch ${brandKey} styles:`, err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchPromises = Object.entries(BRAND_CONFIG).map(([key, config]) =>
          fetchColumnData(config.sheetColumn, key)
        );

        const results = await Promise.all(fetchPromises);
        const dataMap = results.reduce((acc, { brand, styles }) => {
          acc[brand] = styles;
          return acc;
        }, {});

        setSheetData(dataMap);
      } catch (err) {
        setError('Failed to fetch data from Google Sheets');
        console.error('Data fetching error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [fetchColumnData]);

  return { sheetData, loading, error };
};

// ============== Utility Functions ==============
const generateStyleNumbers = (brand, requiredCount, existingStyles) => {
  const config = BRAND_CONFIG[brand];
  if (!config) return [];

  let currentNum = config.startNum;
  const maxNum = config.lastNum;
  const generated = [];
  const existingSet = new Set(existingStyles || []);

  while (generated.length < requiredCount && currentNum <= maxNum) {
    if (!existingSet.has(currentNum)) {
      generated.push(currentNum);
    }
    currentNum++;
  }

  return generated;
};

const generateCSV = (numbers, category) => {
  const headers = 'StyleNumber,Category\n';
  const rows = numbers.map((num) => `${num},${category}`).join('\n');
  return headers + rows;
};

const downloadCSVFile = (content, filename = 'new-styles.csv') => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
  URL.revokeObjectURL(url);
};

// ============== Sub-components ==============
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
    <span className="ml-2 text-gray-600">Loading style data...</span>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
    <p className="font-medium">Error</p>
    <p className="text-sm">{message}</p>
  </div>
);

const GeneratedStylesList = ({ styles, category, onDownload }) => (
  <div className="pl-6 bg-gray-50 rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium">
        <span className="bg-purple-100 py-2 px-4 rounded-md text-purple-900">
          {styles.length} {category} generated
        </span>
      </h3>
      <button
        onClick={onDownload}
        className="bg-purple-400 text-white py-2 px-4 rounded-md hover:bg-purple-500 transition-colors duration-75 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        Download CSV
      </button>
    </div>

    <div className="overflow-auto max-h-96">
      <ol className="list-decimal pl-6">
        <li className="grid grid-cols-3 text-cyan-800 rounded-md bg-cyan-100 py-2 px-2 my-2 font-medium">
          <div>Style Number</div>
          <div>Category</div>
          <div>Status</div>
        </li>
        {styles.map((style, index) => (
          <li
            key={style}
            className={`grid grid-cols-3 gap-3 p-2 rounded-md ${
              index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
            } hover:bg-gray-200 transition-colors`}
          >
            <div className="font-mono">{style}</div>
            <div>{category}</div>
            <div className="text-green-600 text-sm">✓ Available</div>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

// ============== Main Component ==============
// ============== Main Component ==============
const StyleNumberGenerator = ({ brand }) => {
  const { sheetData, loading, error } = useGoogleSheetsData();
  const [quantity, setQuantity] = useState('');
  const [generatedNumbers, setGeneratedNumbers] = useState([]);

  const currentBrandStyles = useMemo(() => sheetData[brand] || [], [sheetData, brand]);

  // Common function to generate numbers
  const generateNumbersForBrand = useCallback(
    (brandToUse, quantityToUse) => {
      if (!quantityToUse) return;

      const requestedQuantity = parseInt(quantityToUse, 10);
      if (isNaN(requestedQuantity) || requestedQuantity <= 0) return;

      const newNumbers = generateStyleNumbers(
        brandToUse,
        requestedQuantity,
        sheetData[brandToUse] || []
      );
      setGeneratedNumbers(newNumbers);

      if (newNumbers.length < requestedQuantity) {
        alert(`Only ${newNumbers.length} style numbers available in the range`);
      }
    },
    [sheetData]
  );

  // Auto-generate when brand changes and quantity exists
  useEffect(() => {
    if (quantity) {
      generateNumbersForBrand(brand, quantity);
    } else {
      setGeneratedNumbers([]); // Clear if no quantity
    }
  }, [brand, quantity, generateNumbersForBrand]);

  const handleGenerateNumbers = useCallback(
    (e) => {
      e.preventDefault();

      const requestedQuantity = parseInt(quantity, 10);
      if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
        alert('Please enter a valid quantity');
        return;
      }

      const newNumbers = generateStyleNumbers(brand, requestedQuantity, currentBrandStyles);
      setGeneratedNumbers(newNumbers);

      if (newNumbers.length < requestedQuantity) {
        alert(`Only ${newNumbers.length} style numbers available in the range`);
      }
    },
    [brand, quantity, currentBrandStyles]
  );

  const handleDownload = useCallback(() => {
    if (generatedNumbers.length === 0) return;

    const csvContent = generateCSV(generatedNumbers, BRAND_CONFIG[brand]?.category || brand);
    downloadCSVFile(csvContent, `${brand.toLowerCase().replace(/\s+/g, '-')}-styles.csv`);
  }, [generatedNumbers, brand]);

  const handleQuantityChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value);
    }
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-purple-600 font-semibold text-2xl">Style Number Generator</h1>
        <p className="text-gray-600 text-sm mt-1">Generate unique style numbers for {brand}</p>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Generator Form */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <form onSubmit={handleGenerateNumbers} className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of styles to generate
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
                  placeholder="Enter quantity..."
                  min="1"
                  max="100"
                />
              </div>
              <button
                type="submit"
                disabled={!quantity || loading}
                className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors duration-75 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                Generate Numbers
              </button>
            </form>

            {/* Available Range Info */}
            <div className="mt-3 text-xs text-gray-500">
              Available range: {BRAND_CONFIG[brand]?.startNum} - {BRAND_CONFIG[brand]?.lastNum}
              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full">
                {currentBrandStyles.length} existing styles
              </span>
            </div>
          </div>

          {/* Results Section */}
          {generatedNumbers.length > 0 && (
            <GeneratedStylesList
              styles={generatedNumbers}
              category={BRAND_CONFIG[brand]?.category || brand}
              onDownload={handleDownload}
            />
          )}
        </div>
      )}
    </div>
  );
};

StyleNumberGenerator.propTypes = {
  brand: PropTypes.oneOf(Object.keys(BRAND_CONFIG)).isRequired,
};

export default StyleNumberGenerator;
