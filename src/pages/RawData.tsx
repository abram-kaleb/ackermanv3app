// src/pages/RawData.tsx

import { useEffect, useState, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { AppStatusContext } from '../App';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';

const SERVER_IP = '192.168.137.1';
const socket = io(`http://${SERVER_IP}:4000`, {
    transports: ['websocket', 'polling'],
    autoConnect: false
});

const BackgroundFUI = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f171d]">
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] opacity-20 blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(100, 210, 255, 0.2) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] opacity-10 blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)' }} />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '2vw 2vw' }} />
        </div>
    );
};

const RawData = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('de');
    const [activeSection, setActiveSection] = useState(0);
    const { rawRunning } = useContext(AppStatusContext);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const sections = [
        { title: "ENGINE", offset: 0, keys: ["Fahrhebel Drehzahl", "Fahrhebel Bremslast", "Stopp/Betrieb", "Umschalter Pult / Maschine", "Datum", "Uhrzeit", "Betriebsstunden", "Drehzahl Motor", "Bremsleistung", "Füllung Motor", "Anlaßluftdruck", "Schmieröldruck", "Kraftstoffdruck", "LT Kühlwasserdruck", "HT Kühlwasserdruck", "Ladeluftdruck", "Druck Maschinenraum (atm. Druck)", "Temp. Maschinenraum", "Rel. Luftfeuchte", "Not-Aus-Taster", "Startzähler"] },
        { title: "EXHAUST", offset: 21, keys: ["Temp. n. Zylinder 1", "Temp. n. Zylinder 2", "Temp. n. Zylinder 3", "Temp. n. Zylinder 4", "Temp. n. Zylinder 5", "Temp. n. Zylinder 6", "Temp. v. ATL", "Temp. n. ATL", "Druck v. ATL", "Druck n. ATL", "Drehzahl ATL", "Temp. vor Schalldämpfer", "Abgastemperaturdifferenz", "Druck 1", "Druck 2", "Druck 3", "Druck 4", "Temp 1", "Temp 2", "Temp 3", "Temp 4", "Konz 1", "Konz 2", "Mobil 1", "Mobil 2", "Mobil 3", "Mobil 4", "Mobil 5", "Mobil 6", "Mobil 7", "Mobil 8", "Mobil 9", "Mobil 10"] },
        { title: "HT COOLING", offset: 55, keys: ["HT Kühlwasser - Druck v. Motor", "HT Kühlwasser - Temp. v. Motor", "HT Kühlwasser - Temp. n. Zyl. 1", "HT Kühlwasser - Temp. n. Zyl. 2", "HT Kühlwasser - Temp. n. Zyl. 3", "HT Kühlwasser - Temp. n. Zyl. 4", "HT Kühlwasser - Temp. n. Zyl. 5", "HT Kühlwasser - Temp. n. Zyl. 6", "HT Kühlwasser - Temp. n. Motor", "HT Kühlwasser - Temp. v. Kühler", "HT Kühlwasser - Temp. n. Kühler", "HT Kühlwasser - Durchfluß", "HT Kühlwasser - Druck", "HT Kühlwasser - Stand by Pumpe", "HT Kühlwasser - Druckhaltepumpe", "HT Kühlwasser - Niveau Ex-Tank"] },
        { title: "LT COOLING", offset: 71, keys: ["LT Kühlwassrer - Temp. v. Ladeluftkühler", "LT Kühlwassrer - Temp. n. Ladeluftkühler", "LT Kühlwassrer - Temp. v. Schmierölkühler", "LT Kühlwassrer - Temp. n. Schmierölkühler", "LT Kühlwassrer - Temp. n. Zylinderkühlwasserkühler", "LT Kühlwassrer - Temp. Eintritt warme Seite Behälter", "LT Kühlwassrer - Durchfluß", "LT Kühlwassrer - Druck", "LT Kühlwassrer - Stand by LT Pumpe", "LT Kühlwassrer - Kühlturmpumpe", "LT Kühlwassrer - Druck Kühlturmpumpe", "LT Kühlwassrer - Gebläse Kühlturm", "LT Kühlwassrer - Temp. Behälter, kalte Seite", "LT Kühlwassrer - Bremsenwasser Zulaufpumpe", "LT Kühlwassrer - Bremsenwasser Ablaufpumpe"] },
        { title: "LUBE OIL", offset: 86, keys: ["Schmieröl - Druck n. Pumpe", "Schmieröl - Temp. n. Pumpe", "Schmieröl - Temp. v. Kühler", "Schmieröl - Temp. n. Kühler", "Schmieröl - Differenzdruck Doppelfilter", "Schmieröl - Druck v. Motor/ n. Filter", "Schmieröl - Temp. v. Motor", "Schmieröl - Durchfluß", "Schmieröl - Stand by Pumpe", "Schmieröl - Separator", "Schmieröl - Diff-Druck Feinfilter", "Schmieröl - Temp. v. terakhir Lager", "Schmieröl - Ölnebelkonzentration"] },
        { title: "CHARGE AIR", offset: 99, keys: ["Ladeluft - Temp. v. ATL", "Ladeluft - Temp. v. Ladeluftkühler", "Ladeluft - Temp. n. Ladeluftkühler", "Ladeluft - Druck n. Ladeluftkühler", "Ladeluft - Druckdifferenz Blende", "Ladeluft - Durchsatz"] },
        { title: "FUEL", offset: 106, keys: ["Kraftstoff MDO - Druck v. Filter", "Kraftstoff MDO - Druck n. Doppelfilter", "Kraftstoff MDO - Temp. v. Motor", "Kraftstoff MDO - Durchsatz", "Kraftstoff MDO - Füllstand Tagestank", "Kraftstoff HFO - Vorwärmung/Begleitheizung", "Kraftstoff HFO - Temp. Vorratstank", "Kraftstoff HFO - Temp. v. Setztank", "Kraftstoff HFO - Temp. Setztank", "Kraftstoff HFO - Füllstand Setztank", "Kraftstoff HFO - Druck v. Vorwärmer", "Kraftstoff HFO - Temp. v. Vorwärmer", "Kraftstoff HFO - Druck n. Vorwärmer", "Kraftstoff HFO - Temp. n. Vorwärmer", "Kraftstoff HFO - Druck v. Tagestank", "Kraftstoff HFO - Temp. v. Tagestank", "Kraftstoff HFO - Temp. Tagestank", "Kraftstoff HFO - Druck v. Mischrohr", "Kraftstoff HFO - Temp. v. Mischrohr", "Kraftstoff HFO - Durchsatz v. Mischrohr", "Kraftstoff HFO - Druck v. Endvorwärmer", "Kraftstoff HFO - Temp. v. Endvorwärmer", "Kraftstoff HFO - Temp. n. Endvorwärmer", "Kraftstoff HFO - Viskosität n. Endvorwärmer", "Kraftstoff HFO - Druck v. Motor", "Kraftstoff HFO - Temp v. Motor", "Kraftstoff HFO - Zubringerpumpe zum Setztank", "Kraftstoff HFO - Separator 1", "Kraftstoff HFO - Separator 2", "Kraftstoff HFO - Zubringerpumpe zum Kraftstoffmodul", "Kraftstoff Flüssiggas - Druck 1", "Kraftstoff Flüssiggas - Druck 2", "Kraftstoff Flüssiggas - Druck 3", "Kraftstoff Flüssiggas - Druck 4", "Kraftstoff Flüssiggas - Druck 5", "Kraftstoff Flüssiggas - Temp 1", "Kraftstoff Flüssiggas - Temp 2", "Kraftstoff Flüssiggas - Temp 3", "Kraftstoff Flüssiggas - Temp 4", "Kraftstoff Flüssiggas - Temp 5", "Kraftstoff Flüssiggas - Konz 1", "Kraftstoff Flüssiggas - Konz 2", "Kraftstoff Flüssiggas - Konz 3", "Kraftstoff Flüssiggas - Konz 4", "Kraftstoff Flüssiggas - Konz 5", "Kraftstoff Flüssiggas - Durchsatz", "Kraftstoff Flüssiggas - Pumpe 1", "Kraftstoff Flüssiggas - Pumpe 2", "Kraftstoff Flüssiggas - Pumpe 3", "Kraftstoff Flüssiggas - Pumpe 4"] },
        { title: "STARTING AIR", offset: 156, keys: ["Anlassluft - Druck v. Motor", "Anlassluft - Verdichter 1", "Anlassluft - Verdichter 2"] },
        { title: "NOZZLE COOLING", offset: 159, keys: ["Düsenkühlung - Druck v. Motor", "Düsenkühlung - Temp. v. Motor", "Düsenkühlung - Temp. n. Motor", "Düsenkühlung - Durchsatz", "Düsenkühlung - Umwälzpumpe", "Düsenkühlung - Stand by Pumpe", "Düsenkühlung - Diff-Druck Filter", "Düsenkühlung - Niveau Umlauftank"] }
    ];

    useEffect(() => {
        if (!rawRunning) {
            socket.disconnect();
        } else {
            socket.connect();
            fetch(`http://${SERVER_IP}:4000/api/data`)
                .then(res => res.json())
                .then(data => { if (Array.isArray(data) && data.length > 0) setEngineData(data[0]); })
                .catch(err => console.error(err));
            socket.on('data_update', (newData) => setEngineData(newData));
        }
        return () => { socket.off('data_update'); };
    }, [rawRunning]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const index = Math.round(container.scrollLeft / container.clientWidth);
            if (index !== activeSection) setActiveSection(index);
        }
    };

    const scrollToSection = (idx: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: idx * scrollContainerRef.current.clientWidth,
                behavior: 'smooth'
            });
        }
    };

    if (!engineData) return (
        <div className="fixed inset-0 bg-[#0f171d] flex items-center justify-center font-mono text-[1.2vw] text-[#FFD700] animate-pulse">
            INITIALIZING_SECURE_DATA_STREAM...
        </div>
    );

    return (
        <div className="fixed top-[4vw]  inset-0 bg-[#0f171d] flex flex-col overflow-hidden font-sans text-white selection:bg-[#FFD700] selection:text-black">
            <BackgroundFUI />

            <header className="shrink-0 bg-black/20 backdrop-blur-md border-b border-white/5 px-[3vw] py-[1.5vw] z-50">
                <div className="flex justify-between items-start mb-[1.5vw]">
                    <div className="flex items-center gap-[1.5vw]">

                    </div>

                    <div className="flex bg-white/5 p-[0.3vw] rounded-lg border border-white/10">
                        {(['de', 'en', 'id'] as const).map((l) => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                className={`px-[1vw] py-[0.4vw] rounded text-[0.6vw] font-black transition-all ${lang === l ? 'bg-[#FFD700] text-black shadow-lg' : 'text-white/40 hover:text-white/70'}`}
                            >
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-[1vw] overflow-x-auto no-scrollbar pb-[0.5vw]">
                    {sections.map((s, idx) => (
                        <button
                            key={s.title}
                            onClick={() => scrollToSection(idx)}
                            className={`shrink-0 flex flex-col items-start transition-all px-[1.2vw] py-[0.6vw] rounded-md border ${activeSection === idx ? 'bg-white/10 border-[#FFD700]/50' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'}`}
                        >
                            <span className={`text-[0.5vw] font-black mb-[0.1vw] ${activeSection === idx ? 'text-[#FFD700]' : 'text-white/40'}`}>CH_0{idx + 1}</span>
                            <span className={`text-[0.8vw] font-bold uppercase tracking-widest ${activeSection === idx ? 'text-white' : 'text-white/60'}`}>
                                {s.title}
                            </span>
                        </button>
                    ))}
                </div>
            </header>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 flex overflow-hidden snap-x snap-mandatory z-10"
            >
                {sections.map((section, sIdx) => (
                    <div key={section.title} className="w-full shrink-0 snap-start h-full flex flex-col px-[3vw] py-[2vw] overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[6vw] content-start overflow-y-auto h-full pr-[1vw] no-scrollbar">
                            {section.keys.map((key, i) => {
                                const columnIndex = (i + section.offset + 1).toString();
                                const value = engineData[columnIndex] ?? '0';
                                return (
                                    <div key={key} className="flex justify-between items-center py-[0.8vw] border-b border-white/5 group hover:bg-white/5 px-[0.8vw] transition-all rounded-lg">
                                        <div className="flex gap-[0.8vw] items-center overflow-hidden mr-[1vw]">
                                            <span className="text-[0.8vw] text-[#FFD700]/40 font-mono w-[3vw] shrink-0 uppercase">ID.{String(sIdx + 1).padStart(2, '0')}.{String(i + 1).padStart(2, '0')}</span>
                                            <span className="text-[0.8vw] text-white/70 font-medium uppercase truncate group-hover:text-white transition-colors">
                                                {translations[key]?.[lang] || key}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-[1vw]">
                                            <div className="h-[1vw] w-[2vw] bg-white/5 rounded relative overflow-hidden hidden group-hover:block">
                                                <div className="absolute inset-0 bg-[#FFD700]/20 animate-pulse" style={{ width: `${Math.min(parseFloat(value) || 0, 100)}%` }} />
                                            </div>
                                            <span className={`text-[0.8vw] font-mono font-light tracking-tighter leading-none shrink-0 ${!rawRunning ? 'text-white/20' : 'text-white'}`}>
                                                {value}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default RawData;