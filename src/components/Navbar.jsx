import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 w-full z-40 py-6 transition-all duration-500 ease-in-out',
                scrolled
                    ? 'glass py-4 border-b border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-black'
                    : 'bg-transparent text-black'
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                <div className="flex items-center gap-3 md:gap-4">
                    <img src="/sapienthr.png" alt="SapientHR Logo" className="h-6 sm:h-8 object-contain" />
                    <div className="h-6 sm:h-8 w-px bg-gray-300"></div>
                    <div className="font-serif font-bold text-xl sm:text-2xl tracking-wide">
                        RE:ORG<span className="text-gray-400 font-sans text-xs sm:text-sm font-normal tracking-normal ml-1 hidden sm:inline">.consulting</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm font-medium">
                    {isHomePage ? (
                        <>
                            <a href="#problem" className="hover:text-accent-red transition-colors hidden md:block">The Problem</a>
                            <a href="#shift" className="hover:text-accent-red transition-colors hidden md:block">The SHIFT Framework</a>
                            <a href="#diagnostic" className="hover:text-accent-red transition-colors hidden md:block">The Diagnostic</a>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="hover:text-accent-red transition-colors hidden md:block">Home</Link>
                        </>
                    )}

                    <Link
                        to="/contact"
                        className={cn(
                            'px-6 py-2.5 rounded-full font-semibold transition-all duration-300 border-2',
                            scrolled ? 'border-black text-black hover:bg-black hover:text-white' : 'border-black text-black hover:bg-black hover:text-white'
                        )}
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
}
