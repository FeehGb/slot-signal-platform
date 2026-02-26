import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    adminGetJogos,
    adminCreateJogo,
    adminUpdateJogo,
    adminDeleteJogo,
    adminGetPlataformas,
    adminCreatePlataforma,
    adminUpdatePlataforma,
    adminDeletePlataforma,
    adminScrapePlataformas,
    adminScrapeJogos,
    adminGetLogs,
    getStats,
} from '../../services/api';
import './Dashboard.css';

type Tab = 'jogos' | 'plataformas' | 'scraping' | 'logs';

interface Jogo {
    id: number;
    nome: string;
    imagem_url: string;
    provedor: string;
    plataforma_id: number | null;
    plataforma_nome?: string;
    ativo: number;
}

interface Plataforma {
    id: number;
    nome: string;
    url_afiliado: string;
    logo_url: string;
    ativo: number;
}

interface LogEntry {
    id: number;
    tipo: string;
    alvo: string;
    status: string;
    mensagem: string;
    criado_em: string;
}

interface Stats {
    totalJogos: number;
    totalPlataformas: number;
    sinaisAtivos: number;
    totalLogs: number;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('jogos');
    const [stats, setStats] = useState<Stats>({ totalJogos: 0, totalPlataformas: 0, sinaisAtivos: 0, totalLogs: 0 });

    // Jogos
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'jogo' | 'plataforma'>('jogo');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>({});

