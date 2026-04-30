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

                </div>
            </Reveal>
        </section>
    );
}
