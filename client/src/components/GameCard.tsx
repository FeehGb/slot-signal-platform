import { useState, useMemo } from 'react';
import './GameCard.css';

interface GameCardProps {
    id: number;
    nome: string;
    imagem_url: string;
    provedor: string;
    plataforma_nome: string;
    url_afiliado: string;
    sinalAtivo?: {
        win_rate: number;
        nivel_bet: 'baixa' | 'media' | 'alta';
        valor_bet: number;
        data_hora_fim: string;
    };
}

const BET_CONFIG = {
    baixa: { label: 'BAIXA', icon: '▼', color: '#00e676', bgFrom: 'rgba(0,230,118,0.15)', bgTo: 'rgba(0,230,118,0.05)', border: 'rgba(0,230,118,0.3)' },
    media: { label: 'MÉDIA', icon: '●', color: '#fbbf24', bgFrom: 'rgba(251,191,36,0.15)', bgTo: 'rgba(251,191,36,0.05)', border: 'rgba(251,191,36,0.3)' },
    alta: { label: 'ALTA', icon: '▲', color: '#ef4444', bgFrom: 'rgba(239,68,68,0.18)', bgTo: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.35)' },
};



function CircularProgress({ value }: { value: number }) {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    const color = useMemo(() => {
        if (value >= 90) return '#00e676';
        if (value >= 80) return '#4d7cff';
        if (value >= 70) return '#fbbf24';
        return '#ef4444';
    }, [value]);

    return (
        <div className="circular-progress">
            <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
                <circle
                    cx="24" cy="24" r={radius}
                    stroke={color} strokeWidth="3" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round" transform="rotate(-90 24 24)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
            </svg>
            <div className="circular-progress-text" style={{ color }}>{value}%</div>
        </div>
    );
}

export default function GameCard({
    nome,
    imagem_url,
    provedor,
    plataforma_nome,
    url_afiliado,
    sinalAtivo,
}: GameCardProps) {
    const isActive = !!sinalAtivo;
    const bet = sinalAtivo ? BET_CONFIG[sinalAtivo.nivel_bet || 'media'] : null;
    const [imgError, setImgError] = useState(false);

    return (
        <div className={`game-card ${isActive ? 'game-card--active' : ''}`}>
            <div className="game-card__image-container">
                {!imgError ? (
                    <img
                        src={imagem_url}
                        alt={nome}
                        className="game-card__image"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="game-card__fallback">
                        <span className="game-card__fallback-icon">🎰</span>
                        <h4 className="game-card__fallback-title">{nome}</h4>
                        <div className="game-card__fallback-glow" />
                    </div>
                )}
                <div className="game-card__image-overlay" />

                {isActive && (
                    <div className="game-card__badge">
                        <span className="game-card__badge-dot" />
                        🔥 Pagando Agora
                    </div>
                )}

                <div className="game-card__provider-tag">{provedor}</div>
            </div>

            <div className="game-card__content">
                <div className="game-card__info">
                    <h3 className="game-card__title">{nome}</h3>
                    <p className="game-card__platform">{plataforma_nome}</p>
                </div>

                {isActive && sinalAtivo && bet && (
                    <>
                        {/* Signal metrics row */}
                        <div className="game-card__metrics">
                            <div className="game-card__metric">
                                <CircularProgress value={sinalAtivo.win_rate} />
                                <span className="game-card__metric-label">Win Rate</span>
                            </div>

                            <div className="game-card__metric-divider" />

                            {/* Bet Indicator - Redesigned */}
                            <div className="game-card__bet" style={{
                                background: `linear-gradient(135deg, ${bet.bgFrom}, ${bet.bgTo})`,
                                borderColor: bet.border,
                            }}>
                                <div className="game-card__bet-header">
                                    <span className="game-card__bet-icon" style={{ color: bet.color }}>{bet.icon}</span>
                                    <span className="game-card__bet-label" style={{ color: bet.color }}>Bet {bet.label}</span>
                                </div>
                                <div className="game-card__bet-value" style={{ color: bet.color }}>
                                    R$ {sinalAtivo.valor_bet.toFixed(2).replace('.', ',')}
                                </div>
                                <div className="game-card__bet-bar">
                                    <div className="game-card__bet-bar-track">
                                        <div
                                            className="game-card__bet-bar-fill"
                                            style={{
                                                width: sinalAtivo.nivel_bet === 'baixa' ? '25%' : sinalAtivo.nivel_bet === 'media' ? '55%' : '90%',
                                                background: bet.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>
                    </>
                )}

                <a
                    href={url_afiliado}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`game-card__cta ${isActive ? 'game-card__cta--active' : ''}`}
                >
                    {isActive ? '🎰 Jogar Agora' : 'Acessar Plataforma'}
                </a>
            </div>
        </div>
    );
}
