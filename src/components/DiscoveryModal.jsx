import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

export function DiscoveryModal({ isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Discovery Session Requested:', formState);
        alert('Thank you for your interest! Our team will contact you shortly to schedule your discovery session.');
        onClose();
    };

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl overflow-y-auto shadow-2xl z-10 max-h-[90vh] hide-scrollbar"
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-accent-red"></div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 sm:p-10">
                            <h2 className="text-3xl font-serif font-medium mb-2 text-black">Book a Discovery Session</h2>
                            <p className="text-gray-500 font-light mb-8">Discuss how RE:ORG can transform your business structure.</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="John Doe"
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-black focus:ring-0 transition-colors outline-none font-light rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="john@company.com"
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-black focus:ring-0 transition-colors outline-none font-light rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Company Name</label>
                                    <input
                                        type="text"
                                        name="company"
                                        required
                                        placeholder="Acme Corp"
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-black focus:ring-0 transition-colors outline-none font-light rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Project Context (Optional)</label>
                                    <textarea
                                        name="message"
                                        rows="3"
                                        placeholder="Tell us briefly about your current structural challenges..."
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-black focus:ring-0 transition-colors outline-none font-light resize-none rounded-xl"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-accent-red transition-all duration-300 flex items-center justify-center group gap-2 rounded-xl mt-4"
                                >
                                    Confirm Request
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
