// src/pages/Simulation.tsx

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { uiLabels, translations } from '../data/translations';
import type { Language } from '../data/translations';
import EngineCanvas from '../components/EngineCanvas';

const SERVER_IP = '192.168.137.1';
const socket = io(`http://${SERVER_IP}:4000`, {
    transports: ['websocket', 'polling'],
    autoConnect: true
});

const Simulation = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('de');

    useEffect(() => {
        fetch(`http://${SERVER_IP}:4000/api/sim-data`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setEngineData(data[0]); })
            .catch(err => console.error(err));

        socket.on('sim_update', (newData) => setEngineData(newData));
        return () => { socket.off('sim_update'); };
    }, []);

    const [isLangOpen, setIsLangOpen] = useState(false);


    return (
        <div className="w-full h-full bg-white overflow-hidden font-sans text-slate-900 relative">
            <div className="fixed top-[2vw] right-[3vw] z-[10005]">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className={`px-[1.5vw] py-[0.6vw] text-[0.9vw] font-black uppercase cursor-pointer border-[0.15vw] border-slate-900 outline-none transition-all duration-300 italic tracking-tighter
            ${isLangOpen ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                    >
                        {lang}
                    </button>

                    {isLangOpen && (
                        <>
                            <div className="absolute top-[110%] right-0 flex flex-col bg-white border-[0.15vw] border-slate-900 animate-in slide-in-from-top-1 duration-200 z-[10006]">
                                {['de', 'en', 'id'].filter(l => l !== lang).map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLang(l as any);
                                            setIsLangOpen(false);
                                        }}
                                        className="px-[1.5vw] py-[0.6vw] text-[0.8vw] font-black text-slate-400 uppercase cursor-pointer border-none outline-none min-w-[5vw] text-center hover:text-slate-900 hover:bg-slate-100 transition-all italic tracking-tighter"
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                            <div
                                className="fixed inset-0 z-[10005] bg-transparent"
                                onClick={() => setIsLangOpen(false)}
                            />
                        </>
                    )}
                </div>
            </div>




            <>
                {/* POSITION: TOP RIGHT */}
                <div className="absolute top-[2vw] right-[3vw] z-20 flex flex-row gap-[3vw] items-center font-sans">
                    {[
                        { label: "DATE", val: engineData?.["5"], unit: "" },
                        { label: "TIME", val: engineData?.["6"], unit: "" },
                        { label: "OPERATE", val: engineData?.["7"], unit: "H" },
                        { label: "START", val: engineData?.["21"], unit: "X" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-end">
                            <span className="text-[0.6vw] font-black text-slate-400 tracking-[0.3em] uppercase italic leading-none mb-[0.4vw]">
                                {item.label}
                            </span>
                            <div className="flex items-baseline gap-[0.2vw]">
                                <span className="text-[1.6vw] font-black text-slate-900 leading-none tracking-tighter">
                                    {item.val ?? "0"}
                                </span>
                                {item.unit && (
                                    <span className="text-[0.7vw] font-black text-slate-400 italic">
                                        {item.unit}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* POSITION: MIDDLE RIGHT */}
                <div className="absolute right-[3vw] top-[45%] -translate-y-1/2 z-10 flex flex-col gap-[2.5vw] items-end font-sans">
                    <div className="flex flex-row gap-[1.5vw]">
                        {[
                            { label: translations["Drehzahl Motor"][lang], val: engineData?.["8"], unit: "RPM", max: 900 },
                            { label: translations["Bremsleistung"][lang], val: engineData?.["9"], unit: "kW", max: 1120 },
                            { label: translations["Füllung Motor"][lang], val: engineData?.["10"], unit: "%", max: 100 },
                            { label: translations["Anlaßluftdruck"][lang], val: engineData?.["11"], unit: "BAR", max: 30 }
                        ].map((item, idx) => {
                            const progress = Math.min((Number(item.val ?? 0) / item.max) * 100, 100);
                            return (
                                <div key={idx} className="flex flex-col items-end">
                                    <span className="text-[0.7vw] font-black text-slate-400 uppercase tracking-widest mb-[0.5vw] italic">
                                        {item.label}
                                    </span>
                                    <div className="flex items-baseline gap-[0.4vw]">
                                        <span className="text-[3.5vw] font-black leading-none text-slate-900 tracking-tighter">
                                            {item.val ?? "0"}
                                        </span>
                                        <span className="text-[1vw] font-black text-slate-400 uppercase italic">{item.unit}</span>
                                    </div>
                                    <div className="w-[8vw] h-[2px] bg-slate-100 mt-[0.5vw] overflow-hidden">
                                        <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-row gap-[2.5vw] border-t border-slate-100 pt-[1.5vw]">
                        {[
                            { label: "LUBE OIL", val: engineData?.["12"] },
                            { label: "FUEL", val: engineData?.["13"] },
                            { label: "LT WATER", val: engineData?.["14"] },
                            { label: "HT WATER", val: engineData?.["15"] },
                            { label: "CHARGE AIR", val: engineData?.["16"] }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-end">
                                <span className="text-[0.55vw] font-black text-slate-300 uppercase tracking-tighter italic mb-[0.2vw]">{item.label}</span>
                                <div className="flex items-baseline gap-[0.2vw]">
                                    <span className="text-[1.8vw] font-black text-slate-800 leading-none tracking-tighter">{item.val ?? "0"}</span>
                                    <span className="text-[0.6vw] font-bold text-slate-400 uppercase">bar</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* POSITION: BOTTOM RIGHT */}
                <div className="absolute bottom-[3vw] right-[3vw] z-10 flex flex-row gap-[3vw] font-sans border-t border-slate-100 pt-[1vw]">
                    {[
                        { label: "ROOM PRESSURE", val: engineData?.["17"], unit: "mbar" },
                        { label: "ROOM TEMP", val: engineData?.["18"], unit: "°C" },
                        { label: "HUMIDITY", val: engineData?.["19"], unit: "%" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-end">
                            <span className="text-[0.55vw] font-bold text-slate-400 uppercase italic tracking-widest mb-[0.2vw]">{item.label}</span>
                            <div className="flex items-baseline gap-[0.2vw]">
                                <span className="text-[1.4vw] font-black text-slate-900">{item.val ?? "0"}</span>
                                <span className="text-[0.6vw] font-bold text-slate-400 italic">{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </>

            <div className="absolute inset-y-0 left-0 w-[58vw] h-[100vh] z-0 overflow-hidden">
                {/* <EngineCanvas /> */}

            </div>

            <div className="absolute left-[3vw] bottom-[3vw] z-20 flex flex-col bg-white border-[0.15vw] border-slate-900 font-sans">
                <div className="flex flex-row border-b-[0.15vw] border-slate-900">
                    {[
                        {
                            label: `${translations["Fahrhebel Drehzahl"][lang]} (%)`,
                            val: engineData?.["1"],
                            id: "1.1",
                            onPlus: () => console.log("Speed Plus"),
                            onMinus: () => console.log("Speed Minus")
                        },
                        {
                            label: `${translations["Fahrhebel Bremslast"][lang]} (%)`,
                            val: engineData?.["2"],
                            id: "1.2",
                            onPlus: () => console.log("Load Plus"),
                            onMinus: () => console.log("Load Minus")
                        }
                    ].map((item, idx) => (
                        <div key={item.id} className={`p-[0.8vw] flex-1 min-w-[14vw] flex flex-col items-center ${idx === 0 ? 'border-r-[0.15vw] border-slate-900' : ''}`}>
                            <span className="text-[0.75vw] font-black text-slate-500 uppercase tracking-tighter mb-[0.6vw] italic">
                                {item.label}
                            </span>
                            <div className="flex items-center justify-between w-full px-[0.5vw]">
                                <button onClick={item.onMinus} className="w-[2.5vw] h-[2.5vw] bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center text-[1.4vw] font-black border border-slate-900">-</button>
                                <span className="text-[3.2vw] font-black text-blue-600 tracking-tighter leading-none min-w-[4vw] text-center">{item.val ?? "0"}</span>
                                <button onClick={item.onPlus} className="w-[2.5vw] h-[2.5vw] bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center text-[1.4vw] font-black border border-slate-900">+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-row bg-slate-50">
                    {[
                        { label: translations["Stopp/Betrieb"][lang], active: engineData?.["3"] === "1", color: "bg-emerald-500", id: "1.3" },
                        { label: translations["Umschalter Pult / Maschine"][lang], active: engineData?.["4"] === "1", color: "bg-blue-500", id: "1.4" },
                        { label: translations["Not-Aus-Taster"][lang], active: engineData?.["20"] !== "0", color: "bg-red-500", pulse: true, id: "1.20" }
                    ].map((stat, idx) => (
                        <button
                            key={stat.id}
                            className={`flex-1 flex items-center justify-center gap-[0.6vw] py-[1vw] px-[0.8vw] hover:bg-white transition-all ${idx !== 2 ? 'border-r-[0.1vw] border-slate-200' : ''}`}
                        >
                            <div className={`w-[0.8vw] h-[0.8vw] rounded-full border border-slate-900/20 ${stat.active ? `${stat.color} ${stat.pulse ? 'animate-pulse' : ''}` : 'bg-slate-200'}`} />
                            <span className="text-[0.6vw] font-black text-slate-900 uppercase italic tracking-tighter whitespace-nowrap">
                                {stat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>





        </div>
    );
};

export default Simulation;