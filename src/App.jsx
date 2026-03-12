import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Advantage } from './components/Advantage';
import { Diagnostic } from './components/Diagnostic';
import { Readiness } from './components/Readiness';
import { Footer } from './components/Footer';

function App() {
    return (
        <div className="min-h-screen bg-white font-sans text-black selection:bg-accent-red selection:text-white">
            <Navbar />
            <Hero />
            <Problem />
            <Solution />
            <Advantage />
            <Diagnostic />
            <Readiness />
            <Footer />
        </div>
    );
}

export default App;
