import { Reveal } from './Reveal';
import { Layers, Network, LockKeyhole } from 'lucide-react';

export function Problem() {
    const problems = [
        {
            icon: <Layers className="w-8 h-8" />,
            title: "Decision Bottlenecks",
            desc: "Every move requires layers of sign-off. Market shifts pass by while internal committees debate.",
        },
        {
            icon: <Network className="w-8 h-8" />,
            title: "Information Silos",
            desc: "Data is hoarded, not shared. Departments compete instead of cooperating toward shared goals.",
        },
        {
            icon: <LockKeyhole className="w-8 h-8" />,
            title: "Role Rigidity",
            desc: "Talent is trapped in boxes, not deployed to value. Best people are stuck doing administrative tasks.",
        },
    ];

    return (
        <section id="problem" className="py-40 bg-white text-black px-6 lg:px-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    <div className="col-span-1 lg:col-span-5 flex flex-col justify-center">
                        <Reveal>
                            <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-8 leading-tight">
                                Is Your 1990s Hierarchy Trying to Win in a 2026 Market?
                            </h2>
                            <div className="h-1 w-20 bg-accent-red mb-8"></div>
                            <p className="text-xl text-gray-600 leading-relaxed font-light">
                                Most companies suffer from <strong className="font-semibold text-black">Vertical Fatigue</strong>. When your best talent is paralyzed by red tape and decisions move at the speed of a legacy email thread, your strategy is already failing.
                            </p>
                        </Reveal>
                    </div>

                    <div className="col-span-1 lg:col-span-7">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {problems.map((problem, idx) => (
                                <Reveal
                                    key={idx}
                                    delay={idx * 0.1}
                                    className={`bg-gray-50 border border-gray-200 p-10 transition-colors duration-300 hover:border-black group ${idx === 2 ? 'sm:col-span-2 sm:w-1/2 sm:mx-auto' : ''}`}
                                >
                                    <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center text-black mb-8 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                        {problem.icon}
                                    </div>
                                    <h3 className="text-xl font-bold font-sans mb-4 uppercase tracking-wide">{problem.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        {problem.desc}
                                    </p>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
