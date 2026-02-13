// src/pages/Home.tsx

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import EngineCanvas from '../components/EngineCanvas';
import HomeMonitor from '../components/HomeMonitor';
import ConditionPanel from '../components/ConditionPanel';
import AlarmPanel from '../components/AlarmPanel';
import TrendGraph from '../components/TrendGraph';


const SERVER_IP = '192.168.137.1';
const socket = io(`http://${SERVER_IP}:4000`, {
    transports: ['websocket', 'polling'],
    autoConnect: true
});


const BackgroundFUI = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f171d]">
            <div className="absolute -left-[5%] -bottom-[5%] w-[60vw] h-[60vw] opacity-40 blur-[80px]" style={{ background: 'radial-gradient(circle at bottom left, rgba(100, 210, 255, 0.25) 0%, transparent 70%)' }} />
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] opacity-40 blur-[110px] scale-x-[1.5] -rotate-[15deg]" style={{ background: 'radial-gradient(circle, rgba(140, 180, 200, 0.3) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[60vw] opacity-30 blur-[90px] -skew-x-[20deg]" style={{ background: 'radial-gradient(circle, rgba(100, 150, 180, 0.25) 0%, transparent 75%)' }} />
            <div className="absolute inset-0 opacity-[0.08] mix-blend-lighten blur-[1px]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/snow.png")` }} />
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(to right, rgba(100,200,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,200,255,0.15) 1px, transparent 1px)', backgroundSize: '4vw 4vw' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.5)_130%)]" />
        </div>
    );
};


const Home = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('de');

    const [isMonitorOpen, setIsMonitorOpen] = useState(false);
    const [historicalData, setHistoricalData] = useState<any[]>([]);

    useEffect(() => {
        if (engineData) {
            setHistoricalData(prev => {

                const newData = [...prev, engineData];

                if (newData.length > 100) return newData.slice(1);
                return newData;
            });
        }
    }, [engineData]);

    useEffect(() => {
        fetch(`http://${SERVER_IP}:4000/api/data`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setEngineData(data[0]); })
            .catch(err => console.error(err));

        socket.on('data_update', (newData) => setEngineData(newData));
        return () => { socket.off('data_update'); };
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden font-sans text-white">
            <BackgroundFUI />

            {/* RIGHT SIDE PANELS CONTAINER */}
            <div className="absolute top-[6vw] right-[2vw] z-50 flex flex-col gap-[1vw] pointer-events-none">
                <ConditionPanel
                    engineData={engineData}
                    lang={lang}
                />
                <AlarmPanel
                    engineData={engineData}
                    lang={lang}
                />
            </div>


            {/* TOP LEFT: DATE, TIME & OPERATION INFO */}
            <div className="absolute top-[18vw] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-y-[1.2vw]">
                {/* PRIMARY DATA: DATE, TIME, OPERATE, START */}
                <div className="flex items-center gap-[2vw]">
                    {[
                        { label: "DATE", val: engineData?.["5"] },
                        { label: "TIME", val: engineData?.["6"] },
                        { label: "OPERATE", val: engineData?.["7"], unit: "H" },
                        { label: "START", val: engineData?.["21"], unit: "X" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-start">
                            <div className="flex items-center gap-1 mb-[0.1vw]">
                                <div className="w-[1.5px] h-[0.7vw] bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                                <span className="text-[0.9vw] font-bold text-white/90 tracking-widest uppercase">
                                    {item.label}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-[0.2vw] pl-[calc(1.5px+0.2vw)]">
                                <span className="text-[1.2vw] font-medium text-white leading-none tracking-tighter font-mono">
                                    {item.val ?? "0"}
                                </span>
                                {item.unit && (
                                    <span className="text-[0.9vw] font-bold text-[#FFD700] italic opacity-50 uppercase">
                                        {item.unit}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* MONITORING PANEL: GAUGES & INDICATORS */}
            <div className="absolute left-[3vw] top-[20vw] -translate-y-1/2 z-20 flex flex-col gap-y-[2.5vw] w-fit">

                {/* TOP SECTION: ENGINE PERFORMANCE GAUGES (HORIZONTAL) */}
                <div className="flex flex-row gap-x-[1vw]">
                    {[
                        { label: "ENGINE SPEED", val: engineData?.["8"], unit: "RPM", max: 900 },
                        { label: "BRAKE POWER", val: engineData?.["9"], unit: "kW", max: 1120 },
                        { label: "ENGINE LOAD", val: engineData?.["10"], unit: "%", max: 100 },
                    ].map((item, idx) => {
                        const progress = Math.min((Number(item.val ?? 0) / item.max) * 100, 100);
                        const radius = 42;
                        const circumference = 2 * Math.PI * radius;
                        const offset = circumference - (progress / 100) * circumference;

                        return (
                            <div key={idx} className="flex flex-col items-center gap-y-[0.8vw] w-[7vw]">
                                <div className="flex flex-col items-center justify-center h-[2.2vw] text-center">
                                    <span className="text-[0.9vw] font-bold text-white/90 tracking-tighter uppercase leading-[1.1]">
                                        {item.label.split(' ').map((word, i) => (
                                            <span key={i} className="block">{word}</span>
                                        ))}
                                    </span>
                                </div>

                                <div className="relative w-[7vw] h-[7vw]">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={circumference}
                                            style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                            className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                                        <span className="text-[1.5vw] font-bold text-white tracking-tighter leading-none font-mono">
                                            {item.val ?? "0"}
                                        </span>
                                        <span className="text-[0.9vw] font-black text-yellow-400/80 uppercase italic mt-[-2px]">{item.unit}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


                {/* BOTTOM SECTION: PRESSURE & FLUID INDICATORS (COMPACT GRID) */}
                <div className="grid grid-cols-3 gap-x-[1.5vw] gap-y-[2vw] ml-[1vw]">
                    {[
                        { label: "STARTING AIR", val: engineData?.["11"], max: 30, unit: "BAR" },
                        { label: "LUBE OIL", val: engineData?.["12"], max: 10, unit: "BAR" },
                        { label: "FUEL", val: engineData?.["13"], max: 15, unit: "BAR" },
                        { label: "LT WATER", val: engineData?.["14"], max: 6, unit: "BAR" },
                        { label: "HT WATER", val: engineData?.["15"], max: 6, unit: "BAR" },
                        { label: "CHARGE AIR", val: engineData?.["16"], max: 4, unit: "BAR" }
                    ].map((item, idx) => {
                        const progress = Math.min((Number(item.val ?? 0) / item.max) * 100, 100);
                        return (
                            <div key={idx} className="flex flex-col items-start w-[7vw]">
                                <div className="flex items-center gap-1.5 mb-[0.1vw]">
                                    <div className="w-[1.5px] h-[0.7vw] bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.4)]" />
                                    <span className="text-[0.9vw] font-bold text-white/90 uppercase tracking-tighter leading-none">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-[0.3vw] leading-none mb-0.5">
                                    <span className="text-[1.5vw] font-medium text-white tracking-tighter font-mono">
                                        {item.val ?? "0.0"}
                                    </span>
                                    <span className="text-[0.9vw] font-bold text-yellow-400/80 uppercase italic">
                                        {item.unit}
                                    </span>
                                </div>
                                <div className="w-full">
                                    <div className="relative w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.3)] transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* SECONDARY DATA: ROOM INFO (HORIZONTAL LINE BELOW) */}
                <div className="flex items-center gap-[2vw] ml-[0.1vw]">
                    {[
                        { label: "ROOM PRESSURE", val: engineData?.["17"], unit: "mbar" },
                        { label: "ROOM TEMP", val: engineData?.["18"], unit: "°C" },
                        { label: "HUMIDITY", val: engineData?.["19"], unit: "%" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-start border-l border-white/10 pl-[0.8vw]">
                            <span className="text-[0.9vw] font-bold text-white/90 uppercase tracking-tighter mb-[0.1vw]">
                                {item.label}
                            </span>
                            <div className="flex items-baseline gap-[0.2vw]">
                                <span className="text-[1.1vw] font-light text-white/90 leading-none font-mono">
                                    {item.val ?? "0"}
                                </span>
                                <span className="text-[0.9vw] font-bold text-yellow-400/80 uppercase">
                                    {item.unit}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* CENTER: 3D ENGINE MODEL */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-[45vw] h-[50vw] absolute top-[-6vw] left-1/2 -translate-x-1/2">
                    <EngineCanvas />
                </div>
            </div>


            <div className="absolute left-[3.6vw] bottom-[2.4vw] z-20 flex flex-row ">
                {[
                    {
                        label: "SPEED CONTROL",
                        val: engineData?.["1"],
                        id: "1.1"
                    },
                    {
                        label: "LOAD CONTROL",
                        val: engineData?.["2"],
                        id: "1.2"
                    }
                ].map((item) => (
                    <div key={item.id} className="flex flex-col items-start min-w-[8vw]">
                        <div className="flex items-center gap-1.5 mb-[0.5vw] h-[2.2vw]">
                            <div className="w-[2px] h-[0.9vw] bg-yellow-400" />
                            <span className="text-[0.9vw] font-bold text-white/90 uppercase tracking-tighter leading-[1.1]">
                                {item.label.split(' ').map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-[0.4vw]">
                            <span className="text-[2.2vw] font-medium text-white tracking-tighter leading-none font-mono">
                                {item.val ?? "0"}
                            </span>
                            <span className="text-[0.9vw] font-bold text-yellow-400/60 italic uppercase">
                                %
                            </span>
                        </div>
                    </div>
                ))}
            </div>


            <div className="absolute left-[19vw] bottom-[2.7vw] z-20 flex flex-col justify-center gap-y-[1vw]">
                {[
                    { label: "STOP / RUN", active: engineData?.["3"] === "1", color: "bg-emerald-400", id: "1.3" },
                    { label: "LOCAL / REMOTE", active: engineData?.["4"] === "1", color: "bg-blue-400", id: "1.4" },
                    { label: "EMERGENCY", active: engineData?.["20"] !== "0", color: "bg-red-500", pulse: true, id: "1.20" }
                ].map((stat) => (
                    <div
                        key={stat.id}
                        className="flex items-center gap-[0.8vw]"
                    >
                        <div className={`w-[0.7vw] h-[0.7vw] rounded-full transition-all duration-500 ${stat.active
                            ? `${stat.color} shadow-[0_0_10px_rgba(255,255,255,0.3)] ${stat.pulse ? 'animate-pulse' : ''}`
                            : 'bg-white/10 shadow-inner'
                            }`} />
                        <span className={`text-[0.9vw] font-bold uppercase tracking-tighter whitespace-nowrap leading-none ${stat.active ? 'text-white/90' : 'text-white/20'}`}>
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>








            {/* MONITOR TRIGGER BUTTON */}
            <div className="absolute top-[5vw] left-[4vw] z-50">
                <button
                    onClick={() => setIsMonitorOpen(true)}
                    className="group relative flex items-center gap-[0.8vw] px-[6vw] py-[0.7vw] bg-black/40 backdrop-blur-md border border-white/40 rounded-lg hover:border-yellow-400 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-yellow-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                    <div className="relative flex flex-col gap-[2px]">
                        <div className="w-[1.2vw] h-[2px] bg-yellow-400 group-hover:w-[1.5vw] transition-all" />
                        <div className="w-[0.8vw] h-[2px] bg-yellow-400/90" />
                        <div className="w-[1.2vw] h-[2px] bg-yellow-400 group-hover:w-[0.6vw] transition-all" />
                    </div>

                    <div className="relative flex flex-col items-start border-l border-white/10 pl-[0.8vw]">

                        <span className="text-[0.8vw] font-black text-white uppercase tracking-[0.15em]">FULL MONITOR</span>
                    </div>
                </button>
            </div>

            {/* MONITOR WINDOW OVERLAY */}
            {
                isMonitorOpen && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-[4vw]">
                        <div className="relative w-full h-full max-w-[85vw] max-h-[85vh] flex flex-col">
                            {/* Close Action Triggered from Outside/Header Container */}
                            <button
                                onClick={() => setIsMonitorOpen(false)}
                                className="absolute -top-[1vw] -right-[1vw] z-[110] w-[2.5vw] h-[2.5vw] bg-red-500 text-white rounded-full flex items-center justify-center text-[1.2vw] font-bold shadow-xl hover:bg-red-600 transition-colors border-2 border-[#0f171d]"
                            >
                                ✕
                            </button>

                            <div className="w-full h-full overflow-hidden rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                <HomeMonitor />
                            </div>
                        </div>
                    </div>
                )
            }


            <div className="absolute right-1/2 translate-x-1/2 bottom-[1vw] h-[10vw] w-[35vw] z-20">
                <TrendGraph data={historicalData} />
            </div>



        </div >
    );
};

export default Home;