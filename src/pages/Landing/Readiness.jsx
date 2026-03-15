import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../../components/Reveal';

export function Readiness() {
    return (
        <section className="py-20 md:py-24 bg-white text-black px-6 lg:px-8 text-center border-b border-gray-100">
            <Reveal className="max-w-4xl mx-auto">
                <h2 className="text-5xl sm:text-6xl font-serif font-medium mb-10 leading-tight">
                    The 48-Hour Test.
                </h2>
                <div className="h-1 w-20 bg-accent-red mx-auto mb-10"></div>
                <div className="text-2xl sm:text-3xl text-gray-800 leading-relaxed font-light space-y-12 max-w-3xl mx-auto">
                    <p>
                        If you were offline for 48 hours, would your key processes come to a standstill?
                    </p>
                    <p className="font-semibold text-black">
                        If the answer is yes, you are ready for a RE:VAMP.
                    </p>

                    <div className="pt-4 text-center">
                        <Link
                            to="/assessment"
                            className="inline-flex items-center px-10 py-5 btn-border-flow text-black font-bold tracking-wide uppercase text-sm shadow-xl transition-all duration-300"
                        >
                            Take RE:ORG Readiness Assessment
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
