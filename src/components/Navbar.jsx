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
                    className="flex flex-col items-end transition-opacity relative z-10 shrink-0"
                >
                    <img src="/assets/reorg-logo.svg" alt="RE:ORG Logo" className="h-5 sm:h-6 lg:h-7 object-contain" />
                    <div className="flex items-center gap-1.5 mt-1 pr-1">
                        <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium uppercase tracking-widest leading-none">by</span>
                        <img src="/assets/sapienthr.png" alt="SapientHR Logo" className="h-3 sm:h-3.5 lg:h-4 object-contain" />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} className="hover:text-amber-600 transition-colors whitespace-nowrap">
                            {link.name}
                        </a>
                    ))}
                    <Link
                        to="/contact"
                        className="px-6 py-2.5 rounded-full font-semibold transition-all duration-300 btn-amber-green text-white shadow-lg whitespace-nowrap"
                    >
                        Contact
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 relative z-10"
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
                        className="lg:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 overflow-hidden shadow-xl"
                    >
                        <div className="px-6 py-10 flex flex-col gap-8 text-lg font-medium">
                            {navLinks.map(link => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-amber-600 transition-colors border-l-2 border-transparent hover:border-amber-600 pl-4"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <Link
                                to="/contact"
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-4 rounded-2xl text-center font-bold btn-amber-green text-white shadow-xl mx-4"
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
