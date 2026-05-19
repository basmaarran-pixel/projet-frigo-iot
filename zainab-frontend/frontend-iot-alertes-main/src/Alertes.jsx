import { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

export default function Alertes() {
    const [alertes, setAlertes] = useState([]);

    const charger = () => {
        axios.get('http://localhost:3001/api/alerts')
            .then(res => setAlertes(res.data))
            .catch(err => console.error('Erreur alertes :', err));
    };

    useEffect(() => { charger(); }, []);

    const resoudre = async (id) => {
        await axios.patch(`http://localhost:3001/api/alerts/${id}/resolve`);
        charger();
    };

    const exportCSV = () => {
        const csv  = Papa.unparse(alertes);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'alertes.csv';
        a.click();
    };

    const ouvertes = alertes.filter(a => a.statut === 'open').length;

    return (
        <div style={{ padding: 24 }}>
            <h2>
                🔔 Alertes
                {ouvertes > 0 &&
                    <span style={{
                        background: 'red', color: 'white',
                        borderRadius: 12, padding: '2px 10px',
                        marginLeft: 8, fontSize: 13
                    }}>
                        {ouvertes}
                    </span>
                }
            </h2>

            <button onClick={exportCSV} style={{
                marginBottom: 16, padding: '8px 16px',
                background: '#333', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer'
            }}>
                📥 Exporter CSV
            </button>

            {alertes.length === 0 && (
                <p style={{ color: 'green' }}>✅ Aucune alerte active</p>
            )}

            {alertes.map(a => (
                <div key={a.id} style={{
                    border: `2px solid ${a.niveau === 'critical' ? 'red' : 'orange'}`,
                    borderRadius: 8, padding: 12, marginBottom: 8,
                    background: a.statut === 'resolved' ? '#f5f5f5' : 'white'
                }}>
                    <b>{a.nom_frigo}</b>
                    <span style={{
                        marginLeft: 8,
                        color: a.niveau === 'critical' ? 'red' : 'orange',
                        fontWeight: 'bold'
                    }}>
                        {a.niveau.toUpperCase()}
                    </span>
                    <span style={{
                        marginLeft: 8,
                        background: a.statut === 'open' ? 'red' : 'green',
                        color: 'white', borderRadius: 4,
                        padding: '2px 6px', fontSize: 12
                    }}>
                        {a.statut}
                    </span>
                    <p style={{ margin: '6px 0', fontSize: 13 }}>
                        {a.message}
                    </p>
                    <small style={{ color: '#666' }}>
                        {new Date(a.date_debut).toLocaleString()}
                    </small>
                    {a.statut === 'open' &&
                        <button onClick={() => resoudre(a.id)} style={{
                            marginLeft: 16, padding: '4px 12px',
                            background: 'green', color: 'white',
                            border: 'none', borderRadius: 6, cursor: 'pointer'
                        }}>
                            ✅ Résoudre
                        </button>
                    }
                </div>
            ))}
        </div>
    );
}