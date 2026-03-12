import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from './Reveal';
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

const sections = [
    {
        id: 0,
        title: "The Bottleneck Reality Check",
        questions: [
            {
                globalIndex: 0,
                key: "Decisions",
                text: "What percentage of critical business decisions currently require your personal sign-off? If you were offline for 48 hours, which 3 key processes would come to a complete standstill?",
                options: [
                    { text: "< 20% (Delegated to enablement leads)", points: 0 },
                    { text: "20% - 50% (A moderate amount)", points: 2 },
                    { text: "> 50% (If I'm offline, 3 key processes stop)", points: 4 }
                ]
            },
            {
                globalIndex: 1,
                key: "Information",
                text: "Do you feel you are usually the last to know about a frontline failure, or do you have a 'real-time' pulse?",
                options: [
                    { text: "Real-time pulse without formal meetings.", points: 0 },
                    { text: "Some lag, but mostly informed.", points: 2 },
                    { text: "Last to know / reliant on formal reporting.", points: 4 }
                ]
            },
            {
                globalIndex: 2,
                key: "Meetings",
                text: "What percentage of your leadership team's week is spent 'reporting status' versus 'solving problems' or 'executing'?",
                options: [
                    { text: "Mostly executing & problem solving.", points: 0 },
                    { text: "Balanced mix of reporting and action.", points: 2 },
                    { text: "Mostly reporting status in recurring meetings.", points: 4 }
                ]
            }
        ]
    },
    {
        id: 1,
        title: "Legacy vs. Fluidity",
        questions: [
            {
                globalIndex: 3,
                key: "Rigidity",
                text: "If a crucial project emerged today, how difficult would it be to pull your best talent into a cross-functional task force?",
                options: [
                    { text: "Very easy. Talent deployment is dynamic.", points: 0 },
                    { text: "Requires some effort and negotiation.", points: 2 },
                    { text: "Extremely difficult (trapped in departments).", points: 4 }
                ]
            },
            {
                globalIndex: 4,
                key: "Shadow Org",
                text: "When things actually get done quickly, is it because people followed formal process, or 'knew who to call'?",
                options: [
                    { text: "Formal processes are efficient and work.", points: 0 },
                    { text: "Mix of process and personal networks.", points: 2 },
                    { text: "We bypass the system entirely to deliver.", points: 4 }
                ]
            },
            {
                globalIndex: 5,
                key: "Autonomy",
                text: "On a scale of 1–10, how comfortable are you with a mid-level manager making a $10,000 mistake without permission?",
                options: [
                    { text: "8-10 (High comfort with controlled risk).", points: 0 },
                    { text: "4-7 (Some hesitance, highly situational).", points: 2 },
                    { text: "1-3 (Low comfort, strict oversight is required).", points: 4 }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "The 'Rebirth' Cultural Climate",
        questions: [
            {
                globalIndex: 6,
                key: "Sacred Cows",
                text: "Which department or process is currently 'untouchable' because of tradition or internal politics?",
                options: [
                    { text: "None. Everything can be optimized.", points: 0 },
                    { text: "A few areas are sensitive but manageable.", points: 2 },
                    { text: "Major 'untouchables' actively block change.", points: 4 }
                ]
            },
            {
                globalIndex: 7,
                key: "Mobility",
                text: "Do your managers 'hoard' their best people, or is talent efficiently moved to where the highest value is created?",
                options: [
                    { text: "Fluid mobility based on business value.", points: 0 },
                    { text: "Some sharing, but mostly localized.", points: 2 },
                    { text: "Managers hoard their best talent fiercely.", points: 4 }
                ]
            },
            {
                globalIndex: 8,
                key: "Snap-Back",
                text: "In previous change attempts, what was the primary 'immune response' mechanism?",
                options: [
                    { text: "None, we sustain transformations well.", points: 0 },
                    { text: "Partial snap-back over time.", points: 2 },
                    { text: "Total relapse to the old status quo.", points: 4 }
                ]
            }
        ]
    }
];

export function Diagnostic() {
    const topRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(-1); // -1: Intro, 0: Section 1, 1: Section 2, 2: Section 3, 3: Result
    const [answers, setAnswers] = useState(Array(9).fill(-1));

    useEffect(() => {
        if (currentStep >= 0 && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentStep]);

    // Math logic
    const calculateScore = () => {
        let score = 0;
        // Flat map questions to get points
        const allQuestions = sections.flatMap(s => s.questions);
        answers.forEach((ans, idx) => {
            if (ans !== -1) score += allQuestions[idx].options[ans].points;
        });
        // 9 questions * 4 max points = 36 max points
        return Math.round((score / 36) * 100);
    };

    const handleNext = () => {
        setCurrentStep(curr => curr + 1);
    };

    const handlePrev = () => {
        if (currentStep >= 0) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const selectOption = (globalIdx, optionIdx) => {
        const newAnswers = [...answers];
        newAnswers[globalIdx] = optionIdx;
        setAnswers(newAnswers);
    };

    // Check if current section is fully answered
    const canProceedSection = () => {
        if (currentStep === -1) return true;
        if (currentStep >= 3) return false;
        const currentSectionQs = sections[currentStep].questions;
        return currentSectionQs.every(q => answers[q.globalIndex] !== -1);
    };

    const canProceed = canProceedSection();

    // Calculate Progress Percent
    let progressPercent = 0;
    if (currentStep === 3) {
        progressPercent = 100;
    } else if (currentStep > -1) {
        progressPercent = (currentStep / sections.length) * 100;
    }

    const score = calculateScore();
    let resultMeta = { color: '#dc2626', title: 'Critically Red', desc: 'Your structure is actively strangling your strategy. Vertical fatigue is severe, and an operational rebirth is highly recommended.' };

    if (score < 25) {
        resultMeta = { color: '#16a34a', title: 'Operating in the Green', desc: 'Your organization demonstrates high velocity and low structural friction. Strategy is well-aligned with execution.' };
    } else if (score < 60) {
        resultMeta = { color: '#f59e0b', title: 'Amber Zone (Gridlock)', desc: 'You have significant operational drag. Certain departments are siloing data and delaying critical decisions.' };
    }

    // Analysis Logic Flags based on specific answers
    const isLowReadiness = answers[0] === 2 && answers[2] === 2;
    const isHighReadiness = answers[3] === 2 && answers[4] === 2;
    const isBlindSpot = answers[5] === 0 && answers[0] === 2;

    // Generate SVG Radar vertices dynamically based on 9 questions
    const generateRadarPoints = () => {
        if (currentStep < 3) return "";
        const cx = 150, cy = 150, radius = 90;
        const allQuestions = sections.flatMap(s => s.questions);

        let points = [];
        for (let i = 0; i < allQuestions.length; i++) {
            const angle = (Math.PI / 2) - (2 * Math.PI * i / allQuestions.length);
            // Map points (0, 2, 4) to radius scale (0.3 to 1.0)
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

    const renderTabs = () => {
        if (currentStep === -1 || currentStep === 3) return null;
        return (
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
                {sections.map((sec, idx) => (
                    <button
                        key={sec.id}
                        disabled={idx > currentStep} // Can't skip ahead without answering
                        onClick={() => setCurrentStep(idx)}
                        className={cn(
                            "whitespace-nowrap py-4 px-6 text-sm font-bold uppercase tracking-widest transition-colors border-b-2",
                            currentStep === idx
                                ? "border-black text-black"
                                : idx < currentStep
                                    ? "border-transparent text-gray-500 hover:text-black cursor-pointer"
                                    : "border-transparent text-gray-300 cursor-not-allowed"
                        )}
                    >
                        {sec.title}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <section id="diagnostic" className="py-40 bg-zinc-50 text-black px-6 lg:px-8 border-b border-gray-200">
            <div className="max-w-5xl mx-auto">
                <Reveal className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-6">
                        The RE:ORG Readiness Assessment
                    </h2>
                    <div className="h-1 w-20 bg-accent-red mx-auto mb-8"></div>
                    <p className="text-gray-600 font-light text-xl">
                        A 9-point deep diagnostic covering Delegation, Fluidity, and Cultural Rebirth.
                    </p>
                </Reveal>

                <Reveal delay={0.2}>
                    <div ref={topRef} className="bg-white border border-gray-200 relative shadow-lg scroll-mt-32">
                        {/* Progress Bar (RAG Colored) */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 z-10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-accent-red"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>

                        <div className="p-8 sm:p-12">
                            {renderTabs()}

                            <div className="min-h-[400px]">
                                <AnimatePresence mode="wait">

                                    {currentStep === -1 && (
                                        <motion.div
                                            key="intro"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full flex flex-col items-center justify-center text-center py-20"
                                        >
                                            <h3 className="text-3xl font-serif font-medium mb-6">How <span className="text-accent-red font-semibold">Red</span> is your Organization?</h3>
                                            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto font-light">Determine your true operational state. Are you stalled in the Red, or flowing in the Green?</p>
                                        </motion.div>
                                    )}

                                    {(currentStep >= 0 && currentStep < 3) && (
                                        <motion.div
                                            key={currentStep}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="space-y-12">
                                                {sections[currentStep].questions.map((q, idx) => (
                                                    <div key={q.globalIndex} className="bg-gray-50/50 p-6 sm:p-8 border border-gray-100">
                                                        <h3 className="text-xl sm:text-2xl font-serif mb-6 leading-tight font-medium">
                                                            <span className="text-accent-red mr-2">{q.globalIndex + 1}.</span>
                                                            {q.text}
                                                        </h3>
                                                        <div className="space-y-4">
                                                            {q.options.map((opt, optIdx) => {
                                                                const selected = answers[q.globalIndex] === optIdx;
                                                                return (
                                                                    <button
                                                                        key={optIdx}
                                                                        onClick={() => selectOption(q.globalIndex, optIdx)}
                                                                        className={cn(
                                                                            "w-full text-left p-5 border flex items-center transition-all duration-200 bg-white group",
                                                                            selected
                                                                                ? "border-black shadow-[4px_4px_0_theme('colors.black')]"
                                                                                : "border-gray-200 hover:border-black hover:bg-gray-50"
                                                                        )}
                                                                    >
                                                                        <div className={cn(
                                                                            "w-5 h-5 border mr-4 flex items-center justify-center transition-colors shadow-sm shrink-0",
                                                                            selected ? "border-black" : "border-gray-300"
                                                                        )}>
                                                                            {selected && <div className="w-2 h-2 bg-black" />}
                                                                        </div>
                                                                        <span className={cn("text-lg font-light text-black")}>{opt.text}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 3 && (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-4 flex flex-col items-center"
                                        >
                                            {/* Dynamic Rigidity Radar SVG */}
                                            <div className="relative w-80 h-80 mb-8 mt-6">
                                                <svg viewBox="0 0 300 300" className="w-full h-full">
                                                    {/* Background Web Rings */}
                                                    {[0.3, 0.6, 1.0].map((scale, sIdx) => {
                                                        const pts = sections.flatMap(s => s.questions).map((_, i) => {
                                                            const angle = (Math.PI / 2) - (2 * Math.PI * i / 9);
                                                            const x = 150 + scale * 90 * Math.cos(angle);
                                                            const y = 150 - scale * 90 * Math.sin(angle);
                                                            return `${x},${y}`;
                                                        }).join(" ");
                                                        return <polygon key={sIdx} points={pts} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
                                                    })}

                                                    {/* Axes and Labels */}
                                                    {sections.flatMap(s => s.questions).map((q, i) => {
                                                        const angle = (Math.PI / 2) - (2 * Math.PI * i / 9);
                                                        const x2 = 150 + 90 * Math.cos(angle);
                                                        const y2 = 150 - 90 * Math.sin(angle);
                                                        const labelX = 150 + 115 * Math.cos(angle);
                                                        const labelY = 150 - 110 * Math.sin(angle);

                                                        return (
                                                            <g key={i}>
                                                                <line x1="150" y1="150" x2={x2} y2={y2} stroke="#e2e8f0" strokeWidth="1" />
                                                                <text x={labelX} y={labelY + 4} fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">
                                                                    {q.key.toUpperCase()}
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

                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="bg-white px-3 py-1 text-2xl font-bold border border-gray-100 shadow-sm" style={{ color: resultMeta.color }}>
                                                        {score}%
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-4xl font-serif font-medium mb-4" style={{ color: resultMeta.color }}>
                                                {resultMeta.title}
                                            </h3>
                                            <p className="text-gray-600 text-lg max-w-lg mx-auto mb-10 font-light leading-relaxed">
                                                {resultMeta.desc}
                                            </p>

                                            {/* SapientHR Custom Analysis Blocks */}
                                            {(isBlindSpot || isLowReadiness || isHighReadiness) && (
                                                <div className="max-w-2xl mx-auto mb-10 text-left border border-gray-200 bg-gray-50 p-6 md:p-8">
                                                    <div className="font-bold text-black uppercase tracking-wide text-sm mb-6 border-b border-gray-200 pb-3 flex items-center">
                                                        Sapient<span className="text-accent-red">HR</span> Analysis
                                                    </div>

                                                    <div className="space-y-6">
                                                        {isBlindSpot && (
                                                            <div className="flex items-start text-gray-700">
                                                                <AlertCircle className="w-5 h-5 text-accent-red mt-1 shrink-0 mr-4" />
                                                                <p className="font-light text-sm md:text-base leading-relaxed"><strong className="font-semibold text-black">Leadership Blind Spot:</strong> You specified high comfort with autonomy, but critical decisions still demand your personal sign-off. A structural diagnostic must start here to close this gap.</p>
                                                            </div>
                                                        )}

                                                        {isLowReadiness && (
                                                            <div className="flex items-start text-gray-700">
                                                                <AlertCircle className="w-5 h-5 text-amber-500 mt-1 shrink-0 mr-4" />
                                                                <p className="font-light text-sm md:text-base leading-relaxed"><strong className="font-semibold text-black">Low Transformation Readiness:</strong> Relying directly on personal sign-offs and heavy status reporting suggests a desire for control over enablement. True RE:ORG transformation will require cultural alignment first.</p>
                                                            </div>
                                                        )}

                                                        {isHighReadiness && (
                                                            <div className="flex items-start text-gray-700">
                                                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 shrink-0 mr-4" />
                                                                <p className="font-light text-sm md:text-base leading-relaxed"><strong className="font-semibold text-black">High RE:VAMP Readiness:</strong> Clear frustration with Shadow Orgs and rigid role definitions indicates you already recognize the devastating cost of your current status quo. You are primed for immediate surgical intervention.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <a href="#contact" className="bg-black text-white px-10 py-4 font-bold tracking-wide uppercase text-sm hover:bg-accent-red transition-colors duration-300">
                                                Discuss Your Radar Profile
                                            </a>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>

                            {/* Footer Nav */}
                            {currentStep < 3 && (
                                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                                    {currentStep > -1 ? (
                                        <button onClick={handlePrev} className="flex items-center text-gray-500 hover:text-black font-semibold uppercase text-xs tracking-wider transition-colors">
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Previous Section
                                        </button>
                                    ) : <div />}

                                    <button
                                        onClick={handleNext}
                                        disabled={!canProceed}
                                        className={cn(
                                            "flex items-center px-8 py-4 font-bold tracking-wide uppercase text-sm transition-all duration-300",
                                            canProceed ? "bg-black text-white hover:bg-accent-red" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        )}
                                    >
                                        {currentStep === -1 ? "Start Diagnostic" : currentStep === 2 ? "Calculate Score" : "Next Section"}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
