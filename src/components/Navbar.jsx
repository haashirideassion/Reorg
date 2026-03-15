import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Menu, X } from 'lucide-react';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'The Problem', href: '/#problem' },
        { name: 'The SHIFT Framework', href: '/#shift' },
        { name: 'The Diagnostic', href: '/#diagnostic' }
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out',
                scrolled || isOpen
                    ? 'glass py-4 border-b border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-black'
                    : 'bg-transparent text-black py-6'
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
                <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-opacity relative z-10"
                >
                    <img src="/sapienthr.png" alt="SapientHR Logo" className="h-6 sm:h-8 object-contain" />
                    <div className="h-6 sm:h-8 w-px bg-gray-300"></div>
                    <div className="font-serif font-bold text-xl sm:text-2xl tracking-wide">
                        RE:ORG<span className="text-gray-400 font-sans text-xs sm:text-sm font-normal tracking-normal ml-1 hidden sm:inline">.consulting</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} className="hover:text-amber-600 transition-colors">
                            {link.name}
                        </a>
                    ))}
                    <Link
                        to="/contact"
                        className="px-6 py-2.5 rounded-full font-semibold transition-all duration-300 btn-amber-green text-white shadow-lg"
                    >
                        Contact
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 relative z-10"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6 text-lg font-medium">
                            {navLinks.map(link => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-amber-600 transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <Link
                                to="/contact"
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-4 rounded-xl text-center font-bold bg-black text-white shadow-lg"
                            >
                                Contact
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
