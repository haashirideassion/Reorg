import { Reveal } from './Reveal';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer({ hideRebirth }) {
    return (
        <footer className="relative bg-zinc-50 text-black pt-20 pb-12 overflow-hidden px-6 lg:px-8">
            {/* Decorative clinical grid */}
            <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zOSA0MHYtNDBtLTQwIDM5aDQwIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-60"></div>

            <div className="relative max-w-7xl mx-auto text-center">
                {!hideRebirth && (
                    <Reveal>
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-medium leading-tight mb-6 text-black">
                            Ready for a Rebirth?
                        </h2>

                        <p className="text-gray-500 font-light text-xl mb-12 max-w-2xl mx-auto">
                            <strong className="font-semibold text-black">SapientHR</strong>: Specializing in the transition from legacy rigidity to fluid high-performance.
                        </p>

                        <Link
                            to="/contact"
                            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold tracking-wide uppercase text-sm btn-amber-green text-white shadow-xl"
                        >
                            <span className="flex items-center">
                                Book a Discovery Session
                                <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </Link>
                    </Reveal>
                )}


                <div className={`pt-12 flex flex-col md:flex-row items-center justify-between text-gray-500 ${!hideRebirth ? "mt-40 border-t border-gray-200" : ""}`}>
                    <Link to="/" className="flex items-center justify-center md:justify-start gap-4 mb-6 md:mb-0 hover:opacity-80 transition-opacity">
                        <img src="/sapienthr.png" alt="SapientHR Logo" className="h-6 sm:h-8 object-contain" />
                        <div className="h-6 sm:h-8 w-px bg-gray-300"></div>
                        <div className="font-serif font-bold text-xl sm:text-2xl tracking-wide text-black">
                            RE:ORG<span className="text-gray-400 font-sans text-xs sm:text-sm font-normal tracking-normal ml-1 hidden sm:inline">.consulting</span>
                        </div>
                    </Link>

                    <div className="flex gap-8 mb-6 md:mb-0 text-sm font-medium">
                        <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
                    </div>

                    <p className="text-sm font-light">
                        &copy; {new Date().getFullYear()} RE-ORG by SapientHR. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
