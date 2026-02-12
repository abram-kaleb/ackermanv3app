// src/pages/Home.tsx

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

const Home = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('de');

    useEffect(() => {
        fetch(`http://${SERVER_IP}:4000/api/data`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setEngineData(data[0]); })
            .catch(err => console.error(err));

        socket.on('data_update', (newData) => setEngineData(newData));
        return () => { socket.off('data_update'); };
    }, []);

    return (
        <div className="w-full h-full bg-white overflow-hidden font-sans text-slate-900 relative" style={{ fontSize: '1.1vw' }}>
            {/* <header className="absolute top-0 left-0 w-full px-[3vw] pt-[3vw] z-30">
                <div className="flex flex-col items-center gap-[1vw]">
                    <div className="text-center">
                        <h1 className="text-[1.8vw] font-black tracking-tighter uppercase leading-none">
                            {uiLabels.title[lang]}
                        </h1>
                        <p className="text-[0.7vw] font-mono text-slate-400 mt-[0.4vw] tracking-widest uppercase">ID_{SERVER_IP}</p>
                    </div>

                    <div className="relative group">
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value as any)}
                            className="appearance-none bg-slate-100 border border-slate-200 px-[1.2vw] py-[0.4vw] rounded-lg text-[0.7vw] font-black text-slate-900 cursor-pointer hover:bg-slate-200 transition-all focus:outline-none shadow-sm"
                        >
                            <option value="de">DEUTSCH</option>
                            <option value="en">ENGLISH</option>
                            <option value="id">INDONESIA</option>
                        </select>
                        <div className="absolute right-[0.5vw] top-1/2 -translate-y-1/2 pointer-events-none text-[0.5vw] text-slate-400">
                            ▼
                        </div>
                    </div>
                </div>
            </header> */}

            {/* <div className="absolute inset-0 z-0">
                <EngineCanvas />
            </div> */}



            <div className="absolute left-[3vw] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-[1.5vw]">
                {[
                    { label: translations["Drehzahl Motor"][lang], val: engineData?.["8"], unit: "rpm", id: "1.8", isRPM: true },
                    { label: translations["Bremsleistung"][lang], val: engineData?.["9"], unit: "kW", id: "1.9" },
                    { label: translations["Füllung Motor"][lang], val: engineData?.["10"], unit: "%", id: "1.10" },
                    { label: translations["Anlaßluftdruck"][lang], val: engineData?.["11"], unit: "bar", id: "1.11" }
                ].map((item) => {
                    const displayVal = item.isRPM ? (item.val ? item.val / 10 : 0) : (item.val ?? 0);

                    return (
                        <div key={item.id} className="w-[20vw] group">
                            <div className="flex flex-col border-l-[3px] border-slate-900 pl-[1.2vw] py-[0.5vw] transition-all duration-300 group-hover:border-blue-500 group-hover:bg-slate-50">
                                <div className="flex items-center gap-[0.5vw] mb-[0.2vw]">
                                    <span className="text-[0.6vw] font-mono font-bold text-white bg-slate-900 px-[0.4vw] py-[0.1vw] rounded">
                                        {item.id}
                                    </span>
                                    <span className="text-[0.7vw] font-black text-slate-400 uppercase tracking-widest">
                                        {item.label} {item.isRPM && "(X10)"}
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-[0.4vw]">
                                    <span className="text-[3vw] font-mono font-black text-slate-900 leading-none tracking-tighter">
                                        {displayVal}
                                    </span>
                                    <span className="text-[0.9vw] font-bold text-slate-300 uppercase">
                                        {item.unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute top-[8vw] left-1/2 -translate-x-1/2 z-10 flex justify-center gap-[3vw] p-[0.5vw] w-fit">
                <div className="text-center min-w-[5vw]">
                    <p className="text-[0.6vw] font-black text-slate-400 uppercase tracking-widest mb-[0.1vw]">
                        {translations["Datum"][lang]}
                    </p>
                    <p className="text-[1.3vw] font-mono font-black text-slate-900 tracking-tighter">
                        {engineData?.["5"] ?? "00.00.0000"}
                    </p>
                </div>
                <div className="text-center min-w-[5vw]">
                    <p className="text-[0.6vw] font-black text-slate-400 uppercase tracking-widest mb-[0.1vw]">
                        {translations["Uhrzeit"][lang]}
                    </p>
                    <p className="text-[1.3vw] font-mono font-black text-slate-900 tracking-tighter">
                        {engineData?.["6"] ?? "00:00:00"}
                    </p>
                </div>
                <div className="border-l border-slate-200 pl-[3vw] text-center min-w-[5vw]">
                    <p className="text-[0.6vw] font-black text-slate-400 uppercase tracking-widest mb-[0.1vw]">
                        {translations["Betriebsstunden"][lang]}
                    </p>
                    <p className="text-[1.3vw] font-mono font-black text-slate-900 tracking-tighter">
                        {engineData?.["7"] ?? "0"}<span className="text-[0.7vw] ml-[0.1vw] text-slate-300 uppercase">h</span>
                    </p>
                </div>
            </div>

            <div className="absolute right-[3vw] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-[2vw] items-end text-right">
                {[
                    { label: translations["Fahrhebel Drehzahl"][lang], val: engineData?.["1"], unit: "%", id: "1.1" },
                    { label: translations["Fahrhebel Bremslast"][lang], val: engineData?.["2"], unit: "%", id: "1.2" }
                ].map((item) => (
                    <div key={item.id} className="flex flex-col items-end">
                        <span className="text-[0.6vw] font-black text-slate-400 uppercase tracking-[0.2em] mb-[0.2vw]">
                            {item.id} {item.label}
                        </span>
                        <div className="flex items-baseline gap-[0.2vw]">
                            <span className="text-[4vw] font-mono font-black text-slate-900 tracking-tighter leading-none">
                                {item.val ?? "0"}
                            </span>
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
                                <span className="text-[0.5vw] font-black text-slate-400 uppercase tracking-widest">
                                    {stat.id} {stat.label}
                                </span>
                                <span className="text-[1vw] font-mono font-black text-slate-900 leading-none">
                                    {stat.val ?? "0"}
                                </span>
                            </div>
                            <div className={`w-[0.7vw] h-[0.7vw] rounded-full shrink-0 ${stat.active ? `${stat.color} ${stat.pulse ? 'animate-pulse' : ''}` : 'bg-slate-200'}`}></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-[3vw] left-1/2 -translate-x-1/2 z-10 flex gap-[3vw] p-[0.5vw] w-fit justify-center">
                {[
                    { label: translations["Schmieröldruck"][lang], val: engineData?.["12"], id: "1.12" },
                    { label: translations["Kraftstoffdruck"][lang], val: engineData?.["13"], id: "1.13" },
                    { label: translations["LT Kühlwasserdruck"][lang], val: engineData?.["14"], id: "1.14" },
                    { label: translations["HT Kühlwasserdruck"][lang], val: engineData?.["15"], id: "1.15" },
                    { label: translations["Ladeluftdruck"][lang], val: engineData?.["16"], id: "1.16" }
                ].map((item, index) => (
                    <div
                        key={item.id}
                        className={`text-center min-w-[6vw] ${index === 2 ? 'border-l border-slate-200 pl-[3vw]' : ''}`}
                    >
                        <p className="text-[0.6vw] font-black text-slate-400 uppercase tracking-widest mb-[0.1vw] truncate">
                            {item.label}
                        </p>
                        <p className="text-[1.3vw] font-mono font-black text-slate-900 tracking-tighter">
                            {item.val ?? "0"}<span className="text-[0.7vw] ml-[0.1vw] text-slate-300 uppercase font-bold">bar</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;