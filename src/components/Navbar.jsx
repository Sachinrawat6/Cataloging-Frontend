import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Layers, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const navlinks = [
    { name: 'Styles', link: '/styles' },
    { name: 'Co-ords', link: '/co-ords' },
    { name: 'Relisted', link: '/relisted' },
    {
      name: 'Create Styles',
      link: '#',
      dropdown: [
        {
          name: 'Create Regular Style',
          path: '/create-regular-style',
          icon: <PlusCircle className="w-4 h-4" />,
        },
        {
          name: 'Create Co-ords',
          path: '/create-coords',
          icon: <Layers className="w-4 h-4" />,
        },
        {
          name: 'Create Relisted Style',
          path: '/create-relisted-style',
          icon: <RefreshCcw className="w-4 h-4" />,
        },
      ],
    },
    { name: 'Generate Style No.', link: '/generate-styles-no' },
    { name: 'Style Logs', link: '/style-logs' },
    { name: 'Cataloging', link: '/cataloging' },
    { name: 'Coords Cataloging', link: '/cataloging/co-ords' },
    { name: 'Convert', link: '/brand_converter' },
    { name: 'Mapping', link: '/mapping' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCreateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCreateDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCreateDropdownOpen(!isCreateDropdownOpen);
  };

  const closeAllMenus = () => {
    setIsOpen(false);
    setIsCreateDropdownOpen(false);
  };

  return (
    <div className="bg-gray-900 text-white w-full fixed top-0 left-0 right-0 z-50 shadow-sm">
      <nav className=" mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Hamburger */}
          <div className="w-full md:w-auto flex justify-between items-center">
            <Link to="/" className="flex items-center truncate" onClick={closeAllMenus}>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
                StyleWise & Cataloging
              </h2>
            </Link>

            {/* Hamburger Button - Mobile Only */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                ></span>
                <span
                  className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                ></span>
                <span
                  className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
                ></span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <ul
            className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-1 md:gap-8 mt-4 md:mt-0 w-full md:w-auto`}
          >
            {navlinks.map((item) => (
              <li
                key={item.link}
                className="w-full md:w-auto text-center relative"
                ref={item.dropdown ? dropdownRef : null}
              >
                {!item.dropdown ? (
                  <Link
                    to={item.link}
                    className={`block px-1 py-3 md:py-2 transition-colors duration-300
                                        relative after:content-[''] after:absolute after:bottom-2 after:left-0 after:w-0 after:h-0.5 
                                        after:bg-gradient-to-r after:from-purple-500 after:to-cyan-400 after:transition-all after:duration-300
                                        hover:after:w-full ${location.pathname === item.link ? 'text-white after:w-full' : 'text-gray-300 hover:text-white'}`}
                    onClick={closeAllMenus}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={toggleCreateDropdown}
                      className={`flex items-center justify-center gap-1 px-1 py-3 md:py-2 w-full md:w-auto transition-colors duration-300
                                            relative after:content-[''] after:absolute after:bottom-2 after:left-0 after:w-0 after:h-0.5 
                                            after:bg-gradient-to-r after:from-purple-500 after:to-cyan-400 after:transition-all after:duration-300
                                            hover:after:w-full ${isCreateDropdownOpen ? 'text-white after:w-full' : 'text-gray-300 hover:text-white'}`}
                    >
                      {item.name}
                      {isCreateDropdownOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isCreateDropdownOpen && (
                      <div
                        className={`md:absolute left-0 ${isOpen ? 'w-full pl-4' : 'w-48'} mt-0 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50
                                                transition-all duration-200 origin-top`}
                      >
                        {item.dropdown.map((subItem, i) => (
                          <Link
                            key={subItem.path + i}
                            to={subItem.path}
                            className={`flex truncate items-center gap-2 px-4 py-3 text-sm transition-colors
                                                        ${location.pathname === subItem.path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            onClick={closeAllMenus}
                          >
                            {subItem.icon}
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
