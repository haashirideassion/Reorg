import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ArrowRight, ArrowLeft, CheckCircle2, Activity, BarChart3, HelpCircle, Download, Send, User, Mail, AlertCircle, X, Shield, Zap, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReadinessScorecardPDF from '../../components/ReadinessScorecardPDF';
import { supabase } from '../../utils/supabaseClient';

const sections = [
    {
        id: 0,
        title: "The \"Bottleneck\" Reality Check",
        questions: [
            {
                id: 1,
                text: "What percentage of critical business decisions currently required your personal sign-off?",
                options: [
                    { val: 3, label: "High", color: "red", status: "Immediate attention", icon: AlertCircle },
                    { val: 2, label: "Moderate", color: "yellow", status: "Needs attention", icon: Activity },
                    { val: 1, label: "Not much", color: "green", status: "Currently stable", icon: Shield }
                ]
            },
            {
                id: 2,
                text: "If you were offline for 48 hours, would at least 3 key processes would come to a complete standstill?",
                options: [
                    { val: 1, label: "Yes", color: "green", status: "Immediate attention", icon: CheckCircle2 },
                    { val: 2, label: "No", color: "red", status: "Needs attention", icon: X }
                ]
            },
            {
                id: 3,
                text: "Do you feel you are usually the last to know about a frontline failure?",
                options: [
                    { val: 1, label: "Yes", color: "green", status: "Immediate attention", icon: CheckCircle2 },
                    { val: 2, label: "No", color: "red", status: "Needs attention", icon: X }
                ]
            },
            {
                id: 4,
                text: "Do you have a 'real-time' pulse on the organization's health without attending a formal meeting?",
                options: [
                    { val: 1, label: "Yes", color: "green", status: "Needs attention", icon: CheckCircle2 },
                    { val: 2, label: "No", color: "red", status: "Immediate attention", icon: X }
                ]
            },
            {
                id: 5,
                text: "What percentage of your leadership team's week is spent 'reporting status' versus 'solving problems' or 'executing strategy'?",
                options: [
                    { val: 3, label: "High", color: "red", status: "Immediate attention", icon: AlertCircle },
                    { val: 2, label: "Medium", color: "yellow", status: "Needs attention", icon: Activity },
                    { val: 1, label: "Low", color: "green", status: "Currently stable", icon: Shield }
                ]
            }
        ]
    },
    {
        id: 1,
        title: "Legacy vs. Fluidity",
        questions: [
            {
                id: 6,
                text: "If a high-priority project emerged today that required your best talent, how difficult would it be to pull them from their current 'departments' to form a cross-functional team force?",
                options: [
                    { val: 3, label: "High", color: "red", status: "Immediate attention", icon: AlertCircle },
                    { val: 2, label: "Medium", color: "yellow", status: "Needs attention", icon: Activity },
                    { val: 1, label: "Low", color: "green", status: "Currently stable", icon: Shield }
                ]
            },
            {
                id: 7,
                text: "When things actually get done quickly in your company, is it because people followed the formal process, or because they 'knew who to call' to bypass the system?",
                options: [
                    { val: 3, label: "Bypass the system", color: "red", status: "Immediate attention", icon: AlertCircle },
                    { val: 2, label: "Knew whom to call", color: "yellow", status: "Needs attention", icon: Activity },
                    { val: 1, label: "Formal Process", color: "green", status: "Currently stable", icon: Shield }
                ]
            },
            {
                id: 8,
                text: "On a scale of 1-10, how comfortable are you with a mid-level manager making a $10,000 mistake without asking for permission, provided they learn from it?",
                options: [
                    { val: 1, label: "Low", color: "red", status: "Immediate attention", icon: Shield },
                    { val: 2, label: "Medium", color: "yellow", status: "Needs attention", icon: Activity },
                    { val: 3, label: "High", color: "green", status: "Currently stable", icon: AlertCircle }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "The \"Rebirth\" Cultural Climate",
        questions: [
            {
                id: 9,
                text: "Is your department or process in your company is currently 'untouchable' because of tradition or internal politics, even though you know it's inefficient?",
                options: [
                    { val: 1, label: "Yes", color: "green", status: "Immediate attention", icon: CheckCircle2 },
                    { val: 2, label: "No", color: "red", status: "Currently stable", icon: X }
                ]
            },
            {
                id: 10,
                text: "Do your managers 'hoard' their best people?",
                options: [
                    { val: 1, label: "Yes", color: "green", status: "Currently stable", icon: CheckCircle2 },
                    { val: 2, label: "No", color: "red", status: "Immediate attention", icon: X }
                ]
            },
            {
                id: 11,
                text: "Is there a culture of moving talent to where the highest value is created?",
                options: [
                    { val: 1, label: "Yes", color: "green", status: "Currently stable", icon: CheckCircle2 },
                    { val: 2, label: "No", color: "red", status: "Needs attention", icon: X }
                ]
            },
            {
                id: 12,
                text: "In previous attempts at change, did the organization eventually 'snap back' to its old ways? If so, what was the primary 'immune response' that killed the change?",
                options: [
                    { val: 1, label: "Yes", color: "green", status: "Needs attention", icon: CheckCircle2 },
                    { val: 2, label: "No", color: "red", status: "Currently stable", icon: X }
                ]
            }
        ]
    }
];


export default function ReadinessAssessment() {
    const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);

    // Initialize state from sessionStorage
    const [answers, setAnswers] = useState(() => {
        const saved = sessionStorage.getItem('reorg_readiness_answers');
        return saved ? JSON.parse(saved) : Array(totalQuestions).fill(0);
    });

    // Keep active section in sync too
    const [activeSection, setActiveSection] = useState(() => {
        const saved = sessionStorage.getItem('reorg_readiness_section');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [showLeadForm, setShowLeadForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Show result if answers are complete and we have user data
    const [showResult, setShowResult] = useState(() => {
        const savedAnswers = sessionStorage.getItem('reorg_readiness_answers');
        const savedUser = sessionStorage.getItem('reorg_readiness_user');
        if (savedAnswers && savedUser) {
            const parsed = JSON.parse(savedAnswers);
            return parsed.every(a => a !== 0);
        }
        return false;
    });

    const [userData, setUserData] = useState(() => {
        const saved = sessionStorage.getItem('reorg_readiness_user');
        return saved ? JSON.parse(saved) : { name: '', email: '' };
    });

    // Update session storage whenever state changes
    useEffect(() => {
        sessionStorage.setItem('reorg_readiness_answers', JSON.stringify(answers));
        sessionStorage.setItem('reorg_readiness_section', activeSection.toString());
        sessionStorage.setItem('reorg_readiness_user', JSON.stringify(userData));
    }, [answers, activeSection, userData]);
    const [formError, setFormError] = useState('');
    const [pdfError, setPdfError] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const questionRefs = useRef([]);
    const resultRef = useRef(null);
    const pdfRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeSection, showResult, showLeadForm]);

    const handleOptionSelect = (qIdx, value) => {
        const newAnswers = [...answers];
        newAnswers[qIdx] = value;
        setAnswers(newAnswers);

        // Scroll to next question
        if (qIdx < totalQuestions - 1) {
            setTimeout(() => {
                questionRefs.current[qIdx + 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    };

    const isSectionComplete = (sIdx) => {
        if (sIdx < 0) return true;
        const section = sections[sIdx];
        const startIdx = sections.slice(0, sIdx).reduce((acc, s) => acc + s.questions.length, 0);
        return answers.slice(startIdx, startIdx + section.questions.length).every(a => a !== 0);
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleProfileView = async () => {
        if (!userData.name || !userData.email) return;
        setFormError('');

        if (!validateEmail(userData.email)) {
            setFormError('Please enter a valid business email address.');
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('readiness_submissions')
                .insert([
                    {
                        name: userData.name,
                        email: userData.email,
                        overall_status: readiness.status,
                        answers: answers
                    }
                ]);

            if (error) throw error;
            setShowResult(true);
        } catch (error) {
            console.error('Error saving readiness result:', error);
            setFormError('Something went wrong while saving your assessment. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setAnswers(Array(totalQuestions).fill(0));
        setActiveSection(0);
        setUserData({ name: '', email: '' });
        setShowResult(false);
        setShowLeadForm(false);
        sessionStorage.removeItem('reorg_readiness_answers');
        sessionStorage.removeItem('reorg_readiness_section');
        sessionStorage.removeItem('reorg_readiness_user');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowResetConfirm(false);
    };

    const progress = (answers.filter(a => a !== 0).length / totalQuestions) * 100;

    const calculateReadiness = () => {
        // Map colors to scores: Purple (1, Stable), Yellow (2, Needs Attention), Red (3, Immediate Attention)
        let totalScore = 0;
        let colorCounts = { red: 0, yellow: 0, green: 0 };

        let flatQuestions = [];
        sections.forEach(s => s.questions.forEach(q => flatQuestions.push(q)));

        answers.forEach((ans, idx) => {
            if (ans !== 0) {
                const opt = flatQuestions[idx].options.find(o => o.val === ans);
                if (opt) {
                    colorCounts[opt.color]++;
                    if (opt.color === 'red') totalScore += 3;
                    else if (opt.color === 'yellow') totalScore += 2;
                    else totalScore += 1;
                }
            }
        });

        const avgScore = totalScore / totalQuestions;

        const sectionScores = sections.map((s, sIdx) => {
            const startIdx = sections.slice(0, sIdx).reduce((acc, current) => acc + current.questions.length, 0);
            const sectionAnswers = answers.slice(startIdx, startIdx + s.questions.length);
            const sectionTotal = sectionAnswers.reduce((sum, val, qIdx) => {
                const opt = s.questions[qIdx].options.find(o => o.val === val);
                if (!opt) return sum;
                if (opt.color === 'red') return sum + 3;
                if (opt.color === 'yellow') return sum + 2;
                return sum + 1;
            }, 0);
            return (sectionTotal / (s.questions.length * 3)) * 100;
        });

        let status = "Needs Attention";
        let color = "text-amber-600";
        let bgColor = "bg-amber-50";
        let borderColor = "border-amber-500";
        let hexColor = "#f59e0b"; // Amber 600
        let overallZone = "The Friction Zone";
        let image = "/assets/assessments/attention.png";
        let desc = "The current structure reflects early signs of strain against evolving business demands, with overlapping roles, unclear accountability, or scalability concerns. Timely realignment will enhance efficiency and prepare the organization for sustained growth.";

        if (avgScore > 2.2 || colorCounts.red > 4) {
            status = "Immediate Attention Required";
            color = "text-red-500";
            bgColor = "bg-red-50";
            borderColor = "border-red-500";
            hexColor = "#ef4444"; // Red 500
            overallZone = "Systemic Rigidity";
            image = "/assets/assessments/immediate.png";
            desc = "In the current global dynamics, the organizational structure is significantly misaligned with business objectives, leading to inefficiencies, decision delays, and performance gaps. Immediate intervention is critical to prevent further impact on growth, talent retention, and operational stability.";
        } else if (avgScore < 1.6 && colorCounts.green > 6) {
            status = "Structure Suffices (with Future Intervention Recommended)";
            color = "text-green-600";
            bgColor = "bg-green-600";
            borderColor = "border-green-500";
            hexColor = "#22c55e"; // Green 600
            overallZone = "The Fluid Enterprise";
            image = "/assets/assessments/stable.png";
            desc = "The current structure supports present business goals; however, emerging trends and future growth plans indicate a need for proactive refinement. Strategic adjustments will ensure continued agility and long-term organizational resilience.";
        }

        const percentageScore = Math.round((totalScore / (totalQuestions * 3)) * 100);

        return {
            status,
            color,
            desc,
            colorCounts,
            sectionScores,
            image,
            bgColor,
            borderColor,
            totalScore: percentageScore,
            hexColor,
            overallZone
        };
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
                    const clonedWrapper = clonedDoc.getElementById('readiness-pdf-wrapper');
                    if (clonedWrapper) {
                        clonedWrapper.style.position = 'static';
                        clonedWrapper.style.left = '0';
                        clonedWrapper.style.opacity = '1';
                        clonedWrapper.style.width = '794px';
                        clonedDoc.body.style.width = '794px';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

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

            const safeName = userData.name ? userData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'profile';
            pdf.save(`reorg-readiness-${safeName}.pdf`);
        } catch (error) {
            console.error("PDF download failed:", error);
            setPdfError("Sorry, we couldn't generate the PDF. Please try again.");
            setTimeout(() => setPdfError(''), 5000);
        }
    };

    const handleFinalSubmit = () => {
        const missed = [];
        answers.forEach((ans, idx) => {
            if (ans === 0) {
                // Find which section this global index belongs to
                let currentTotal = 0;
                let sIdx = 0;
                let qInSIdx = 0;
                for (let i = 0; i < sections.length; i++) {
                    if (idx < currentTotal + sections[i].questions.length) {
                        sIdx = i;
                        qInSIdx = idx - currentTotal;
                        break;
                    }
                    currentTotal += sections[i].questions.length;
                }

                missed.push({
                    sIdx,
                    sectionTitle: sections[sIdx].title,
                    qNum: qInSIdx + 1,
                    globalIdx: idx
                });
            }
        });

        if (missed.length > 0) {
            setValidationErrors(missed);
            return;
        }

        if (!userData.email) {
            setShowLeadForm(true);
        }
    };

    const readiness = calculateReadiness();

    return (
        <div className="min-h-screen flex flex-col bg-white text-black font-sans premium-gradient transition-all duration-700">
            <Navbar />
            <div className="fixed inset-0 noise-bg z-0 pointer-events-none"></div>

            {showResult ? (
                <main className="relative flex-1 pt-32 pb-24 px-6 lg:px-8 overflow-hidden">
                    <div className="max-w-4xl mx-auto" ref={resultRef} id="readiness-result">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-16"
                        >
                            <div className="text-center">
                                <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4">Readiness Profile</h1>
                                <p className="text-xl text-gray-500 font-light italic">Prepared for: {userData.name}</p>
                            </div>

                            <div className={cn("glass rounded-[40px] shadow-2xl relative overflow-hidden border-t-8 flex flex-col md:flex-row items-stretch", readiness.borderColor)}>
                                <div className="md:w-1/3 relative overflow-hidden h-64 md:h-auto">
                                    <img
                                        src={readiness.image}
                                        alt={readiness.status}
                                        className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-all duration-1000"
                                    />
                                    <div className={cn("absolute inset-0 opacity-10", readiness.bgColor)}></div>
                                </div>
                                <div className="md:w-2/3 p-8 md:p-12 text-center md:text-center flex flex-col justify-center">
                                    <h2 className={cn("text-3xl md:text-4xl font-serif font-medium mb-6", readiness.color)}>{readiness.status}</h2>
                                    <p className="text-lg text-gray-600 font-light leading-relaxed">
                                        {readiness.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-2xl font-serif text-center">Organizational Breakdown</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {sections.map((section, idx) => (
                                        <div key={idx} className="glass p-8 rounded-3xl relative">
                                            <div className="flex justify-between items-end mb-4">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 max-w-[120px]">{section.title}</h4>
                                                <span className="text-2xl font-serif">{Math.round(readiness.sectionScores[idx])}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${readiness.sectionScores[idx]}%` }}
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        readiness.sectionScores[idx] > 60 ? "bg-red-500" :
                                                            readiness.sectionScores[idx] > 30 ? "bg-amber-500" : "bg-green-500"
                                                    )}
                                                />
                                            </div>
                                            <div className="mt-4 flex items-center gap-2">
                                                {readiness.sectionScores[idx] > 60 ? (
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                ) : readiness.sectionScores[idx] > 30 ? (
                                                    <Activity className="w-4 h-4 text-amber-500" />
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                )}
                                                <span className="text-[9px] uppercase tracking-tighter text-gray-500">
                                                    {readiness.sectionScores[idx] > 60 ? "Critical Resistance" :
                                                        readiness.sectionScores[idx] > 30 ? "Transition Strain" : "Stable Flow"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass p-8 rounded-3xl text-center border-b-4 border-green-400">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-green-50 rounded-2xl flex items-center justify-center">
                                        <div className="w-6 h-6 bg-green-400 rounded-full" />
                                    </div>
                                    <h3 className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-2">Currently Stable</h3>
                                    <p className="text-3xl font-serif">{readiness.colorCounts.green}</p>
                                </div>
                                <div className="glass p-8 rounded-3xl text-center border-b-4 border-amber-400">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center">
                                        <div className="w-6 h-6 bg-amber-400 rounded-full" />
                                    </div>
                                    <h3 className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-2">Needs Attention</h3>
                                    <p className="text-3xl font-serif">{readiness.colorCounts.yellow}</p>
                                </div>
                                <div className="glass p-8 rounded-3xl text-center border-b-4 border-red-500">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
                                        <div className="w-6 h-6 bg-red-500 rounded-full" />
                                    </div>
                                    <h3 className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-2">Immediate Attention</h3>
                                    <p className="text-3xl font-serif">{readiness.colorCounts.red}</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {pdfError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest mb-6"
                                        role="alert"
                                    >
                                        <AlertCircle className="w-5 h-5" /> {pdfError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                                <button
                                    onClick={downloadPDF}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-black text-white font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-gray-800 transition-colors rounded-full"
                                >
                                    <Download className="w-5 h-5" /> Download PDF
                                </button>
                                <button
                                    onClick={() => setShowResetConfirm(true)}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white border-2 border-green-600 text-green-600 font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-green-50 transition-colors rounded-full"
                                >
                                    <RefreshCw className="w-4 h-4" /> Start New Assessment
                                </button>
                                <button
                                    onClick={() => window.location.href = '/contact'}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-green-600 text-white font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-green-700 transition-colors rounded-full"
                                >
                                    Discuss Your Results
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hidden PDF Template */}
                    <div id="readiness-pdf-wrapper" style={{ position: 'absolute', left: '-9999px', top: '0', opacity: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        <div ref={pdfRef}>
                            <ReadinessScorecardPDF
                                userData={userData}
                                overallStatus={{
                                    label: readiness.status,
                                    image: readiness.image,
                                    zone: readiness.overallZone,
                                    desc: readiness.desc,
                                    hexColor: readiness.hexColor
                                }}
                                totalScore={readiness.totalScore}
                                sections={sections}
                                getSectionScore={(id) => readiness.sectionScores[id] * 0.15} // Simplified back-convert for the visual bar
                                getStatus={() => ({ label: 'N/A' })}
                                options={sections[0].questions[0].options} // Pick one as reference
                                answers={answers}
                                radarPoints={sections.map((_, i) => {
                                    const cx = 150, cy = 150, radius = 90;
                                    const angle = (Math.PI / 2) - (2 * Math.PI * i / 7);
                                    const val = (readiness.sectionScores[i] / 100);
                                    const x = cx + val * radius * Math.cos(angle);
                                    const y = cy - val * radius * Math.sin(angle);
                                    return `${x},${y}`;
                                }).join(" ")}
                            />
                        </div>
                    </div>
                </main>
            ) : showLeadForm ? (
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

                            <AnimatePresence>
                                {formError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-left mt-2 flex items-center gap-2"
                                        role="alert"
                                    >
                                        <AlertCircle className="w-3 h-3" /> {formError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={handleProfileView}
                                disabled={!userData.name || !userData.email || isSaving}
                                className={cn(
                                    "w-full py-5 font-bold uppercase tracking-widest text-sm mt-4 flex items-center justify-center gap-3 transition-all rounded-full",
                                    (userData.name && userData.email && !isSaving)
                                        ? "bg-green-600 text-white shadow-xl hover:bg-green-700"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                {isSaving ? 'Processing...' : 'Get Readiness Profile'}
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </main>
            ) : (
                <>
                    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100">
                        <motion.div
                            className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <main className="relative flex-1 pt-24 sm:pt-48 pb-12 px-4 sm:px-8 lg:px-12 overflow-x-hidden">
                        <div className="max-w-4xl mx-auto w-full">
                            {/* Tabs / Stage Line */}
                            <div className="relative mb-8 sm:mb-24 max-w-2xl mx-auto px-10">
                                <div className="flex flex-col relative">
                                    <div className="flex justify-between items-center mb-2 sm:mb-0">
                                        <div className="sm:hidden px-4 flex-1 min-w-0">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-600 block truncate">
                                                {sections[activeSection].title}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="relative flex justify-between items-center py-8">
                                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 -translate-y-1/2"></div>
                                        {sections.map((s, idx) => {
                                            const isCurrent = activeSection === idx;
                                            const isDone = isSectionComplete(idx);

                                            return (
                                                <div key={s.id} className="relative flex flex-col items-center shrink-0">
                                                    <AnimatePresence>
                                                        {isCurrent && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 10 }}
                                                                className="absolute -top-12 whitespace-nowrap hidden md:block"
                                                            >
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 shadow-sm">
                                                                    {s.title}
                                                                </span>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    <button
                                                        onClick={() => setActiveSection(idx)}
                                                        className={cn(
                                                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 relative z-10",
                                                            isCurrent ? "bg-white border-green-500 text-green-600 shadow-lg scale-110" :
                                                                isDone ? "bg-green-600 border-green-600 text-white" :
                                                                    "bg-white border-gray-200 text-gray-400 hover:border-green-300"
                                                        )}
                                                    >
                                                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

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
                                        {(() => {
                                            const sectionStartIdx = sections.slice(0, activeSection).reduce((acc, s) => acc + s.questions.length, 0);
                                            return sections[activeSection].questions.map((q, qIdx) => {
                                                const globalIdx = sectionStartIdx + qIdx;
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
                                                                hasAnswer ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"
                                                            )}>
                                                                0{qIdx + 1}
                                                            </div>
                                                            <div className="space-y-8 flex-1 pt-1 sm:pt-2">
                                                                <h3 className="text-xl sm:text-3xl font-serif font-light text-gray-900 leading-snug pt-1">
                                                                    {q.text}
                                                                </h3>

                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                                                                    {q.options.map((opt, oIdx) => {
                                                                        const Icon = opt.icon;
                                                                        const isActive = answers[globalIdx] === opt.val;
                                                                        const activeColors = {
                                                                            green: "bg-green-50 border-green-200 shadow-green-100 text-green-600",
                                                                            yellow: "bg-amber-50 border-amber-200 shadow-amber-100 text-amber-600",
                                                                            red: "bg-red-50 border-red-200 shadow-red-100 text-red-600"
                                                                        };
                                                                        const iconColors = {
                                                                            green: "bg-green-600",
                                                                            yellow: "bg-amber-600",
                                                                            red: "bg-red-600"
                                                                        };

                                                                        return (
                                                                            <button
                                                                                key={opt.val}
                                                                                onClick={() => handleOptionSelect(globalIdx, opt.val)}
                                                                                className={cn(
                                                                                    "group flex flex-col items-center text-center gap-2 sm:gap-4 py-4 sm:py-6 px-3 sm:px-6 rounded-2xl sm:rounded-[32px] border-2 transition-all duration-300 relative overflow-hidden",
                                                                                    isActive
                                                                                        ? activeColors[opt.color]
                                                                                        : "bg-white border-gray-100 hover:border-green-200",
                                                                                    q.options.length === 2 && oIdx === 1 ? "sm:col-span-1" : ""
                                                                                )}
                                                                            >
                                                                                <div className={cn(
                                                                                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300",
                                                                                    isActive
                                                                                        ? cn(iconColors[opt.color], "text-white")
                                                                                        : "bg-gray-50 text-gray-400 group-hover:scale-110 group-hover:text-green-600 group-hover:bg-green-50"
                                                                                )}>
                                                                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                                                </div>
                                                                                <span className={cn(
                                                                                    "font-bold uppercase tracking-[0.1em] text-[10px] sm:text-xs transition-colors",
                                                                                    isActive ? (opt.color === 'red' ? 'text-red-600' : opt.color === 'yellow' ? 'text-amber-600' : 'text-green-600') : "text-gray-500 group-hover:text-green-600"
                                                                                )}>
                                                                                    {opt.label}
                                                                                </span>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}

                                        <div className="pt-16 flex flex-col sm:flex-row justify-between items-center gap-6">
                                            <button
                                                onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                                                disabled={activeSection === 0}
                                                className="order-2 sm:order-1 inline-flex items-center gap-2 px-8 py-4 text-gray-400 hover:text-green-600 font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-0"
                                            >
                                                <ArrowLeft className="w-4 h-4" /> Previous Section
                                            </button>

                                            <button
                                                onClick={() => setShowResetConfirm(true)}
                                                className="order-3 sm:order-2 inline-flex items-center gap-2 px-8 py-4 text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest text-xs transition-colors"
                                            >
                                                <RefreshCw className="w-4 h-4" /> Reset Assessment
                                            </button>

                                            {activeSection === 2 ? (
                                                <button
                                                    onClick={handleFinalSubmit}
                                                    disabled={answers.filter(a => a !== 0).length < totalQuestions}
                                                    className="order-1 sm:order-3 w-full sm:w-auto px-12 py-5 font-bold uppercase tracking-widest text-sm btn-border-flow text-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:before:hidden flex items-center justify-center gap-3"
                                                >
                                                    Readiness Profile <ArrowRight className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setActiveSection(activeSection + 1)}
                                                    className="order-1 sm:order-3 w-full sm:w-auto px-12 py-5 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold uppercase tracking-widest text-sm transition-all rounded-full flex items-center justify-center gap-3"
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
                </>
            )
            }

            <Footer hideRebirth={true} />

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
