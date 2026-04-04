import React, { useState } from 'react';
import {
  FiShoppingBag,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiStar,
  FiShoppingCart,
  FiTag,
  FiUpload,
  FiDownload,
  FiX,
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
import * as XLSX from 'xlsx';
import { generateMyntraCoatMaternityListingFile } from '../catalog/maternity/myntra maternity/MyntraCoatMaternity';
import { generateMyntraDressMaternityListingFile } from '../catalog/maternity/myntra maternity/MyntraDressMaternity';
import { generateMyntraJacketMaternityListingFile } from '../catalog/maternity/myntra maternity/MyntraJacketMaternity';
import { generateMyntraShirtMaternityListingFile } from '../catalog/maternity/myntra maternity/MyntraShirtMaternity';
import { generateMyntraShrugMaternityListingFile } from '../catalog/maternity/myntra maternity/MyntraShrugMaternity';
import { generateMyntraSkirtMaternityListingFile } from '../catalog/maternity/myntra maternity/MyntraSkirtMaternity';
import { generateMyntraTopMaternityListingFile } from '../catalog/maternity/myntra maternity/MyntraTopMaternity';
import { generateMyntraTrousersMaternityListingFile } from '../catalog/maternity/myntra maternity/MyntraTrouserMaternity';
import generateTatacliqMaternityListing from '../catalog/maternity/tatacliq maternity/TataCliqMaternityListing';
import { generateShoppersStopMaternityListing } from '../catalog/maternity/shoppersstop maternity/ShoppersstopMaternity';
import { generateNykaaJackeAndShrugeMaternityListing } from '../catalog/maternity/nykaa maternity/NykaaJacketAndShrugMaternity';
import generateNykaaDressMaternityListing from '../catalog/maternity/nykaa maternity/NykaaDressMaternity';
import { generateNykaaPantShortsPlazzoAndJoggersMaternity } from '../catalog/maternity/nykaa maternity/NykaaPantPlazosMaternity';
import { generateNykaaShirtListingMaternity } from '../catalog/maternity/nykaa maternity/NykaaShirtMaternity';
import { generateNykaaSkirtMaternityListing } from '../catalog/maternity/nykaa maternity/NykaaSkirtMaternity';
import { generateNykaaSweatShirtMaternityListing } from '../catalog/maternity/nykaa maternity/NykaaSweatShirtMaternity';
import { generateNykaaTopMaternityListing } from '../catalog/maternity/nykaa maternity/NykaaTopMaternity';
import { generateShopifyUSListing } from '../catalog/Shopify/ShopifyUsListingGeneration';
import { generateShopifyMaternity } from '../catalog/maternity/shopify/GenerateShopifyMaternityListing';
import { generateBlazersListingFile } from '../catalog/myntra/qurvii/MyntraBlazers';
const Sidebar = ({ data, selectedChannels, selectedBrands }) => {
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
      } else if (selectedCategory.channel === 'Nykaa' && selectedCategory.type === 'Top') {
        // Special case for Nykaa Top with headers
        generateNykaaTopListing(data, headers);
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

  // Define channels with actions
  const channels = [
    {
      name: 'Myntra',
      brand: 'Qurvii',
      icon: <FiShoppingBag className="text-pink-500" />,
      categories: [
        {
          type: 'Dress',
          action: () => generateMyntraDressListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraDressListingFile(data, headers);
          },
        },
        {
          type: 'Shirt',
          action: () => generateMyntraShirtListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraShirtListingFile(data, headers);
          },
        },
        {
          type: 'Top',
          action: () => generateMyntraTopListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraTopListingFile(data, headers);
          },
        },
        {
          type: 'Shrug',
          action: () => generateMyntraShrugListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraShrugListingFile(data, headers);
          },
        },
        {
          type: 'Jacket',
          action: () => generateMyntraJacketListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraJacketListingFile(data, headers);
          },
        },

        {
          type: 'Blazers',
          action: () => generateBlazersListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateBlazersListingFile(data, headers);
          },
        },

        {
          type: 'Coat',
          action: () => generateMyntraCoatListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraCoatListingFile(data, headers);
          },
        },
        {
          type: 'Skirt',
          action: () => generateMyntraSkirtListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraSkirtListingFile(data, headers);
          },
        },
        {
          type: 'Trouser',
          action: () => generateMyntraTrousersListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraTrousersListingFile(data, headers);
          },
        },
      ],
    },
    // myntra maternity collection
    {
      name: 'Myntra Maternity',
      brand: 'Maternity',
      icon: <FiShoppingBag className="text-pink-500" />,
      categories: [
        {
          type: 'Dress',
          action: () => generateMyntraDressMaternityListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraDressMaternityListingFile(data, headers);
          },
        },
        {
          type: 'Shirt',
          action: () => generateMyntraShirtMaternityListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraShirtMaternityListingFile(data, headers);
          },
        },
        {
          type: 'Top',
          action: () => generateMyntraTopMaternityListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraTopMaternityListingFile(data, headers);
          },
        },
        {
          type: 'Shrug',
          action: () => generateMyntraShrugMaternityListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraShrugMaternityListingFile(data, headers);
          },
        },
        {
          type: 'Jacket',
          action: () => generateMyntraJacketMaternityListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraJacketMaternityListingFile(data, headers);
          },
        },
        {
          type: 'Coat',
          action: () => generateMyntraCoatMaternityListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraCoatMaternityListingFile(data, headers);
          },
        },
        {
          type: 'Skirt',
          action: () => generateMyntraSkirtMaternityListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraSkirtMaternityListingFile(data, headers);
          },
        },
        {
          type: 'Trouser',
          action: () => generateMyntraTrousersMaternityListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraTrousersMaternityListingFile(data, headers);
          },
        },
        { type: 'Co-ords', action: () => alert('Myntra Co-ords') },
      ],
    },
    {
      name: 'Myntra +',
      brand: 'Qurvii+',
      icon: <FiShoppingBag className="text-pink-500" />,
      categories: [
        {
          type: 'Dress',
          action: () => generateMyntraDressPlusListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraDressPlusListingFile(data, headers);
          },
        },
        {
          type: 'Shirt',
          action: () => generateMyntraShirtPlusListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraShirtPlusListingFile(data, headers);
          },
        },
        {
          type: 'Top',
          action: () => generateMyntraTopPlusListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraTopPlusListingFile(data, headers);
          },
        },
        {
          type: 'Shrug',
          action: () => generateMyntraShrugPlusListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraShrugPlusListingFile(data, headers);
          },
        },
        {
          type: 'Jacket',
          action: () => generateMyntraJacketsPlusListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraJacketsPlusListingFile(data, headers);
          },
        },
        {
          type: 'Coat',
          action: () => generateMyntraCoatsPlusListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraCoatsPlusListingFile(data, headers);
          },
        },
        {
          type: 'Skirt',
          action: () => generateMyntraSkirtPlusListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraSkirtPlusListingFile(data, headers);
          },
        },
        {
          type: 'Trouser',
          action: () => generateMyntraTrousersPlusListingFile(data),
          actionWithHeaders: (data, headers) => {
            generateMyntraTrousersPlusListingFile(data, headers);
          },
        },
        { type: 'Co-ords', action: () => alert('Myntra Co-ords') },
      ],
    },
    {
      name: 'Nykaa',
      brand: 'Qurvii',
      icon: <FiStar className="text-purple-500" />,
      categories: [
        {
          type: 'Dress',
          action: () => generateNykaaDressListing(data),
          actionWithHeaders: (data, headers) => {
            // You can create a wrapper function for dress too if needed
            generateNykaaDressListing(data, headers);
          },
        },
        {
          type: 'Shirt',
          action: () => generateNykaaShirtListing(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaShirtListing(data, headers);
          },
        },
        {
          type: 'Top',
          action: () => generateNykaaTopListing(data), // Original without headers
          actionWithHeaders: (data, headers) => {
            // This is the key change - pass headers to the function
            generateNykaaTopListing(data, headers);
          },
        },
        {
          type: 'Pant Plazzos Joggers Shorts Trouser',
          action: () => generateNykaaPantShortsPlazzoAndJoggers(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaPantShortsPlazzoAndJoggers(data, headers);
          },
        },
        {
          type: 'SweatShirt',
          action: () => generateNykaaSweatShirtListing(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaSweatShirtListing(data, headers);
          },
        },
        {
          type: 'Skirt',
          action: () => generateNykaaSkirtListing(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaSkirtListing(data, headers);
          },
        },
        {
          type: 'Jacket & Shrug',
          action: () => generateNykaaJackeAndShrugeListing(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaJackeAndShrugeListing(data, headers);
          },
        },
      ],
    },
    // nykaa maternity collection
    {
      name: 'Nykaa Maternity',
      brand: 'Maternity',
      icon: <FiStar className="text-purple-500" />,
      categories: [
        {
          type: 'Dress',
          action: () => generateNykaaDressMaternityListing(data),
          actionWithHeaders: (data, headers) => {
            // You can create a wrapper function for dress too if needed
            generateNykaaDressMaternityListing(data, headers);
          },
        },
        {
          type: 'Shirt',
          action: () => generateNykaaShirtListingMaternity(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaShirtListingMaternity(data, headers);
          },
        },
        {
          type: 'Top',
          action: () => generateNykaaTopMaternityListing(data), // Original without headers
          actionWithHeaders: (data, headers) => {
            // This is the key change - pass headers to the function
            generateNykaaTopMaternityListing(data, headers);
          },
        },
        {
          type: 'Pant Plazzos Joggers Shorts Trouser',
          action: () => generateNykaaPantShortsPlazzoAndJoggersMaternity(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaPantShortsPlazzoAndJoggersMaternity(data, headers);
          },
        },
        {
          type: 'SweatShirt',
          action: () => generateNykaaSweatShirtMaternityListing(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaSweatShirtMaternityListing(data, headers);
          },
        },
        {
          type: 'Skirt',
          action: () => generateNykaaSkirtMaternityListing(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaSkirtMaternityListing(data, headers);
          },
        },
        {
          type: 'Jacket & Shrug',
          action: () => generateNykaaJackeAndShrugeMaternityListing(data),
          actionWithHeaders: (data, headers) => {
            generateNykaaJackeAndShrugeMaternityListing(data, headers);
          },
        },
      ],
    },
    {
      name: 'Ajio',
      brand: 'Qurvii',
      icon: <FiTag className="text-blue-500" />,
      categories: [
        { type: 'Dress', action: () => generateAjioDressListing(data) },
        { type: 'Shirt', action: () => generateAjioShirtListing(data) },
        { type: 'Skirt', action: () => generateAjioSkirtListing(data) },
        { type: 'Top', action: () => generateAjioTopstListing(data) },
        { type: 'Pant & Plazzo', action: () => generateAjioPlazosAndPantsListing(data) },
        { type: 'Shrug', action: () => generateAjioShurgsListing(data) },
        { type: 'Jacket', action: () => generateAjioJacketsListing(data) },
      ],
    },
    {
      name: 'Ajio +',
      brand: 'Qurvii+',
      icon: <FiTag className="text-blue-500" />,
      categories: [
        { type: 'Dress', action: () => generateAjioDressPlusListing(data) },
        { type: 'Shirt', action: () => generateAjioShirtPlusListing(data) },
        { type: 'Skirt', action: () => generateAjioSkirtPlusListing(data) },
        { type: 'Top', action: () => generateAjioTopsPlustListing(data) },
        { type: 'Pant & Plazzo', action: () => generateAjioPlazosAndPantPlusListing(data) },
        { type: 'Shrug', action: () => generateAjioShurgsPlusListing(data) },
        { type: 'Jacket', action: () => generateAjioJacketsPlusListing(data) },
      ],
    },
    {
      name: 'Shopify',
      brand: 'Qurvii',
      icon: <FiShoppingCart className="text-green-500" />,
      categories: [{ type: 'Download', action: () => generateShopifyListing(data) }],
    },
    {
      name: 'Shopify Maternity',
      brand: 'Maternity',
      icon: <FiGrid className="text-red-500" />,
      categories: [
        {
          type: 'Qurvii',
          action: () => generateShopifyMaternity(data),
          actionWithHeaders: (data, headers) => {
            generateShoppersStopMaternityListing(data, headers);
          },
        },
      ],
    },
    {
      name: 'shopifyus',
      brand: 'Qurvii',
      icon: <FiShoppingCart className="text-green-500" />,
      categories: [{ type: 'Download', action: () => generateShopifyUSListing(data) }],
    },
    {
      name: 'TataCliq',
      brand: 'Qurvii',
      icon: <FiGrid className="text-red-500" />,
      categories: [
        {
          type: 'Qurvii',
          action: () => generateTatacliqListing(data),
          actionWithHeaders: (data, headers) => {
            generateTatacliqListing(data, headers);
          },
        },
        {
          type: 'Qurvii+',
          action: () => generateTatacliqPlusListing(data),
          actionWithHeaders: (data, headers) => {
            generateTatacliqPlusListing(data, headers);
          },
        },
      ],
    },
    {
      name: 'TataCliq Maternity',
      brand: 'Maternity',
      icon: <FiGrid className="text-red-500" />,
      categories: [
        {
          type: 'Qurvii',
          action: () => generateTatacliqMaternityListing(data),
          actionWithHeaders: (data, headers) => {
            generateTatacliqMaternityListing(data, headers);
          },
        },
      ],
    },
    {
      name: 'ShopperStop',
      brand: 'Qurvii',
      icon: <FiShoppingBag className="text-yellow-500" />,
      categories: [
        { type: 'Qurvii', action: () => generateShoppersStopListing(data) },
        { type: 'Qurvii+', action: () => generateShoppersStopPlusSizeListing(data) },
      ],
    },
    {
      name: 'ShopperStop Maternity',
      brand: 'Maternity',
      icon: <FiShoppingBag className="text-yellow-500" />,
      categories: [
        {
          type: 'Qurvii',
          action: () => generateShoppersStopMaternityListing(data),
          actionWithHeaders: (data, headers) => {
            generateShoppersStopMaternityListing(data, headers);
          },
        },
      ],
    },
  ];

  const maternityStyles = data?.filter((style) =>
    style.occasion?.trim()?.toLowerCase()?.split(',').includes('maternity')
  );
  console.log('Maternity styles', maternityStyles);

  const hasMaternityData = maternityStyles?.length > 0;

  const filteredChannel = channels.filter((ch) => {
    const channelName = ch.name?.toLowerCase().trim().split(' ')[0];
    const brandName = ch.brand?.toLowerCase().trim();

    const channelMatch = selectedChannels.some((c) => c.toLowerCase().trim() === channelName);

    const brandMatch = selectedBrands.some((b) => b.toLowerCase().trim() === brandName);

    // ⭐ auto allow maternity channels
    const autoMaternity = hasMaternityData && brandName === 'maternity';

    return channelMatch && (brandMatch || autoMaternity);
  });

  // Category count

  const categoryMap = (data, type, channel) => {
    if (!data.length > 0) return;
    const category = {};
    for (const style of data) {
      category[style.styleType?.trim()?.toLowerCase()] =
        (category[style.styleType?.trim()?.toLowerCase()] || 0) + 1;
    }
    const categoryCount = {
      dress: (category['dress'] || 0) + (category['kaftan'] || 0),
      blazers: (category['blazers'] || 0) + (category['blazer'] || 0),
      pant:
        (category['pant'] || 0) +
        (category['trouser'] || 0) +
        (category['short'] || 0) +
        (category['plazzo'] || 0),
      trouser:
        (category['pant'] || 0) +
        (category['trouser'] || 0) +
        (category['short'] || 0) +
        (category['plazzo'] || 0),
      shirt: category['shirt'] || 0,
      sweatshirt: category['sweatshirt'] || 0,
      shrug: category['shrug'] || 0,
      jacket:
        channel?.toLowerCase() === 'nykaa'
          ? (category['jacket'] || 0) +
            (category['coat'] || 0) +
            (category['hoodie'] || 0) +
            (category['shrug'] || 0)
          : channel?.toLowerCase() === 'myntra' || channel?.toLowerCase() === 'myntra +'
            ? (category['jacket'] || 0) + (category['hoodie'] || 0) + (category['sweatshirt'] || 0)
            : (category['jacket'] || 0) +
              (category['coat'] || 0) +
              (category['hoodie'] || 0) +
              (category['sweatshirt'] || 0),
      top: category['top'] || 0,
      coat: category['coat'] || 0,
      skirt: category['skirt'] || 0,
    };

    return {
      count: categoryCount[type],
      categoryCount,
    };
  };

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

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
            {filteredChannel.map((channel, index) => (
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
                          <span className="ml-2 text-center font-medium text-purple-700 text-xs bg-purple-100 rounded-full py-1 px-2">
                            {/* {getCategoryCount(data, category, channel.name) || ''} */}
                            {!channel.name?.toLowerCase()?.split(' ').includes('maternity') &&
                              categoryMap(
                                data,
                                category.type?.trim()?.toLowerCase()?.split(' ')[0],
                                channel.name
                              )?.count}
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

                {selectedCategory.channel.toLowerCase() === 'shopify' && (
                  <button
                    onClick={() => generateShopifyListing(data)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ease-in duration-75 cursor-pointer"
                  >
                    Download Without Uploading Template
                  </button>
                )}

                {selectedCategory.channel.toLowerCase() === 'shopifyus' && (
                  <button
                    onClick={() => generateShopifyUSListing(data)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ease-in duration-75 cursor-pointer"
                  >
                    Download Without Uploading Template
                  </button>
                )}
                {selectedCategory.channel.toLowerCase() === 'shopify maternity' && (
                  <button
                    onClick={() => generateShopifyMaternity(data)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ease-in duration-75 cursor-pointer"
                  >
                    {console.log('selected category', selectedCategory)}
                    Download Without Uploading Template
                  </button>
                )}

                {selectedCategory.channel.toLowerCase() === 'tatacliq' && (
                  <button
                    onClick={() =>
                      selectedCategory.type?.toLowerCase() === 'qurvii'
                        ? generateTatacliqListing(data)
                        : generateTatacliqPlusListing(data)
                    }
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ease-in duration-75 cursor-pointer"
                  >
                    Download Without Uploading Template
                  </button>
                )}
                {selectedCategory.channel.toLowerCase() === 'shopperstop' && (
                  <button
                    onClick={() =>
                      selectedCategory.type?.toLowerCase() === 'qurvii'
                        ? generateShoppersStopListing(data)
                        : generateShoppersStopPlusSizeListing(data)
                    }
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ease-in duration-75 cursor-pointer"
                  >
                    {console.log('selected category', selectedCategory)}
                    Download Without Uploading Template
                  </button>
                )}
                {selectedCategory.channel.toLowerCase() === 'shopperstop maternity' && (
                  <button
                    onClick={() => generateShoppersStopMaternityListing(data)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ease-in duration-75 cursor-pointer"
                  >
                    {console.log('selected category', selectedCategory)}
                    Download Without Uploading Template
                  </button>
                )}

                {selectedCategory.channel.toLowerCase() === 'tatacliq maternity' && (
                  <button
                    onClick={() => generateTatacliqMaternityListing(data)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ease-in duration-75 cursor-pointer"
                  >
                    {console.log('selected category', selectedCategory)}
                    Download Without Uploading Template
                  </button>
                )}
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

export default Sidebar;