    // Scraping
    const [scrapingLoading, setScrapingLoading] = useState(false);
    const [scrapingResult, setScrapingResult] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem('admin_token')) {
            navigate('/admin', { replace: true });
            return;
        }
        loadData();
    }, []);

    async function loadData() {
        try {
            const [jogosRes, platRes, logsRes, statsRes] = await Promise.all([
                adminGetJogos(),
                adminGetPlataformas(),
                adminGetLogs(),
                getStats(),
            ]);
            setJogos(jogosRes.data);
            setPlataformas(platRes.data);
            setLogs(logsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem('admin_token');
        navigate('/admin');
    }

    // ==================== MODAL ====================

    function openCreateModal(type: 'jogo' | 'plataforma') {
        setModalType(type);
        setEditingId(null);
        setFormData(type === 'jogo'
            ? { nome: '', imagem_url: '', provedor: '', plataforma_id: '', ativo: 1 }
            : { nome: '', url_afiliado: '', logo_url: '', ativo: 1 }
        );
        setShowModal(true);
    }

    function openEditModal(type: 'jogo' | 'plataforma', item: any) {
        setModalType(type);
        setEditingId(item.id);
        setFormData({ ...item, plataforma_id: item.plataforma_id || '' });
        setShowModal(true);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            if (modalType === 'jogo') {
                const data = { ...formData, plataforma_id: formData.plataforma_id || null };
                if (editingId) {
                    await adminUpdateJogo(editingId, data);
                } else {
                    await adminCreateJogo(data);
                }
            } else {
                if (editingId) {
                    await adminUpdatePlataforma(editingId, formData);
                } else {
                    await adminCreatePlataforma(formData);
                }
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    }

    async function handleDelete(type: 'jogo' | 'plataforma', id: number) {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            if (type === 'jogo') await adminDeleteJogo(id);
            else await adminDeletePlataforma(id);
            loadData();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    // ==================== SCRAPING ====================

    async function handleScrapePlataformas() {
        setScrapingLoading(true);
        setScrapingResult('');
        try {
            const res = await adminScrapePlataformas();
            setScrapingResult(res.data.message);
            loadData();
        } catch (error: any) {
            setScrapingResult(error.response?.data?.error || 'Erro no scraping');
        } finally {
            setScrapingLoading(false);
        }
    }

    async function handleScrapeJogos() {
        setScrapingLoading(true);
        setScrapingResult('');
        try {
            const res = await adminScrapeJogos();
            setScrapingResult(res.data.message);
            loadData();
        } catch (error: any) {
            setScrapingResult(error.response?.data?.error || 'Erro no scraping');
        } finally {
            setScrapingLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="dashboard__loading">
                <div className="dashboard__spinner" />
                <p>Carregando painel...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard__sidebar">
                <div className="dashboard__brand">
                    <span className="dashboard__brand-icon">🎰</span>
                    <span className="dashboard__brand-text">Admin</span>
                </div>

                <nav className="dashboard__nav">
                    {([
                        { id: 'jogos' as Tab, label: 'Jogos', icon: '🎮' },
                        { id: 'plataformas' as Tab, label: 'Plataformas', icon: '🏢' },
                        { id: 'scraping' as Tab, label: 'Scraping', icon: '🤖' },
                        { id: 'logs' as Tab, label: 'Logs', icon: '📋' },
                    ]).map((item) => (
                        <button
                            key={item.id}
                            className={`dashboard__nav-item ${tab === item.id ? 'dashboard__nav-item--active' : ''}`}
                            onClick={() => setTab(item.id)}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="dashboard__sidebar-footer">
                    <a href="/" className="dashboard__nav-item">
                        <span>🌐</span>
                        <span>Ver Site</span>
                    </a>
                    <button className="dashboard__nav-item dashboard__logout" onClick={logout}>
                        <span>🚪</span>
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard__main">
                {/* Stats */}
                <div className="dashboard__stats">
                    {[
                        { label: 'Jogos Ativos', value: stats.totalJogos, color: '#4d7cff' },
                        { label: 'Plataformas', value: stats.totalPlataformas, color: '#a855f7' },
                        { label: 'Sinais Ativos', value: stats.sinaisAtivos, color: '#00e676' },
                        { label: 'Logs', value: stats.totalLogs, color: '#fbbf24' },
                    ].map((s) => (
                        <div key={s.label} className="dashboard__stat-card">
                            <span className="dashboard__stat-value" style={{ color: s.color }}>{s.value}</span>
                            <span className="dashboard__stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Tab Content */}
                {tab === 'jogos' && (
                    <div className="dashboard__section">
                        <div className="dashboard__section-header">
                            <h2>Gerenciar Jogos</h2>
                            <button className="dashboard__btn-primary" onClick={() => openCreateModal('jogo')}>
                                + Novo Jogo
                            </button>
                        </div>
                        <div className="dashboard__table-wrap">
                            <table className="dashboard__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Provedor</th>
                                        <th>Plataforma</th>
                                        <th>Ativo</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jogos.map((j) => (
                                        <tr key={j.id}>
                                            <td>{j.id}</td>
                                            <td>
                                                <div className="dashboard__cell-with-img">
                                                    <img src={j.imagem_url} alt="" className="dashboard__thumb"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/48/slot-machine.png'; }}
                                                    />
                                                    {j.nome}
                                                </div>
                                            </td>
                                            <td>{j.provedor}</td>
                                            <td>{j.plataforma_nome || '-'}</td>
                                            <td><span className={`dashboard__badge ${j.ativo ? 'dashboard__badge--active' : 'dashboard__badge--inactive'}`}>{j.ativo ? 'Sim' : 'Não'}</span></td>
                                            <td>
                                                <div className="dashboard__actions">
                                                    <button className="dashboard__btn-edit" onClick={() => openEditModal('jogo', j)}>Editar</button>
                                                    <button className="dashboard__btn-delete" onClick={() => handleDelete('jogo', j.id)}>Excluir</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === 'plataformas' && (
                    <div className="dashboard__section">
                        <div className="dashboard__section-header">
                            <h2>Gerenciar Plataformas</h2>
                            <button className="dashboard__btn-primary" onClick={() => openCreateModal('plataforma')}>
                                + Nova Plataforma
                            </button>
                        </div>
                        <div className="dashboard__table-wrap">
                            <table className="dashboard__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>URL Afiliado</th>
                                        <th>Ativo</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plataformas.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.nome}</td>
                                            <td><a href={p.url_afiliado} target="_blank" rel="noopener" className="dashboard__link">{p.url_afiliado.substring(0, 40)}...</a></td>
                                            <td><span className={`dashboard__badge ${p.ativo ? 'dashboard__badge--active' : 'dashboard__badge--inactive'}`}>{p.ativo ? 'Sim' : 'Não'}</span></td>
                                            <td>
                                                <div className="dashboard__actions">
                                                    <button className="dashboard__btn-edit" onClick={() => openEditModal('plataforma', p)}>Editar</button>
                                                    <button className="dashboard__btn-delete" onClick={() => handleDelete('plataforma', p.id)}>Excluir</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === 'scraping' && (
                    <div className="dashboard__section">
                        <h2>Scraping e Automação</h2>
                        <div className="dashboard__scraping-grid">
                            <div className="dashboard__scraping-card">
                                <h3>🔍 Scrape Plataformas</h3>
                                <p>Extrair plataformas do site de referência (reidoslotsinais.com)</p>
                                <button className="dashboard__btn-primary" onClick={handleScrapePlataformas} disabled={scrapingLoading}>
                                    {scrapingLoading ? 'Executando...' : 'Executar Scraping'}
                                </button>
                            </div>
                            <div className="dashboard__scraping-card">
                                <h3>🎮 Scrape Jogos</h3>
                                <p>Extrair jogos de um site de cassino configurado</p>
                                <button className="dashboard__btn-primary" onClick={handleScrapeJogos} disabled={scrapingLoading}>
                                    {scrapingLoading ? 'Executando...' : 'Executar Scraping'}
                                </button>
                            </div>
                        </div>
                        {scrapingResult && (
                            <div className="dashboard__scraping-result">
                                <strong>Resultado:</strong> {scrapingResult}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'logs' && (
                    <div className="dashboard__section">
                        <h2>Logs de Scraping</h2>
                        <div className="dashboard__table-wrap">
                            <table className="dashboard__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tipo</th>
                                        <th>Alvo</th>
                                        <th>Status</th>
                                        <th>Mensagem</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((l) => (
                                        <tr key={l.id}>
                                            <td>{l.id}</td>
                                            <td><span className="dashboard__badge">{l.tipo}</span></td>
                                            <td className="dashboard__cell-truncate">{l.alvo}</td>
                                            <td><span className={`dashboard__badge ${l.status === 'sucesso' ? 'dashboard__badge--active' : l.status === 'erro' ? 'dashboard__badge--inactive' : ''}`}>{l.status}</span></td>
                                            <td className="dashboard__cell-truncate">{l.mensagem}</td>
                                            <td>{new Date(l.criado_em).toLocaleString('pt-BR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="dashboard__modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="dashboard__modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingId ? 'Editar' : 'Novo'} {modalType === 'jogo' ? 'Jogo' : 'Plataforma'}</h3>
                        <form onSubmit={handleSubmit} className="dashboard__modal-form">
                            <div className="dashboard__field">
                                <label>Nome</label>
                                <input value={formData.nome || ''} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                            </div>

                            {modalType === 'jogo' ? (
                                <>
                                    <div className="dashboard__field">
                                        <label>URL da Imagem</label>
                                        <input value={formData.imagem_url || ''} onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })} required />
                                    </div>
                                    <div className="dashboard__field">
                                        <label>Provedor</label>
                                        <input value={formData.provedor || ''} onChange={(e) => setFormData({ ...formData, provedor: e.target.value })} />
                                    </div>
                                    <div className="dashboard__field">
                                        <label>Plataforma</label>
                                        <select value={formData.plataforma_id || ''} onChange={(e) => setFormData({ ...formData, plataforma_id: e.target.value ? Number(e.target.value) : null })}>
                                            <option value="">Selecione...</option>
                                            {plataformas.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="dashboard__field">
                                        <label>URL de Afiliado</label>
                                        <input value={formData.url_afiliado || ''} onChange={(e) => setFormData({ ...formData, url_afiliado: e.target.value })} required />
                                    </div>
                                    <div className="dashboard__field">
                                        <label>URL do Logo</label>
                                        <input value={formData.logo_url || ''} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} />
                                    </div>
                                </>
                            )}

                            <div className="dashboard__field">
                                <label>Ativo</label>
                                <select value={formData.ativo} onChange={(e) => setFormData({ ...formData, ativo: Number(e.target.value) })}>
                                    <option value={1}>Sim</option>
                                    <option value={0}>Não</option>
                                </select>
                            </div>

                            <div className="dashboard__modal-actions">
                                <button type="button" className="dashboard__btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="dashboard__btn-primary">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
