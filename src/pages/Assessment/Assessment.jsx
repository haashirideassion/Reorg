import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../../components/Reveal';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, ChevronRight, BarChart3, PieChart, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';

const sections = [
    {
        id: 0,
        title: "Strategy Alignment",
        questions: [
            { text: "Our current organizational structure supports our long-term business strategy.", id: 1 },
            { text: "Our structure enables us to respond quickly to market changes.", id: 2 },
            { text: "Our organization is structured effectively to support innovation and growth.", id: 3 },
            { text: "The current reporting lines align well with strategic priorities.", id: 4 },
            { text: "Our leadership structure supports expansion into new markets or products.", id: 5 }
        ]
    },
    {
        id: 1,
        title: "Decision-Making Efficiency",
        questions: [
            { text: "Decisions are made quickly within our organization.", id: 6 },
            { text: "Managers have clear authority to make operational decisions.", id: 7 },
            { text: "There are minimal unnecessary approval layers in decision-making.", id: 8 },
            { text: "Decision rights are clearly defined across leadership levels.", id: 9 },
            { text: "Escalations are rare because teams are empowered to act.", id: 10 }
        ]
    },
    {
        id: 2,
        title: "Role Clarity & Accountability",
        questions: [
            { text: "Roles and responsibilities across departments are clearly defined.", id: 11 },
            { text: "Employees understand their decision-making authority.", id: 12 },
            { text: "There is minimal duplication of responsibilities across teams.", id: 13 },
            { text: "Accountability for results is clearly assigned.", id: 14 },
            { text: "Employees clearly understand how their work contributes to organizational goals.", id: 15 }
        ]
    },
    {
        id: 3,
        title: "Leadership Effectiveness",
        questions: [
            { text: "The number of leadership layers in our organization is appropriate.", id: 16 },
            { text: "Managers have an effective number of direct reports.", id: 17 },
            { text: "Leaders have sufficient time to focus on strategic priorities.", id: 18 },
            { text: "Leadership responsibilities are clearly defined.", id: 19 },
            { text: "Our leadership structure supports effective communication.", id: 20 }
        ]
    },
    {
        id: 4,
        title: "Collaboration & Culture",
        questions: [
            { text: "Departments collaborate effectively across functions.", id: 21 },
            { text: "Information flows easily across teams.", id: 22 },
            { text: "Our structure supports cross-functional problem solving.", id: 23 },
            { text: "Employees feel empowered to contribute ideas.", id: 24 },
            { text: "Our organizational culture supports agility and adaptability.", id: 25 }
        ]
    }
];

