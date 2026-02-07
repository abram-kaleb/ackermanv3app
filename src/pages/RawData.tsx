// src/pages/RawData.tsx
import React, { useEffect, useState, useContext, Fragment, useRef } from 'react';
import { io } from 'socket.io-client';
import { AppStatusContext } from '../App';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';

const SERVER_IP = '192.168.137.1';
const socket = io(`http://${SERVER_IP}:4000`, {
    transports: ['websocket', 'polling'],
    autoConnect: false
});

const RawData = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('de');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { rawRunning } = useContext(AppStatusContext);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sections = [
        {
            title: "ENGINE",
            offset: 0,
            keys: ["Fahrhebel Drehzahl", "Fahrhebel Bremslast", "Stopp/Betrieb", "Umschalter Pult / Maschine", "Datum", "Uhrzeit", "Betriebsstunden", "Drehzahl Motor", "Bremsleistung", "Füllung Motor", "Anlaßluftdruck", "Schmieröldruck", "Kraftstoffdruck", "LT Kühlwasserdruck", "HT Kühlwasserdruck", "Ladeluftdruck", "Druck Maschinenraum (atm. Druck)", "Temp. Maschinenraum", "Rel. Luftfeuchte", "Not-Aus-Taster", "Startzähler"]
        },
        {
            title: "EXHAUST",
            offset: 21,
            keys: ["Temp. n. Zylinder 1", "Temp. n. Zylinder 2", "Temp. n. Zylinder 3", "Temp. n. Zylinder 4", "Temp. n. Zylinder 5", "Temp. n. Zylinder 6", "Temp. v. ATL", "Temp. n. ATL", "Druck v. ATL", "Druck n. ATL", "Drehzahl ATL", "Temp. vor Schalldämpfer", "Abgastemperaturdifferenz", "Druck 1", "Druck 2", "Druck 3", "Druck 4", "Temp 1", "Temp 2", "Temp 3", "Temp 4", "Empty", "Konz 1", "Konz 2", "Mobil 1", "Mobil 2", "Mobil 3", "Mobil 4", "Mobil 5", "Mobil 6", "Mobil 7", "Mobil 8", "Mobil 9", "Mobil 10"]
        },
        {
            title: "HT COOLING",
            offset: 55,
            keys: ["HT Kühlwasser - Druck v. Motor", "HT Kühlwasser - Temp. v. Motor", "HT Kühlwasser - Temp. n. Zyl. 1", "HT Kühlwasser - Temp. n. Zyl. 2", "HT Kühlwasser - Temp. n. Zyl. 3", "HT Kühlwasser - Temp. n. Zyl. 4", "HT Kühlwasser - Temp. n. Zyl. 5", "HT Kühlwasser - Temp. n. Zyl. 6", "HT Kühlwasser - Temp. n. Motor", "HT Kühlwasser - Temp. v. Kühler", "HT Kühlwasser - Temp. n. Kühler", "HT Kühlwasser - Durchfluß", "HT Kühlwasser - Druck", "HT Kühlwasser - Stand by Pumpe", "HT Kühlwasser - Druckhaltepumpe", "HT Kühlwasser - Niveau Ex-Tank"]
        },
        {
            title: "LT COOLING",
            offset: 71,
            keys: ["LT Kühlwassrer - Temp. v. Ladeluftkühler", "LT Kühlwassrer - Temp. n. Ladeluftkühler", "LT Kühlwassrer - Temp. v. Schmierölkühler", "LT Kühlwassrer - Temp. n. Schmierölkühler", "LT Kühlwassrer - Temp. n. Zylinderkühlwasserkühler", "LT Kühlwassrer - Temp. Eintritt warme Seite Behälter", "LT Kühlwassrer - Durchfluß", "LT Kühlwassrer - Druck", "LT Kühlwassrer - Stand by LT Pumpe", "LT Kühlwassrer - Kühlturmpumpe", "LT Kühlwassrer - Druck Kühlturmpumpe", "LT Kühlwassrer - Gebläse Kühlturm", "LT Kühlwassrer - Temp. Behälter, kalte Seite", "LT Kühlwassrer - Bremsenwasser Zulaufpumpe", "LT Kühlwassrer - Bremsenwasser Ablaufpumpe"]
        },

        {
            title: "LUBE OIL",
            offset: 86,
            keys: ["Schmieröl - Druck n. Pumpe", "Schmieröl - Temp. n. Pumpe", "Schmieröl - Temp. v. Kühler", "Schmieröl - Temp. n. Kühler", "Schmieröl - Differenzdruck Doppelfilter", "Schmieröl - Druck v. Motor/ n. Filter", "Schmieröl - Temp. v. Motor", "Schmieröl - Durchfluß", "Schmieröl - Stand by Pumpe", "Schmieröl - Separator", "Schmieröl - Diff-Druck Feinfilter", "Schmieröl - Temp. v. letztem Lager", "Schmieröl - Ölnebelkonzentration"]
        },

        {
            title: "CHARGE AIR",
            offset: 99,
            keys: ["Ladeluft - Temp. v. ATL", "Ladeluft - Temp. v. Ladeluftkühler", "Ladeluft - Temp. n. Ladeluftkühler", "Ladeluft - Druck n. Ladeluftkühler", "Ladeluft - Druckdifferenz Blende", "Ladeluft - Empty", "Ladeluft - Durchsatz"]
        },

        {
            title: "FUEL",
            offset: 106,
            keys: ["Kraftstoff MDO - Druck v. Filter", "Kraftstoff MDO - Druck n. Doppelfilter", "Kraftstoff MDO - Temp. v. Motor", "Kraftstoff MDO - Durchsatz", "Kraftstoff MDO - Füllstand Tagestank", "Kraftstoff HFO - Vorwärmung/Begleitheizung", "Kraftstoff HFO - Temp. Vorratstank", "Kraftstoff HFO - Temp. v. Setztank", "Kraftstoff HFO - Temp. Setztank", "Kraftstoff HFO - Füllstand Setztank", "Kraftstoff HFO - Druck v. Vorwärmer", "Kraftstoff HFO - Temp. v. Vorwärmer", "Kraftstoff HFO - Druck n. Vorwärmer", "Kraftstoff HFO - Temp. n. Vorwärmer", "Kraftstoff HFO - Druck v. Tagestank", "Kraftstoff HFO - Temp. v. Tagestank", "Kraftstoff HFO - Temp. Tagestank", "Kraftstoff HFO - Druck v. Mischrohr", "Kraftstoff HFO - Temp. v. Mischrohr", "Kraftstoff HFO - Durchsatz v. Mischrohr", "Kraftstoff HFO - Druck v. Endvorwärmer", "Kraftstoff HFO - Temp. v. Endvorwärmer", "Kraftstoff HFO - Temp. n. Endvorwärmer", "Kraftstoff HFO - Viskosität n. Endvorwärmer", "Kraftstoff HFO - Druck v. Motor", "Kraftstoff HFO - Temp v. Motor", "Kraftstoff HFO - Zubringerpumpe zum Setztank", "Kraftstoff HFO - Separator 1", "Kraftstoff HFO - Separator 2", "Kraftstoff HFO - Zubringerpumpe zum Kraftstoffmodul", "Kraftstoff Flüssiggas - Druck 1",
                "Kraftstoff Flüssiggas - Druck 2", "Kraftstoff Flüssiggas - Druck 3", "Kraftstoff Flüssiggas - Druck 4", "Kraftstoff Flüssiggas - Druck 5", "Kraftstoff Flüssiggas - Temp 1", "Kraftstoff Flüssiggas - Temp 2", "Kraftstoff Flüssiggas - Temp 3", "Kraftstoff Flüssiggas - Temp 4", "Kraftstoff Flüssiggas - Temp 5", "Kraftstoff Flüssiggas - Konz 1", "Kraftstoff Flüssiggas - Konz 2", "Kraftstoff Flüssiggas - Konz 3", "Kraftstoff Flüssiggas - Konz 4", "Kraftstoff Flüssiggas - Konz 5", "Kraftstoff Flüssiggas - Durchsatz", "Kraftstoff Flüssiggas - Pumpe 1", "Kraftstoff Flüssiggas - Pumpe 2", "Kraftstoff Flüssiggas - Pumpe 3", "Kraftstoff Flüssiggas - Pumpe 4"]
        },



        {
            title: "STARTING AIR",
            offset: 156,
            keys: ["Anlassluft - Druck v. Motor", "Anlassluft - Verdichter 1", "Anlassluft - Verdichter 2"]
        },

        {
            title: "NOZZLE COOLING",
            offset: 159,
            keys: ["Düsenkühlung - Druck v. Motor", "Düsenkühlung - Temp. v. Motor", "Düsenkühlung - Temp. n. Motor", "Düsenkühlung - Durchsatz", "Düsenkühlung - Umwälzpumpe", "Düsenkühlung - Stand by Pumpe", "Düsenkühlung - Diff-Druck Filter", "Düsenkühlung - Niveau Umlauftank"]
        }



    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
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
        return () => {
            socket.off('data_update');
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [rawRunning]);

    if (!engineData) return (
        <div className="p-8 text-slate-900 font-mono text-[10px] animate-pulse">LOADING_STREAM...</div>
    );

    return (
        <div className="min-h-screen bg-white font-mono text-[10px] text-slate-900 selection:bg-slate-900 selection:text-white">
            <div className="fixed top-4 right-4 z-[100]" ref={dropdownRef}>
                <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="px-2 py-1 border border-slate-900 font-black uppercase tracking-tighter hover:bg-slate-900 hover:text-white transition-colors bg-white"
                >
                    {lang} {isLangOpen ? '×' : '+'}
                </button>
                {isLangOpen && (
                    <div className="absolute right-0 mt-1 bg-white border border-slate-900 p-1 flex flex-col gap-1 min-w-[60px]">
                        {(['de', 'en', 'id'] as Language[]).filter(l => l !== lang).map((l) => (
                            <button
                                key={l}
                                onClick={() => { setLang(l); setIsLangOpen(false); }}
                                className="px-2 py-1 text-slate-400 hover:text-slate-900 text-right uppercase"
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-12">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="h-0">
                            <th className="w-8"></th>
                            <th className="w-auto"></th>
                            <th className="w-20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((section, sIdx) => (
                            <Fragment key={section.title}>
                                <tr className="sticky top-0 z-40 bg-white">
                                    <td colSpan={3} className="pt-12 pb-2 border-b-2 border-slate-900">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-black text-xs tracking-tighter text-slate-900">// {section.title}</span>
                                            <span className="text-[9px] text-slate-900 opacity-30">0{sIdx + 1}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="sticky top-[42px] z-30 bg-white text-[9px] font-black uppercase border-b border-slate-900/10">
                                    <th className="py-2 text-slate-900">ID</th>
                                    <th className="py-2 text-slate-900">PARAMETER</th>
                                    <th className="py-2 text-right text-slate-900">VALUE</th>
                                </tr>
                                {section.keys.map((key, i) => (
                                    <tr key={key} className="group border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-2 text-slate-900 opacity-20 group-hover:opacity-100">{sIdx + 1}.{i + 1}</td>
                                        <td className="py-2 text-slate-900 truncate pr-4">
                                            {translations[key]?.[lang] || key}
                                        </td>
                                        <td className={`py-2 text-right font-black text-slate-900 ${!rawRunning ? 'opacity-20' : ''}`}>
                                            {engineData[(i + section.offset).toString()]}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="h-16"><td colSpan={3}></td></tr>
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RawData;