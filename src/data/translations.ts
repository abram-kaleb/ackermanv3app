// src/data/translations.ts
export type Language = 'de' | 'en' | 'id';

export const translations: Record<string, Record<Language, string>> = {
    "Fahrhebel Drehzahl": { de: "Fahrhebel Drehzahl", en: "Throttle RPM", id: "RPM Tuas Gas" },
    "Fahrhebel Bremslast": { de: "Fahrhebel Bremslast", en: "Brake Load", id: "Beban Rem" },
    "Stopp/Betrieb": { de: "Stopp/Betrieb", en: "Stop/Operation", id: "Stop/Operasi" },
    "Umschalter Pult / Maschine": { de: "Umschalter Pult / Maschine", en: "Console/Machine Switch", id: "Saklar Konsol/Mesin" },
    "Datum": { de: "Datum", en: "Date", id: "Tanggal" },
    "Uhrzeit": { de: "Uhrzeit", en: "Time", id: "Waktu" },
    "Betriebsstunden": { de: "Betriebsstunden", en: "Operating Hours", id: "Jam Operasional" },
    "Drehzahl Motor": { de: "Drehzahl Motor", en: "Engine RPM", id: "RPM Mesin" },
    "Bremsleistung": { de: "Bremsleistung", en: "Braking Power", id: "Daya Pengereman" },
    "Füllung Motor": { de: "Füllung Motor", en: "Engine Filling", id: "Pengisian Mesin" },
    "Anlaßluftdruck": { de: "Anlaßluftdruck", en: "Starting Air Pressure", id: "Tekanan Udara Start" },
    "Schmieröldruck": { de: "Schmieröldruck", en: "Lube Oil Pressure", id: "Tekanan Oli Pelumas" },
    "Kraftstoffdruck": { de: "Kraftstoffdruck", en: "Fuel Pressure", id: "Tekanan Bahan Bakar" },
    "LT Kühlwasserdruck": { de: "LT Kühlwasserdruck", en: "LT Water Pressure", id: "Tekanan Air Pendingin LT" },
    "HT Kühlwasserdruck": { de: "HT Kühlwasserdruck", en: "HT Water Pressure", id: "Tekanan Air Pendingin HT" },
    "Ladeluftdruck": { de: "Ladeluftdruck", en: "Charge Air Pressure", id: "Tekanan Udara Masuk" },
    "Druck Maschinenraum (atm. Druck)": { de: "Druck Maschinenraum", en: "Engine Room Pressure", id: "Tekanan Ruang Mesin" },
    "Temp. Maschinenraum": { de: "Temp. Maschinenraum", en: "Engine Room Temp", id: "Suhu Ruang Mesin" },
    "Rel. Luftfeuchte": { de: "Rel. Luftfeuchte", en: "Rel. Humidity", id: "Kelembapan Udara" },
    "Not-Aus-Taster": { de: "Not-Aus-Taster", en: "Emergency Stop", id: "Tombol Darurat" },
    "Startzähler": { de: "Startzähler", en: "Start Counter", id: "Penghitung Start" }
};

export const uiLabels = {
    title: { de: "Motorüberwachung", en: "Engine Monitoring", id: "Pemantauan Mesin" },
    status: { de: "System bereit", en: "System Ready", id: "Sistem Siap" },
    loading: { de: "LADEN...", en: "LOADING...", id: "MEMUAT..." }
};