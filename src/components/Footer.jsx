import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerLinks = [
        {
            title: "Quick Links", links: [
                { name: "Home", link: "/" },
                { name: "Styles", link: "/styles" },
                { name: "Co-ords", link: "/co-ords" },
                { name: "Relisted", link: "/relisted" },
                { name: "Style Logs", link: "/style-logs" },
            ]
        },

    ];

    const socialLinks = [
        { name: "Instagram", icon: "fab fa-instagram", link: "#" },
        { name: "Twitter", icon: "fab fa-twitter", link: "#" },
        { name: "Pinterest", icon: "fab fa-pinterest", link: "#" },
        { name: "Facebook", icon: "fab fa-facebook-f", link: "#" },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            <div className="container mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                    {/* Brand Info */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center mb-4">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
                                StyleWise Database
                            </h2>
                        </Link>
                        <p className="text-sm text-gray-400 mb-4">
                            The ultimate fashion style database for modern trendsetters and fashion enthusiasts.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.link}
                                    aria-label={social.name}
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    <i className={`${social.icon} text-lg`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="mt-4 md:mt-0">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            to={item.link}
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-300
                      relative before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 
                      before:w-1 before:h-1 before:bg-cyan-400 before:opacity-0 before:transition-all before:duration-300
                      hover:before:opacity-100 hover:pl-3"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}


                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} StyleWise Database. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-300">Privacy Policy</a>
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-300">Terms of Service</a>
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-300">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;