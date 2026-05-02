import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, ArrowLeft } from 'lucide-react';
import { Reveal } from '../../components/Reveal';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { submitToGoogleSheet } from '../../utils/googleSheet';
import { cn } from '../../utils/cn';

export default function Contact() {
    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrorMessage('');

        try {
            const result = await submitToGoogleSheet({
                project: 'Reorg_Contact',
                first_name: formState.firstName,
                last_name: formState.lastName,
                email: formState.email,
                message: formState.message
            });

            if (result.error) throw new Error(result.error);

            setSubmitStatus('success');
            setFormState({ firstName: '', lastName: '', email: '', message: '' });
            // Clear success message after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error('Form Submission Error:', error);
            setSubmitStatus('error');
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans premium-gradient">
            <Navbar />
            <div className="fixed inset-0 noise-bg z-0 pointer-events-none"></div>

            <section className="bg-white text-black pt-24 sm:pt-48 pb-20 px-4 sm:px-8 lg:px-12 relative overflow-x-hidden border-b border-gray-100">
                <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zOSA0MHYtNDBtLTQwIDM5aDQwIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]"></div>
                {/* Abstract Glow shape */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-red/5 rounded-full blur-3xl z-0"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <Reveal>
                        <h1 className="text-5xl text-center md:text-7xl font-serif font-medium mb-6 leading-tight">Contact Us</h1>
                        <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                            Ready to optimize your business structure? Let's talk about how the RE:ORG program can help you scale.
                        </p>
                    </Reveal>
                </div>
            </section>

            <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto relative z-10 overflow-x-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Contact Form */}
                    <Reveal direction="left">
                        <div className="glass border border-white/40 p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative rounded-3xl backdrop-blur-3xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                            <h2 className="text-3xl font-serif font-medium mb-8">Send us a message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            placeholder="John"
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 transition-colors outline-none font-light"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            placeholder="Doe"
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 transition-colors outline-none font-light"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="john@company.com"
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 transition-colors outline-none font-light"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows="4"
                                        placeholder="How can we help you scale?"
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 transition-colors outline-none font-light resize-none"
                                    ></textarea>
                                </div>

                                <AnimatePresence>
                                    {submitStatus && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={cn(
                                                "p-4 text-sm font-medium border rounded-xl",
                                                submitStatus === 'success'
                                                    ? "bg-green-50 border-green-100 text-green-700"
                                                    : "bg-red-50 border-red-100 text-red-700"
                                            )}
                                            role="alert"
                                        >
                                            {submitStatus === 'success' ? (
                                                <p>Thank you for your inquiry. The SapientHR RE:ORG team will contact you shortly.</p>
                                            ) : (
                                                <p>{errorMessage}</p>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full flex items-center justify-center btn-border-flow text-black py-5 font-bold uppercase tracking-widest text-sm shadow-xl group",
                                        isSubmitting && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </Reveal>

                    {/* Contact Info */}
                    <Reveal direction="right">
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-serif font-medium mb-8">Head Office Address</h2>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-100 rounded-lg">
                                        <MapPin className="w-6 h-6 text-accent-red" />
                                    </div>
                                    <div>
                                        <p className="text-lg text-gray-600 font-light leading-relaxed">
                                            191, 3rd Floor, Hamid Building, Whites Road,<br />
                                            Anna Salai, Chennai – 600 006
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Contact Info</h3>
                                    <div className="space-y-4">
                                        <a href="mailto:reachus@sapienthr.com" className="flex items-center text-gray-600 hover:text-black transition-colors group">
                                            <Mail className="w-5 h-5 mr-3 text-accent-red" />
                                            reachus@sapienthr.com
                                        </a>
                                        <a href="tel:+919840090112" className="flex items-center text-gray-600 hover:text-black transition-colors">
                                            <Phone className="w-5 h-5 mr-3 text-accent-red" />
                                            +91 9840090112
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Business Hours</h3>
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-5 h-5 mr-3 text-accent-red" />
                                        <p className="font-light text-sm italic">Monday - Friday 09 AM - 10 PM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Need immediate assistance block */}
                            <div className="bg-zinc-50 border border-gray-100 p-8">
                                <h4 className="text-xl font-serif font-medium mb-4">Need immediate assistance?</h4>
                                <p className="text-gray-500 font-light mb-6">Our support team is available 24/7 to help you with any urgent structural inquiries.</p>
                                <a href="tel:+919840090112" className="inline-flex items-center text-accent-red font-bold uppercase tracking-wider text-sm hover:underline">
                                    Call Us Now <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                </a>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Live Interactive Map */}
            <section className="h-96 w-full bg-gray-100 grayscale hover:grayscale-0 transition-all duration-700 relative overflow-hidden border-t border-gray-100">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6083313626244!2d80.25805561136458!3d13.060618087121703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526618451f0449%3A0x6b89182a4d3527b1!2sHamid%20Building!5e0!3m2!1sen!2sin!4v1710255000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Hamid Building, Anna Salai, 3rd Floor"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-500"
                ></iframe>
            </section>
            <Footer hideRebirth={true} />
        </div>
    );
}
