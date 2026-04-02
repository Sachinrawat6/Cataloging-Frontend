import React, { useState } from 'react';
import {
  FiShoppingBag,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiStar,
  FiShoppingCart,
  FiTag,
} from 'react-icons/fi';
import generateTatacliqListing from '../catalog/Tatacliq/TataCliqListingGeneration';
import { generateShopifyListing } from '../catalog/Shopify/ShopifyListingGeneration';
import { generateShoppersStopListing } from '../catalog/shoopersstop/ShoppersstopListingGenerator';
import generateNykaaDressListing from '../catalog/Nykaa/NykaaDressListingGeneration';
import { generateNykaaShirtListing } from '../catalog/Nykaa/NykaaShirtListingGeneration';
import { generateNykaaTopListing } from '../catalog/Nykaa/NykaaTopsListingGeneration';
import { generateNykaaJackeAndShrugeListing } from '../catalog/Nykaa/NykaaJacketAndShrugListingGeneration';
import { generateShoppersStopPlusSizeListing } from '../catalog/shoopersstop/ShoppersstopPlusListingGenerator';
import generateTatacliqPlusListing from '../catalog/Tatacliq/TataCliqPlusListingGeneration';
import generateNykaaPlusDressListing from '../catalog/Nykaa/NykaaPlus/NykaaDressPlusListingGenerator';
import { generateNykaaShirtPlusListing } from '../catalog/Nykaa/NykaaPlus/NykaaShirtPlusListingGenerator';
import { generateMyntraDressListingFile } from '../catalog/myntra/qurvii/MyntraDressListingGenerator';
import { generateMyntraShirtListingFile } from '../catalog/myntra/qurvii/MyntraShirtListingGenerator';
import { generateMyntraTopListingFile } from '../catalog/myntra/qurvii/MyntraTopListingGenerator';
import { generateMyntraShrugListingFile } from '../catalog/myntra/qurvii/MyntraShrugListingGenerator';
import { generateMyntraCoatListingFile } from '../catalog/myntra/qurvii/MyntraCoatsListingGenerator';
import { generateMyntraJacketListingFile } from '../catalog/myntra/qurvii/MyntraJacketsListingGenerator';
import { generateMyntraSkirtListingFile } from '../catalog/myntra/qurvii/MyntraSkirtListingGenerator';
import { generateMyntraTrousersListingFile } from '../catalog/myntra/qurvii/MyntraTrousersListingGeneration';
import { generateMyntraCoatsPlusListingFile } from '../catalog/myntra/qurvii+/MyntraCoatsPlusListingGenerator';
import { generateMyntraJacketsPlusListingFile } from '../catalog/myntra/qurvii+/MyntraJacketsPlusListingGenerator';
import { generateMyntraDressPlusListingFile } from '../catalog/myntra/qurvii+/MyntraDressPlusListingGenerator';
import { generateMyntraShirtPlusListingFile } from '../catalog/myntra/qurvii+/MyntraShirtPlusListingGenerator';
import { generateMyntraShrugPlusListingFile } from '../catalog/myntra/qurvii+/MyntraShrugPlusListingGenerator';
import { generateMyntraSkirtPlusListingFile } from '../catalog/myntra/qurvii+/MyntraSkirtPlusListingGenerator';
import { generateMyntraTopPlusListingFile } from '../catalog/myntra/qurvii+/MyntraTopPlusListingGenerator';
import { generateMyntraTrousersPlusListingFile } from '../catalog/myntra/qurvii+/MyntraTrousersPlusListingGenerator';
import generateAjioDressListing from '../catalog/ajio/qurvii/AjioDress';
import generateAjioJacketsListing from '../catalog/ajio/qurvii/AjioJacket';
import generateAjioPlazosAndPantsListing from '../catalog/ajio/qurvii/AjioPlazzosAndPants';
import generateAjioShirtListing from '../catalog/ajio/qurvii/AjioShirt';
import generateAjioShurgsListing from '../catalog/ajio/qurvii/AjioShrugs';
import generateAjioSkirtListing from '../catalog/ajio/qurvii/AjioSkirt';
import generateAjioTopstListing from '../catalog/ajio/qurvii/AjioTop';
import generateAjioDressPlusListing from '../catalog/ajio/qurvii+/AjioDressPlus';
import generateAjioJacketsPlusListing from '../catalog/ajio/qurvii+/AjioJacketPlus';
import generateAjioPlazosAndPantPlusListing from '../catalog/ajio/qurvii+/AjioPlazzosAndPantsPlus';
import generateAjioShirtPlusListing from '../catalog/ajio/qurvii+/AjioShirtPlus';
import generateAjioShurgsPlusListing from '../catalog/ajio/qurvii+/AjioShrugPlus';
import generateAjioSkirtPlusListing from '../catalog/ajio/qurvii+/AjioSkirtPlus';
import generateAjioTopsPlustListing from '../catalog/ajio/qurvii+/AjioTopPlus';
import { generateNykaaSweatShirtListing } from '../catalog/Nykaa/NykaaSweatShirt';
import { generateNykaaSkirtListing } from '../catalog/Nykaa/NykaaSkirt';
import { generateNykaaPantShortsPlazzoAndJoggers } from '../catalog/Nykaa/NykaaPantPalazoShortsAndJoggers';

const Sidebar = ({ data }) => {
  const [openChannels, setOpenChannels] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headers, setHeaders] = useState([]);

  const toggleChannel = (channel) => {
    if (openChannels.includes(channel)) {
      setOpenChannels(openChannels.filter((item) => item !== channel));
    } else {
      setOpenChannels([...openChannels, channel]);
    }
  };

  const channels = [
    {
      name: 'Myntra',
      icon: <FiShoppingBag className="text-pink-500" />,
      categories: [
        { type: 'Dress', action: () => generateMyntraDressListingFile(data) },
        { type: 'Shirt', action: () => generateMyntraShirtListingFile(data) },
        { type: 'Top', action: () => generateMyntraTopListingFile(data) },
        { type: 'Shrug', action: () => generateMyntraShrugListingFile(data) },
        { type: 'Jacket', action: () => generateMyntraJacketListingFile(data) },
        { type: 'Coat', action: () => generateMyntraCoatListingFile(data) },
        { type: 'Skirt', action: () => generateMyntraSkirtListingFile(data) },
        { type: 'Trousers', action: () => generateMyntraTrousersListingFile(data) },
        { type: 'Co-ords', action: () => alert('Myntra Co-ords') },
      ],
    },
    {
      name: 'Myntra+',
      icon: <FiShoppingBag className="text-pink-500" />,
      categories: [
        { type: 'Dress', action: () => generateMyntraDressPlusListingFile(data) },
        { type: 'Shirt', action: () => generateMyntraShirtPlusListingFile(data) },
        { type: 'Top', action: () => generateMyntraTopPlusListingFile(data) },
        { type: 'Shrug', action: () => generateMyntraShrugPlusListingFile(data) },
        { type: 'Jacket', action: () => generateMyntraJacketsPlusListingFile(data) },
        { type: 'Coat', action: () => generateMyntraCoatsPlusListingFile(data) },
        { type: 'Skirt', action: () => generateMyntraSkirtPlusListingFile(data) },
        { type: 'Trousers', action: () => generateMyntraTrousersPlusListingFile(data) },
        { type: 'Co-ords', action: () => alert('Myntra Co-ords') },
      ],
    },

    {
      name: 'Nykaa',
      icon: <FiStar className="text-purple-500" />,
      categories: [
        { type: 'Dress', action: () => generateNykaaDressListing(data) },
        { type: 'Shirt', action: () => generateNykaaShirtListing(data) },
        { type: 'Top', action: () => generateNykaaTopListing(data) },
        {
          type: 'Pant Plazzos Joggers Shorts',
          action: () => generateNykaaPantShortsPlazzoAndJoggers(data),
        },
        { type: 'SweatShirt', action: () => generateNykaaSweatShirtListing(data) },
        { type: 'Skirt', action: () => generateNykaaSkirtListing(data) },
        { type: 'Jacket & Shrug', action: () => generateNykaaJackeAndShrugeListing(data) },
      ],
    },
    {
      name: 'Ajio',
      icon: <FiTag className="text-blue-500" />,
      categories: [
        { type: 'Dress', action: () => generateAjioDressListing(data) },
        { type: 'Shirt', action: () => generateAjioShirtListing(data) },
        { type: 'Skirt', action: () => generateAjioSkirtListing(data) },
        { type: 'Top', action: () => generateAjioTopstListing(data) },
        { type: 'Plazzo & Pant', action: () => generateAjioPlazosAndPantsListing(data) },
        { type: 'Co-ords', action: () => alert('Ajio Co-ords') },
        { type: 'Shrug', action: () => generateAjioShurgsListing(data) },
        { type: 'Jacket', action: () => generateAjioJacketsListing(data) },
      ],
    },

    {
      name: 'Ajio +',
      icon: <FiTag className="text-blue-500" />,
      categories: [
        { type: 'Dress', action: () => generateAjioDressPlusListing(data) },
        { type: 'Shirt', action: () => generateAjioShirtPlusListing(data) },
        { type: 'Skirt', action: () => generateAjioSkirtPlusListing(data) },
        { type: 'Top', action: () => generateAjioTopsPlustListing(data) },
        { type: 'Plazzo & Pant', action: () => generateAjioPlazosAndPantPlusListing(data) },
        { type: 'Co-ords', action: () => alert('Ajio Co-ords') },
        { type: 'Shrug', action: () => generateAjioShurgsPlusListing(data) },
        { type: 'Jacket', action: () => generateAjioJacketsPlusListing(data) },
      ],
    },
    {
      name: 'Shopify',
      icon: <FiShoppingCart className="text-green-500" />,
      categories: [{ type: 'Download', action: () => generateShopifyListing(data) }],
    },
    {
      name: 'TataCliq',
      icon: <FiGrid className="text-red-500" />,
      categories: [
        { type: 'Qurvii', action: () => generateTatacliqListing(data) },
        { type: 'Qurvii+', action: () => generateTatacliqPlusListing(data) },
      ],
    },
    {
      name: 'ShopperStop',
      icon: <FiShoppingBag className="text-yellow-500" />,
      categories: [
        { type: 'Qurvii', action: () => generateShoppersStopListing(data) },
        { type: 'Qurvii+', action: () => generateShoppersStopPlusSizeListing(data) },
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
      <div
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
      </div>
    </div>
  );
};

export default Sidebar;
