import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ArrowRight, ArrowLeft, CheckCircle2, Activity, BarChart3, HelpCircle, Send, User, Mail, AlertCircle, X, Shield, Zap, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

const sections = [
    {
        id: 0,
        title: "The Bottleneck Reality Check",
        questions: [
            {
                text: "What percentage of critical business decisions currently require your personal sign-off?",
                id: 1,
                options: [
                    { val: 1, label: "< 10% (Autonomous)", desc: "Decisions happen at the source." },
                    { val: 2, label: "10-40% (Managed)", desc: "Balanced oversight." },
                    { val: 3, label: "> 40% (Bottleneck)", desc: "Everything waits for you." }
                ]
            },
            {
                text: "Information Flow: Do you feel you are usually the last to know about a frontline failure?",
                id: 2,
                options: [
                    { val: 1, label: "Real-time Pulse", desc: "I know as it happens." },
                    { val: 2, label: "Scheduled Updates", desc: "Caught in formal meetings." },
                    { val: 3, label: "Lagging/Surprise", desc: "I find out when it's too late." }
                ]
            },
            {
                text: "Meeting Burden: Time spent 'reporting status' vs 'solving problems'?",
                id: 3,
                options: [
                    { val: 1, label: "Strategy First", desc: "Mostly solving & executing." },
                    { val: 2, label: "Mixed Bag", desc: "Half and half." },
                    { val: 3, label: "Status Heavy", desc: "Endless reporting loops." }
                ]
            }
        ]
    },
    {
        id: 1,
        title: "Legacy vs. Fluidity",
        questions: [
            {
                text: "Role Rigidity: Difficulty in forming a cross-functional task force for a project?",
                id: 4,
                options: [
                    { val: 1, label: "Fluid", desc: "Talent moves where needed instantly." },
                    { val: 2, label: "Frictional", desc: "Requires negotiation with heads." },
                    { val: 3, label: "Rigid", desc: "Departments 'own' their people." }
                ]
            },
            {
                text: "The Shadow Org: When things get done quickly, is it because people follow process or 'know who to call'?",
                id: 5,
                options: [
                    { val: 1, label: "Formal Agility", desc: "Systems actually work." },
                    { val: 2, label: "Mixed Pathways", desc: "A bit of both." },
                    { val: 3, label: "Shadow Reliance", desc: "Backchannels are the only way." }
                ]
            },
            {
                text: "Tolerance for Autonomy: Comfort with a mid-level manager making a $10,000 mistake?",
                id: 6,
                options: [
                    { val: 1, label: "Highly Comfortable", desc: "Mistakes are learning costs (10/10)." },
                    { val: 2, label: "Somewhat Uneasy", desc: "Okay if explained (5/10)." },
                    { val: 3, label: "Not Comfortable", desc: "Requires prior approval (1/10)." }
                ],
                isAutonomyQ: true
            }
        ]
    },
    {
        id: 2,
        title: "The Rebirth Cultural Climate",
        questions: [
            {
                text: "The Sacred Cows: Presence of 'untouchable' inefficient processes due to tradition?",
                id: 7,
                options: [
                    { val: 1, label: "None", desc: "Everything is open to audit." },
                    { val: 2, label: "Few", desc: "Some historical artifacts remain." },
                    { val: 3, label: "Widespread", desc: "Politics protect the outdated." }
                ]
            },
            {
                text: "Talent Mobility: Do managers 'hoard' their best people or encourage movement?",
                id: 8,
                options: [
                    { val: 1, label: "Values Mobility", desc: "People move to high-value areas." },
                    { val: 2, label: "Occasional Moves", desc: "Some hoarding occurs." },
                    { val: 3, label: "High Hoarding", desc: "Best talent is 'locked' in silos." }
                ]
            },
            {
                text: "The 'Snap-Back' Risk: Does the organization revert to old ways after change?",
                id: 9,
                options: [
                    { val: 1, label: "Evolves", desc: "Change stickiness is high." },
                    { val: 2, label: "Struggles", desc: "Reverts slightly over time." },
                    { val: 3, label: "Snaps Back", desc: "Strong 'immune response' to change." }
                ]
            }
        ]
    }
];

