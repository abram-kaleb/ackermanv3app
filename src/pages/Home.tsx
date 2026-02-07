// src/pages/Home.tsx

import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import EngineCanvas from '../components/EngineCanvas';
import { uiLabels } from '../data/translations';
import type { Language } from '../data/translations';
import { translations } from '../data/translations';

interface HeaderProps {
    lang: Language;
    setLang: (lang: Language) => void;
}

const SERVER_IP = '192.168.137.1';
const socket = io(`http://${SERVER_IP}:4000`, {
    transports: ['websocket', 'polling'],
    autoConnect: true
});

const Home = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('de');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`http://${SERVER_IP}:4000/api/data`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setEngineData(data[0]); })
            .catch(err => console.error(err));

        socket.on('data_update', (newData) => setEngineData(newData));
        return () => { socket.off('data_update'); };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col w-full h-screen bg-white overflow-hidden font-sans text-slate-900 relative">

            {/* HEADER */}
            <header className="absolute top-0 left-0 w-full flex justify-between items-start px-4 md:px-8 pt-4 md:pt-8 z-30">
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                    <div>
                        <h1 className="text-sm md:text-xl font-black tracking-tighter uppercase leading-none">
                            {uiLabels.title[lang]}
                        </h1>
                        <p className="text-[8px] md:text-[10px] font-mono text-slate-400 mt-1 tracking-widest">ID_{SERVER_IP}</p>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all hover:text-slate-500"
                        >
                            {lang}
                            <svg className={`w-2 h-2 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isLangOpen && (
                            <div className="absolute top-full left-0 mt-1 flex flex-col bg-white border border-slate-100 overflow-hidden min-w-[50px] shadow-lg">
                                {(['de', 'en', 'id'] as Language[]).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => {
                                            setLang(l);
                                            setIsLangOpen(false);
                                        }}
                                        className={`px-2 py-1.5 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-left transition-colors ${lang === l ? 'text-slate-900 bg-slate-50' : 'text-slate-300 hover:text-slate-900'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-900 uppercase tracking-tighter">{uiLabels.status[lang]}</p>
                    <p className="text-[8px] md:text-[10px] font-mono text-slate-400">{engineData?.["5"] || "00:00:00"}</p>
                </div>
            </header>

            {/* CANVAS */}
            <div className="absolute inset-0 z-0">
                <EngineCanvas />
            </div>

            <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-6 md:gap-10">
                {[
                    { label: translations["Drehzahl Motor"][lang], val: engineData?.["7"], unit: "rpm", id: "1.8" },
                    { label: translations["Bremsleistung"][lang], val: engineData?.["8"], unit: "kW", id: "1.9" },
                    { label: translations["Füllung Motor"][lang], val: engineData?.["9"], unit: "%", id: "1.10" },
                    { label: translations["Anlaßluftdruck"][lang], val: engineData?.["10"], unit: "bar", id: "1.11" }
                ].map((item) => (
                    <div key={item.id} className="flex flex-col">
                        <span className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] md:tracking-[0.2em]">
                            {item.id} {item.label}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl md:text-4xl font-mono font-black text-slate-900 tracking-tighter leading-none">
                                {item.val ?? "0"}
                            </span>
                            <span className="text-[8px] md:text-[10px] font-bold text-slate-300 uppercase">{item.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* OVERLAY ATAS TENGAH - MOBILE RESPONSIVE */}
            <div className="absolute top-20 md:top-8 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-4 md:gap-12 p-2 w-full max-w-md md:max-w-none">
                <div className="text-center min-w-[70px]">
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        {translations["Datum"][lang]}
                    </p>
                    <p className="text-sm md:text-2xl font-mono font-black text-slate-900 tracking-tighter">
                        {engineData?.["4"] ?? "00.00.0000"}
                    </p>
                </div>
                <div className="text-center min-w-[70px]">
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        {translations["Uhrzeit"][lang]}
                    </p>
                    <p className="text-sm md:text-2xl font-mono font-black text-slate-900 tracking-tighter">
                        {engineData?.["5"] ?? "00:00:00"}
                    </p>
                </div>
                <div className="md:border-l border-slate-200 md:pl-12 text-center min-w-[70px]">
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        {translations["Betriebsstunden"][lang]}
                    </p>
                    <p className="text-sm md:text-2xl font-mono font-black text-slate-900 tracking-tighter">
                        {engineData?.["6"] ?? "0"}<span className="text-[10px] ml-1 text-slate-300 uppercase">h</span>
                    </p>
                </div>
                <div className="text-center min-w-[70px]">
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        {translations["Startzähler"][lang]}
                    </p>
                    <p className="text-sm md:text-2xl font-mono font-black text-slate-900 tracking-tighter">
                        {engineData?.["20"] ?? "0"}<span className="text-[10px] ml-1 text-slate-300 uppercase">x</span>
                    </p>
                </div>
            </div>

            {/* FLAT DATA KANAN - MOBILE RESPONSIVE */}
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-6 md:gap-10 items-end text-right">
                {[
                    { label: translations["Fahrhebel Drehzahl"][lang], val: engineData?.["0"], unit: "%", id: "1.1" },
                    { label: translations["Fahrhebel Bremslast"][lang], val: engineData?.["1"], unit: "%", id: "1.2" }
                ].map((item) => (
                    <div key={item.id} className="flex flex-col items-end">
                        <span className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] md:tracking-[0.2em] mb-1">
                            {item.id} {item.label}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl md:text-6xl font-mono font-black text-slate-900 tracking-tighter leading-none">
                                {item.val ?? "0"}
                            </span>
                            <span className="text-[8px] md:text-sm font-bold text-slate-300 uppercase">{item.unit}</span>
                        </div>
                    </div>
                ))}

                {/* Status Indicators */}
                <div className="flex flex-col gap-3 md:gap-6 pt-2 md:pt-4 border-t border-slate-100 w-full max-w-[120px] md:max-w-none">
                    {[
                        { label: translations["Stopp/Betrieb"][lang], val: engineData?.["2"], id: "1.3", active: engineData?.["2"] === "1", color: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" },
                        { label: translations["Umschalter Pult / Maschine"][lang], val: engineData?.["3"], id: "1.4", active: engineData?.["3"] === "1", color: "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]" },
                        { label: translations["Not-Aus-Taster"][lang], val: engineData?.["19"], id: "1.20", active: engineData?.["19"] !== "0", color: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]", pulse: true }
                    ].map((stat) => (
                        <div key={stat.id} className="flex justify-end items-center gap-2 md:gap-4">
                            <div className="flex flex-col items-end">
                                <span className="hidden md:block text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {stat.id} {stat.label}
                                </span>
                                <span className="text-sm md:text-xl font-mono font-black text-slate-900 leading-none md:leading-normal">
                                    {stat.val ?? "0"}
                                </span>
                            </div>
                            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full shrink-0 ${stat.active ? `${stat.color} ${stat.pulse ? 'animate-pulse' : ''}` : 'bg-slate-200'}`}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DATA BAWAH TENGAH - MOBILE RESPONSIVE */}
            <div className="absolute bottom-4 md:bottom-8 left-0 md:left-1/2 md:-translate-x-1/2 z-10 flex md:gap-12 p-2 w-full overflow-x-auto no-scrollbar justify-start md:justify-center px-4">
                {[
                    { label: translations["Schmieröldruck"][lang], val: engineData?.["11"], id: "1.12" },
                    { label: translations["Kraftstoffdruck"][lang], val: engineData?.["12"], id: "1.13" },
                    { label: translations["LT Kühlwasserdruck"][lang], val: engineData?.["13"], id: "1.14" },
                    { label: translations["HT Kühlwasserdruck"][lang], val: engineData?.["14"], id: "1.15" },
                    { label: translations["Ladeluftdruck"][lang], val: engineData?.["15"], id: "1.16" }
                ].map((item, index) => (
                    <div
                        key={item.id}
                        className={`text-center min-w-[100px] md:min-w-0 ${index === 2 ? 'md:border-l md:border-slate-200 md:pl-12' : ''} ${index > 0 ? 'ml-4 md:ml-0' : ''}`}
                    >
                        <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate px-1">
                            {item.label}
                        </p>
                        <p className="text-sm md:text-2xl font-mono font-black text-slate-900 tracking-tighter">
                            {item.val ?? "0"}<span className="text-[8px] md:text-xs ml-1 text-slate-300 uppercase font-bold">bar</span>
                        </p>
                    </div>
                ))}
            </div>








        </div>
    );
};

export default Home;