// src/components/AlarmPanel.tsx

import { useState } from 'react';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';

interface AlarmPanelProps {
    engineData: any;
    lang: Language;
}

const AlarmPanel = ({ engineData, lang }: AlarmPanelProps) => {
    const t = (key: string) => translations[key]?.[lang] || key;

    const [alarms, setAlarms] = useState([
        { id: "64_HT_PR", label: "HT Water High", time: "14:02" },
        { id: "12_LO_PRS", label: "LO Press Low", time: "14:05" },
        { id: "08_FUEL_LK", label: "Fuel Leakage", time: "14:10" }
    ]);

    const handleAck = (id: string) => {
        setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    };

    return (
        <div className="w-[20vw] h-[11.5vw] bg-[#0b1217]/90 backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl pointer-events-auto select-none">
            <div className="px-[1vw] py-[0.6vw] bg-red-500/10 border-b border-red-500/20 flex items-center justify-between">
                <span className="text-[0.8vw] font-black text-red-500 uppercase tracking-widest">Alarm List</span>
                <span className="text-[0.7vw] font-mono text-red-400/60 uppercase">{alarms.length} Active</span>
            </div>

            <div className="p-[0.6vw] h-[calc(100%-2.5vw)] space-y-[0.4vw] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {alarms.map((alarm) => (
                    <div key={alarm.id} className="h-[3.6vw] bg-red-500/5 border-l-4 border-red-500 px-[0.8vw] flex items-center justify-between gap-[0.5vw] shrink-0">
                        <div className="flex flex-col min-w-0">
                            <span className="text-white text-[0.8vw] font-bold tracking-tight uppercase truncate">{alarm.label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[0.8vw] font-mono text-red-400/60 font-bold shrink-0">{alarm.time}</span>
                                <span className="text-red-400/40 text-[0.7vw] font-mono uppercase truncate">{alarm.id}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleAck(alarm.id)}
                            className="px-[0.8vw] py-[0.3vw] bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 font-black text-white text-[0.8vw] uppercase transition-all active:scale-95 shrink-0"
                        >
                            ACK
                        </button>
                    </div>
                ))}

                {alarms.length === 0 && (
                    <div className="h-full flex items-center justify-center opacity-20">
                        <span className="text-[0.8vw] font-bold text-white uppercase tracking-[0.2em]">No Alerts</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlarmPanel;