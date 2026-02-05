// src/components/Header.tsx
import React from 'react';
import { uiLabels } from '../data/translations';
import type { Language } from '../data/translations';

interface HeaderProps {
    lang: Language;
    setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
    return (
        <header className="sticky top-0 z-50 bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200 mb-12 py-4">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        {uiLabels.title[lang]}
                    </h1>

                </div>

                <div className="flex bg-white shadow-sm p-1 rounded-xl border border-slate-200">
                    {(['de', 'en', 'id'] as Language[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-5 py-2 rounded-lg text-xs font-black transition-all duration-200 ${lang === l
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {l.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;