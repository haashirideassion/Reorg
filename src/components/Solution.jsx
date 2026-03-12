import { Reveal } from './Reveal';
import { Search, GitMerge, Lightbulb, Users, LineChart } from 'lucide-react';

const steps = [
    { prefix: "S", title: "CAN", desc: "Audit & Diagnosis of the existing friction points preventing operational flow.", icon: <Search className="w-6 h-6" /> },
    { prefix: "H", title: "ARMONIZE", desc: "Aligning your overarching Strategy & organizational Structure flawlessly.", icon: <GitMerge className="w-6 h-6" /> },
    { prefix: "I", title: "NNOVATE", desc: "Designing a robust, modern, and highly fluid Target Operating Model.", icon: <Lightbulb className="w-6 h-6" /> },
    { prefix: "F", title: "ACILITATE", desc: "Actively managing the complex Change & Transition process efficiently.", icon: <Users className="w-6 h-6" /> },
    { prefix: "T", title: "RACK", desc: "Monitoring Performance metrics & Stabilizing the new 'Green' operational state.", icon: <LineChart className="w-6 h-6" /> },
];

export function Solution() {
    return (
        <section id="shift" className="py-40 bg-zinc-50 text-black px-6 lg:px-8 border-b border-gray-200">
            <div className="max-w-5xl mx-auto">
                <Reveal className="text-center mb-24">
                    <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-6">From Diagnosis to Durability.</h2>
                    <div className="h-1 w-20 bg-accent-red mx-auto mb-8"></div>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        RE:ORG is a surgical intervention using our signature <strong className="font-semibold text-black">SHIFT framework</strong> to align your structure, leadership, and governance with your desired outcomes.
                    </p>
                </Reveal>

                <div className="relative pl-8 sm:pl-16 border-l border-gray-300">
                    {steps.map((step, idx) => (
                        <Reveal key={idx} delay={idx * 0.1} className="relative mb-16 last:mb-0 group flex flex-col sm:flex-row">

                            {/* Sharp Clinical Icon */}
                            <div className="absolute -left-8 sm:-left-16 top-0 transform -translate-x-1/2 w-16 h-16 bg-white border border-gray-200 shadow-sm flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                                {step.icon}
                            </div>

                            <div className="flex-1 bg-white border border-gray-200 p-8 sm:p-10 ml-12 sm:ml-12 group-hover:border-accent-red group-hover:shadow-[5px_5px_0_theme('colors.accent.red')] transition-all duration-300">
                                <h3 className="text-2xl sm:text-3xl font-sans font-bold mb-4 tracking-widest uppercase text-gray-900 border-b border-gray-100 pb-4 inline-block">
                                    <span className="text-accent-red">{step.prefix}</span>{step.title}
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed font-light mt-4">
                                    {step.desc}
                                </p>
                            </div>

                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
