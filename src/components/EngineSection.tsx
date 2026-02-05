// src/components/EngineSection.tsx
import React from 'react';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';

interface EngineSectionProps {
    data: any;
    lang: Language;
}

const EngineSection: React.FC<EngineSectionProps> = ({ data, lang }) => {
    if (!data) return null;

    const engineKeys = [
        { key: "Drehzahl Motor", unit: "RPM", criticalMax: 2200 },
        { key: "Bremsleistung", unit: "kW" },
        { key: "Füllung Motor", unit: "%" },
        { key: "Anlaßluftdruck", unit: "bar", criticalMin: 18 },
        { key: "Schmieröldruck", unit: "bar", criticalMin: 2.5 },
        { key: "Kraftstoffdruck", unit: "bar" },
        { key: "LT Kühlwasserdruck", unit: "bar" },
        { key: "HT Kühlwasserdruck", unit: "bar" },
        { key: "Ladeluftdruck", unit: "bar" }
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                <h2 className="text-slate-900 text-sm font-black tracking-widest uppercase">
                    {lang === 'id' ? 'Sistem Utama Mesin' : lang === 'en' ? 'Core Engine System' : 'Hauptmotorsystem'}
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {engineKeys.map((item) => {
                    const config = (translations as any)[item.key];
                    const label = config ? config[lang] : item.key;

                    const fullKey = Object.keys(data).find(k => k.toLowerCase().includes(item.key.toLowerCase())) || item.key;
                    const value = data[fullKey];
                    const numValue = parseFloat(value);

                    // Logika Peringatan (Warning Logic)
                    const isCritical =
                        (item.criticalMax && numValue > item.criticalMax) ||
                        (item.criticalMin && numValue < item.criticalMin);

                    return (
                        <div
                            key={item.key}
                            className={`p-6 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col justify-between min-h-[140px] group ${isCritical
                                    ? 'bg-red-50 border-red-200 animate-pulse'
                                    : 'bg-white border-slate-100 hover:border-red-200 hover:shadow-md'
                                }`}
                        >
                            <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isCritical ? 'text-red-600' : 'text-slate-400 group-hover:text-red-500'
                                }`}>
                                {label}
                            </p>

                            <div className="flex items-baseline gap-1">
                                <span className={`text-4xl font-black font-mono tracking-tighter transition-colors ${isCritical ? 'text-red-700' : 'text-slate-800'
                                    }`}>
                                    {value !== undefined && value !== null ? String(value) : '0'}
                                </span>
                                <span className={`text-[10px] font-bold uppercase ${isCritical ? 'text-red-400' : 'text-slate-400'
                                    }`}>
                                    {item.unit}
                                </span>
                            </div>

                            {isCritical && (
                                <div className="mt-2 text-[8px] font-black text-red-500 uppercase tracking-tighter">
                                    Warning: Out of Range
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EngineSection;