export default function Assessment() {
    const [currentStep, setCurrentStep] = useState(0); // 0-4: Sections, 5: Result
    const [answers, setAnswers] = useState(Array(25).fill(0));
    const containerRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    const handleOptionSelect = (qIdx, value) => {
        const newAnswers = [...answers];
        newAnswers[qIdx] = value;
        setAnswers(newAnswers);
    };

    const getSectionScore = (sectionIdx) => {
        const start = sectionIdx * 5;
        return answers.slice(start, start + 5).reduce((a, b) => a + b, 0);
    };

    const totalScore = answers.reduce((a, b) => a + b, 0);

    const getStatus = (score) => {
        if (score >= 13) return { label: "Green", color: "text-green-600", bg: "bg-green-100", sig: "Optimized state." };
        if (score >= 10) return { label: "Amber", color: "text-amber-600", bg: "bg-amber-100", sig: "Friction exists." };
        return { label: "Red", color: "text-red-600", bg: "bg-red-100", sig: "Critical bottleneck." };
    };

    const overallStatus = totalScore >= 60
        ? { label: "Well Placed", color: "text-green-600", zone: "The Fluid Enterprise", desc: "The organization is high-performing." }
        : totalScore >= 50
            ? { label: "Needs Attention", color: "text-amber-600", zone: "The Friction Zone", desc: "Functional but losing energy to legacy drag." }
            : { label: "Needs Immediate Attention", color: "text-red-600", zone: "Systemic Rigidity", desc: "Structure is actively sabotaging the strategy." };

    const generateRadarPoints = () => {
        const cx = 150, cy = 150, radius = 90, maxScore = 15;
        return sections.map((_, i) => {
            const score = getSectionScore(i);
            const angle = (Math.PI / 2) - (2 * Math.PI * i / 5);
            const val = (score / maxScore);
            const x = cx + val * radius * Math.cos(angle);
            const y = cy - val * radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(" ");
    };

    const canProceed = () => {
        const start = currentStep * 5;
        const sectionAnswers = answers.slice(start, start + 5);
        return sectionAnswers.every(a => a > 0);
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans premium-gradient">
            <Navbar />
            <div className="fixed inset-0 noise-bg z-0 pointer-events-none"></div>

            <main className="relative pt-32 pb-24 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto" ref={containerRef}>
                    <AnimatePresence mode="wait">
                        {currentStep < 5 ? (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="mb-12">
                                    <span className="text-accent-red font-bold uppercase tracking-widest text-sm">Step {currentStep + 1} of 5</span>
                                    <h1 className="text-4xl md:text-5xl font-serif font-medium mt-2">{sections[currentStep].title}</h1>
                                </div>

                                <div className="space-y-8">
                                    {sections[currentStep].questions.map((q, qIdx) => {
                                        const globalIdx = currentStep * 5 + qIdx;
                                        return (
                                            <div key={q.id} className="bg-zinc-50/50 border border-gray-100 p-8 rounded-2xl">
                                                <p className="text-lg font-light mb-6"><span className="font-bold mr-3">{q.id}.</span> {q.text}</p>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {[1, 2, 3].map((val) => (
                                                        <button
                                                            key={val}
                                                            onClick={() => handleOptionSelect(globalIdx, val)}
                                                            className={cn(
                                                                "py-3 px-6 border-2 transition-all duration-300 font-bold uppercase text-xs tracking-widest",
                                                                answers[globalIdx] === val
                                                                    ? "bg-black border-black text-white"
                                                                    : "bg-white border-gray-200 hover:border-black"
                                                            )}
                                                        >
                                                            {val === 1 ? "Disagree" : val === 2 ? "Neutral" : "Agree"}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-12 flex justify-between">
                                    <button
                                        disabled={currentStep === 0}
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        className="flex items-center text-gray-400 hover:text-black transition-colors disabled:opacity-0"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" /> Previous
                                    </button>
                                    <button
                                        disabled={!canProceed()}
                                        onClick={() => setCurrentStep(prev => prev + 1)}
                                        className={cn(
                                            "flex items-center px-10 py-4 font-bold uppercase tracking-widest text-sm transition-all duration-300",
                                            canProceed() ? "bg-black text-white hover:bg-accent-red" : "bg-gray-100 text-gray-300 cursor-not-allowed"
                                        )}
                                    >
                                        {currentStep === 4 ? "Build My Scorecard" : "Next Section"} <ArrowRight className="w-5 h-5 ml-2" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-16"
                            >
                                <div className="text-center">
                                    <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6">RE:ORG Scorecard</h1>
                                    <p className="text-xl text-gray-500 font-light">Your organizational health diagnostic result.</p>
                                </div>

                                {/* Health Gauge (Speedometer) */}
                                <div className="glass p-12 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-64 h-32 overflow-hidden mb-8">
                                            {/* Gauge background */}
                                            <div className="absolute w-64 h-64 border-[16px] border-gray-100 rounded-full"></div>
                                            {/* RAG Overlay */}
                                            <div
                                                className="absolute w-64 h-64 border-[16px] rounded-full"
                                                style={{
                                                    borderColor: 'transparent',
                                                    borderTopColor: totalScore < 50 ? '#ef4444' : totalScore < 60 ? '#f59e0b' : '#22c55e',
                                                    transform: `rotate(${(totalScore / 75) * 180 - 45}deg)`,
                                                    transition: 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                                }}
                                            ></div>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-5xl font-bold">{totalScore}<span className="text-sm text-gray-400 font-light ml-1">/75</span></div>
                                        </div>
                                        <h2 className={cn("text-4xl font-serif font-medium mb-2", overallStatus.color)}>{overallStatus.label}</h2>
                                        <p className="text-xl font-bold uppercase tracking-widest text-black/40 mb-4">{overallStatus.zone}</p>
                                        <p className="text-gray-500 font-light max-w-md mx-auto">{overallStatus.desc}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* 1. Rigidity Radar */}
                                    <div className="glass p-8 rounded-3xl shadow-lg border border-white/40">
                                        <div className="flex items-center gap-3 mb-8">
                                            <Activity className="text-accent-red" />
                                            <h3 className="text-xl font-serif">Rigidity Radar</h3>
                                        </div>
                                        <div className="relative aspect-square">
                                            <svg viewBox="0 0 300 300" className="w-full h-full">
                                                {/* Background Rings */}
                                                {[0.33, 0.66, 1.0].map((scale, sIdx) => {
                                                    const pts = [0, 1, 2, 3, 4].map((i) => {
                                                        const angle = (Math.PI / 2) - (2 * Math.PI * i / 5);
                                                        const x = 150 + scale * 90 * Math.cos(angle);
                                                        const y = 150 - scale * 90 * Math.sin(angle);
                                                        return `${x},${y}`;
                                                    }).join(" ");
                                                    return <polygon key={sIdx} points={pts} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
                                                })}
                                                {/* Axes */}
                                                {[0, 1, 2, 3, 4].map((i) => {
                                                    const angle = (Math.PI / 2) - (2 * Math.PI * i / 5);
                                                    const x = 150 + 90 * Math.cos(angle);
                                                    const y = 150 - 90 * Math.sin(angle);
                                                    return (
                                                        <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                                                    );
                                                })}
                                                {/* Labels */}
                                                {sections.map((sec, i) => {
                                                    const angle = (Math.PI / 2) - (2 * Math.PI * i / 5);
                                                    const lx = 150 + 110 * Math.cos(angle);
                                                    const ly = 150 - 110 * Math.sin(angle);
                                                    return (
                                                        <text key={i} x={lx} y={ly} fontSize="10" textAnchor="middle" fill="#9ca3af" fontWeight="bold">
                                                            {sec.id + 1}
                                                        </text>
                                                    );
                                                })}
                                                {/* Data Polygon */}
                                                <motion.polygon
                                                    points={generateRadarPoints()}
                                                    fill={totalScore < 50 ? '#ef4444' : totalScore < 60 ? '#f59e0b' : '#22c55e'}
                                                    fillOpacity="0.2"
                                                    stroke={totalScore < 50 ? '#ef4444' : totalScore < 60 ? '#f59e0b' : '#22c55e'}
                                                    strokeWidth="3"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1, transformOrigin: "150px 150px" }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                />
                                            </svg>
                                        </div>
                                        <div className="mt-8 grid grid-cols-1 gap-2">
                                            {sections.map(s => (
                                                <div key={s.id} className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center">
                                                    <span className="w-4 text-accent-red">{s.id + 1}</span> {s.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Heat Map (The Clog Detector) */}
                                    <div className="glass p-8 rounded-3xl shadow-lg border border-white/40">
                                        <div className="flex items-center gap-3 mb-8">
                                            <BarChart3 className="text-accent-red" />
                                            <h3 className="text-xl font-serif">The Clog Detector</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {sections.map((sec) => {
                                                const score = getSectionScore(sec.id);
                                                const status = getStatus(score);
                                                return (
                                                    <div key={sec.id} className="flex items-center gap-4 bg-white/50 p-4 rounded-xl border border-gray-100">
                                                        <div className={cn("w-3 h-12 rounded-full shrink-0", status.bg.replace('100', '500'))}></div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-bold text-sm">{sec.title}</span>
                                                                <span className={cn("font-bold text-xs uppercase tracking-widest", status.color)}>{status.label}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs text-gray-400 font-light">{status.sig}</span>
                                                                <span className="text-sm font-bold">{score}/15</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black text-white p-12 rounded-[40px] text-center">
                                    <h3 className="text-3xl font-serif mb-6">Discuss Your Result</h3>
                                    <p className="text-gray-400 font-light mb-10 max-w-xl mx-auto">Our experts can help you interpret these findings and build a bespoke transition plan from legacy rigidity to fluid high-performance.</p>
                                    <button
                                        onClick={() => window.location.href = '/contact'}
                                        className="bg-white text-black px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-accent-red hover:text-white transition-all duration-300"
                                    >
                                        Book a Structural Audit
                                    </button>
                                </div>

                                <div className="text-center">
                                    <button onClick={() => setCurrentStep(0)} className="text-gray-400 hover:text-black transition-colors text-sm uppercase font-bold tracking-widest">
                                        Retake Diagnostic
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer hideRebirth={true} />
        </div>
    );
}
