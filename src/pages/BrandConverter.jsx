import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styleWiseService from '../services/GET SERVICE/getService';

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const BrandConverter = () => {
  const [loading, setLoading] = useState(false);
  const [mappedStyles, setMappedStyles] = useState({});
  const [generatedRows, setGeneratedRows] = useState([]);
  const [fileName, setFileName] = useState('');

  /* ------------ FETCH MAPPING FROM SHEET ------------ */
  const fetchMapping = async () => {
    try {
      const sheetId = '1SIP3Glxo5vkL0Jvx9ulj0p6xZoOh0ruzRtIqzldmb8E';
      const apiKey = 'AIzaSyAGjWAyG29vKBgiYVSXCn08cu5ym6FwiQs';
      const range = 'style mapping!A1:C';

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      const response = await axios.get(url);

      const mapping = {};

      response.data.values.slice(1).forEach((row) => {
        const style = Number(row[0]);
        const mapped = Number(row[2]);

        if (style && mapped) {
          mapping[style] = mapped;
        }
      });

      setMappedStyles(mapping);
    } catch (err) {
      console.error('Mapping fetch error', err);
    }
  };

  /* ------------ CSV UPLOAD ------------ */
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target.result;

      // read styles from csv
      const uploadedStyles = text
        .split('\n')
        .map((r) => Number(r.split(',')[0].trim()))
        .filter(Boolean);

      //  make styles unique
      const uniqueStyles = [...new Set(uploadedStyles)];

      await fetchStyleDetails(uniqueStyles);
    };

    reader.readAsText(file);
  };

  /* ------------ FETCH STYLE DETAILS ------------ */
  const fetchStyleDetails = async (styles) => {
    setLoading(true);

    try {
      const response = await styleWiseService.uploadAndGetStyleDetails(styles);
      const details = response.data || [];
      generateSkus(styles, details);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------ SKU GENERATION ------------ */
  const generateSkus = (uploadedStyles, details) => {
    const rows = [['QURVII SKU', 'QURVII DESI SKU']];

    uploadedStyles.forEach((style) => {
      const mapped = mappedStyles[style];
      if (!mapped) return;

      const detail = details.find((d) => Number(d.styleNumber) === Number(style));
      if (!detail) return;

      const color = detail.stylePrimaryColor;

      SIZES.forEach((size) => {
        const oldSku = `${style}-${color}-${size}`;
        const newSku = `${mapped}-${color}-${size}`;

        rows.push([oldSku, newSku]); // ✅ same row
      });
    });

    setGeneratedRows(rows);
  };

  /* ------------ DOWNLOAD BUTTON ------------ */
  const downloadCSV = () => {
    const csvContent = generatedRows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_skus.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  };

  /* ------------ RESET UPLOAD ------------ */
  const handleReset = () => {
    setGeneratedRows([]);
    setFileName('');
    document.getElementById('csv-upload').value = '';
  };

  useEffect(() => {
    fetchMapping();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-4 flex justify-center gap-4 items-centers">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Qurvii To <span className="text-red-400"> [Qurvii Desi] </span>{' '}
          </h1>
          <a
            className="bg-green-500 text-white py-2 px-4 hover:bg-green-600 duration-75 ease-in rounded-md rounded-md "
            href="/mappedstyle.csv"
          >
            {' '}
            Download Template{' '}
          </a>
        </div>{' '}
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload CSV File
            </h2>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-colors duration-200">
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
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>

                <div className="mt-4 flex flex-col items-center">
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm inline-flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Choose CSV File
                  </label>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />

                  {fileName && (
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Selected: {fileName}
                    </div>
                  )}

                  <p className="mt-2 text-xs text-gray-500">
                    CSV file should contain style numbers in the first column
                  </p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-700 font-medium">Processing your file...</span>
                </div>
              </div>
            )}

            {/* Success State with Generated SKUs */}
            {generatedRows.length > 1 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-green-700 font-medium">
                      Successfully generated {generatedRows.length - 1} SKUs
                    </span>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Preview (First 5 SKUs)</h3>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generatedRows.slice(0, 6).map((row, index) => (
                          <tr key={index} className={index === 0 ? 'bg-gray-50' : ''}>
                            <td className="px-4 py-2 text-sm font-mono text-gray-600">{row[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={downloadCSV}
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm inline-flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download SKU CSV
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm text-gray-700 inline-flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Upload New File
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {generatedRows.length <= 1 && !loading && !fileName && (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">
                  No file uploaded yet. Choose a CSV file to get started.
                </p>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              SKUs will be generated in format: MAPPED-COLOR-SIZE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandConverter;
