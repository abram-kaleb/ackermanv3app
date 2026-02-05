// src/components/ControlSection.tsx
import React from 'react';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';

interface ControlSectionProps {
    data: any;
    lang: Language;
}

const ControlSection: React.FC<ControlSectionProps> = ({ data, lang }) => {
    if (!data) return null;

    const controlKeys = [
        { key: "Fahrhebel Drehzahl", unit: "pos" },
        { key: "Fahrhebel Bremslast", unit: "pos" },
        { key: "Stopp/Betrieb", unit: "" },
        { key: "Not-Aus-Taster", unit: "" },
        { key: "Umschalter Pult / Maschine", unit: "" }
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1 bg-amber-500 rounded-full"></div>
                <h2 className="text-slate-900 text-sm font-black tracking-widest uppercase">
                    {lang === 'id' ? 'Sistem Kontrol' : lang === 'en' ? 'Control System' : 'Steuerungssystem'}
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {controlKeys.map((item) => {
                    const config = (translations as any)[item.key];
                    const label = config ? config[lang] : item.key;
                    const fullKey = Object.keys(data).find(k => k.toLowerCase().includes(item.key.toLowerCase())) || item.key;
                    const value = data[fullKey];

                    const isEmergency = item.key.includes('Not-Aus') && value !== 0;

                    return (
                        <div key={item.key} className={`p-6 rounded-2xl shadow-sm border transition-all ${isEmergency ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-white border-slate-100'}`}>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isEmergency ? 'text-red-600' : 'text-slate-400'}`}>
                                {label}
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-3xl font-black font-mono tracking-tighter ${isEmergency ? 'text-red-600' : 'text-slate-800'}`}>
                                    {value !== undefined ? String(value) : '---'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ControlSection;