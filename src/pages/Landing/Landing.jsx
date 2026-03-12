import { Navbar } from '../../components/Navbar';
import { Hero } from './Hero';
import { Problem } from './Problem';
import { Solution } from './Solution';
import { Advantage } from './Advantage';
import { Diagnostic } from './Diagnostic';
import { Readiness } from './Readiness';
import { Footer } from '../../components/Footer';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white font-sans text-black selection:bg-primary selection:text-white premium-gradient relative overflow-hidden">
            <div className="fixed inset-0 noise-bg z-0 pointer-events-none"></div>
            <div className="relative">
                <Navbar />
                <Hero />
                <Problem />
                <Solution />
                <Advantage />
                <Diagnostic />
                <Readiness />
                <Footer />
            </div>
        </div>
    );
}
