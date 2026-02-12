// src/components/PredictiveAnalytics.tsx

import { useMemo } from 'react';

interface PredictiveAnalyticsProps {
    engineData: any;
    sections: { title: string; offset: number; keys: string[] }[];
    lang: 'de' | 'en' | 'id';
    translations: any;
}

const PredictiveAnalytics = ({ engineData, sections, lang, translations }: PredictiveAnalyticsProps) => {
    const criticalComponents = useMemo(() => {
        if (!engineData) return [];
        return Object.entries(engineData)
            .filter(([key, val]) => {
                const numVal = parseFloat(val as string);
                return !isNaN(numVal) && numVal >= 90 && !["5", "6", "7"].includes(key);
            })
            .map(([key, val]) => {
                const flatKeys = sections.flatMap(s => s.keys);
                const channelIdx = parseInt(key) - 1;
                const nameKey = flatKeys[channelIdx] || `Channel ${key}`;
                return {
                    name: translations[nameKey]?.[lang] || nameKey,
                    value: val
                };
            });
    }, [engineData, sections, lang, translations]);

    return (
        <div className="fixed top-[8vw] right-[3vw] w-[18vw] z-50 pointer-events-auto font-sans">
            <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-[1vw] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />

                <div className="flex justify-between items-end mb-[1.2vw]">
                    <div>
                        <p className="text-[0.5vw] font-black text-white/30 uppercase tracking-[0.2em]">HEALTH_INDEX</p>
                        <p className="text-[1.8vw] font-mono font-light text-white leading-none">98.4<span className="text-[0.8vw] opacity-40">%</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-[0.5vw] font-black text-white/30 uppercase tracking-[0.2em]">R.U.L</p>
                        <p className="text-[1.2vw] font-mono font-light text-[#FFD700] leading-none">1,240<span className="text-[0.6vw] opacity-40 ml-1">HRS</span></p>
                    </div>
                </div>

                <div className="space-y-[0.8vw]">
                    <div className="flex justify-between items-center border-b border-white/5 pb-[0.5vw]">
                        <span className="text-[0.6vw] font-black text-red-500 animate-pulse tracking-widest">CRITICAL_ALARM</span>
                        <span className="text-[0.5vw] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 uppercase">{criticalComponents.length} ACTIVE</span>
                    </div>

                    <div className="max-h-[12vw] overflow-y-auto no-scrollbar space-y-[0.4vw]">
                        {criticalComponents.length > 0 ? (
                            criticalComponents.map((comp, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white/5 px-[0.6vw] py-[0.4vw] rounded border-l-2 border-red-500 group hover:bg-red-500/10 transition-colors">
                                    <span className="text-[0.6vw] text-white/60 uppercase truncate w-[10vw] font-medium group-hover:text-white">{comp.name}</span>
                                    <span className="text-[0.8vw] font-mono text-red-400 font-bold">{comp.value}%</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-[0.6vw] text-white/20 italic uppercase tracking-widest">System Nominal</div>
                        )}
                    </div>
                </div>

                <div className="mt-[1vw] pt-[0.8vw] border-t border-white/5 flex justify-between items-center">
                    <span className="text-[0.45vw] text-white/20 uppercase tracking-tighter">Diagnostic Unit: 0x4FF2</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                        <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;