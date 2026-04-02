import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PlusCircle, Layers, RefreshCcw } from "lucide-react";

const StyleCreationSidebar = () => {
    const location = useLocation();
    const links = [
        {
            name: "Create Regular Style",
            path: "/create-regular-style",
            icon: <PlusCircle className="w-5 h-5" />,
        },
        {
            name: "Create Co-ords",
            path: "/create-coords",
            icon: <Layers className="w-5 h-5" />,
        },
        {
            name: "Create Relisted Style",
            path: "/create-relisted-style",
            icon: <RefreshCcw className="w-5 h-5" />,
        },
    ];

    return (
        <div className="h-[92vh]  w-64 bg-gradient-to-b from-gray-700 to-gray-900 text-white shadow-xl rounded-xl flex flex-col relative top-0 overflow-hidden border border-gray-600">
            {/* Header with subtle shine effect */}
            <div className="px-6 py-5 border-b border-gray-600 bg-gradient-to-r from-gray-700 to-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20"></div>
                <h2 className="text-lg font-semibold tracking-wide relative z-10 flex items-center">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Style Creation
                    </span>
                </h2>
                <p className="text-xs text-gray-400 mt-1 relative z-10">
                    Create new styles
                </p>
            </div>

            {/* Sidebar Links */}
            <nav className="flex-1 px-2 py-4 space-y-1.5">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 group
                            ${location.pathname === link.path
                                ? "bg-blue-500/10 border-l-4 border-blue-400 shadow-md"
                                : "hover:bg-gray-700/50"
                            }`}
                    >
                        <span className={`transition-colors duration-200 ${location.pathname === link.path
                            ? "text-blue-400"
                            : "text-gray-400 group-hover:text-white"
                            }`}>
                            {link.icon}
                        </span>
                        <span className={`font-medium ${location.pathname === link.path
                            ? "text-white"
                            : "text-gray-300 group-hover:text-white"
                            }`}>
                            {link.name}
                        </span>
                        {location.pathname === link.path && (
                            <span className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Subtle decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-30"></div>
        </div>
    );
};

export default StyleCreationSidebar;