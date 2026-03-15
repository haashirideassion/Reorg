import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../../components/Reveal';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ArrowRight, ArrowLeft, CheckCircle2, Activity, BarChart3, ChevronRight, HelpCircle, Download, Send, User, Mail, Frown, Meh, Smile, ChevronDown, AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    const [activeSection, setActiveSection] = useState(0);
    const [answers, setAnswers] = useState(Array(25).fill(0));
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '' });

    const [validationErrors, setValidationErrors] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const questionRefs = useRef([]);
    const resultRef = useRef(null);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeSection, showResult, showLeadForm]);

    const handleOptionSelect = (qIdx, value) => {
        const newAnswers = [...answers];
        newAnswers[qIdx] = value;
        setAnswers(newAnswers);

        // Scroll to next question within section
        const sectionQIdx = qIdx % 5;
        if (sectionQIdx < 4) {
            setTimeout(() => {
                questionRefs.current[qIdx + 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    };

    const isSectionComplete = (sIdx) => {
        if (sIdx < 0) return false;
        const start = sIdx * 5;
        return answers.slice(start, start + 5).every(a => a !== 0);
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

    const progress = (answers.filter(a => a !== 0).length / 25) * 100;

    const options = [
        { val: 1, label: "Disagree", icon: Frown, activeColor: "bg-red-600 border-red-600", hoverColor: "hover:border-red-600 hover:text-red-600" },
        { val: 2, label: "Neutral", icon: Meh, activeColor: "bg-amber-600 border-amber-600", hoverColor: "hover:border-amber-600 hover:text-amber-600" },
        { val: 3, label: "Agree", icon: Smile, activeColor: "bg-green-600 border-green-600", hoverColor: "hover:border-green-600 hover:text-green-600" }
    ];

    const handleFinalSubmit = () => {
        const missed = [];
        answers.forEach((ans, idx) => {
            if (ans === 0) {
                const sIdx = Math.floor(idx / 5);
                const qIdx = idx % 5;
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

    const downloadPDF = async () => {
        const element = resultRef.current;
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Header
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text('RE:ORG Organizational Health Report', 10, 10);
        pdf.text(`Patient: ${userData.name}`, pdfWidth - 50, 10);

        pdf.addImage(imgData, 'PNG', 0, 15, pdfWidth, pdfHeight);

        // Footer
        pdf.text(`Generated by SapientHR - ${new Date().toLocaleDateString()}`, 10, pdf.internal.pageSize.getHeight() - 10);

        pdf.save('reorg-diagnostic-report.pdf');
    };

    if (showResult) {
        return (
            <div className="min-h-screen flex flex-col bg-white text-black font-sans premium-gradient">
                <Navbar />
                <div className="fixed inset-0 noise-bg z-0 pointer-events-none"></div>

                <main className="relative flex-1 pt-32 pb-24 px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto" ref={resultRef}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-16"
                        >
                            <div className="text-center">
                                <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4">RE:ORG Scorecard</h1>
                                <p className="text-xl text-gray-500 font-light italic">Prepared for: {userData.name}</p>
                            </div>

                            <div className="glass p-12 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                                <div className="flex flex-col items-center">
                                    <div className="relative w-64 h-32 overflow-hidden mb-8">
                                        <div className="absolute w-64 h-64 border-[16px] border-gray-100 rounded-full"></div>
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
                                <div className="glass p-8 rounded-3xl shadow-lg border border-white/40">
                                    <div className="flex items-center gap-3 mb-8">
                                        <Activity className="text-amber-600" />
                                        <h3 className="text-xl font-serif">Rigidity Radar</h3>
                                    </div>
                                    <div className="relative aspect-square">
                                        <svg viewBox="0 0 300 300" className="w-full h-full">
                                            {[0.33, 0.66, 1.0].map((scale, sIdx) => {
                                                const pts = [0, 1, 2, 3, 4].map((i) => {
                                                    const angle = (Math.PI / 2) - (2 * Math.PI * i / 5);
                                                    const x = 150 + scale * 90 * Math.cos(angle);
                                                    const y = 150 - scale * 90 * Math.sin(angle);
                                                    return `${x},${y}`;
                                                }).join(" ");
                                                return <polygon key={sIdx} points={pts} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
                                            })}
                                            {[0, 1, 2, 3, 4].map((i) => {
                                                const angle = (Math.PI / 2) - (2 * Math.PI * i / 5);
                                                const x = 150 + 90 * Math.cos(angle);
                                                const y = 150 - 90 * Math.sin(angle);
                                                return (
                                                    <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                                                );
                                            })}
                                            <motion.polygon
                                                points={generateRadarPoints()}
                                                fill={totalScore < 50 ? '#ef4444' : totalScore < 60 ? '#f59e0b' : '#22c55e'}
                                                fillOpacity="0.2"
                                                stroke={totalScore < 50 ? '#ef4444' : totalScore < 60 ? '#f59e0b' : '#22c55e'}
                                                strokeWidth="3"
                                                animate={{ scale: 1 }}
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="glass p-8 rounded-3xl shadow-lg border border-white/40">
                                    <div className="flex items-center gap-3 mb-8">
                                        <BarChart3 className="text-amber-600" />
                                        <h3 className="text-xl font-serif">The Clog Detector</h3>
                                    </div>
                                    <div className="space-y-4 text-left">
                                        {sections.map((sec) => {
                                            const score = getSectionScore(sec.id);
                                            const status = getStatus(score);
                                            return (
                                                <div key={sec.id} className="flex items-center gap-4 bg-white/50 p-4 rounded-xl border border-gray-100">
                                                    <div className={cn("w-3 h-12 rounded-full shrink-0 shadow-sm", status.label === 'Green' ? 'bg-green-500' : status.label === 'Amber' ? 'bg-amber-500' : 'bg-red-500')}></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-sm tracking-tight">{sec.title}</span>
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

                            {/* Detailed Responses for PDF */}
                            <div className="mt-20 space-y-8 text-left border-t pt-16">
                                <h3 className="text-2xl font-serif mb-8">Detailed Diagnostic Breakdown</h3>
                                {sections.map((sec) => (
                                    <div key={sec.id} className="space-y-4">
                                        <h4 className="text-lg font-bold uppercase tracking-widest text-amber-600 border-b pb-2">{sec.title}</h4>
                                        <div className="space-y-4">
                                            {sec.questions.map((q, qIdx) => {
                                                const globalIdx = sec.id * 5 + qIdx;
                                                const answer = answers[globalIdx];
                                                const optionLabel = options.find(o => o.val === answer)?.label || "N/A";
                                                return (
                                                    <div key={q.id} className="flex justify-between items-start gap-8 bg-gray-50 p-4 rounded-xl">
                                                        <p className="text-sm font-light leading-relaxed flex-1">
                                                            <span className="font-bold mr-2 text-gray-400">{qIdx + 1}.</span>
                                                            {q.text}
                                                        </p>
                                                        <span className={cn(
                                                            "text-xs font-bold uppercase px-3 py-1 rounded-full shrink-0",
                                                            answer === 3 ? "bg-green-100 text-green-700" : answer === 2 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                                        )}>
                                                            {optionLabel}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="max-w-4xl mx-auto mt-16 space-y-8">
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button
                                onClick={downloadPDF}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-border-flow text-black font-bold uppercase tracking-widest text-sm shadow-xl"
                            >
                                <Download className="w-5 h-5" /> Download PDF Report
                            </button>
                            <button
                                onClick={() => window.location.href = '/contact'}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-border-flow text-black font-bold uppercase tracking-widest text-sm shadow-xl"
                            >
                                Book a Structural Audit
                            </button>
                        </div>
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
                    <div className="max-w-md w-full glass p-10 rounded-[40px] shadow-2xl text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 btn-amber-green"></div>
                        <h2 className="text-3xl font-serif mb-6">Almost there!</h2>
                        <p className="text-gray-500 font-light mb-10">Enter your details to generate your customized RIGIDITY RADAR report.</p>

                        <div className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                                <div className="relative text-gray-400 focus-within:text-black transition-colors">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-amber-600 outline-none transition-all font-light"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Business Email</label>
                                <div className="relative text-gray-400 focus-within:text-black transition-colors">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        type="email"
                                        placeholder="john@company.com"
                                        className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-amber-600 outline-none transition-all font-light"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => (userData.name && userData.email) && setShowResult(true)}
                                disabled={!userData.name || !userData.email}
                                className={cn(
                                    "w-full py-5 font-bold uppercase tracking-widest text-sm mt-4 flex items-center justify-center gap-3 transition-all",
                                    (userData.name && userData.email) ? "btn-border-flow text-black shadow-xl" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                View Detailed Report <Send className="w-4 h-4" />
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
                    className="h-full bg-amber-mix shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <main className="relative flex-1 pt-24 sm:pt-48 pb-24 px-4 sm:px-8 lg:px-12 overflow-x-hidden">
                <div className="max-w-4xl mx-auto w-full">
                    {/* Stage Numbered Line for Sections */}
                    <div className="relative mb-8 sm:mb-24 max-w-2xl mx-auto px-10">
                        {/* Global Centered Title for Mobile */}
                        <div className="sm:hidden text-center mb-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="inline-block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-white/90 px-4 py-1.5 rounded-full border border-amber-100"
                                >
                                    {sections[activeSection].title}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="relative flex justify-between items-center bg-white/60 py-4 px-2 rounded-full">
                            <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-100 -translate-y-1/2"></div>
                            {sections.map((s, idx) => {
                                const isAccessible = true; // Unrestricted jumping allowed for review
                                const isCurrent = activeSection === idx;
                                const isDone = isSectionComplete(idx);

                                return (
                                    <div key={s.id} className="relative flex flex-col items-center shrink-0 px-2 sm:px-4">
                                        <AnimatePresence>
                                            {isCurrent && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="hidden sm:block absolute -top-14 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-white/90 px-3 py-1 rounded-full border border-amber-100 z-20"
                                                >
                                                    {s.title}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            onClick={() => isAccessible && setActiveSection(idx)}
                                            disabled={!isAccessible}
                                            className={cn(
                                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 relative z-10 overflow-hidden",
                                                isCurrent ? "bg-white border-amber-mix text-black scale-110 sm:scale-125" :
                                                    isDone ? "bg-amber-500 border-amber-500 text-white" :
                                                        isAccessible ? "bg-white border-gray-200 text-gray-400 hover:border-amber-600" :
                                                            "bg-gray-50 border-gray-100 text-gray-200 cursor-not-allowed"
                                            )}
                                        >
                                            {isDone ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : idx + 1}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Centered Section Title below removed */}
                    </div>

                    <div className="relative overflow-hidden w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-20 pb-32"
                            >
                                {sections[activeSection].questions.map((q, qIdx) => {
                                    const globalIdx = activeSection * 5 + qIdx;
                                    const hasAnswer = answers[globalIdx] !== 0;
                                    return (
                                        <div
                                            key={q.id}
                                            ref={el => questionRefs.current[globalIdx] = el}
                                            className="space-y-10"
                                        >
                                            <div className="flex items-start gap-6">
                                                <div className={cn(
                                                    "w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-serif text-sm sm:text-xl shrink-0 transition-all duration-500",
                                                    hasAnswer ? "bg-amber-mix text-white shadow-lg" : "bg-gray-100 text-gray-400"
                                                )}>
                                                    0{qIdx + 1}
                                                </div>
                                                <h3 className="text-xl md:text-3xl font-serif font-light leading-snug pt-1">
                                                    {q.text}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-0 md:pl-18">
                                                {options.map(opt => {
                                                    const Icon = opt.icon;
                                                    const isActive = answers[globalIdx] === opt.val;
                                                    return (
                                                        <button
                                                            key={opt.val}
                                                            onClick={() => handleOptionSelect(globalIdx, opt.val)}
                                                            className={cn(
                                                                "group flex flex-col items-center text-center gap-3 py-6 px-4 rounded-3xl border-2 transition-all duration-300",
                                                                isActive
                                                                    ? `${opt.activeColor} text-white shadow-xl scale-[1.02]`
                                                                    : `bg-white border-gray-50 text-gray-400 ${opt.hoverColor}`
                                                            )}
                                                        >
                                                            <Icon className={cn("w-8 h-8 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-300 group-hover:text-inherit")} />
                                                            <span className="font-bold uppercase tracking-widest text-[10px]">{opt.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="pt-12 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-gray-100">
                                    <button
                                        onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                                        disabled={activeSection === 0}
                                        className="order-2 sm:order-1 inline-flex items-center gap-2 px-8 py-4 text-gray-400 hover:text-amber-600 font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-0"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Previous Section
                                    </button>

                                    {activeSection === 4 ? (
                                        <button
                                            onClick={handleFinalSubmit}
                                            className="order-1 sm:order-2 w-full sm:w-auto px-10 py-5 font-bold uppercase tracking-widest text-sm btn-border-flow text-black shadow-xl"
                                        >
                                            Complete Diagnostic <ArrowRight className="w-4 h-4 inline ml-2" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setActiveSection(activeSection + 1)}
                                            className="order-1 sm:order-2 w-full sm:w-auto px-10 py-5 font-bold uppercase tracking-widest text-sm border-2 border-amber-600 text-amber-600 bg-white hover:bg-amber-600 hover:text-white transition-all rounded-full"
                                        >
                                            Next Section <ArrowRight className="w-4 h-4 inline ml-2" />
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
                        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[32px] shadow-2xl backdrop-blur-xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 text-red-600">
                                    <AlertCircle className="w-6 h-6" />
                                    <h4 className="font-bold uppercase tracking-widest text-sm">Action Required</h4>
                                </div>
                                <button onClick={() => setValidationErrors([])} className="text-gray-400 hover:text-black">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">Please answer all 25 questions. The following are missing:</p>
                            <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
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
                                        className="w-full text-left text-xs bg-white p-2 rounded-lg border border-red-50 hover:border-red-200 transition-colors flex justify-between"
                                    >
                                        <span className="font-medium text-gray-700">{err.sectionTitle}</span>
                                        <span className="text-red-500 font-bold tracking-widest uppercase">Q{err.qNum}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-8 right-8 hidden md:block">
                <div className="flex items-center gap-3 glass py-3 px-5 rounded-full border-gray-100 shadow-lg text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Global Jump Enabled
                </div>
            </div>
        </div>
    );
}
