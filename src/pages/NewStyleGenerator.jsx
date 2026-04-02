import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import StyleNumberGenerator from './StyleNumberGenerator';

// ============== Constants ==============
const BRAND_CATEGORIES = [
  { value: 'Qurvii', label: 'Qurvii', icon: '👗' },
  { value: 'Qurvii Desi', label: 'Qurvii Desi', icon: '🥻' },
  { value: 'Coords', label: 'Coords', icon: '👚' },
  { value: 'Qurvii Desi Coords', label: 'Qurvii Desi Co-ords', icon: '✨' },
];

// ============== Sub-components ==============

/**
 * Brand selection header component
 */
const BrandSelectionHeader = ({ selectedBrand }) => {
  if (!selectedBrand) return null;

  const brand = BRAND_CATEGORIES.find((b) => b.value === selectedBrand);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 py-3 px-4 mb-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl" role="img" aria-label="brand-icon">
            {brand?.icon || '🏷️'}
          </span>
          <span className="font-medium text-gray-700">Active Brand:</span>
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {brand?.label || selectedBrand}
          </span>
        </div>
        <p className="text-sm text-gray-500 hidden sm:block">
          Generate unique style numbers for your collection
        </p>
      </div>
    </div>
  );
};

BrandSelectionHeader.propTypes = {
  selectedBrand: PropTypes.string,
};

/**
 * Brand selector dropdown component
 */
const BrandSelector = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="relative">
      <label htmlFor="brand-selector" className="block text-sm font-semibold text-gray-700 mb-2">
        Select Brand
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div
        className={`
        relative transition-all duration-200 rounded-md
        ${isFocused ? 'ring-2 ring-purple-300 ring-offset-2' : ''}
      `}
      >
        <select
          id="brand-selector"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full appearance-none bg-white border-2 border-purple-200 
                   hover:border-purple-300 rounded-lg py-3 px-4 
                   text-gray-700 font-medium
                   focus:outline-none focus:border-purple-500
                   transition-colors duration-200 cursor-pointer"
          aria-label="Select brand category"
        >
          <option value="" disabled className="text-gray-400">
            — Choose a Brand —
          </option>

          {BRAND_CATEGORIES.map((brand) => (
            <option key={brand.value} value={brand.value} className="py-2">
              {brand.icon} {brand.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg
            className={`w-5 h-5 text-purple-500 transition-transform duration-200 
                       ${value ? 'rotate-0' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-1.5 text-xs text-gray-500 flex items-center">
        <svg
          className="w-4 h-4 mr-1 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Select a category to start generating style numbers
      </p>
    </div>
  );
};

BrandSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * Empty state component when no brand is selected
 */
const EmptyState = () => (
  <div className="max-w-4xl mx-auto mt-10 px-4">
    <div
      className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-12 
                    border-2 border-dashed border-purple-200 
                    flex flex-col items-center justify-center text-center"
    >
      {/* Illustration */}
      <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 11v4m0 4h.01"
          />
        </svg>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Brand Selected</h3>

      <p className="text-gray-600 max-w-md mb-6">
        Please select a brand category from the dropdown above to start generating unique style
        numbers for your products.
      </p>

      <div className="flex flex-wrap gap-3 justify-center text-sm text-gray-500">
        <span className="px-3 py-1.5 bg-white rounded-full border border-gray-200">👗 Qurvii</span>
        <span className="px-3 py-1.5 bg-white rounded-full border border-gray-200">
          🥻 Qurvii Desi
        </span>
        <span className="px-3 py-1.5 bg-white rounded-full border border-gray-200">👚 Co-ords</span>
        <span className="px-3 py-1.5 bg-white rounded-full border border-gray-200">
          ✨ Qurvii Desi Co-ords
        </span>
      </div>
    </div>
  </div>
);

// ============== Main Component ==============

/**
 * Main container component for style number generation
 * Manages brand selection and renders the StyleNumberGenerator component
 */
const NewStyleGenerator = () => {
  const [selectedBrand, setSelectedBrand] = useState('');

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrand(brand);
  }, []);

  const selectedBrandConfig = useMemo(
    () => BRAND_CATEGORIES.find((b) => b.value === selectedBrand),
    [selectedBrand]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Brand Selection */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-purple-600 w-1.5 h-8 rounded-full" />
                Style Number Generator
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Create unique identifiers for your product catalog
              </p>
            </div>

            <div className="w-full sm:w-80">
              <BrandSelector value={selectedBrand} onChange={handleBrandChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Active Brand Header */}
      <BrandSelectionHeader selectedBrand={selectedBrand} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {selectedBrand ? (
          <div className="animate-fadeIn">
            {/* Brand Info Card */}
            {selectedBrandConfig && (
              <div className="mb-6 bg-white rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">{selectedBrandConfig.icon}</span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedBrandConfig.label}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Generating style numbers for {selectedBrandConfig.label} collection
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Style Number Generator Component */}
            <StyleNumberGenerator brand={selectedBrand} />
          </div>
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Style Number Generator •<span className="mx-2">•</span>
            Automatically generates unique style numbers within defined ranges
          </p>
        </div>
      </footer>
    </div>
  );
};

NewStyleGenerator.propTypes = {
  // Add any props if needed in the future
};

export default NewStyleGenerator;
