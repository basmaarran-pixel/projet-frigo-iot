import Historique from './Historique';
import Alertes from './Alertes';

function App() {
    return (
        <div>
            <h1 style={{ padding: 24, background: '#333', color: 'white', margin: 0 }}>
                🌡️ Système de Gestion des Frigos IoT
            </h1>
            <Historique frigoId={1} />
            <Alertes />
        </div>
    );
}

export default App;
