// src/components/TimeSection.tsx
import React from 'react';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';

interface TimeSectionProps {
    data: any;
    lang: Language;
}

const TimeSection: React.FC<TimeSectionProps> = ({ data, lang }) => {
    if (!data) return null;

    const timeKeys = ["Datum", "Uhrzeit", "Betriebsstunden", "Startzähler"];

    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-slate-900 text-sm font-black tracking-widest uppercase">
                    {lang === 'id' ? 'Informasi Waktu' : lang === 'en' ? 'Time Information' : 'Zeit-Information'}
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {timeKeys.map((key) => {
                    const config = (translations as any)[key];
                    const label = config ? config[lang] : key;

                    const fullKeyInDB = Object.keys(data).find(k => k.toLowerCase().includes(key.toLowerCase())) || key;
                    const value = data[fullKeyInDB];

                    return (
                        <div key={key} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px]">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {label}
                            </p>
                            <span className="text-3xl font-black font-mono text-blue-600 tracking-tighter">
                                {value !== undefined && value !== null ? String(value) : '---'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimeSection;