// src/pages/Monitor.tsx

import { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AppStatusContext } from '../App';
import EngineCanvas from '../components/EngineCanvas';
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
            <div className="absolute -left-[5%] -bottom-[5%] w-[60vw] h-[60vw] opacity-40 blur-[80px]" style={{ background: 'radial-gradient(circle at bottom left, rgba(100, 210, 255, 0.25) 0%, transparent 70%)' }} />

        </div>
    );
};

const Monitor = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('id');
    const { rawRunning } = useContext(AppStatusContext);

    useEffect(() => {
        if (!rawRunning) {
            socket.disconnect();
            return;
        }
        socket.connect();
        fetch(`http://${SERVER_IP}:4000/api/sim-data`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setEngineData(data[0]); })
            .catch(err => console.error(err));

        socket.on('sim_update', (newData) => setEngineData(newData));
        return () => { socket.off('sim_update'); };
    }, [rawRunning]);

    const t = (key: string) => {
        return translations[key]?.[lang] || key;
    };

    const renderMetric = (germanKey: string, val: any, unit: string, max?: number) => {
        const label = t(germanKey);
        const numericVal = Number(val ?? 0);
        const isCritical = max ? numericVal >= max * 0.9 : false;
        return (
            <div className="flex justify-between items-baseline border-b border-white/[0.03] pb-[0.2vw] mb-[0.2vw]">
                <span className="text-[0.8vw] text-white/100 font-medium uppercase tracking-wider">{label}</span>
                <div className="flex items-baseline gap-x-1">
                    <span className={`text-[0.8vw] font-mono font-light ${isCritical ? 'text-red-500 animate-pulse font-bold' : 'text-yellow-400/80'}`}>
                        {val ?? "---"}
                    </span>
                    <span className="text-[0.8vw] text-white/100 font-bold uppercase">{unit}</span>
                </div>
            </div>
        );
    };

    const renderStatus = (germanKey: string, val: any, activeLabel: string, type: 'OP' | 'SEL' | 'STOP') => {
        const label = t(germanKey);
        const isActive = String(val).toUpperCase() === activeLabel || val === "1" || val === 1;
        let colorClass = "bg-white/5 text-white/100";
        let displayVal = val ?? "---";

        if (type === 'OP') {
            colorClass = isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";
            displayVal = isActive ? (lang === 'id' ? "OPERASI" : lang === 'en' ? "OPERATION" : "BETRIEB") : "STOP";
        } else if (type === 'SEL') {
            colorClass = "bg-blue-500/20 text-blue-400";
            displayVal = isActive ? (lang === 'id' ? "MESIN" : lang === 'en' ? "MACHINE" : "MASCHINE") : (lang === 'id' ? "KONSOL" : lang === 'en' ? "CONSOLE" : "PULT");
        } else if (type === 'STOP') {
            colorClass = isActive ? "bg-red-600 text-white animate-bounce" : "bg-green-500/10 text-green-500/40";
            displayVal = isActive ? (lang === 'id' ? "DARURAT" : lang === 'en' ? "EMERGENCY" : "NOT-AUS") : "NORMAL";
        }

        return (
            <div className="flex justify-between items-center border-b border-white/[0.03] pb-[0.2vw] mb-[0.2vw]">
                <span className="text-[0.8vw] text-white/100 font-bold uppercase tracking-wider">{label}</span>
                <span className={`text-[0.8vw] px-2 py-0.5 rounded-sm font-black tracking-tighter ${colorClass}`}>{displayVal}</span>
            </div>
        );
    };



    return (
        <div className="relative z-10 w-full h-full flex overflow-x-auto scrollbar-hide pt-[5vw] pb-[4vw]">
            <BackgroundFUI />

            <div className="fixed top-[3.5vw] right-[1.5vw] z-[9999] flex gap-2 pointer-events-auto">
                {(['de', 'en', 'id'] as Language[]).map((l) => (
                    <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`text-[0.7vw] px-[0.8vw] py-[0.2vw] font-black tracking-widest uppercase border transition-all duration-300 ${lang === l
                            ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                            : 'bg-[#0f171d]/80 backdrop-blur-md text-white/40 border-white/10 hover:border-white/30'
                            }`}
                    >
                        {l}
                    </button>
                ))}
            </div>



            <div className="relative z-10 w-full h-full flex">


                <div className="w-[20vw] p-[1.5vw] relative border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1">
                        <h3 className="text-[0.8vw] font-black text-yellow-400 tracking-[0.3em] italic uppercase border-b border-white/5 pb-1 w-fit whitespace-nowrap">
                            ENGINE
                        </h3>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col gap-y-0.5 pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            {renderMetric("Fahrhebel Drehzahl", engineData?.["1"], "RPM", 900)}
                            {renderMetric("Fahrhebel Bremslast", engineData?.["2"], "VAL", 100)}
                            {renderStatus("Stopp/Betrieb", engineData?.["3"], "1", "OP")}
                            {renderStatus("Umschalter Pult / Maschine", engineData?.["4"], "1", "SEL")}
                            {renderMetric("Datum", engineData?.["5"], "")}
                            {renderMetric("Uhrzeit", engineData?.["6"], "")}
                            {renderMetric("Betriebsstunden", engineData?.["7"], "H")}
                            {renderMetric("Drehzahl Motor", engineData?.["8"], "RPM", 900)}
                            {renderMetric("Bremsleistung", engineData?.["9"], "kW", 1120)}
                            {renderMetric("Füllung Motor", engineData?.["10"], "%", 100)}
                            {renderMetric("Anlaßluftdruck", engineData?.["11"], "BAR", 12)}
                            {renderMetric("Schmieröldruck", engineData?.["12"], "BAR", 5)}
                            {renderMetric("Kraftstoffdruck", engineData?.["13"], "BAR", 10)}
                            {renderMetric("LT Kühlwasserdruck", engineData?.["14"], "BAR", 2.5)}
                            {renderMetric("HT Kühlwasserdruck", engineData?.["15"], "BAR", 2.5)}
                            {renderMetric("Ladeluftdruck", engineData?.["16"], "BAR", 3.9)}
                            {renderMetric("Druck Maschinenraum (atm. Druck)", engineData?.["17"], "BAR", 1.02)}
                            {renderMetric("Temp. Maschinenraum", engineData?.["18"], "°C", 60)}
                            {renderMetric("Rel. Luftfeuchte", engineData?.["19"], "%RH", 100)}
                            {renderStatus("Not-Aus-Taster", engineData?.["20"], "1", "STOP")}
                            {renderMetric("Startzähler", engineData?.["21"], "CNT")}
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[4px] h-[4px] border-t border-l border-white/20" />
                </div>


                <div className="w-[20vw] p-[1.5vw] relative border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1">
                        <h3 className="text-[0.8vw] font-black text-yellow-400 tracking-[0.3em] italic uppercase border-b border-white/5 pb-1 w-fit whitespace-nowrap">
                            EXHAUST
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-y-0.5 pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            {renderMetric("Temp. n. Zylinder 1", engineData?.["22"], "°C", 500)}
                            {renderMetric("Temp. n. Zylinder 2", engineData?.["23"], "°C", 500)}
                            {renderMetric("Temp. n. Zylinder 3", engineData?.["24"], "°C", 500)}
                            {renderMetric("Temp. n. Zylinder 4", engineData?.["25"], "°C", 500)}
                            {renderMetric("Temp. n. Zylinder 5", engineData?.["26"], "°C", 500)}
                            {renderMetric("Temp. n. Zylinder 6", engineData?.["27"], "°C", 500)}
                            {renderMetric("Temp. v. ATL", engineData?.["28"], "°C", 650)}
                            {renderMetric("Temp. n. ATL", engineData?.["29"], "°C", 450)}
                            {renderMetric("Druck v. ATL", engineData?.["30"], "BAR")}
                            {renderMetric("Druck n. ATL", engineData?.["31"], "BAR")}
                            {renderMetric("Drehzahl ATL", engineData?.["32"], "RPM")}
                            {renderMetric("Temp. vor Schalldämpfer", engineData?.["33"], "°C")}
                            {renderMetric("Abgastemperaturdifferenz", engineData?.["34"], "ΔT")}
                            {renderMetric("Druck 1", engineData?.["35"], "BAR")}
                            {renderMetric("Druck 2", engineData?.["36"], "BAR")}
                            {renderMetric("Druck 3", engineData?.["37"], "BAR")}
                            {renderMetric("Druck 4", engineData?.["38"], "BAR")}
                            {renderMetric("Temp 1", engineData?.["39"], "°C")}
                            {renderMetric("Temp 2", engineData?.["40"], "°C")}
                            {renderMetric("Temp 3", engineData?.["41"], "°C")}
                            {renderMetric("Temp 4", engineData?.["42"], "°C")}
                            {renderMetric("-", engineData?.["43"], "")}
                            {renderMetric("Konz 1", engineData?.["44"], "ppm")}
                            {renderMetric("Konz 2", engineData?.["45"], "ppm")}
                            {renderMetric("Mobil 1", engineData?.["46"], "")}
                            {renderMetric("Mobil 2", engineData?.["47"], "")}
                            {renderMetric("Mobil 3", engineData?.["48"], "")}
                            {renderMetric("Mobil 4", engineData?.["49"], "")}
                            {renderMetric("Mobil 5", engineData?.["50"], "")}
                            {renderMetric("Mobil 6", engineData?.["51"], "")}
                            {renderMetric("Mobil 7", engineData?.["52"], "")}
                            {renderMetric("Mobil 8", engineData?.["53"], "")}
                            {renderMetric("Mobil 9", engineData?.["54"], "")}
                            {renderMetric("Mobil 10", engineData?.["55"], "")}
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[4px] h-[4px] border-t border-l border-white/20" />
                </div>


                <div className="w-[22vw] p-[1.5vw] relative border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1">
                        <h3 className="text-[0.8vw] font-black text-yellow-400 tracking-[0.3em] italic uppercase border-b border-white/5 pb-1 w-fit whitespace-nowrap">
                            HT COOLING
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-y-0.5 pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            {renderMetric("HT Kühlwasser - Druck v. Motor", engineData?.["56"], "BAR")}
                            {renderMetric("HT Kühlwasser - Temp. v. Motor", engineData?.["57"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. n. Zyl. 1", engineData?.["58"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. n. Zyl. 2", engineData?.["59"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. n. Zyl. 3", engineData?.["60"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. n. Zyl. 4", engineData?.["61"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. n. Zyl. 5", engineData?.["62"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. n. Zyl. 6", engineData?.["63"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. n. Motor", engineData?.["64"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. v. Kühler", engineData?.["65"], "°C")}
                            {renderMetric("HT Kühlwasser - Temp. n. Kühler", engineData?.["66"], "°C")}
                            {renderMetric("HT Kühlwasser - Durchfluß", engineData?.["67"], "m³/h")}
                            {renderMetric("HT Kühlwasser - Druck", engineData?.["68"], "BAR")}
                            {renderStatus("HT Kühlwasser - Stand by Pumpe", engineData?.["69"], "1", "OP")}
                            {renderStatus("HT Kühlwasser - Druckhaltepumpe", engineData?.["70"], "1", "OP")}
                            {renderMetric("HT Kühlwasser - Niveau Ex-Tank", engineData?.["71"], "%")}
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[4px] h-[4px] border-t border-l border-white/20" />
                </div>

                <div className="w-[25vw] p-[1.5vw] relative border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1 flex justify-between items-center">
                        <h3 className="text-[0.7vw] font-black text-yellow-400 tracking-[0.2em] italic uppercase">LT COOLING</h3>
                        <span className="text-[0.45vw] text-yellow-400/40 font-mono tracking-[0.2em]">CH_05</span>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-y-0.5 pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            {renderMetric("LT Kühlwassrer - Temp. v. Ladeluftkühler", engineData?.["72"], "°C")}
                            {renderMetric("LT Kühlwassrer - Temp. n. Ladeluftkühler", engineData?.["73"], "°C")}
                            {renderMetric("LT Kühlwassrer - Temp. v. Schmierölkühler", engineData?.["74"], "°C")}
                            {renderMetric("LT Kühlwassrer - Temp. n. Schmierölkühler", engineData?.["75"], "°C")}
                            {renderMetric("LT Kühlwassrer - Temp. n. Zylinderkühlwasserkühler", engineData?.["76"], "°C")}
                            {renderMetric("LT Kühlwassrer - Temp. Eintritt warme Seite Behälter", engineData?.["77"], "°C")}
                            {renderMetric("LT Kühlwassrer - Durchfluß", engineData?.["78"], "m³/h")}
                            {renderMetric("LT Kühlwassrer - Druck", engineData?.["79"], "BAR")}
                            {renderStatus("LT Kühlwassrer - Stand by LT Pumpe", engineData?.["80"], "1", "OP")}
                            {renderStatus("LT Kühlwassrer - Kühlturmpumpe", engineData?.["81"], "1", "OP")}
                            {renderMetric("LT Kühlwassrer - Druck Kühlturmpumpe", engineData?.["82"], "BAR")}
                            {renderStatus("LT Kühlwassrer - Gebläse Kühlturm", engineData?.["83"], "1", "OP")}
                            {renderMetric("LT Kühlwassrer - Temp. Behälter, kalte Seite", engineData?.["84"], "°C")}
                            {renderStatus("LT Kühlwassrer - Bremsenwasser Zulaufpumpe", engineData?.["85"], "1", "OP")}
                            {renderStatus("LT Kühlwassrer - Bremsenwasser Ablaufpumpe", engineData?.["86"], "1", "OP")}
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[3px] h-[3px] border-t border-l border-white/10" />
                </div>

                <div className="w-[20vw] p-[1.5vw] relative border-r border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1 flex justify-between items-center">
                        <h3 className="text-[0.7vw] font-black text-yellow-400 tracking-[0.2em] italic uppercase">LUBE OIL</h3>
                        <span className="text-[0.45vw] text-yellow-400/40 font-mono tracking-[0.2em]">CH_06</span>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-y-0.5 pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            {renderMetric("Schmieröl - Druck n. Pumpe", engineData?.["87"], "BAR")}
                            {renderMetric("Schmieröl - Temp. n. Pumpe", engineData?.["88"], "°C")}
                            {renderMetric("Schmieröl - Temp. v. Kühler", engineData?.["89"], "°C")}
                            {renderMetric("Schmieröl - Temp. n. Kühler", engineData?.["90"], "°C")}
                            {renderMetric("Schmieröl - Differenzdruck Doppelfilter", engineData?.["91"], "BAR")}
                            {renderMetric("Schmieröl - Druck v. Motor/ n. Filter", engineData?.["92"], "BAR")}
                            {renderMetric("Schmieröl - Temp. v. Motor", engineData?.["93"], "°C")}
                            {renderMetric("Schmieröl - Durchfluß", engineData?.["94"], "m³/h")}
                            {renderStatus("Schmieröl - Stand by Pumpe", engineData?.["95"], "1", "OP")}
                            {renderStatus("Schmieröl - Separator", engineData?.["96"], "1", "OP")}
                            {renderMetric("Schmieröl - Diff-Druck Feinfilter", engineData?.["97"], "BAR")}
                            {renderMetric("Schmieröl - Temp. v. letztem Lager", engineData?.["98"], "°C")}
                            {renderMetric("Schmieröl - Ölnebelkonzentration", engineData?.["99"], "%")}
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[3px] h-[3px] border-t border-l border-white/10" />
                </div>


                <div className="w-[26vw] p-[1.5vw] relative border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1 flex justify-between items-center">
                        <h3 className="text-[0.7vw] font-black text-yellow-400 tracking-[0.2em] italic uppercase">CHARGE AIR</h3>
                        <span className="text-[0.45vw] text-yellow-400/40 font-mono tracking-[0.2em]">CH_07</span>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-y-0.5 pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            {renderMetric("Ladeluft - Temp. v. ATL", engineData?.["100"], "°C")}
                            {renderMetric("Ladeluft - Temp. v. Ladeluftkühler", engineData?.["101"], "°C")}
                            {renderMetric("Ladeluft - Temp. n. Ladeluftkühler", engineData?.["102"], "°C")}
                            {renderMetric("Ladeluft - Druck n. Ladeluftkühler", engineData?.["103"], "BAR")}
                            {renderMetric("Ladeluft - Druckdifferenz Blende", engineData?.["104"], "mBAR")}
                            {renderMetric("Ladeluft - Status", engineData?.["105"], "")}
                            {renderMetric("Ladeluft - Durchsatz", engineData?.["106"], "kg/h")}
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[3px] h-[3px] border-t border-l border-white/10" />
                </div>


                <div className="w-[30vw] p-[1.5vw] relative border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1 flex justify-between items-center">
                        <h3 className="text-[0.7vw] font-black text-yellow-400 tracking-[0.2em] italic uppercase">FUEL SYSTEM</h3>
                        <span className="text-[0.45vw] text-yellow-400/40 font-mono tracking-[0.2em]">CH_08</span>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="grid grid-cols-2 gap-x-[1.5vw] pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            <div className="flex flex-col gap-y-4">
                                <div className="flex flex-col">
                                    <span className="text-[0.5vw] text-white/30 font-bold mb-1 border-b border-white/5">MDO</span>
                                    {renderMetric("Kraftstoff MDO - Druck v. Filter", engineData?.["107"], "BAR")}
                                    {renderMetric("Kraftstoff MDO - Druck n. Doppelfilter", engineData?.["108"], "BAR")}
                                    {renderMetric("Kraftstoff MDO - Temp. v. Motor", engineData?.["109"], "°C")}
                                    {renderMetric("Kraftstoff MDO - Durchsatz", engineData?.["110"], "kg/h")}
                                    {renderMetric("Kraftstoff MDO - Füllstand Tagestank", engineData?.["111"], "%")}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-[0.5vw] text-white/30 font-bold mb-1 border-b border-white/5">HFO (I)</span>
                                    {renderStatus("Kraftstoff HFO - Vorwärmung/Begleitheizung", engineData?.["112"], "1", "ON")}
                                    {renderMetric("Kraftstoff HFO - Temp. Vorratstank", engineData?.["113"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Temp. v. Setztank", engineData?.["114"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Temp. Setztank", engineData?.["115"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Füllstand Setztank", engineData?.["116"], "%")}
                                    {renderMetric("Kraftstoff HFO - Druck v. Vorwärmer", engineData?.["117"], "BAR")}
                                    {renderMetric("Kraftstoff HFO - Temp. v. Vorwärmer", engineData?.["118"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Druck n. Vorwärmer", engineData?.["119"], "BAR")}
                                    {renderMetric("Kraftstoff HFO - Temp. n. Vorwärmer", engineData?.["120"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Druck v. Tagestank", engineData?.["121"], "BAR")}
                                    {renderMetric("Kraftstoff HFO - Temp. v. Tagestank", engineData?.["122"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Temp. Tagestank", engineData?.["123"], "°C")}
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-4">
                                <div className="flex flex-col">
                                    <span className="text-[0.5vw] text-white/30 font-bold mb-1 border-b border-white/5">HFO (II) / LPG</span>
                                    {renderMetric("Kraftstoff HFO - Druck v. Mischrohr", engineData?.["124"], "BAR")}
                                    {renderMetric("Kraftstoff HFO - Temp. v. Mischrohr", engineData?.["125"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Durchsatz v. Mischrohr", engineData?.["126"], "kg/h")}
                                    {renderMetric("Kraftstoff HFO - Druck v. Endvorwärmer", engineData?.["127"], "BAR")}
                                    {renderMetric("Kraftstoff HFO - Temp. v. Endvorwärmer", engineData?.["128"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Temp. n. Endvorwärmer", engineData?.["129"], "°C")}
                                    {renderMetric("Kraftstoff HFO - Viskosität n. Endvorwärmer", engineData?.["130"], "cSt")}
                                    {renderMetric("Kraftstoff HFO - Druck v. Motor", engineData?.["131"], "BAR")}
                                    {renderMetric("Kraftstoff HFO - Temp v. Motor", engineData?.["132"], "°C")}
                                    {renderStatus("Kraftstoff HFO - Zubringerpumpe zum Setztank", engineData?.["133"], "1", "OP")}
                                    {renderStatus("Kraftstoff HFO - Separator 1", engineData?.["134"], "1", "OP")}
                                    {renderStatus("Kraftstoff HFO - Separator 2", engineData?.["135"], "1", "OP")}
                                    {renderStatus("Kraftstoff HFO - Zubringerpumpe zum Kraftstoffmodul", engineData?.["136"], "1", "OP")}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-[0.5vw] text-white/30 font-bold mb-1 border-b border-white/5">LPG DETAILS</span>
                                    {renderMetric("Kraftstoff Flüssiggas - Druck 1", engineData?.["137"], "BAR")}
                                    {renderMetric("Kraftstoff Flüssiggas - Druck 2", engineData?.["138"], "BAR")}
                                    {renderMetric("Kraftstoff Flüssiggas - Druck 3", engineData?.["139"], "BAR")}
                                    {renderMetric("Kraftstoff Flüssiggas - Druck 4", engineData?.["140"], "BAR")}
                                    {renderMetric("Kraftstoff Flüssiggas - Druck 5", engineData?.["141"], "BAR")}
                                    {renderMetric("Kraftstoff Flüssiggas - Temp 1", engineData?.["142"], "°C")}
                                    {renderMetric("Kraftstoff Flüssiggas - Temp 2", engineData?.["143"], "°C")}
                                    {renderMetric("Kraftstoff Flüssiggas - Temp 3", engineData?.["144"], "°C")}
                                    {renderMetric("Kraftstoff Flüssiggas - Temp 4", engineData?.["145"], "°C")}
                                    {renderMetric("Kraftstoff Flüssiggas - Temp 5", engineData?.["146"], "°C")}
                                    {renderMetric("Kraftstoff Flüssiggas - Konz 1", engineData?.["147"], "%")}
                                    {renderMetric("Kraftstoff Flüssiggas - Konz 2", engineData?.["148"], "%")}
                                    {renderMetric("Kraftstoff Flüssiggas - Konz 3", engineData?.["149"], "%")}
                                    {renderMetric("Kraftstoff Flüssiggas - Konz 4", engineData?.["150"], "%")}
                                    {renderMetric("Kraftstoff Flüssiggas - Konz 5", engineData?.["151"], "%")}
                                    {renderMetric("Kraftstoff Flüssiggas - Durchsatz", engineData?.["152"], "kg/h")}
                                    {renderStatus("Kraftstoff Flüssiggas - Pumpe 1", engineData?.["153"], "1", "OP")}
                                    {renderStatus("Kraftstoff Flüssiggas - Pumpe 2", engineData?.["154"], "1", "OP")}
                                    {renderStatus("Kraftstoff Flüssiggas - Pumpe 3", engineData?.["155"], "1", "OP")}
                                    {renderStatus("Kraftstoff Flüssiggas - Pumpe 4", engineData?.["156"], "1", "OP")}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[3px] h-[3px] border-t border-l border-white/10" />
                </div>


                <div className="w-[20vw] p-[1.5vw] relative border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1 flex justify-between items-center">
                        <h3 className="text-[0.7vw] font-black text-yellow-400 tracking-[0.2em] italic uppercase">STARTING AIR</h3>
                        <span className="text-[0.45vw] text-yellow-400/40 font-mono tracking-[0.2em]">CH_09</span>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-y-0.5 pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            {renderMetric("Anlassluft - Druck v. Motor", engineData?.["157"], "BAR")}
                            {renderStatus("Anlassluft - Verdichter 1", engineData?.["158"], "1", "OP")}
                            {renderStatus("Anlassluft - Verdichter 2", engineData?.["159"], "1", "OP")}
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[3px] h-[3px] border-t border-l border-white/10" />
                </div>



                <div className="w-[20vw] p-[1.5vw] relative border-b border-white/5 flex flex-col shrink-0 overflow-hidden">
                    <div className="sticky top-0 z-20 bg-[#0f171d]/80 backdrop-blur-md pb-1 flex justify-between items-center">
                        <h3 className="text-[0.7vw] font-black text-yellow-400 tracking-[0.2em] italic uppercase">NOZZLE COOLING</h3>
                        <span className="text-[0.45vw] text-yellow-400/40 font-mono tracking-[0.2em]">CH_10</span>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-y-0.5 pr-1" style={{ opacity: rawRunning ? 1 : 0.5 }}>
                            {renderMetric("Düsenkühlung - Druck v. Motor", engineData?.["160"], "BAR")}
                            {renderMetric("Düsenkühlung - Temp. v. Motor", engineData?.["161"], "°C")}
                            {renderMetric("Düsenkühlung - Temp. n. Motor", engineData?.["162"], "°C")}
                            {renderMetric("Düsenkühlung - Durchsatz", engineData?.["163"], "kg/h")}
                            {renderStatus("Düsenkühlung - Umwälzpumpe", engineData?.["164"], "1", "OP")}
                            {renderStatus("Düsenkühlung - Stand by Pumpe", engineData?.["165"], "1", "OP")}
                            {renderMetric("Düsenkühlung - Diff-Druck Filter", engineData?.["166"], "BAR")}
                            {renderMetric("Düsenkühlung - Niveau Umlauftank", engineData?.["167"], "%")}
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-[3px] h-[3px] border-t border-l border-white/10" />
                </div>




















            </div>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div >
    );
};

export default Monitor;