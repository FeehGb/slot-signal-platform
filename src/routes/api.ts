import { Router, Request, Response } from 'express';
import { getDatabase } from '../database/init';

const router = Router();

// GET /api/jogos - Lista jogos ativos com filtros
router.get('/jogos', (req: Request, res: Response) => {
    try {
        const db = getDatabase();
        const { plataforma, provedor } = req.query;

        let query = `
      SELECT j.*, p.nome as plataforma_nome, p.url_afiliado, p.logo_url as plataforma_logo
      FROM jogos j
      LEFT JOIN plataformas p ON j.plataforma_id = p.id
      WHERE j.ativo = 1
    `;
        const params: any[] = [];

        if (plataforma) {
            query += ' AND j.plataforma_id = ?';
            params.push(plataforma);
        }
        if (provedor) {
            query += ' AND j.provedor = ?';
            params.push(provedor);
        }

        query += ' ORDER BY j.criado_em DESC';

        const jogos = db.prepare(query).all(...params);
        res.json(jogos);
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        res.status(500).json({ error: 'Erro ao buscar jogos' });
    }
});

// GET /api/plataformas - Lista plataformas ativas
router.get('/plataformas', (_req: Request, res: Response) => {
    try {
        const db = getDatabase();
        const plataformas = db.prepare(
            'SELECT * FROM plataformas WHERE ativo = 1 ORDER BY nome'
        ).all();
        res.json(plataformas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar plataformas' });
    }
});

// GET /api/sinais-ativos - Jogos com sinal ativo agora
router.get('/sinais-ativos', (_req: Request, res: Response) => {
    try {
        const db = getDatabase();
        const sinais = db.prepare(`
      SELECT
        sa.id as sinal_id,
        sa.win_rate,
        sa.nivel_bet,
        sa.valor_bet,
        sa.data_hora_inicio,
        sa.data_hora_fim,
        j.id as jogo_id,
        j.nome,
        j.imagem_url,
        j.provedor,
        p.nome as plataforma_nome,
        p.url_afiliado,
        p.logo_url as plataforma_logo
      FROM sinais_ativos sa
      JOIN jogos j ON sa.jogo_id = j.id
      LEFT JOIN plataformas p ON j.plataforma_id = p.id
      WHERE sa.data_hora_fim > datetime('now')
      ORDER BY sa.win_rate DESC
    `).all();

        res.json(sinais);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar sinais ativos' });
    }
});

// GET /api/provedores - Lista provedores distintos
router.get('/provedores', (_req: Request, res: Response) => {
    try {
        const db = getDatabase();
        const provedores = db.prepare(
            'SELECT DISTINCT provedor FROM jogos WHERE ativo = 1 AND provedor IS NOT NULL ORDER BY provedor'
        ).all();
        res.json(provedores.map((p: any) => p.provedor));
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar provedores' });
    }
});

// GET /api/stats - Estatísticas
router.get('/stats', (_req: Request, res: Response) => {
    try {
        const db = getDatabase();
        const totalJogos = (db.prepare('SELECT COUNT(*) as c FROM jogos WHERE ativo = 1').get() as any).c;
        const totalPlataformas = (db.prepare('SELECT COUNT(*) as c FROM plataformas WHERE ativo = 1').get() as any).c;
        const sinaisAtivos = (db.prepare("SELECT COUNT(*) as c FROM sinais_ativos WHERE data_hora_fim > datetime('now')").get() as any).c;
        const totalLogs = (db.prepare('SELECT COUNT(*) as c FROM logs_scraping').get() as any).c;

        res.json({
            totalJogos,
            totalPlataformas,
            sinaisAtivos,
            totalLogs,
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

export default router;
