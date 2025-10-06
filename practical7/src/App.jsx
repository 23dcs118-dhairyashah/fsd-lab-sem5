import React, { useState } from 'react';

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('Home');

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNavClick = (section) => {
        setActiveSection(section);
        setIsOpen(false);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'Home':
                return (
                    <div>
                        <h1 className="text-3xl font-semibold mb-4 text-gray-900">Welcome to My Website</h1>
                        <p className="text-gray-700">This is the main content of the webpage.</p>
                    </div>
                );
            case 'About':
                return (
                    <div>
                        <h1 className="text-3xl font-semibold mb-4 text-gray-900">About</h1>
                        <p className="text-gray-700">Learn more about our company and services.</p>
                    </div>
                );
            case 'Contact':
                return (
                    <div>
                        <h1 className="text-3xl font-semibold mb-4 text-gray-900">Contact</h1>
                        <p className="text-gray-700">Get in touch with us for more information.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white relative">
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <div className={`fixed top-0 left-0 h-full bg-gray-200 border-r border-gray-300 z-50 transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 w-56`}>

                <div className="pt-4 px-3">
                    {['Home', 'About', 'Contact'].map((item) => (
                        <button
                            key={item}
                            onClick={() => handleNavClick(item)}
                            className={`w-full text-left px-3 py-2 mb-2 rounded transition-colors ${activeSection === item
                                ? 'bg-gray-300 text-gray-900'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-30 p-2 bg-gray-600 text-white border border-gray-500 md:hidden"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <main className={`transition-all duration-200 ${isOpen ? 'md:ml-56' : 'md:ml-56'
                } min-h-screen`}>
                <div className="p-6 pt-16 md:pt-6">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default App;
