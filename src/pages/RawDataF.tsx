// src/pages/RawData.tsx
import { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AppStatusContext } from '../App';

const SERVER_IP = '192.168.137.1';
const socket = io(`http://${SERVER_IP}:4000`, {
    transports: ['websocket', 'polling'],
    autoConnect: false
});

const RawData = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const { rawRunning } = useContext(AppStatusContext);

    useEffect(() => {
        if (!rawRunning) {
            socket.disconnect();
            return;
        }

        socket.connect();

        fetch(`http://${SERVER_IP}:4000/api/data`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setEngineData(data[0]);
                }
            })
            .catch(err => console.error("Fetch error:", err));

        socket.on('data_update', (newData) => {
            setEngineData(newData);
        });

        return () => {
            socket.off('data_update');
        };
    }, [rawRunning]);

    if (!engineData) {
        return (
            <div className="p-6 text-slate-500 font-mono text-sm animate-pulse">
                Waiting for raw data stream from {SERVER_IP}...
            </div>
        );
    }



    return (
        <div style={{ padding: '20px', backgroundColor: !rawRunning ? '#f1f1f1' : '#fff' }}>
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ccc',
                position: 'sticky',
                top: 0,
                backgroundColor: '#eee',
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
            }}>
                <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    <strong>Status Raw Stream:</strong> {rawRunning ? 'ACTIVE' : 'PAUSED'}
                </div>
            </div>

            {engineData ? (
                <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', opacity: rawRunning ? 1 : 0.6 }}>
                    // Engine
                    <div>1/1 - Fahrhebel Drehzahl: {engineData["0"]}</div>
                    <div>1/2 - Fahrhebel Bremslast: {engineData["1"]}</div>
                    <div>1/3 - Stopp/Betrieb: {engineData["2"]}</div>
                    <div>1/4 - Umschalter Pult / Maschine: {engineData["3"]}</div>
                    <div>1/5 - Datum: {engineData["4"]}</div>
                    <div>1/6 - Uhrzeit: {engineData["5"]}</div>
                    <div>1/7 - Betriebsstunden: {engineData["6"]}</div>
                    <div>1/8 - Drehzahl Motor: {engineData["7"]}</div>
                    <div>1/9 - Bremsleistung: {engineData["8"]}</div>
                    <div>1/10 - Füllung Motor: {engineData["9"]}</div>
                    <div>1/11 - Anlaßluftdruck: {engineData["10"]}</div>
                    <div>1/12 - Schmieröldruck: {engineData["11"]}</div>
                    <div>1/13 - Kraftstoffdruck: {engineData["12"]}</div>
                    <div>1/14 - LT Kühlwasserdruck: {engineData["13"]}</div>
                    <div>1/15 - HT Kühlwasserdruck: {engineData["14"]}</div>
                    <div>1/16 - Ladeluftdruck: {engineData["15"]}</div>
                    <div>1/17 - Druck Maschinenraum: {engineData["16"]}</div>
                    <div>1/18 - Temp. Maschinenraum: {engineData["17"]}</div>
                    <div>1/19 - Rel. Luftfeuchte: {engineData["18"]}</div>
                    <div>1/20 - Not-Aus-Taster: {engineData["19"]}</div>
                    <div>1/21 - Startzähler: {engineData["20"]}</div>

                    <hr style={{ margin: '20px 0' }} />

                    // Exhaust
                    <div>2/1 - Temp. n. Zylinder 1: {engineData["21"]}</div>
                    <div>2/2 - Temp. n. Zylinder 2: {engineData["22"]}</div>
                    <div>2/3 - Temp. n. Zylinder 3: {engineData["23"]}</div>
                    <div>2/4 - Temp. n. Zylinder 4: {engineData["24"]}</div>
                    <div>2/5 - Temp. n. Zylinder 5: {engineData["25"]}</div>
                    <div>2/6 - Temp. n. Zylinder 6: {engineData["26"]}</div>
                    <div>2/7 - Temp. v. ATL: {engineData["27"]}</div>
                    <div>2/8 - Temp. n. ATL: {engineData["28"]}</div>
                    <div>2/9 - Druck v. ATL: {engineData["29"]}</div>
                    <div>2/10 - Druck n. ATL: {engineData["30"]}</div>
                    <div>2/11 - Drehzahl ATL: {engineData["31"]}</div>
                    <div>2/12 - Temp. vor Schalldämpfer: {engineData["32"]}</div>
                    <div>2/13 - Abgastemperaturdifferenz: {engineData["33"]}</div>
                    <div>2/14 - Druck 1: {engineData["34"]}</div>
                    <div>2/15 - Druck 2: {engineData["35"]}</div>
                    <div>2/16 - Druck 3: {engineData["36"]}</div>
                    <div>2/17 - Druck 4: {engineData["37"]}</div>
                    <div>2/18 - Temp 1: {engineData["38"]}</div>
                    <div>2/19 - Temp 2: {engineData["39"]}</div>
                    <div>2/20 - Temp 3: {engineData["40"]}</div>
                    <div>2/21 - Temp 4: {engineData["41"]}</div>
                    <div>2/22 - Empty: {engineData["42"]}</div>
                    <div>2/23 - Konz 1: {engineData["43"]}</div>
                    <div>2/24 - Konz 2: {engineData["44"]}</div>
                    <div>2/25 - Mobil 1: {engineData["45"]}</div>
                    <div>2/26 - Mobil 2: {engineData["46"]}</div>
                    <div>2/27 - Mobil 3: {engineData["47"]}</div>
                    <div>2/28 - Mobil 4: {engineData["48"]}</div>
                    <div>2/29 - Mobil 5: {engineData["49"]}</div>
                    <div>2/30 - Mobil 6: {engineData["50"]}</div>
                    <div>2/31 - Mobil 7: {engineData["51"]}</div>
                    <div>2/32 - Mobil 8: {engineData["52"]}</div>
                    <div>2/33 - Mobil 9: {engineData["53"]}</div>
                    <div>2/34 - Mobil 10: {engineData["54"]}</div>

                    <hr style={{ margin: '20px 0' }} />

                // ht_cooling
                    <div>3/1 - HT Kühlwasser - Druck v. Motor: {engineData["55"]}</div>
                    <div>3/2 - HT Kühlwasser - Temp. v. Motor: {engineData["56"]}</div>
                    <div>3/3 - HT Kühlwasser - Temp. n. Zyl. 1: {engineData["57"]}</div>
                    <div>3/4 - HT Kühlwasser - Temp. n. Zyl. 2: {engineData["58"]}</div>
                    <div>3/5 - HT Kühlwasser - Temp. n. Zyl. 3: {engineData["59"]}</div>
                    <div>3/6 - HT Kühlwasser - Temp. n. Zyl. 4: {engineData["60"]}</div>
                    <div>3/7 - HT Kühlwasser - Temp. n. Zyl. 5: {engineData["61"]}</div>
                    <div>3/8 - HT Kühlwasser - Temp. n. Zyl. 6: {engineData["62"]}</div>
                    <div>3/9 - HT Kühlwasser - Temp. n. Motor: {engineData["63"]}</div>
                    <div>3/10 - HT Kühlwasser - Temp. v. Kühler: {engineData["64"]}</div>
                    <div>3/11 - HT Kühlwasser - Temp. n. Kühler: {engineData["65"]}</div>
                    <div>3/12 - HT Kühlwasser - Durchfluß: {engineData["66"]}</div>
                    <div>3/13 - HT Kühlwasser - Druck: {engineData["67"]}</div>
                    <div>3/14 - HT Kühlwasser - Stand by Pumpe: {engineData["68"]}</div>
                    <div>3/15 - HT Kühlwasser - Druckhaltepumpe: {engineData["69"]}</div>
                    <div>3/16 - HT Kühlwasser - Niveau Ex-Tank: {engineData["70"]}</div>


                    <hr style={{ margin: '20px 0' }} />

                // lt_cooling
                    <div>4/1 - LT Kühlwassrer - Temp. v. Ladeluftkühler: {engineData["71"]}</div>
                    <div>4/2 - LT Kühlwassrer - Temp. n. Ladeluftkühler: {engineData["72"]}</div>
                    <div>4/3 - LT Kühlwassrer - Temp. v. Schmierölkühler: {engineData["73"]}</div>
                    <div>4/4 - LT Kühlwassrer - Temp. n. Schmierölkühler: {engineData["74"]}</div>
                    <div>4/5 - LT Kühlwassrer - Temp. n. Zylinderkühlwasserkühler: {engineData["75"]}</div>
                    <div>4/6 - LT Kühlwassrer - Temp. Eintritt warme Seite Behälter: {engineData["76"]}</div>
                    <div>4/7 - LT Kühlwassrer - Durchfluß: {engineData["77"]}</div>
                    <div>4/8 - LT Kühlwassrer - Druck: {engineData["78"]}</div>
                    <div>4/9 - LT Kühlwassrer - Stand by LT Pumpe: {engineData["79"]}</div>
                    <div>4/10 - LT Kühlwassrer - Kühlturmpumpe: {engineData["80"]}</div>
                    <div>4/11 - LT Kühlwassrer - Druck Kühlturmpumpe: {engineData["81"]}</div>
                    <div>4/12 - LT Kühlwassrer - Gebläse Kühlturm: {engineData["82"]}</div>
                    <div>4/13 - LT Kühlwassrer - Temp. Behälter, kalte Seite: {engineData["83"]}</div>
                    <div>4/14 - LT Kühlwassrer - Bremsenwasser Zulaufpumpe: {engineData["84"]}</div>
                    <div>4/15 - LT Kühlwassrer - Bremsenwasser Ablaufpumpe: {engineData["85"]}</div>

                    <hr style={{ margin: '20px 0' }} />

                // lube_oil
                    <div>5/1 - Schmieröl - Druck n. Pumpe: {engineData["86"]}</div>
                    <div>5/2 - Schmieröl - Temp. n. Pumpe: {engineData["87"]}</div>
                    <div>5/3 - Schmieröl - Temp. v. Kühler: {engineData["88"]}</div>
                    <div>5/4 - Schmieröl - Temp. n. Kühler: {engineData["89"]}</div>
                    <div>5/5 - Schmieröl - Differenzdruck Doppelfilter: {engineData["90"]}</div>
                    <div>5/6 - Schmieröl - Druck v. Motor/ n. Filter: {engineData["91"]}</div>
                    <div>5/7 - Schmieröl - Temp. v. Motor: {engineData["92"]}</div>
                    <div>5/8 - Schmieröl - Durchfluß: {engineData["93"]}</div>
                    <div>5/9 - Schmieröl - Stand by Pumpe: {engineData["94"]}</div>
                    <div>5/10 - Schmieröl - Separator: {engineData["95"]}</div>
                    <div>5/11 - Schmieröl - Diff-Druck Feinfilter: {engineData["96"]}</div>
                    <div>5/12 - Schmieröl - Temp. v. letztem Lager: {engineData["97"]}</div>
                    <div>5/13 - Schmieröl - Ölnebelkonzentration: {engineData["98"]}</div>

                    <hr style={{ margin: '20px 0' }} />

                // charge_air
                    <div>6/1 - Ladeluft - Temp. v. ATL: {engineData["99"]}</div>
                    <div>6/2 - Ladeluft - Temp. v. Ladeluftkühler: {engineData["100"]}</div>
                    <div>6/3 - Ladeluft - Temp. n. Ladeluftkühler: {engineData["101"]}</div>
                    <div>6/4 - Ladeluft - Druck n. Ladeluftkühler: {engineData["102"]}</div>
                    <div>6/5 - Ladeluft - Druckdifferenz Blende: {engineData["103"]}</div>
                    <div>6/6 - Ladeluft - {engineData["104"]}</div>
                    <div>6/7 - Ladeluft - Durchsatz: {engineData["105"]}</div>


                    <hr style={{ margin: '20px 0' }} />

                // fuel
                    // MDO
                    <div>7/1 - Kraftstoff MDO - Druck v. Filter: {engineData["106"]}</div>
                    <div>7/2 - Kraftstoff MDO - Druck n. Doppelfilter: {engineData["107"]}</div>
                    <div>7/3 - Kraftstoff MDO - Temp. v. Motor: {engineData["108"]}</div>
                    <div>7/4 - Kraftstoff MDO - Durchsatz: {engineData["109"]}</div>
                    <div>7/5 - Kraftstoff MDO - Füllstand Tagestank: {engineData["110"]}</div>
                    // HFO
                    <div>7/6 - Kraftstoff HFO - Vorwärmung/Begleitheizung: {engineData["111"]}</div>
                    <div>7/7 - Kraftstoff HFO - Temp. Vorratstank: {engineData["112"]}</div>
                    <div>7/8 - Kraftstoff HFO - Temp. v. Setztank: {engineData["113"]}</div>
                    <div>7/9 - Kraftstoff HFO - Temp. Setztank: {engineData["114"]}</div>
                    <div>7/10 - Kraftstoff HFO - Füllstand Setztank: {engineData["115"]}</div>
                    <div>7/11 - Kraftstoff HFO - Druck v. Vorwärmer: {engineData["116"]}</div>
                    <div>7/12 - Kraftstoff HFO - Temp. v. Vorwärmer: {engineData["117"]}</div>
                    <div>7/13 - Kraftstoff HFO - Druck n. Vorwärmer: {engineData["118"]}</div>
                    <div>7/14 - Kraftstoff HFO - Temp. n. Vorwärmer: {engineData["119"]}</div>
                    <div>7/15 - Kraftstoff HFO - Druck v. Tagestank: {engineData["120"]}</div>
                    <div>7/16 - Kraftstoff HFO - Temp. v. Tagestank: {engineData["121"]}</div>
                    <div>7/17 - Kraftstoff HFO - Temp. Tagestank: {engineData["122"]}</div>
                    <div>7/18 - Kraftstoff HFO - Druck v. Mischrohr: {engineData["123"]}</div>
                    <div>7/19 - Kraftstoff HFO - Temp. v. Mischrohr: {engineData["124"]}</div>
                    <div>7/20 - Kraftstoff HFO - Durchsatz v. Mischrohr: {engineData["125"]}</div>
                    <div>7/21 - Kraftstoff HFO - Druck v. Endvorwärmer: {engineData["126"]}</div>
                    <div>7/22 - Kraftstoff HFO - Temp. v. Endvorwärmer: {engineData["127"]}</div>
                    <div>7/23 - Kraftstoff HFO - Temp. n. Endvorwärmer: {engineData["128"]}</div>
                    <div>7/24 - Kraftstoff HFO - Viskosität n. Endvorwärmer: {engineData["129"]}</div>
                    <div>7/25 - Kraftstoff HFO - Druck v. Motor: {engineData["130"]}</div>
                    <div>7/26 - Kraftstoff HFO - Temp v. Motor: {engineData["131"]}</div>
                    <div>7/27 - Kraftstoff HFO - Zubringerpumpe zum Setztank: {engineData["132"]}</div>
                    <div>7/28 - Kraftstoff HFO - Separator 1: {engineData["133"]}</div>
                    <div>7/29 - Kraftstoff HFO - Separator 2: {engineData["134"]}</div>
                    <div>7/30 - Kraftstoff HFO - Zubringerpumpe zum Kraftstoffmodul: {engineData["135"]}</div>
                    // LPG
                    <div>7/31 - Kraftstoff Flüssiggas - Druck 1: {engineData["136"]}</div>
                    <div>7/32 - Kraftstoff Flüssiggas - Druck 2: {engineData["137"]}</div>
                    <div>7/33 - Kraftstoff Flüssiggas - Druck 3: {engineData["138"]}</div>
                    <div>7/34 - Kraftstoff Flüssiggas - Druck 4: {engineData["139"]}</div>
                    <div>7/35 - Kraftstoff Flüssiggas - Druck 5: {engineData["140"]}</div>
                    <div>7/36 - Kraftstoff Flüssiggas - Temp 1: {engineData["141"]}</div>
                    <div>7/37 - Kraftstoff Flüssiggas - Temp 2: {engineData["142"]}</div>
                    <div>7/38 - Kraftstoff Flüssiggas - Temp 3: {engineData["143"]}</div>
                    <div>7/39 - Kraftstoff Flüssiggas - Temp 4: {engineData["144"]}</div>
                    <div>7/40 - Kraftstoff Flüssiggas - Temp 5: {engineData["145"]}</div>
                    <div>7/41 - Kraftstoff Flüssiggas - Konz 1: {engineData["146"]}</div>
                    <div>7/42 - Kraftstoff Flüssiggas - Konz 2: {engineData["147"]}</div>
                    <div>7/43 - Kraftstoff Flüssiggas - Konz 3: {engineData["148"]}</div>
                    <div>7/44 - Kraftstoff Flüssiggas - Konz 4: {engineData["149"]}</div>
                    <div>7/45 - Kraftstoff Flüssiggas - Konz 5: {engineData["150"]}</div>
                    <div>7/46 - Kraftstoff Flüssiggas - Durchsatz: {engineData["151"]}</div>
                    <div>7/47 - Kraftstoff Flüssiggas - Pumpe 1: {engineData["152"]}</div>
                    <div>7/48 - Kraftstoff Flüssiggas - Pumpe 2: {engineData["153"]}</div>
                    <div>7/49 - Kraftstoff Flüssiggas - Pumpe 3: {engineData["154"]}</div>
                    <div>7/50 - Kraftstoff Flüssiggas - Pumpe 4: {engineData["155"]}</div>

                    <hr style={{ margin: '20px 0' }} />

                // starting air
                    <div>8/1 - Anlassluft - Druck v. Motor: {engineData["156"]}</div>
                    <div>8/2 - Anlassluft - Verdichter 1: {engineData["157"]}</div>
                    <div>8/3 - Anlassluft - Verdichter 2: {engineData["158"]}</div>

                    <hr style={{ margin: '20px 0' }} />

                // nozzle coolling
                    <div>9/1 - Düsenkühlung - Druck v. Motor: {engineData["159"]}</div>
                    <div>9/2 - Düsenkühlung - Temp. v. Motor: {engineData["160"]}</div>
                    <div>9/3 - Düsenkühlung - Temp. n. Motor: {engineData["161"]}</div>
                    <div>9/4 - Düsenkühlung - Durchsatz: {engineData["162"]}</div>
                    <div>9/5 - Düsenkühlung - Umwälzpumpe: {engineData["163"]}</div>
                    <div>9/6 - Düsenkühlung - Stand by Pumpe: {engineData["164"]}</div>
                    <div>9/7 - Düsenkühlung - Diff-Druck Filter: {engineData["165"]}</div>
                    <div>9/8 - Düsenkühlung - Niveau Umlauftank: {engineData["166"]}</div>



                </div>
            ) : (
                <div style={{ color: '#888', fontStyle: 'italic' }}>
                    Loading or stream paused by global controller.
                </div>
            )}
        </div>
    );
};

export default RawData;