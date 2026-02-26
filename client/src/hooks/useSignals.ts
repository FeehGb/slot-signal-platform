import { useState, useEffect, useCallback } from 'react';
import { getSinaisAtivos } from '../services/api';

interface SinalAtivo {
    sinal_id: number;
    win_rate: number;
    nivel_bet: 'baixa' | 'media' | 'alta';
    valor_bet: number;
    data_hora_inicio: string;
    data_hora_fim: string;
    jogo_id: number;
    nome: string;
    imagem_url: string;
    provedor: string;
    plataforma_nome: string;
    url_afiliado: string;
    plataforma_logo: string;
}

export function useSignals(intervalMs: number = 30000) {
    const [sinais, setSinais] = useState<SinalAtivo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSinais = useCallback(async () => {
        try {
            const response = await getSinaisAtivos();
            setSinais(response.data);
        } catch (error) {
            console.error('Erro ao buscar sinais:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSinais();
        const interval = setInterval(fetchSinais, intervalMs);
        return () => clearInterval(interval);
    }, [fetchSinais, intervalMs]);

    const isActive = useCallback(
        (jogoId: number) => sinais.some((s) => s.jogo_id === jogoId),
        [sinais]
    );

    const getSignalData = useCallback(
        (jogoId: number) => sinais.find((s) => s.jogo_id === jogoId),
        [sinais]
    );

    return { sinais, loading, isActive, getSignalData, refresh: fetchSinais };
}
