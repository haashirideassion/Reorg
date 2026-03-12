import { Reveal } from './Reveal';
import { ArrowRight } from 'lucide-react';

export function Hero() {
    return (
        <header className="relative min-h-screen flex items-center overflow-hidden bg-gray-50 text-black pt-24 border-b border-gray-200">

            {/* Clinical Grid Background */}
            <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zOSA0MHYtNDBtLTQwIDM5aDQwIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-60"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center sm:text-left flex flex-col justify-center">
                <Reveal delay={0}>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-medium leading-[1.1] tracking-tight mb-8">
                        Stop Letting Your Structure <br className="hidden sm:block" />
                        <em className="text-accent-red not-italic font-bold">Strangle</em> Your Strategy.
                    </h1>
                </Reveal>

                <Reveal delay={0.2} className="relative before:absolute before:-left-6 before:top-2 before:bottom-2 before:w-1 before:bg-accent-red/20 sm:pl-0 sm:before:hidden">
                    <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mb-12 leading-relaxed border-l-4 border-accent-red pl-6 py-2">
                        Moving from a legacy hierarchy to a high-performance model isn’t just a shift—it’s a <strong className="font-semibold text-black">cultural and operational rebirth.</strong>
                    </p>
                </Reveal>

                <Reveal delay={0.4}>
                    <a
                        href="#diagnostic"
                        className="inline-flex items-center justify-center px-10 py-5 rounded-none font-bold text-lg bg-black text-white hover:bg-accent-red transition-colors duration-300 group cursor-pointer border border-transparent hover:border-accent-red"
                    >
                        <span className="mr-3 tracking-wide uppercase text-sm">Take the RE:ORG Readiness Assessment</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </Reveal>
            </div>
        </header>
    );
}
