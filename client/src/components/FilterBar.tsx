import './FilterBar.css';

interface FilterBarProps {
    plataformas: { id: number; nome: string }[];
    provedores: string[];
    selectedPlataforma: number | null;
    selectedProvedor: string | null;
    searchTerm: string;
    onPlataformaChange: (id: number | null) => void;
    onProvedorChange: (provedor: string | null) => void;
    onSearchChange: (term: string) => void;
}

export default function FilterBar({
    plataformas,
    provedores,
    selectedPlataforma,
    selectedProvedor,
    searchTerm,
    onPlataformaChange,
    onProvedorChange,
    onSearchChange,
}: FilterBarProps) {
    return (
        <div className="filter-bar">
            {/* Campo de Busca */}
            <div className="filter-bar__search">
                <input
                    type="text"
                    placeholder="🔍 Buscar jogo por nome..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="filter-bar__input"
                />
            </div>

            <div className="filter-bar__section">
                <span className="filter-bar__label">Plataforma:</span>
                <div className="filter-bar__chips">
                    <button
                        className={`filter-chip ${!selectedPlataforma ? 'filter-chip--active' : ''}`}
                        onClick={() => onPlataformaChange(null)}
                    >
                        Todas
                    </button>
                    {plataformas.map((p) => (
                        <button
                            key={p.id}
                            className={`filter-chip ${selectedPlataforma === p.id ? 'filter-chip--active' : ''}`}
                            onClick={() => onPlataformaChange(p.id)}
                        >
                            {p.nome}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-bar__section">
                <span className="filter-bar__label">Provedor:</span>
                <div className="filter-bar__chips">
                    <button
                        className={`filter-chip ${!selectedProvedor ? 'filter-chip--active' : ''}`}
                        onClick={() => onProvedorChange(null)}
                    >
                        Todos
                    </button>
                    {provedores.map((p) => (
                        <button
                            key={p}
                            className={`filter-chip ${selectedProvedor === p ? 'filter-chip--active' : ''}`}
                            onClick={() => onProvedorChange(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
