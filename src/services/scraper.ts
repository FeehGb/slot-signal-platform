import axios from 'axios';
import * as cheerio from 'cheerio';
import { getDatabase } from '../database/init';

const SINAIS_URL = process.env.SCRAPING_URL_SINAIS || 'https://reidoslotsinais.com';

export async function scrapePlataformas(): Promise<{ success: boolean; message: string; plataformas?: any[] }> {
    const db = getDatabase();

    try {
        db.prepare(
            "INSERT INTO logs_scraping (tipo, alvo, status, mensagem) VALUES ('scraping', ?, 'iniciado', 'Iniciando scraping de plataformas')"
        ).run(SINAIS_URL);

        const response = await axios.get(SINAIS_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            timeout: 15000,
        });

        const $ = cheerio.load(response.data);
        const plataformas: { nome: string; url: string }[] = [];

        $('a[href]').each((_i, el) => {
            const href = $(el).attr('href') || '';
            const text = $(el).text().trim();

            // Filtra links de afiliados (com ?id= param)
            if (href.includes('?id=') && !href.includes('instagram')) {
                try {
                    const urlObj = new URL(href);
                    const nome = urlObj.hostname.replace('www.', '').replace('.com', '').replace('.bet', '');
                    plataformas.push({
                        nome: nome.charAt(0).toUpperCase() + nome.slice(1),
                        url: href,
                    });
                } catch { }
            }
        });

        // Insere no banco (upsert)
        const upsert = db.prepare(`
      INSERT INTO plataformas (nome, url_afiliado, ativo) VALUES (?, ?, 1)
      ON CONFLICT(nome) DO UPDATE SET url_afiliado = excluded.url_afiliado
    `);

        // Add unique constraint if not exists (workaround for SQLite)
        try {
            db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_plataformas_nome ON plataformas(nome)');
        } catch { }

        const transaction = db.transaction(() => {
            for (const p of plataformas) {
                try {
                    upsert.run(p.nome, p.url);
                } catch {
                    // If upsert fails due to constraint, just update
                    db.prepare('UPDATE plataformas SET url_afiliado = ? WHERE nome = ?').run(p.url, p.nome);
                }
            }
        });

        transaction();

        db.prepare(
            "INSERT INTO logs_scraping (tipo, alvo, status, mensagem) VALUES ('scraping', ?, 'sucesso', ?)"
        ).run(SINAIS_URL, `Encontradas ${plataformas.length} plataformas`);

        return {
            success: true,
            message: `Encontradas ${plataformas.length} plataformas`,
            plataformas,
        };
    } catch (error: any) {
        const msg = error.message || 'Erro desconhecido';
        db.prepare(
            "INSERT INTO logs_scraping (tipo, alvo, status, mensagem) VALUES ('scraping', ?, 'erro', ?)"
        ).run(SINAIS_URL, msg);

        return { success: false, message: `Erro no scraping: ${msg}` };
    }
}

export async function scrapeJogos(url?: string): Promise<{ success: boolean; message: string; jogos?: any[] }> {
    const db = getDatabase();
    const targetUrl = url || process.env.SCRAPING_URL_CASSINO || '';

    if (!targetUrl) {
        return { success: false, message: 'URL do cassino não configurada' };
    }

    try {
        db.prepare(
            "INSERT INTO logs_scraping (tipo, alvo, status, mensagem) VALUES ('scraping_jogos', ?, 'iniciado', 'Iniciando scraping de jogos')"
        ).run(targetUrl);

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            timeout: 15000,
        });

        const $ = cheerio.load(response.data);
        const jogos: { nome: string; imagem_url: string; provedor: string }[] = [];

        // Generic selectors for common casino game layouts
        $('img[src*="game"], img[data-src*="game"], .game-card img, .game-item img').each((_i, el) => {
            const img = $(el).attr('src') || $(el).attr('data-src') || '';
            const alt = $(el).attr('alt') || '';
            const title = $(el).closest('[data-title], [title]').attr('data-title') ||
                $(el).closest('[data-title], [title]').attr('title') || alt;

            if (img && title) {
                jogos.push({
                    nome: title,
                    imagem_url: img.startsWith('http') ? img : new URL(img, targetUrl).href,
                    provedor: 'Importado',
                });
            }
        });

        db.prepare(
            "INSERT INTO logs_scraping (tipo, alvo, status, mensagem) VALUES ('scraping_jogos', ?, 'sucesso', ?)"
        ).run(targetUrl, `Encontrados ${jogos.length} jogos`);

        return {
            success: true,
            message: `Encontrados ${jogos.length} jogos`,
            jogos,
        };
    } catch (error: any) {
        const msg = error.message || 'Erro desconhecido';
        db.prepare(
            "INSERT INTO logs_scraping (tipo, alvo, status, mensagem) VALUES ('scraping_jogos', ?, 'erro', ?)"
        ).run(targetUrl, msg);

        return { success: false, message: `Erro no scraping: ${msg}` };
    }
}