export default function ReadinessAssessment() {
    const [activeSection, setActiveSection] = useState(0);
    const [answers, setAnswers] = useState(Array(9).fill(0));
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '' });
    const [validationErrors, setValidationErrors] = useState([]);

    const questionRefs = useRef([]);
    const resultRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeSection, showResult, showLeadForm]);

    const handleOptionSelect = (qIdx, value) => {
        const newAnswers = [...answers];
        newAnswers[qIdx] = value;
        setAnswers(newAnswers);

        // Scroll to next question within section
        const sectionQIdx = qIdx % 3;
        if (sectionQIdx < 2) {
            setTimeout(() => {
                questionRefs.current[qIdx + 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    };

    const isSectionComplete = (sIdx) => {
        if (sIdx < 0) return false;
        const start = sIdx * 3;
        return answers.slice(start, start + 3).every(a => a !== 0);
    };

    const progress = (answers.filter(a => a !== 0).length / 9) * 100;

    const calculateReadiness = () => {
        // Bottleneck factors (Q1, Q3) - High val = Low Readiness
        // Reality check factors (Q4, Q5) - High val = High Readiness (recognizing frustration)
        // Autonomy (Q6) - Low val = High Readiness

        const bottleneckScore = answers[0] + answers[2]; // Max 6
        const frustrationScore = answers[3] + answers[4]; // Max 6
        const autonomyVal = answers[5]; // 1 is high comfort, 3 is low

        const totalRaw = answers.reduce((a, b) => a + b, 0);

        let status = "Moderate Readiness";
        let color = "text-amber-600";
        let desc = "You recognize the friction, but are still holding onto legacy controls.";

        if (bottleneckScore >= 5 || totalRaw > 20) {
            status = "Low Readiness";
            color = "text-red-500";
            desc = "You may want the results of a RE:ORG without the discomfort of losing control.";
        } else if (frustrationScore >= 5 || totalRaw < 15) {
            status = "High Readiness";
            color = "text-green-600";
            desc = "You recognize the massive cost of the status quo and are ready for a RE:VAMP.";
        }

        // Blind Spot logic
        const hasBlindSpot = autonomyVal === 1 && answers[0] === 3; // Comfort is 10/10 but sign-off is High

        return { status, color, desc, hasBlindSpot };
    };

    const handleFinalSubmit = () => {
        const missed = [];
        answers.forEach((ans, idx) => {
            if (ans === 0) {
                const sIdx = Math.floor(idx / 3);
                const qIdx = idx % 3;
                missed.push({
                    sIdx,
                    sectionTitle: sections[sIdx].title,
                    qNum: qIdx + 1,
                    globalIdx: idx
                });
            }
        });

        if (missed.length > 0) {
            setValidationErrors(missed);
        } else {
            setValidationErrors([]);
            setShowLeadForm(true);
        }
    };

    const readiness = calculateReadiness();

    if (showResult) {
        return (
            <div className="min-h-screen flex flex-col bg-white text-black font-sans premium-gradient">
                <Navbar />
                <main className="relative flex-1 pt-32 pb-24 px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto" ref={resultRef}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-16"
                        >
                            <div className="text-center">
                                <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4">Readiness Profile</h1>
                                <p className="text-xl text-gray-500 font-light italic">Prepared for: {userData.name}</p>
                            </div>

                            <div className="glass p-12 rounded-[40px] text-center shadow-2xl relative overflow-hidden border-t-8 border-green-500">
                                <h2 className={cn("text-4xl font-serif font-medium mb-4", readiness.color)}>{readiness.status}</h2>
                                <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-8">
                                    {readiness.desc}
                                </p>

                                {readiness.hasBlindSpot && (
                                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-left flex gap-4 items-start">
                                        <AlertCircle className="text-amber-600 shrink-0 w-6 h-6" />
                                        <div>
                                            <h4 className="font-bold text-amber-800 uppercase tracking-widest text-xs mb-1">SapientHR Tip: Blind Spot Detected</h4>
                                            <p className="text-amber-700 text-sm">
                                                You expressed maximum comfort with autonomy but still require high personal sign-offs. This disconnect suggests your structural reality is lagging behind your leadership intent.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass p-8 rounded-3xl text-center">
                                    <Zap className="w-8 h-8 mx-auto mb-4 text-green-500" />
                                    <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-2">Momentum</h3>
                                    <p className="text-2xl font-serif">Accelerated</p>
                                </div>
                                <div className="glass p-8 rounded-3xl text-center">
                                    <Shield className="w-8 h-8 mx-auto mb-4 text-green-500" />
                                    <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-2">Risk Level</h3>
                                    <p className="text-2xl font-serif">Calculated</p>
                                </div>
                                <div className="glass p-8 rounded-3xl text-center">
                                    <RefreshCw className="w-8 h-8 mx-auto mb-4 text-green-500" />
                                    <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-2">Next Phase</h3>
                                    <p className="text-2xl font-serif">RE:VAMP</p>
                                </div>
                            </div>

                            <div className="text-center pt-8">
                                <button
                                    onClick={() => window.location.href = '/contact'}
                                    className="inline-flex items-center justify-center gap-2 px-12 py-5 bg-green-600 text-white font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-green-700 transition-colors rounded-full"
                                >
                                    Discuss Your Results
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <Footer hideRebirth={true} />
            </div>
        );
    }

    if (showLeadForm) {
        return (
            <div className="min-h-screen flex flex-col bg-white text-black font-sans premium-gradient">
                <Navbar />
                <main className="relative flex-1 flex items-center justify-center pt-32 pb-24 px-6">
                    <div className="max-w-md w-full glass p-10 rounded-[40px] shadow-2xl text-center relative overflow-hidden border-t-8 border-green-500">
                        <h2 className="text-3xl font-serif mb-6">Discovery Awaits</h2>
                        <p className="text-gray-500 font-light mb-10">We'll analyze your readiness markers and prepare your cultural climate profile.</p>

                        <div className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Name</label>
                                <div className="relative text-gray-400 focus-within:text-black transition-colors">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-600 outline-none transition-all font-light rounded-xl"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Professional Email</label>
                                <div className="relative text-gray-400 focus-within:text-black transition-colors">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        type="email"
                                        placeholder="john@company.com"
                                        className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-600 outline-none transition-all font-light rounded-xl"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => (userData.name && userData.email) && setShowResult(true)}
                                disabled={!userData.name || !userData.email}
                                className={cn(
                                    "w-full py-5 font-bold uppercase tracking-widest text-sm mt-4 flex items-center justify-center gap-3 transition-all rounded-full",
                                    (userData.name && userData.email) ? "bg-green-600 text-white shadow-xl hover:bg-green-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                Get Readiness Profile <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </main>
                <Footer hideRebirth={true} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-black font-sans premium-gradient transition-all duration-700">
            <Navbar />
            <div className="fixed inset-0 noise-bg z-0 pointer-events-none"></div>

            <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100">
                <motion.div
                    className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <main className="relative flex-1 pt-24 sm:pt-48 pb-24 px-4 sm:px-8 lg:px-12 overflow-x-hidden">
                <div className="max-w-4xl mx-auto w-full">
                    {/* Tabs / Stage Line */}
                    <div className="relative mb-8 sm:mb-24 max-w-2xl mx-auto px-10">
                        {/* Global Centered Title for Mobile */}
                        <div className="sm:hidden text-center mb-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="inline-block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] text-green-600 bg-white/90 px-4 py-1.5 rounded-full border border-green-100"
                                >
                                    {sections[activeSection].title}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="relative flex justify-between items-center bg-white/60 py-4 px-2 rounded-full">
                            <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-100 -translate-y-1/2"></div>
                            {sections.map((s, idx) => {
                                const isAccessible = true; // Unrestricted jumping allowed
                                const isCurrent = activeSection === idx;
                                const isDone = isSectionComplete(idx);

                                return (
                                    <div key={s.id} className="relative flex flex-col items-center group shrink-0 px-2 sm:px-4">
                                        <AnimatePresence>
                                            {isCurrent && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="hidden sm:block absolute -top-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest transition-opacity text-center w-max px-3 py-1 bg-white/90 rounded-full border border-green-100 z-20 text-green-700"
                                                >
                                                    {s.title}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <button
                                            onClick={() => isAccessible && setActiveSection(idx)}
                                            className={cn(
                                                "px-4 sm:px-6 py-2 rounded-full border-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-500 relative z-10 bg-white shadow-sm overflow-hidden",
                                                isCurrent ? "border-green-600 text-green-600 scale-105 sm:scale-110" :
                                                    isDone ? "bg-green-600 border-green-600 text-white" :
                                                        "border-gray-100 text-gray-300 hover:border-green-200"
                                            )}
                                        >
                                            <span className="hidden sm:inline">Section </span>{idx + 1}
                                        </button>
                                        {/* Name removed from here to be centered globally */}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Centered Section Title below removed */}
                    </div>

                    <div className="relative mt-12 overflow-hidden w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-24 pb-32"
                            >
                                {sections[activeSection].questions.map((q, qIdx) => {
                                    const globalIdx = activeSection * 3 + qIdx;
                                    const hasAnswer = answers[globalIdx] !== 0;
                                    return (
                                        <div
                                            key={q.id}
                                            ref={el => questionRefs.current[globalIdx] = el}
                                            className="space-y-12"
                                        >
                                            <div className="flex items-start gap-8">
                                                <div className={cn(
                                                    "w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-serif text-lg sm:text-2xl shrink-0 transition-all duration-500",
                                                    hasAnswer ? "bg-green-600 text-white shadow-xl rotate-[360deg]" : "bg-gray-50 border border-gray-100 text-gray-300"
                                                )}>
                                                    0{qIdx + 1}
                                                </div>
                                                <h3 className="text-xl md:text-3xl font-serif font-light leading-snug pt-1">
                                                    {q.text}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-0 md:pl-22">
                                                {q.options.map(opt => {
                                                    const isActive = answers[globalIdx] === opt.val;
                                                    return (
                                                        <button
                                                            key={opt.val}
                                                            onClick={() => handleOptionSelect(globalIdx, opt.val)}
                                                            className={cn(
                                                                "group text-center p-6 rounded-[32px] border-2 transition-all duration-300 relative overflow-hidden",
                                                                isActive
                                                                    ? "border-green-600 bg-green-50/30 scale-[1.05] shadow-xl"
                                                                    : "bg-white border-gray-50 hover:border-green-200"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors",
                                                                isActive ? "text-green-600" : "text-gray-400 group-hover:text-green-500"
                                                            )}>
                                                                {opt.label}
                                                            </div>
                                                            <div className={cn(
                                                                "text-sm font-light leading-relaxed transition-colors",
                                                                isActive ? "text-black" : "text-gray-500"
                                                            )}>
                                                                {opt.desc}
                                                            </div>
                                                            {isActive && (
                                                                <div className="absolute top-4 right-4 text-green-600">
                                                                    <CheckCircle2 className="w-5 h-5" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="pt-16 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-gray-100">
                                    <button
                                        onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                                        disabled={activeSection === 0}
                                        className="order-2 sm:order-1 inline-flex items-center gap-2 px-8 py-4 text-gray-400 hover:text-green-600 font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-0"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Previous Section
                                    </button>

                                    {activeSection === 2 ? (
                                        <button
                                            onClick={handleFinalSubmit}
                                            className="order-1 sm:order-2 w-full sm:w-auto px-12 py-5 bg-green-600 text-white font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-green-700 transition-all rounded-full flex items-center justify-center gap-3"
                                        >
                                            Generate Readiness Profile <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setActiveSection(activeSection + 1)}
                                            className="order-1 sm:order-2 w-full sm:w-auto px-12 py-5 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold uppercase tracking-widest text-sm transition-all rounded-full flex items-center justify-center gap-3"
                                        >
                                            Next Section <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer hideRebirth={true} />

            {/* Validation Alerts */}
            <AnimatePresence>
                {validationErrors.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg z-[60] px-6"
                    >
                        <div className="bg-white border-2 border-red-100 p-8 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4 text-red-600">
                                    <AlertCircle className="w-7 h-7" />
                                    <h4 className="font-bold uppercase tracking-[0.2em] text-sm">Action Required</h4>
                                </div>
                                <button onClick={() => setValidationErrors([])} className="text-gray-300 hover:text-black transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-gray-500 font-light mb-6">Please complete the following questions to see your profile:</p>
                            <div className="grid grid-cols-1 gap-2">
                                {validationErrors.map((err, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setActiveSection(err.sIdx);
                                            setValidationErrors([]);
                                            setTimeout(() => {
                                                questionRefs.current[err.globalIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }, 500);
                                        }}
                                        className="w-full text-left text-xs bg-gray-50 p-3 rounded-xl border border-transparent hover:border-red-200 transition-all flex justify-between items-center group"
                                    >
                                        <span className="font-medium text-gray-700">{err.sectionTitle}</span>
                                        <span className="text-red-500 font-bold tracking-widest uppercase flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                            Q{err.qNum} <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
