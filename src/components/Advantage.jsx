import { Reveal } from './Reveal';
import { Target, RefreshCw, BarChart } from 'lucide-react';

export function Advantage() {
    return (
        <section className="py-40 bg-white text-black px-6 lg:px-8 overflow-hidden border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    <Reveal direction="left" className="order-2 lg:order-1">
                        <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-8 leading-tight">
                            Our Focus: <br className="hidden sm:block" />
                            <span className="text-gray-900 border-b-2 border-accent-red font-bold">Outcome</span> →{' '}
                            <span className="text-gray-900 border-b-2 border-amber-500 font-bold">Transformation</span> →{' '}
                            <span className="text-gray-900 border-b-2 border-green-600 font-bold">Efficiency</span>.
                        </h2>
                        <div className="text-xl text-gray-600 font-light space-y-6 leading-relaxed">
                            <p>
                                <strong className="font-semibold text-black">SapientHR</strong> doesn't just redraw your org chart. We study your current design and propose a total redesign that strengthens leadership accountability and enables sustainable growth.
                            </p>
                            <p>
                                We treat your organization as a living organism, not a static list of isolated roles.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal direction="right" className="order-1 lg:order-2 flex justify-center">
                        <div className="relative w-full max-w-md bg-gray-50 border border-gray-200 p-12">
                            <div className="flex flex-col gap-10 relative">

                                {/* Connecting Line */}
                                <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gray-200 z-0"></div>

                                <div className="relative z-10 flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-full border-2 border-accent-red bg-white flex items-center justify-center text-accent-red group-hover:bg-accent-red group-hover:text-white transition-colors duration-300">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold uppercase tracking-wider text-black">Outcome</h4>
                                        <p className="text-sm text-gray-500 font-light">Defining the strategic vector.</p>
                                    </div>
                                </div>

                                <div className="relative z-10 flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-white flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                                        <RefreshCw className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold uppercase tracking-wider text-black">Transformation</h4>
                                        <p className="text-sm text-gray-500 font-light">Architecting the rebirth.</p>
                                    </div>
                                </div>

                                <div className="relative z-10 flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-full border-2 border-green-600 bg-white flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                        <BarChart className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold uppercase tracking-wider text-black">Efficiency</h4>
                                        <p className="text-sm text-gray-500 font-light">Sustaining the "Green" state.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
}
