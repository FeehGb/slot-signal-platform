import { getDatabase } from '../database/init';

/**
 * Módulo de cadastro automático em plataformas de cassino.
 * 
 * AVISO: Este módulo é apenas demonstrativo/educacional.
 * A criação automática de contas viola os Termos de Serviço 
 * da maioria dos sites e pode resultar em bloqueio de IP 
 * ou ações legais.
 * 
 * Requer Puppeteer para funcionar (não incluído por padrão para 
 * manter o projeto leve). Instale com: npm install puppeteer
 */

interface RegistroResult {
    plataforma: string;
    status: 'sucesso' | 'erro' | 'bloqueado';
    mensagem: string;
}

export async function autoRegistrar(plataformaId?: number): Promise<{ success: boolean; results: RegistroResult[] }> {
    const db = getDatabase();
    const results: RegistroResult[] = [];

    try {
        // Busca plataformas para tentar cadastro
        let query = 'SELECT * FROM plataformas WHERE ativo = 1';
        const params: any[] = [];

        if (plataformaId) {
            query += ' AND id = ?';
            params.push(plataformaId);
        }

        const plataformas = db.prepare(query).all(...params) as any[];

        for (const plat of plataformas) {
            db.prepare(
                "INSERT INTO logs_scraping (tipo, alvo, status, mensagem) VALUES ('cadastro_auto', ?, 'simulado', ?)"
            ).run(plat.url_afiliado, `Simulação de cadastro na plataforma ${plat.nome} - Puppeteer não ativado`);

            results.push({
                plataforma: plat.nome,
                status: 'erro',
                mensagem: 'Puppeteer não instalado. Instale com: npm install puppeteer',
            });
        }

        return { success: true, results };
    } catch (error: any) {
        db.prepare(
            "INSERT INTO logs_scraping (tipo, alvo, status, mensagem) VALUES ('cadastro_auto', 'geral', 'erro', ?)"
        ).run(error.message || 'Erro desconhecido');

        return { success: false, results };
    }
}
