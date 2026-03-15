import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal } from '../../components/Reveal';
import { ArrowRight } from 'lucide-react';

const sections = [
    { key: "Alignment" }, { key: "Agility" },
    { key: "Bottlenecks" }, { key: "Autonomy" },
    { key: "Mobility" }, { key: "Shadow Org" },
    { key: "Focus" }, { key: "Pulse" },
    { key: "Sacred Cows" }, { key: "Snap-Back" }
];

export function Diagnostic() {
    // Sample static radar chart points logic
    const answers = [2, 1, 2, 0, 1, 2, 1, 0, 2, 1]; // Mix of red, amber, green for visualization
    const resultMeta = { color: '#f59e0b', title: 'Amber Zone (Gridlock)' };

    const generateRadarPoints = () => {
        const cx = 150, cy = 150, radius = 90;
        let points = [];
        for (let i = 0; i < sections.length; i++) {
            const angle = (Math.PI / 2) - (2 * Math.PI * i / sections.length);
            let val = 1.0;
            if (answers[i] === 0) val = 0.3; // Green
            if (answers[i] === 1) val = 0.6; // Amber
            if (answers[i] === 2) val = 1.0; // Red

            const x = cx + val * radius * Math.cos(angle);
            const y = cy - val * radius * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        return points.join(" ");
    };

    return (
        <section id="diagnostic" className="py-20 md:py-24 bg-zinc-50 text-black px-6 lg:px-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <Reveal direction="left">
                        <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-6">
                            How <span className="text-accent-red font-semibold">Red</span> is your Organization?
                        </h2>
                        <div className="h-1 w-20 bg-accent-red mb-8"></div>
                        <p className="text-gray-600 font-light text-xl mb-6 leading-relaxed">
                            An embedded 5-section quiz covering Strategy, Decision-Making, Role Clarity, Leadership, and Culture.
                        </p>
                        <p className="text-gray-600 font-light text-xl mb-10 leading-relaxed">
                            Complete the assessment to generate a custom <strong className="text-black font-semibold">Rigidity Radar</strong> chart visualizing your operational health. Find out if your structure is driving agility or creating bottlenecks.
                        </p>

                        <Link
                            to="/diagnostic"
                            className="inline-flex items-center px-8 py-4 btn-border-flow text-black font-bold tracking-wide uppercase text-sm shadow-xl transition-all duration-300"
                        >
                            Start Diagnostic
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </Reveal>

                    <Reveal direction="right" delay={0.2} className="flex justify-center">
                        <div className="glass border border-white/40 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-3xl backdrop-blur-2xl relative w-full max-w-lg flex flex-col items-center">
                            {/* Decorative badge */}
                            <div className="absolute -top-4 -right-4 bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest py-2 px-4 shadow-sm rounded-full pointer-events-none z-10">
                                Sample Output
                            </div>

                            <h3 className="font-serif text-2xl mb-8 font-medium">Rigidity Radar</h3>
                            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
                                <svg viewBox="0 0 300 300" className="w-full h-full">
                                    {/* Background Web Rings */}
                                    {[0.3, 0.6, 1.0].map((scale, sIdx) => {
                                        const pts = sections.map((_, i) => {
                                            const angle = (Math.PI / 2) - (2 * Math.PI * i / 10);
                                            const x = 150 + scale * 90 * Math.cos(angle);
                                            const y = 150 - scale * 90 * Math.sin(angle);
                                            return `${x},${y}`;
                                        }).join(" ");
                                        return <polygon key={sIdx} points={pts} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
                                    })}

                                    {/* Axes and Labels */}
                                    {sections.map((sec, i) => {
                                        const angle = (Math.PI / 2) - (2 * Math.PI * i / 10);
                                        const x2 = 150 + 90 * Math.cos(angle);
                                        const y2 = 150 - 90 * Math.sin(angle);
                                        const labelX = 150 + 115 * Math.cos(angle);
                                        const labelY = 150 - 110 * Math.sin(angle);

                                        return (
                                            <g key={i}>
                                                <line x1="150" y1="150" x2={x2} y2={y2} stroke="#e2e8f0" strokeWidth="1" />
                                                <text x={labelX} y={labelY + 4} fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">
                                                    {sec.key.toUpperCase()}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Data Polygon */}
                                    <motion.polygon
                                        points={generateRadarPoints()}
                                        fill={resultMeta.color}
                                        fillOpacity="0.2"
                                        stroke={resultMeta.color}
                                        strokeWidth="3"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1, transformOrigin: "150px 150px" }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </svg>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
