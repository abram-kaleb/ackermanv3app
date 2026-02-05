// src/components/EnvironmentSection.tsx
import React from 'react';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';

interface EnvironmentSectionProps {
    data: any;
    lang: Language;
}

const EnvironmentSection: React.FC<EnvironmentSectionProps> = ({ data, lang }) => {
    if (!data) return null;

    const envKeys = [
        { key: "Temp. Maschinenraum", unit: "°C" },
        { key: "Druck Maschinenraum (atm. Druck)", unit: "mbar" },
        { key: "Rel. Luftfeuchte", unit: "%" }
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1 bg-emerald-500 rounded-full"></div>
                <h2 className="text-slate-900 text-sm font-black tracking-widest uppercase">
                    {lang === 'id' ? 'Kondisi Lingkungan' : lang === 'en' ? 'Environment Conditions' : 'Umgebungsbedingungen'}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {envKeys.map((item) => {
                    const config = (translations as any)[item.key];
                    const label = config ? config[lang] : item.key;
                    const fullKey = Object.keys(data).find(k => k.toLowerCase().includes(item.key.toLowerCase())) || item.key;
                    const value = data[fullKey];

                    return (
                        <div key={item.key} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px]">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {label}
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black font-mono text-slate-800 tracking-tighter">
                                    {value !== undefined ? String(value) : '---'}
                                </span>
                                <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EnvironmentSection;