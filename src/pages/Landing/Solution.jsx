import { Reveal } from '../../components/Reveal';

const steps = [
    { prefix: "S", title: "CAN", desc: "Audit & Diagnosis of the existing friction points preventing operational flow." },
    { prefix: "H", title: "ARMONIZE", desc: "Aligning your overarching Strategy & organizational Structure flawlessly." },
    { prefix: "I", title: "NNOVATE", desc: "Designing a robust, modern, and highly fluid Target Operating Model." },
    { prefix: "F", title: "ACILITATE", desc: "Actively managing the complex Change & Transition process efficiently." },
    { prefix: "T", title: "RACK", desc: "Monitoring Performance metrics & Stabilizing the new 'Green' operational state." },
];

export function Solution() {
    return (
        <section id="shift" className="py-20 md:py-24 bg-zinc-50 text-black px-6 lg:px-8 border-b border-gray-200 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <Reveal className="text-center mb-16 lg:mb-24">
                    <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-6">From Diagnosis to Durability.</h2>
                    <div className="h-1 w-20 bg-accent-red mx-auto mb-8"></div>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        RE:ORG is a surgical intervention using our signature <strong className="font-semibold text-black">SHIFT framework</strong> to align your structure, leadership, and governance with your desired outcomes.
                    </p>
                </Reveal>

                <div className="relative z-10 w-full mt-10">
                    {/* Horizontal Timeline Line for Desktop */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 hidden lg:block z-0"></div>

                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-stretch gap-8 lg:gap-4 relative z-10">
                        {steps.map((step, idx) => (
                            <Reveal
                                key={idx}
                                delay={idx * 0.1}
                                className="group flex flex-col items-center w-full lg:w-1/5 relative"
                            >
                                {/* Timeline Dot (desktop) */}
                                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-accent-red rounded-full -translate-x-1/2 -translate-y-1/2 hidden lg:block z-0 ring-4 ring-zinc-50 group-hover:scale-150 transition-transform duration-500"></div>

                                {/* Vertical Connecting Line (mobile) */}
                                {idx !== steps.length - 1 && (
                                    <div className="absolute top-full left-1/2 w-0.5 h-8 bg-gray-200 -translate-x-1/2 block lg:hidden z-0"></div>
                                )}

                                <div
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                                    }}
                                    className={`glow-card w-full max-w-sm bg-white border border-gray-100 p-8 hover:border-accent-red/30 hover:shadow-2xl hover:shadow-accent-red/5 transition-all duration-500 flex flex-col items-center text-center group-hover:-translate-y-2 z-10 ${idx % 2 === 0 ? 'lg:mb-32 lg:mt-0' : 'lg:mt-32 lg:mb-0'}`}
                                >
                                    <h3 className="flex items-baseline justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                        <span className="text-5xl sm:text-6xl font-serif font-bold text-accent-red leading-none mr-0.5">
                                            {step.prefix}
                                        </span>
                                        <span className="text-xl sm:text-2xl font-sans font-bold tracking-widest uppercase text-gray-900 leading-none">
                                            {step.title}
                                        </span>
                                    </h3>
                                    <div className="w-10 h-0.5 bg-gray-200 mb-4 group-hover:bg-accent-red transition-colors duration-500"></div>
                                    <p className="text-gray-500 text-sm leading-relaxed font-light">
                                        {step.desc}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
