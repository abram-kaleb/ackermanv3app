// src/components/ConditionPanel.tsx

import { translations } from '../data/translations';
import type { Language } from '../data/translations';

interface ConditionPanelProps {
    engineData: any;
    lang: Language;
}

const ConditionPanel = ({ engineData, lang }: ConditionPanelProps) => {
    const t = (key: string) => translations[key]?.[lang] || key;

    const healthIndex = 88.5;
    const baseRUL = 1250;
    const adjustedRUL = 1180;

    return (
        <div className="w-[20vw] h-[25vw] bg-[#0b1217]/80 backdrop-blur-2xl border border-white/20 overflow-hidden  pointer-events-auto select-none flex flex-col">
            <div className="px-[1vw] py-[0.8vw] bg-cyan-500/10 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
                <span className="text-[0.8vw] font-black text-cyan-500 uppercase tracking-widest">Condition Monitoring</span>
                <div className="flex gap-1">
                    <div className="w-1 h-1  bg-cyan-500 animate-pulse" />
                    <div className="w-1 h-1  bg-cyan-500/40" />
                </div>
            </div>

            <div className="relative h-[0.2vw] w-full bg-white/5 shrink-0">
                <div
                    className="absolute inset-y-0 left-0 bg-cyan-500"
                    style={{ width: `${healthIndex}%` }}
                />
            </div>

            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-[1.2vw] space-y-[1.2vw]">
                <div className="relative p-[1vw] bg-white/[0.02] border border-white/5  overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[0.8vw] text-white/30 font-black uppercase tracking-[0.1em]">Efficiency Health</span>
                        <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-[0.8vw] text-cyan-400 font-mono italic">
                            NOMINAL
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="relative flex items-center justify-center">
                            <svg className="w-[4.5vw] h-[4.5vw] -rotate-90">
                                <circle cx="2.25vw" cy="2.25vw" r="2vw" stroke="currentColor" strokeWidth="0.4vw" fill="transparent" className="text-white/5" />
                                <circle
                                    cx="2.25vw"
                                    cy="2.25vw"
                                    r="2vw"
                                    stroke="currentColor"
                                    strokeWidth="0.4vw"
                                    fill="transparent"
                                    strokeDasharray={`${2 * Math.PI * 2}vw`}
                                    strokeDashoffset={`${(2 * Math.PI * 2) * (1 - healthIndex / 100)}vw`}
                                    className="text-cyan-500 transition-all duration-1000"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-[1vw] font-mono font-bold text-white tracking-tighter">{healthIndex}%</span>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="h-[3px] w-full bg-white/5  overflow-hidden">
                                <div className="h-full bg-cyan-500/50 w-3/4 animate-pulse" />
                            </div>
                            <p className="text-[0.8vw] text-white/40 font-medium leading-tight uppercase italic">Stable status</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-[1vw]">
                    <div className="relative p-[1vw] bg-white/[0.02] border border-white/5  ">
                        <span className="text-[0.8vw] text-white/40 font-black uppercase tracking-tight block mb-1">Standard RUL</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[1.8vw] font-mono text-white/90 font-light leading-none">{baseRUL}</span>
                            <span className="text-[0.8vw] text-white/30 font-bold uppercase">h</span>
                        </div>
                    </div>

                    <div className="relative p-[1vw] bg-yellow-500/[0.03] border border-yellow-500/10 ">
                        <span className="text-[0.8vw] text-yellow-500/60 font-black uppercase tracking-tight block mb-1">Estimated RUL</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[1.8vw] font-mono text-yellow-500 font-bold leading-none">{adjustedRUL}</span>
                            <span className="text-[0.8vw] text-yellow-500/40 font-bold uppercase">h</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-[0.8vw]">
                    <span className="text-[0.8vw] text-white/30 font-black uppercase tracking-widest block">Active Anomalies</span>
                    <div className="space-y-2">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10  shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-red-500 animate-ping" />
                                    <span className="text-[0.8vw] text-red-200/70 font-bold uppercase">HT Fluctuation</span>
                                </div>
                                <span className="text-[0.75vw] text-red-500/50 font-mono">0.42s</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConditionPanel;