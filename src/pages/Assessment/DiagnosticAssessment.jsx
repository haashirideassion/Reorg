import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../../components/Reveal';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ArrowRight, ArrowLeft, CheckCircle2, Activity, BarChart3, ChevronRight, HelpCircle, Download, Send, User, Mail, Frown, Meh, Smile, ChevronDown, AlertCircle, X, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ScorecardPDF from '../../components/ScorecardPDF';

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

export default function DiagnosticAssessment() {
    // Initialize state from sessionStorage
    const [answers, setAnswers] = useState(() => {
        const saved = sessionStorage.getItem('reorg_diagnostic_answers');
        return saved ? JSON.parse(saved) : Array(25).fill(0);
    });

    const [activeSection, setActiveSection] = useState(() => {
        const saved = sessionStorage.getItem('reorg_diagnostic_section');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [userData, setUserData] = useState(() => {
        const saved = sessionStorage.getItem('reorg_diagnostic_user');
        return saved ? JSON.parse(saved) : { name: '', email: '' };
    });

    // Show result if answers are complete and we have user data
    const [showResult, setShowResult] = useState(() => {
        const savedAnswers = sessionStorage.getItem('reorg_diagnostic_answers');
        const savedUser = sessionStorage.getItem('reorg_diagnostic_user');
        if (savedAnswers && savedUser) {
            const parsed = JSON.parse(savedAnswers);
            return parsed.every(a => a !== 0);
        }
        return false;
    });

    // Update session storage whenever state changes
    useEffect(() => {
        sessionStorage.setItem('reorg_diagnostic_answers', JSON.stringify(answers));
        sessionStorage.setItem('reorg_diagnostic_section', activeSection.toString());
        sessionStorage.setItem('reorg_diagnostic_user', JSON.stringify(userData));
    }, [answers, activeSection, userData]);

    const [showLeadForm, setShowLeadForm] = useState(false);

    const [validationErrors, setValidationErrors] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const questionRefs = useRef([]);
    const resultRef = useRef(null);
    const pdfRef = useRef(null);
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
        if (sIdx < 0) return true;
        const start = sIdx * 5;
        return answers.slice(start, start + 5).every(a => a !== 0);
    };

    const handleReset = () => {
        // Clear states
        const emptyAnswers = Array(25).fill(0);
        setAnswers(emptyAnswers);
        setActiveSection(0);
        setUserData({ name: '', email: '' });
        setShowResult(false);
        setShowLeadForm(false);

        // Clear session storage
        sessionStorage.removeItem('reorg_diagnostic_answers');
        sessionStorage.removeItem('reorg_diagnostic_section');
        sessionStorage.removeItem('reorg_diagnostic_user');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowResetConfirm(false);
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
        ? { label: "Well Placed", color: "text-green-600", bgColor: "bg-green-600", borderColor: "border-green-500", image: "/assets/assessments/stable.png", zone: "The Fluid Enterprise", desc: "The organization is high-performing." }
        : totalScore >= 50
            ? { label: "Needs Attention", color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-500", image: "/assets/assessments/attention.png", zone: "The Friction Zone", desc: "Functional but losing energy to legacy drag." }
            : { label: "Needs Immediate Attention", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-500", image: "/assets/assessments/immediate.png", zone: "Systemic Rigidity", desc: "Structure is actively sabotaging the strategy." };

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
        { val: 1, label: "Disagree", icon: Frown, activeColor: "border-red-600 bg-red-50/40", textColor: "text-red-700", baseColor: "red" },
        { val: 2, label: "Neutral", icon: Meh, activeColor: "border-amber-600 bg-amber-50/40", textColor: "text-amber-700", baseColor: "amber" },
        { val: 3, label: "Agree", icon: Smile, activeColor: "border-green-600 bg-green-50/40", textColor: "text-green-700", baseColor: "green" }
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
        const element = pdfRef.current;
        if (!element) return;

        try {
            // High-fidelity capture from the dedicated PDF template
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    const clonedWrapper = clonedDoc.getElementById('diagnostic-pdf-wrapper');
                    if (clonedWrapper) {
                        clonedWrapper.style.position = 'static';
                        clonedWrapper.style.left = '0';
                        clonedWrapper.style.opacity = '1';
                        clonedWrapper.style.width = '794px';
                        clonedDoc.body.style.width = '794px';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

            // Handle multi-page if necessary
            const pdfHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = imgHeight - pdfHeight;
            let position = -pdfHeight;

            while (heightLeft > 0) {
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
                position -= pdfHeight;
            }

            const safeName = userData.name ? userData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'scorecard';
            pdf.save(`reorg-diagnostic-${safeName}.pdf`);
        } catch (error) {
            console.error("PDF download failed:", error);
            alert("Sorry, we couldn't generate the PDF. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-black font-sans premium-gradient transition-all duration-700">
            <Navbar />
            <div className="fixed inset-0 noise-bg z-0 pointer-events-none"></div>

            {showResult ? (
                <main className="relative flex-1 pt-32 pb-24 px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto" ref={resultRef} id="diagnostic-result">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-16"
                        >
                            <div className="text-center">
                                <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4">RE:ORG Diagnostic Scorecard</h1>
                                <p className="text-xl text-gray-500 font-light italic">Prepared for: {userData.name}</p>
                            </div>

                            <div className={cn("glass rounded-[40px] shadow-2xl relative overflow-hidden border-t-8 flex flex-col md:flex-row items-stretch", overallStatus.borderColor)}>
                                <div className="md:w-1/3 relative overflow-hidden h-64 md:h-auto">
                                    <img
                                        src={overallStatus.image}
                                        alt={overallStatus.label}
                                        className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-all duration-1000"
                                    />
                                    <div className={cn("absolute inset-0 opacity-10", overallStatus.bgColor)}></div>
                                </div>
                                <div className="md:w-2/3 p-8 md:p-12 text-center md:text-center flex flex-col justify-center">
                                    <div className="flex flex-col items-center md:items-center">
                                        <div className="relative w-64 h-32 overflow-hidden mb-6">
                                            <div className="absolute w-64 h-64 border-[16px] border-gray-100/50 rounded-full"></div>
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
                                        <h2 className={cn("text-3xl md:text-4xl font-serif font-medium mb-1", overallStatus.color)}>{overallStatus.label}</h2>
                                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-black/40 mb-4">{overallStatus.zone}</p>
                                        <p className="text-gray-500 font-light leading-relaxed">{overallStatus.desc}</p>
                                    </div>
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
                        <div className="flex flex-col md:flex-row gap-4 justify-center pt-12">
                            <button
                                onClick={downloadPDF}
                                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-black text-white font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-gray-800 transition-colors rounded-full"
                            >
                                <Download className="w-5 h-5" /> Download PDF
                            </button>
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white border-2 border-amber-600 text-amber-600 font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-amber-50 transition-colors rounded-full"
                            >
                                <RefreshCw className="w-4 h-4" /> Start New Assessment
                            </button>
                            <button
                                onClick={() => window.location.href = '/contact'}
                                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-amber-600 text-white font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-amber-700 transition-colors rounded-full"
                            >
                                Discuss Your Results
                            </button>
                        </div>
                    </div>

                    {/* Hidden PDF Template */}
                    <div id="diagnostic-pdf-wrapper" style={{ position: 'absolute', left: '-9999px', top: '0', opacity: 0 }}>
                        <div ref={pdfRef}>
                            <ScorecardPDF
                                userData={userData}
                                overallStatus={overallStatus}
                                totalScore={totalScore}
                                sections={sections}
                                getSectionScore={getSectionScore}
                                getStatus={getStatus}
                                options={options}
                                answers={answers}
                                radarPoints={generateRadarPoints()}
                            />
                        </div>
                    </div>
                </main>
            ) : showLeadForm ? (
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
            ) : (
                <>
                    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100">
                        <motion.div
                            className="h-full bg-amber-mix shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <main className="relative flex-1 pt-24 sm:pt-48 pb-12 px-4 sm:px-8 lg:px-12 overflow-x-hidden">
                        <div className="max-w-4xl mx-auto w-full">
                            {/* Stage Numbered Line for Sections */}
                            <div className="relative mb-8 sm:mb-24 max-w-2xl mx-auto px-10">
                                {/* Global Centered Title for Mobile - REMOVED for alignment fix */}
                                <div className="flex flex-col relative">
                                    {/* Header Row: Title (Left on Mobile) and Reset (Right) */}
                                    <div className="flex justify-between items-center mb-2 sm:mb-0">
                                        <div className="sm:hidden px-4 flex-1 min-w-0">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600 block truncate">
                                                {sections[activeSection].title}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="relative flex justify-between items-center py-8">
                                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 -translate-y-1/2"></div>
                                        {sections.map((s, idx) => {
                                            const isAccessible = true;
                                            const isCurrent = activeSection === idx;
                                            const isDone = isSectionComplete(idx);

                                            return (
                                                <div key={s.id} className="relative flex flex-col items-center shrink-0">
                                                    {/* Section Title above Dot */}
                                                    <AnimatePresence>
                                                        {isCurrent && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 10 }}
                                                                className="absolute -top-12 whitespace-nowrap hidden md:block"
                                                            >
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                                                                    {s.title}
                                                                </span>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    <button
                                                        onClick={() => isAccessible && setActiveSection(idx)}
                                                        className={cn(
                                                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 relative z-10",
                                                            isCurrent ? "bg-white border-amber-500 text-amber-600 shadow-lg scale-110" :
                                                                isDone ? "bg-amber-500 border-amber-500 text-white" :
                                                                    "bg-white border-gray-200 text-gray-400 hover:border-amber-300"
                                                        )}
                                                    >
                                                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                                    </button>

                                                    {/* Label below on Mobile - REMOVED per request */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Centered Section Title below removed */}

                            <div className="relative overflow-hidden w-full">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeSection}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-20 pb-12"
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
                                                            hasAnswer ? "bg-amber-mix text-white" : "bg-gray-100 text-gray-400"
                                                        )}>
                                                            0{qIdx + 1}
                                                        </div>
                                                        <h3 className="text-xl md:text-3xl font-serif font-light leading-snug pt-1">
                                                            {q.text}
                                                        </h3>
                                                    </div>

                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                                                        {options.map((opt, oIdx) => {
                                                            const Icon = opt.icon;
                                                            const isActive = answers[globalIdx] === opt.val;
                                                            return (
                                                                <button
                                                                    key={opt.val}
                                                                    onClick={() => handleOptionSelect(globalIdx, opt.val)}
                                                                    className={cn(
                                                                        "group flex flex-col items-center text-center gap-2 sm:gap-4 py-4 sm:py-6 px-3 sm:px-6 rounded-2xl sm:rounded-[32px] border-2 transition-all duration-300 relative overflow-hidden",
                                                                        isActive
                                                                            ? `${opt.activeColor}`
                                                                            : `bg-white border-gray-100 hover:border-amber-200`,
                                                                        oIdx === 2 ? "col-span-2 sm:col-span-1 w-[48%] sm:w-full justify-self-center" : ""
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300",
                                                                        isActive
                                                                            ? cn(
                                                                                opt.baseColor === 'red' ? "bg-red-600" :
                                                                                    opt.baseColor === 'amber' ? "bg-amber-600" :
                                                                                        "bg-green-600",
                                                                                "text-white"
                                                                            )
                                                                            : "bg-gray-50 text-gray-400 group-hover:scale-110 group-hover:text-amber-600 group-hover:bg-amber-50"
                                                                    )}>
                                                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                                    </div>
                                                                    <span className={cn(
                                                                        "font-bold uppercase tracking-[0.1em] text-[10px] sm:text-xs transition-colors",
                                                                        isActive ? opt.textColor : "text-gray-500 group-hover:text-amber-600"
                                                                    )}>
                                                                        {opt.label}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div className="pt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
                                            <button
                                                onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                                                disabled={activeSection === 0}
                                                className="order-2 sm:order-1 inline-flex items-center gap-2 px-8 py-4 text-gray-400 hover:text-amber-600 font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-0"
                                            >
                                                <ArrowLeft className="w-4 h-4" /> Previous Section
                                            </button>

                                            <button
                                                onClick={() => setShowResetConfirm(true)}
                                                className="order-3 sm:order-2 inline-flex items-center gap-2 px-8 py-4 text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest text-xs transition-colors"
                                            >
                                                <RefreshCw className="w-4 h-4" /> Reset Assessment
                                            </button>

                                            {activeSection === 4 ? (
                                                <button
                                                    onClick={handleFinalSubmit}
                                                    disabled={answers.filter(a => a !== 0).length < 25}
                                                    className="order-1 sm:order-3 w-full sm:w-auto px-10 py-5 font-bold uppercase tracking-widest text-sm btn-border-flow text-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:before:hidden flex items-center justify-center gap-3"
                                                >
                                                    Complete Diagnostic <ArrowRight className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setActiveSection(activeSection + 1)}
                                                    className="order-1 sm:order-3 w-full sm:w-auto px-10 py-5 font-bold uppercase tracking-widest text-sm border-2 border-amber-600 text-amber-600 bg-white hover:bg-amber-600 hover:text-white transition-all rounded-full"
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
                </>
            )}

            <Footer hideRebirth={true} />

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

            <AnimatePresence>
                {showResetConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowResetConfirm(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] p-8 sm:p-12 max-w-lg w-full relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-gray-100"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
                                    <RefreshCw className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-serif mb-4">Reset Assessment?</h3>
                                <p className="text-gray-500 mb-10 leading-relaxed px-4">
                                    This will clear all your progress and current answers. This action cannot be undone.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 w-full">
                                    <button
                                        onClick={() => setShowResetConfirm(false)}
                                        className="flex-1 px-8 py-4 rounded-full border border-gray-100 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                                    >
                                        Keep Progress
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 px-8 py-4 rounded-full bg-red-500 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-200 hover:bg-red-600 transition-colors"
                                    >
                                        Yes, Reset
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
