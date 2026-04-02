import React, { useState, useMemo } from 'react';

const CatalogDetails = ({ data, not_approved }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const itemsPerPage = 10;

  // Filter and sort data
  const processedData = useMemo(() => {
    let filteredData = data;

    // Apply filter
    if (filterText) {
      filteredData = data.filter((item) =>
        Object.values(item).some(
          (val) => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, sortConfig, filterText]);

  // Get current items for pagination
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return processedData.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, processedData]);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const showNotApprovedStyles = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-lg  p-6">
      <div className="flex justify-between items-start relative">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Style Catalog</h2>

        {/* Not Approved Styles Section */}
        <div className="flex flex-col gap-2 relative">
          {/* Badge and Button */}
          <div className="flex gap-2 items-center">
            <span className="px-3 py-1 bg-red-100 text-red-800 font-medium rounded-lg">
              Not Approved Styles: ({not_approved?.length})
            </span>
            <button
              onClick={showNotApprovedStyles}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-150"
            >
              {show ? 'Hide Styles' : 'Show Styles'}
            </button>
          </div>

          {/* Dropdown List */}
          {show && (
            <div className="absolute top-12 right-0 w-44 bg-gray-100 p-3 rounded-lg shadow-md z-10">
              <ol className="list-decimal list-inside space-y-1">
                {not_approved?.map((style) => (
                  <li key={style._id} className="text-gray-700 ">
                    {style.styleNumber}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search styles..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <div className="text-sm text-gray-600">
          Showing {currentItems.length} of {processedData.length} styles
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th title="#" sortable={false} />
              <Th
                title="Style Number"
                sortKey="styleNumber"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <Th
                title="Style Type"
                sortKey="styleType"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <Th
                title="Color"
                sortKey="stylePrimaryColor"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <Th
                title="Style Name"
                sortKey="styleName"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <Th
                title="Prints"
                sortKey="prints"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <Th
                title="Season"
                sortKey="season"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <Th title="MRP" sortKey="mrp" sortConfig={sortConfig} requestSort={requestSort} />
              <Th title="Details" sortable={false} className="text-center" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((style, i) => (
                <tr
                  key={`${style.styleNumber}-${i}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <Td value={(currentPage - 1) * itemsPerPage + i + 1} />
                  <Td value={style.styleNumber} className="font-medium text-blue-600" />
                  <Td value={style.styleType} className="font-medium text-blue-600" />
                  <Td>
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                        style={{
                          backgroundColor: style.stylePrimaryColor?.toLowerCase() || '#ccc',
                        }}
                      ></div>
                      {style.stylePrimaryColor || '-'}
                    </div>
                  </Td>
                  <Td value={style.styleName} />
                  <Td value={style.prints} />
                  <Td value={style.season} />
                  <Td value={style.mrp ? `₹${style.mrp}` : '-'} />
                  <Td>
                    <DetailsModal style={style} formatDate={formatDate} />
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No styles found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {processedData.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{Math.ceil(processedData.length / itemsPerPage)}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(processedData.length / itemsPerPage)}
              className="px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Table Header Component
const Th = ({ title, sortable = true, sortKey, sortConfig, requestSort, className = '' }) => {
  const canSort = sortable && sortKey;
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${canSort ? 'cursor-pointer' : ''} ${className}`}
      onClick={() => canSort && requestSort(sortKey)}
    >
      <div className="flex items-center">
        {title}
        {canSort && (
          <span className="ml-1">
            {sortConfig.key === sortKey ? (
              sortConfig.direction === 'ascending' ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              )
            ) : (
              <svg
                className="w-4 h-4 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                ></path>
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  );
};

// Table Data Component
const Td = ({ value, children, className = '' }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>
      {children || value || '-'}
    </td>
  );
};

// Details Modal Component
const DetailsModal = ({ style, formatDate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View Details
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Style Details</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Style Number</h4>
                  <p className="text-gray-900">{style.styleNumber || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Style Type</h4>
                  <p className="text-gray-900">{style.styleType || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Style Name</h4>
                  <p className="text-gray-900">{style.styleName || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Color</h4>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                      style={{ backgroundColor: style.stylePrimaryColor?.toLowerCase() || '#ccc' }}
                    ></div>
                    <p className="text-gray-900">{style.stylePrimaryColor || '-'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Prints</h4>
                  <p className="text-gray-900">{style.prints || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Season</h4>
                  <p className="text-gray-900">{style.season || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">MRP</h4>
                  <p className="text-gray-900">{style.mrp ? `₹${style.mrp}` : '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Wash Care</h4>
                  <p className="text-gray-900">{style.washCare || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Hemline</h4>
                  <p className="text-gray-900">{style.hemline || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Closure</h4>
                  <p className="text-gray-900">{style.closure || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Lining</h4>
                  <p className="text-gray-900">{style.lining || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Neckline</h4>
                  <p className="text-gray-900">{style.neckStyle || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Log ID</h4>
                  <p className="text-gray-900">{style.logId || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Designer</h4>
                  <p className="text-gray-900">{style.createdBy || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Created At</h4>
                  <p className="text-gray-900">{formatDate(style.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CatalogDetails;
