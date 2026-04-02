import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    // Sample data for demonstration
    const recentStyles = [
        { id: 1, name: "Summer Casual", type: "coord-set", date: "2023-06-15" },
        { id: 2, name: "Formal Office", type: "style", date: "2023-06-10" },
        { id: 3, name: "Weekend Vibes", type: "relisted", date: "2023-06-05" },
    ];

    const upcomingFeatures = [
        "Discount Generation Tool",
        "Advanced Style Analytics",
        "Bulk Listing Generator",
        "Seasonal Trend Reports"
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-900 to-gray-900 text-white py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">StyleWise Fashion Manager</h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        Create, manage, and analyze your fashion styles, coord sets, and relisted items all in one place.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/create-single-product"
                            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium text-lg transition-colors"
                        >
                            Create Single Product
                        </Link>
                        <Link

                            to="/create-combo-product"
                            className="px-8 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium text-lg transition-colors"
                        >
                            Create Combo Product
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Features */}
            <section className="container mx-auto py-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Style Management Card */}
                    <div className="bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2"></div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 p-3 rounded-full mr-4">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Style Management</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Create and organize your fashion styles with detailed categorization and tagging.
                            </p>
                            <Link
                                to="/styles"
                                className="text-cyan-600 hover:text-cyan-800 font-medium inline-flex items-center"
                            >
                                View Styles
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Coord Sets Card */}
                    <div className="bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2"></div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-cyan-100 p-3 rounded-full mr-4">
                                    <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Coord Sets</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Build perfect outfit combinations with our coordinated sets builder and matching tools.
                            </p>
                            <Link
                                to="/co-ords"
                                className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
                            >
                                View Coord Sets
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Relisted Items Card */}
                    <div className="bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-pink-100 p-3 rounded-full mr-4">
                                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Relisted Items</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Manage and track your relisted fashion items with inventory and pricing tools.
                            </p>
                            <Link
                                to="/relisted"
                                className="text-pink-600 hover:text-pink-800 font-medium inline-flex items-center"
                            >
                                View Relisted
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Activity & Upcoming Features */}
            <section className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-xs p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {recentStyles.map((style) => (
                                <div key={style.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{style.name}</h3>
                                            <p className="text-sm text-gray-500 capitalize">{style.type}</p>
                                        </div>
                                        <span className="text-sm text-gray-400">{style.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link
                            to="/style-logs"
                            className="mt-6 inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-800"
                        >
                            View All Activity
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Upcoming Features */}
                    <div className="bg-white rounded-xl shadow-xs p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Coming Soon
                        </h2>
                        <ul className="space-y-3">
                            {upcomingFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg">
                            <h3 className="font-medium text-gray-800 mb-2">Discount Generation</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Our new discount feature will be launching soon! Create automated discounts and promotions for your styles.
                            </p>
                            <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
                                Notify Me When Available
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-800 text-white py-12 px-4 mt-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to elevate your fashion management?</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">
                        Start creating, organizing, and analyzing your styles  with qurvii tools.
                    </p>
                    <Link
                        to="/styles/new"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-medium text-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
                    >
                        Get Started Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;