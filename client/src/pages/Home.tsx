import { useState, useEffect, useMemo } from 'react';
import GameCard from '../components/GameCard';
import FilterBar from '../components/FilterBar';
import { useSignals } from '../hooks/useSignals';
import { getJogos, getPlataformas, getProvedores } from '../services/api';
import './Home.css';

interface Jogo {
    id: number;
    nome: string;
    imagem_url: string;
    provedor: string;
    plataforma_id: number;
    plataforma_nome: string;
    url_afiliado: string;
}

interface Plataforma {
    id: number;
    nome: string;
}

function GlobalTimer() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [lastUpdate, setLastUpdate] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const next = new Date(now);

            // Calculates distance to next 10-minutes border (eg. 14:10:00, 14:20:00, 14:30:00)
            const remainder = 10 - (now.getMinutes() % 10);
            next.setMinutes(now.getMinutes() + remainder);
            next.setSeconds(0);
            next.setMilliseconds(0);

            let diff = Math.floor((next.getTime() - now.getTime()) / 1000);
            // Just in case it evaluates exactly on the trigger second
            if (diff <= 0) diff = 600;

            setTimeLeft(diff);

            const last = new Date(next.getTime() - 600 * 1000);
            const lh = String(last.getHours()).padStart(2, '0');
            const lm = String(last.getMinutes()).padStart(2, '0');
            setLastUpdate(`${lh}:${lm}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const m = Math.floor(timeLeft / 60);
    const s = Math.floor(timeLeft % 60);
    const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    return (
        <div className="home__global-timer-wrapper">
            <div className="home__global-timer">
                <span className="home__global-timer-icon">⏱</span>
                <span className="home__global-timer-text">Próxima análise do Robô em:</span>
                <span className="home__global-timer-value">{timeStr}</span>
            </div>
            <div className="home__last-update">
                Última atualização: hoje às <strong>{lastUpdate}</strong>
            </div>
        </div>
    );
}

export default function Home() {
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
    const [provedores, setProvedores] = useState<string[]>([]);
    const [selectedPlataforma, setSelectedPlataforma] = useState<number | null>(null);
    const [selectedProvedor, setSelectedProvedor] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { sinais, isActive, getSignalData } = useSignals(30000);

    useEffect(() => {
        async function fetchData() {
            try {
                const [jogosRes, platRes, provRes] = await Promise.all([
                    getJogos(),
                    getPlataformas(),
                    getProvedores(),
                ]);
                setJogos(jogosRes.data);
                setPlataformas(platRes.data);
                setProvedores(provRes.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredJogos = useMemo(() => {
        return jogos.filter((j) => {
            if (selectedPlataforma && j.plataforma_id !== selectedPlataforma) return false;
            if (selectedProvedor && j.provedor !== selectedProvedor) return false;
            if (searchTerm && !j.nome.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [jogos, selectedPlataforma, selectedProvedor, searchTerm]);

    // Sort: active signals first
    const sortedJogos = useMemo(() => {
        return [...filteredJogos].sort((a, b) => {
            const aActive = isActive(a.id) ? 1 : 0;
            const bActive = isActive(b.id) ? 1 : 0;
            return bActive - aActive;
        });
    }, [filteredJogos, isActive]);

    return (
        <div className="home">
            <header className="home__header">
                <div className="home__header-bg" />
                <div className="home__header-content">
                    <h1 className="home__title">
                        <span className="home__title-accent">Fortune Wise</span>
                    </h1>
                    <p className="home__subtitle">
                        Acompanhe os jogos que estão pagando agora. Sinais atualizados automaticamente.
                    </p>
                    <div className="home__stats">
                        <div className="home__stat">
                            <span className="home__stat-value">{sinais.length}</span>
                            <span className="home__stat-label">Pagando Agora</span>
                        </div>
                        <div className="home__stat">
                            <span className="home__stat-value">{plataformas.length}</span>
                            <span className="home__stat-label">Plataformas</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="home__main">
                <GlobalTimer />

                <FilterBar
                    plataformas={plataformas}
                    provedores={provedores}
                    selectedPlataforma={selectedPlataforma}
                    selectedProvedor={selectedProvedor}
                    searchTerm={searchTerm}
                    onPlataformaChange={setSelectedPlataforma}
                    onProvedorChange={setSelectedProvedor}
                    onSearchChange={setSearchTerm}
                />

                {loading ? (
                    <div className="home__loading">
                        <div className="home__spinner" />
                        <p>Carregando jogos...</p>
                    </div>
                ) : sortedJogos.length === 0 ? (
                    <div className="home__empty">
                        <p>Nenhum jogo encontrado com os filtros selecionados.</p>
                    </div>
                ) : (
                    <div className="home__grid">
                        {sortedJogos.map((jogo) => {
                            const signalData = getSignalData(jogo.id);
                            return (
                                <GameCard
                                    key={jogo.id}
                                    id={jogo.id}
                                    nome={jogo.nome}
                                    imagem_url={jogo.imagem_url}
                                    provedor={jogo.provedor}
                                    plataforma_nome={jogo.plataforma_nome}
                                    url_afiliado={jogo.url_afiliado}
                                    sinalAtivo={
                                        signalData
                                            ? { win_rate: signalData.win_rate, nivel_bet: signalData.nivel_bet, valor_bet: signalData.valor_bet, data_hora_fim: signalData.data_hora_fim }
                                            : undefined
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            <footer className="home__footer">
                <p>⚠️ Jogue com responsabilidade. Este site é apenas informativo.</p>
                <p>© {new Date().getFullYear()} Fortune Wise - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
