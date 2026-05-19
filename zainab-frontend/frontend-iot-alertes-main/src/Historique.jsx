import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { format } from 'date-fns';

export default function Historique({ frigoId = 1 }) {
    const [donnees, setDonnees] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/fridges/${frigoId}/history?from=2026-05-01&to=2026-05-31`)
            .then(res => {
                const formatted = res.data.map(d => ({
                    valeur_temp: d.valeur_temp,
                    heure: format(new Date(d.date_heure), 'HH:mm'),
                }));
                setDonnees(formatted);
            })
            .catch(err => console.error('Erreur historique :', err));
    }, [frigoId]);

    return (
        <div style={{ padding: 24 }}>
            <h2>🌡️ Historique des températures — Frigo {frigoId}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={donnees}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="heure" />
                    <YAxis domain={[0, 15]} unit="°C" />
                    <Tooltip formatter={v => `${v}°C`} />
                    <ReferenceLine y={2} stroke="blue"
                        strokeDasharray="4 4" label="Min 2°C" />
                    <ReferenceLine y={8} stroke="red"
                        strokeDasharray="4 4" label="Max 8°C" />
                    <Line
                        type="monotone"
                        dataKey="valeur_temp"
                        stroke="#e55"
                        strokeWidth={2}
                        dot={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}