// src/pages/RawData.tsx
import { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AppStatusContext } from '../App';

const socket = io('http://localhost:4000');

const RawData = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const { rawRunning } = useContext(AppStatusContext);

    useEffect(() => {
        if (!rawRunning) {
            socket.disconnect();
            return;
        }

        socket.connect();

        fetch('http://localhost:4000/api/data')
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
                    <div>1/1 - Lever speed (RPM): {engineData["1/1 - Motor/Bremse - Fahrhebel Drehzahl"]}</div>
                    <div>1/2 - Lever braking load: {engineData["1/2 - Motor/Bremse - Fahrhebel Bremslast"]}</div>
                    <div>1/3 - Stop / Operation: {engineData["1/3 - Motor/Bremse - Stopp/Betrieb"]}</div>
                    <div>1/4 - Control selector: Console / Machine: {engineData["1/4 - Motor/Bremse - Umschalter Pult / Maschine"]}</div>
                    <div>1/5 - Date: {engineData["1/5 - Motor/Bremse - Datum"]}</div>
                    <div>1/6 - Time: {engineData["1/6 - Motor/Bremse - Uhrzeit"]}</div>
                    <div>1/7 - Operating hours: {engineData["1/7 - Motor/Bremse - Betriebsstunden"]}</div>
                    <div>1/8 - Engine speed (RPM): {engineData["1/8 - Motor/Bremse - Drehzahl Motor"]}</div>
                    <div>1/9 - Braking power: {engineData["1/9 - Motor/Bremse - Bremsleistung"]}</div>
                    <div>1/10 - Engine fueling / Load: {engineData["1/10 - Motor/Bremse - Füllung Motor"]}</div>
                    <div>1/11 - Starting air pressure: {engineData["1/11 - Motor/Bremse - Anlaßluftdruck"]}</div>
                    <div>1/12 - Lube oil pressure: {engineData["1/12 - Motor/Bremse - Schmieröldruck"]}</div>
                    <div>1/13 - Fuel pressure: {engineData["1/13 - Motor/Bremse - Kraftstoffdruck"]}</div>
                    <div>1/14 - LT (Low Temp) cooling water pressure: {engineData["1/14 - Motor/Bremse - LT Kühlwasserdruck"]}</div>
                    <div>1/15 - HT (High Temp) cooling water pressure: {engineData["1/15 - Motor/Bremse - HT Kühlwasserdruck"]}</div>
                    <div>1/16 - Charge air pressure: {engineData["1/16 - Motor/Bremse - Ladeluftdruck"]}</div>
                    <div>1/17 - Engine room pressure (atmospheric pressure): {engineData["1/17 - Motor/Bremse - Druck Maschinenraum (atm. Druck)"]}</div>
                    <div>1/18 - Engine room temperature: {engineData["1/18 - Motor/Bremse - Temp. Maschinenraum"]}</div>
                    <div>1/19 - Relative humidity: {engineData["1/19 - Motor/Bremse - Rel. Luftfeuchte"]}</div>
                    <div>1/20 - Emergency stop button: {engineData["1/20 - Motor/Bremse - Not-Aus-Taster"]}</div>
                    <div>1/21 - Start counter: {engineData["1/21 - Motor/Bremse - Startzähler"]}</div>

                    <hr style={{ margin: '20px 0' }} />

                    <div>2/1 - Temp. n. Zylinder 1: {engineData["2/1 - Abgassystem - Temp. n. Zylinder 1"]}</div>
                    <div>2/2 - Temp. n. Zylinder 2: {engineData["2/2 - Abgassystem - Temp. n. Zylinder 2"]}</div>
                    <div>2/3 - Temp. n. Zylinder 3: {engineData["2/3 - Abgassystem - Temp. n. Zylinder 3"]}</div>
                    <div>2/4 - Temp. n. Zylinder 4: {engineData["2/4 - Abgassystem - Temp. n. Zylinder 4"]}</div>
                    <div>2/5 - Temp. n. Zylinder 5: {engineData["2/5 - Abgassystem - Temp. n. Zylinder 5"]}</div>
                    <div>2/6 - Temp. n. Zylinder 6: {engineData["2/6 - Abgassystem - Temp. n. Zylinder 6"]}</div>
                    <div>2/7 - Temp. v. ATL: {engineData["2/7 - Abgassystem - Temp. v. ATL"]}</div>
                    <div>2/8 - Temp. n. ATL: {engineData["2/8 - Abgassystem - Temp. n. ATL"]}</div>
                    <div>2/9 - Druck v. ATL: {engineData["2/9 - Abgassystem - Druck v. ATL"]}</div>
                    <div>2/10 - Druck n. ATL: {engineData["2/10 - Abgassystem - Druck n. ATL"]}</div>
                    <div>2/11 - Drehzahl ATL: {engineData["2/11 - Abgassystem - Drehzahl ATL"]}</div>
                    <div>2/12 - Temp. vor Schalldämpfer: {engineData["2/12 - Abgassystem - Temp. vor Schalldämpfer"]}</div>
                    <div>2/13 - Abgastemperaturdifferenz: {engineData["2/13 - Abgassystem - Abgastemperaturdifferenz (als Alarm)"]}</div>
                    <div>2/14 - Druck 1: {engineData["2/14 - Abgassystem - Druck 1"]}</div>
                    <div>2/15 - Druck 2: {engineData["2/15 - Abgassystem - Druck 2"]}</div>
                    <div>2/16 - Druck 3: {engineData["2/16 - Abgassystem - Druck 3"]}</div>
                    <div>2/17 - Druck 4: {engineData["2/17 - Abgassystem - Druck 4"]}</div>
                    <div>2/18 - Temp 1: {engineData["2/18 - Abgassystem - Temp 1"]}</div>
                    <div>2/19 - Temp 2: {engineData["2/19 - Abgassystem - Temp 2"]}</div>
                    <div>2/20 - Temp 3: {engineData["2/20 - Abgassystem - Temp 3"]}</div>
                    <div>2/21 - Temp 4: {engineData["2/21 - Abgassystem - Temp 4"]}</div>
                    <div>2/22 - Empty: {engineData["2/22 - Abgassystem - "]}</div>
                    <div>2/23 - Konz 1: {engineData["2/23 - Abgassystem - Konz 1"]}</div>
                    <div>2/24 - Konz 2: {engineData["2/24 - Abgassystem - Konz 2"]}</div>
                    <div>2/25 - Mobil 1: {engineData["2/25 - Abgassystem - Mobil 1"]}</div>
                    <div>2/26 - Mobil 2: {engineData["2/26 - Abgassystem - Mobil 2"]}</div>
                    <div>2/27 - Mobil 3: {engineData["2/27 - Abgassystem - Mobil 3"]}</div>
                    <div>2/28 - Mobil 4: {engineData["2/28 - Abgassystem - Mobil 4"]}</div>
                    <div>2/29 - Mobil 5: {engineData["2/29 - Abgassystem - Mobil 5"]}</div>
                    <div>2/30 - Mobil 6: {engineData["2/30 - Abgassystem - Mobil 6"]}</div>
                    <div>2/31 - Mobil 7: {engineData["2/31 - Abgassystem - Mobil 7"]}</div>
                    <div>2/32 - Mobil 8: {engineData["2/32 - Abgassystem - Mobil 8"]}</div>
                    <div>2/33 - Mobil 9: {engineData["2/33 - Abgassystem - Mobil 9"]}</div>
                    <div>2/34 - Mobil 10: {engineData["2/34 - Abgassystem - Mobil 10"]}</div>
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