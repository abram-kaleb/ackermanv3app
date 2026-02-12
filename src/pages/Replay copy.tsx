// src/pages/Replay.tsx

import { useEffect, useState, useRef } from 'react';
import EngineCanvas from '../components/EngineCanvas';
import { translations, uiLabels } from '../data/translations';
import type { Language } from '../data/translations';

const SERVER_IP = '192.168.137.1';

const Replay = () => {
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [lang, setLang] = useState<Language>('de');

    const [step, setStep] = useState<'yy' | 'mm' | 'dd'>('yy');
    const [selectedYY, setSelectedYY] = useState('');
    const [selectedMM, setSelectedMM] = useState('');
    const [selectedDD, setSelectedDD] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    const pickerRef = useRef<HTMLDivElement>(null);
    const engineData = historyData[currentIndex] || null;

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const res = await fetch(`http://${SERVER_IP}:4000/api/available-dates`);
                const data = await res.json();
                setAvailableDates(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDates();
    }, []);

    const years = [...new Set(availableDates.filter(d => d.length >= 2).map(d => d.substring(0, 2)))].sort();
    const months = [...new Set(availableDates.filter(d => d.startsWith(selectedYY) && d.length >= 4).map(d => d.substring(2, 4)))].sort();
    const days = availableDates.filter(d => d.startsWith(selectedYY + selectedMM) && d.length >= 6).map(d => d.substring(4, 6)).sort();

    const handleSelectDay = async (dd: string) => {
        const fullDate = selectedYY + selectedMM + dd;
        setSelectedDD(dd);
        setShowPicker(false);
        try {
            const res = await fetch(`http://${SERVER_IP}:4000/api/history?datum=${fullDate}`);
            const data = await res.json();
            setHistoryData(data);
            setCurrentIndex(0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentIndex < historyData.length - 1) {
            timer = setInterval(() => {
                setCurrentIndex(prev => prev + 1);
            }, 1000);
        } else {
            setIsPlaying(false);
        }
        return () => clearInterval(timer);
    }, [isPlaying, currentIndex, historyData]);

    return (
        <div className="w-full h-full bg-white overflow-hidden font-sans text-slate-900 relative" style={{ fontSize: '1.1vw' }}>

            {/* HEADER - Disesuaikan dengan Sidebar */}
            <header className="absolute top-0 left-0 w-full flex justify-between items-start px-[3vw] pt-[3vw] z-30">
                <div className="flex items-start gap-[2.5vw]">
                    <button
                        onClick={() => { setShowPicker(!showPicker); setStep('yy'); }}
                        className="bg-slate-900 text-white px-[1.5vw] py-[0.8vw] rounded-xl flex items-center gap-[1vw] shadow-xl hover:bg-orange-600 transition-all active:scale-95"
                    >
                        <svg className="w-[1.2vw] h-[1.2vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="text-left">
                            <p className="text-[0.6vw] font-black uppercase tracking-widest opacity-60">Archive</p>
                            <p className="text-[0.8vw] font-mono font-bold">
                                {selectedDD ? `${selectedDD}.${selectedMM}.20${selectedYY}` : 'SELECT_DATE'}
                            </p>
                        </div>
                    </button>

                    {showPicker && (
                        <div ref={pickerRef} className="absolute top-full mt-[1vw] bg-white border border-slate-200 p-[1.5vw] rounded-[2vw] shadow-2xl w-[20vw] z-50">
                            <div className="flex justify-between items-center mb-[1vw]">
                                <h3 className="text-[0.7vw] font-black uppercase text-slate-400">Select {step.toUpperCase()}</h3>
                                {step !== 'yy' && (
                                    <button onClick={() => setStep(step === 'dd' ? 'mm' : 'yy')} className="text-[0.7vw] text-orange-500 font-bold">BACK</button>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-[0.5vw]">
                                {step === 'yy' && years.map(yy => (
                                    <button key={yy} onClick={() => { setSelectedYY(yy); setStep('mm'); }} className="py-[0.8vw] bg-slate-50 rounded-lg font-mono text-[0.8vw] hover:bg-orange-500 hover:text-white transition-all">20{yy}</button>
                                ))}
                                {step === 'mm' && months.map(mm => (
                                    <button key={mm} onClick={() => { setSelectedMM(mm); setStep('dd'); }} className="py-[0.8vw] bg-slate-50 rounded-lg font-mono text-[0.8vw] hover:bg-orange-500 hover:text-white transition-all">{mm}</button>
                                ))}
                                {step === 'dd' && days.map(dd => (
                                    <button key={dd} onClick={() => handleSelectDay(dd)} className="py-[0.8vw] bg-slate-50 rounded-lg font-mono text-[0.8vw] hover:bg-orange-500 hover:text-white transition-all">{dd}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-[0.5vw] mb-[0.2vw]">
                        <div className={`w-[0.5vw] h-[0.5vw] rounded-full ${isPlaying ? 'bg-orange-500 animate-pulse' : 'bg-slate-300'}`} />
                        <p className="text-[0.7vw] font-black text-slate-900 uppercase tracking-tighter">REPLAY_MODE</p>
                    </div>
                    <p className="text-[2.5vw] font-mono font-black text-slate-900 tracking-tighter leading-none">
                        {engineData?.["6"] || "00:00:00"}
                    </p>
                </div>
            </header>

            {/* PLAYBACK CONTROL - Pindah ke Tengah Atas */}
            <div className="absolute top-[3vw] left-1/2 -translate-x-1/2 z-40 w-[35vw]">
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-[1.2vw] rounded-2xl flex items-center gap-[1.5vw] shadow-xl">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={historyData.length === 0}
                        className={`w-[3.5vw] h-[3.5vw] shrink-0 rounded-xl flex items-center justify-center transition-all ${isPlaying ? 'bg-slate-900 text-white' : 'bg-orange-500 text-white disabled:opacity-20'}`}
                    >
                        {isPlaying ? (
                            <svg className="w-[1.5vw] h-[1.5vw]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg className="w-[1.5vw] h-[1.5vw] ml-[0.2vw]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>

                    <div className="flex-1">
                        <div className="flex justify-between text-[0.6vw] font-black mb-[0.5vw] text-slate-400 uppercase tracking-widest">
                            <span>{currentIndex + 1} / {historyData.length} records</span>
                            <span className="text-orange-500">{((currentIndex / (historyData.length - 1)) * 100 || 0).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={historyData.length > 0 ? historyData.length - 1 : 0}
                            value={currentIndex}
                            onChange={(e) => setCurrentIndex(Number(e.target.value))}
                            className="w-full h-[0.3vw] bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500"
                        />
                    </div>
                </div>
            </div>

            {/* <div className="absolute inset-0 z-0">
                <EngineCanvas />
            </div> */}

            {/* LEFT DATA */}
            <div className="absolute left-[3vw] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-[2vw]">
                {[
                    { label: translations["Drehzahl Motor"][lang], val: engineData?.["8"], unit: "rpm", id: "1.8" },
                    { label: translations["Bremsleistung"][lang], val: engineData?.["9"], unit: "kW", id: "1.9" },
                    { label: translations["Füllung Motor"][lang], val: engineData?.["10"], unit: "%", id: "1.10" },
                    { label: translations["Anlaßluftdruck"][lang], val: engineData?.["11"], unit: "bar", id: "1.11" }
                ].map((item) => (
                    <div key={item.id} className="flex flex-col">
                        <span className="text-[0.6vw] font-black text-slate-400 uppercase tracking-[0.2em]">{item.id} {item.label}</span>
                        <div className="flex items-baseline gap-[0.2vw]">
                            <span className="text-[2.8vw] font-mono font-black text-slate-900 tracking-tighter leading-none">{item.val ?? "0"}</span>
                            <span className="text-[0.7vw] font-bold text-slate-300 uppercase">{item.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT DATA */}
            <div className="absolute right-[3vw] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-[2vw] items-end text-right">
                {[
                    { label: translations["Fahrhebel Drehzahl"][lang], val: engineData?.["1"], unit: "%", id: "1.1" },
                    { label: translations["Fahrhebel Bremslast"][lang], val: engineData?.["2"], unit: "%", id: "1.2" }
                ].map((item) => (
                    <div key={item.id} className="flex flex-col items-end">
                        <span className="text-[0.6vw] font-black text-slate-400 uppercase tracking-[0.2em] mb-[0.2vw]">{item.id} {item.label}</span>
                        <div className="flex items-baseline gap-[0.2vw]">
                            <span className="text-[4vw] font-mono font-black text-slate-900 tracking-tighter leading-none">{item.val ?? "0"}</span>
                            <span className="text-[0.9vw] font-bold text-slate-300 uppercase">{item.unit}</span>
                        </div>
                    </div>
                ))}

                <div className="flex flex-col gap-[1.2vw] pt-[1.2vw] border-t border-slate-100 w-full min-w-[10vw]">
                    {[
                        { label: translations["Stopp/Betrieb"][lang], val: engineData?.["3"], id: "1.3", active: engineData?.["3"] === "1", color: "bg-emerald-500 shadow-[0_0_0.8vw_rgba(16,185,129,0.3)]" },
                        { label: translations["Umschalter Pult / Maschine"][lang], val: engineData?.["4"], id: "1.4", active: engineData?.["4"] === "1", color: "bg-blue-500 shadow-[0_0_0.8vw_rgba(59,130,246,0.3)]" },
                        { label: translations["Not-Aus-Taster"][lang], val: engineData?.["20"], id: "1.20", active: engineData?.["20"] !== "0", color: "bg-red-500 shadow-[0_0_0.8vw_rgba(239,68,68,0.3)]", pulse: true }
                    ].map((stat) => (
                        <div key={stat.id} className="flex justify-end items-center gap-[0.8vw]">
                            <div className="flex flex-col items-end">
                                <span className="text-[0.5vw] font-black text-slate-400 uppercase tracking-widest">{stat.id} {stat.label}</span>
                                <span className="text-[1vw] font-mono font-black text-slate-900 leading-none">{stat.val ?? "0"}</span>
                            </div>
                            <div className={`w-[0.7vw] h-[0.7vw] rounded-full shrink-0 ${stat.active ? `${stat.color} ${stat.pulse ? 'animate-pulse' : ''}` : 'bg-slate-200'}`}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM DATA */}
            <div className="absolute bottom-[3vw] left-1/2 -translate-x-1/2 z-10 flex gap-[3vw] p-[0.5vw] w-fit justify-center">
                {[
                    { label: translations["Schmieröldruck"][lang], val: engineData?.["12"], id: "1.12" },
                    { label: translations["Kraftstoffdruck"][lang], val: engineData?.["13"], id: "1.13" },
                    { label: translations["LT Kühlwasserdruck"][lang], val: engineData?.["14"], id: "1.14" },
                    { label: translations["HT Kühlwasserdruck"][lang], val: engineData?.["15"], id: "1.15" },
                    { label: translations["Ladeluftdruck"][lang], val: engineData?.["16"], id: "1.16" }
                ].map((item, index) => (
                    <div key={item.id} className={`text-center min-w-[6vw] ${index === 2 ? 'border-l border-slate-200 pl-[3vw]' : ''}`}>
                        <p className="text-[0.6vw] font-black text-slate-400 uppercase tracking-widest mb-[0.1vw] truncate">{item.label}</p>
                        <p className="text-[1.3vw] font-mono font-black text-slate-900 tracking-tighter">
                            {item.val ?? "0"}<span className="text-[0.7vw] ml-[0.1vw] text-slate-300 uppercase font-bold">bar</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Replay;