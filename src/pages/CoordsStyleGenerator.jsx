import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoordsStyleGenerator = () => {
  const [coords, setCoords] = useState([]);
  const [qurviiStyles, setQurviiStyles] = useState([]);
  const [qurviiDesiStyles, setQurviiDesiStyles] = useState([]);
  const [qurviiDesiCoordsStyles, setQurviiDesiCoordsStyle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState(0);
  const [newNumbers, setNewNumbers] = useState([]);

  // ********************** fetching coords styles ********************

  const fetchCoordsDataFromGoogleSheet = async () => {
    setLoading(true);
    try {
      const sheetId = '1SIP3Glxo5vkL0Jvx9ulj0p6xZoOh0ruzRtIqzldmb8E';
      const apiKey = 'AIzaSyAGjWAyG29vKBgiYVSXCn08cu5ym6FwiQs';
      const range = 'NEW STYLE GENERATOR!C2:C';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      const response = await axios.get(url);

      const coords = response.data.values;
      const flatArray = coords
        .map((co) => Number(co))
        .sort((a, b) => b - a)
        .flat();
      setCoords(flatArray);
      console.log('Co-ords styles', flatArray);
    } catch (error) {
      console.log('Failed to fetch Co-ords styles error :: ', error);
    } finally {
      setLoading(false);
    }
  };

  // QURVII  STYLES
  const fetchQurviiStyles = async () => {
    setLoading(true);
    try {
      const sheetId = '1SIP3Glxo5vkL0Jvx9ulj0p6xZoOh0ruzRtIqzldmb8E';
      const apiKey = 'AIzaSyAGjWAyG29vKBgiYVSXCn08cu5ym6FwiQs';
      const range = 'NEW STYLE GENERATOR!A2:A';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      const response = await axios.get(url);

      const coords = response.data.values;
      const flatArray = coords
        .map((co) => Number(co))
        .sort((a, b) => b - a)
        .flat();
      setQurviiStyles(flatArray);
      console.log('Qurvii Styles', flatArray);
    } catch (error) {
      console.log('Failed to fetch Qurvii Styles error :: ', error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH QURVII DESI STYLES
  const fetchQurviiDesiStyles = async () => {
    setLoading(true);
    try {
      const sheetId = '1SIP3Glxo5vkL0Jvx9ulj0p6xZoOh0ruzRtIqzldmb8E';
      const apiKey = 'AIzaSyAGjWAyG29vKBgiYVSXCn08cu5ym6FwiQs';
      const range = 'NEW STYLE GENERATOR!b2:b';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      const response = await axios.get(url);

      const coords = response.data.values;
      const flatArray = coords
        .map((co) => Number(co))
        .sort((a, b) => b - a)
        .flat();
      setQurviiDesiStyles(flatArray);
      console.log('Qurvii Desi Styles', flatArray);
    } catch (error) {
      console.log('Failed to fetch Qurvii Desi Styles error :: ', error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH QURVII DESI CO-ORDS
  const fetchQurviiDesiCoordsStyles = async () => {
    setLoading(true);
    try {
      const sheetId = '1SIP3Glxo5vkL0Jvx9ulj0p6xZoOh0ruzRtIqzldmb8E';
      const apiKey = 'AIzaSyAGjWAyG29vKBgiYVSXCn08cu5ym6FwiQs';
      const range = 'NEW STYLE GENERATOR!d2:d';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      const response = await axios.get(url);

      const coords = response.data.values;
      const flatArray = coords
        .map((co) => Number(co))
        .sort((a, b) => b - a)
        .flat();
      setQurviiDesiCoordsStyle(flatArray);
      console.log('Qurvii Desi co-ords Styles', flatArray);
    } catch (error) {
      console.log('Failed to fetch Qurvii Desi co-ords Styles error :: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchCoordsDataFromGoogleSheet();
    // fetchQurviiStyles();

    Promise.all([
      fetchCoordsDataFromGoogleSheet(),
      fetchQurviiStyles(),
      fetchQurviiDesiStyles(),
      fetchQurviiDesiCoordsStyles(),
    ]);
  }, []);

  const newStylesGenerator = (e) => {
    e.preventDefault();

    try {
      let startNum = 30000; // starting point
      let lastNum = 30999;
      let requiredCount = parseInt(number, 10);
      let generated = [];

      while (generated.length < requiredCount && startNum <= lastNum) {
        let exists = coords?.find((style) => style?.coordStyleNumber === startNum);
        if (!exists) {
          generated.push(startNum);
        }
        startNum++;
      }

      setNewNumbers(generated);
      console.log('New Numbers:', generated);
    } catch (error) {
      console.log('Failed to generate new styles :: error :: ', error);
    }
  };

  const downloadCSV = () => {
    if (newNumbers.length === 0) return;

    let csvContent =
      'StyleNumber,Category,Designer\n' +
      newNumbers.map((num) => `${num},Co-ords,${designer}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'new-styles.csv');
    link.click();
  };

  if (loading) {
    return <p className="text-center mt-4"> loading... </p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-purple-500 font-medium text-xl">Co-ords Generator</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <form className="grid grid-cols-2 gap-2" onSubmit={newStylesGenerator}>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="border border-purple-300 rounded-md outline-purple-400 py-2 px-4"
              placeholder="Enter quantity..."
            />

            <input
              className="py-2 px-4 bg-purple-400 text-white col-span-2 cursor-pointer hover:bg-purple-500 ease-in duration-75 rounded-md"
              type="submit"
              value="Generate Numbers"
            />
          </form>
        </div>

        {newNumbers.length > 0 && (
          <div className="pl-6 bg-gray-50 rounded-xl p-4 shadow-xs">
            <div className="flex justify-between items-center  ">
              <h3 className="font-medium text-purple-400 text-xl mb-4">
                {' '}
                <span className="bg-purple-100 py-2 px-4 rounded-md text-purple-900">
                  {' '}
                  {newNumbers.length} Co-ords generated
                </span>{' '}
              </h3>
              <button
                onClick={downloadCSV}
                className="bg-purple-400 text-white py-2 px-4 rounded hover:bg-purple-500 duration-75 ease-in cursor-pointer"
              >
                {' '}
                Download
              </button>
            </div>
            <ol className="list-decimal pl-6">
              <li className="grid grid-cols-3 text-cyan-800 rounded-md shadow bg-cyan-100 py-2 px-2 my-2">
                <div>New Styles </div>
                <div> Category </div>
                <div>Created By</div>
              </li>
              {newNumbers.map((style, i) => (
                <li
                  key={style}
                  className={`grid grid-cols-3 gap-3 p-2 rounded-md ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                >
                  <div>{style} </div>
                  <div> Co-ords </div>
                  <div>{designer}</div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordsStyleGenerator;
