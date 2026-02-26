import { Router, Response } from 'express';
import { getDatabase } from '../database/init';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { scrapePlataformas, scrapeJogos } from '../services/scraper';

const router = Router();

// All admin routes require authentication
router.use(authMiddleware);

// ==================== JOGOS CRUD ====================

router.get('/jogos', (_req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const jogos = db.prepare(`
      SELECT j.*, p.nome as plataforma_nome
      FROM jogos j
      LEFT JOIN plataformas p ON j.plataforma_id = p.id
      ORDER BY j.criado_em DESC
    `).all();
        res.json(jogos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar jogos' });
    }
});

router.post('/jogos', (req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const { nome, imagem_url, provedor, plataforma_id, ativo } = req.body;

        if (!nome || !imagem_url) {
            res.status(400).json({ error: 'Nome e imagem são obrigatórios' });
            return;
        }

        const result = db.prepare(
            'INSERT INTO jogos (nome, imagem_url, provedor, plataforma_id, ativo) VALUES (?, ?, ?, ?, ?)'
        ).run(nome, imagem_url, provedor || 'Desconhecido', plataforma_id || null, ativo !== undefined ? ativo : 1);

        res.status(201).json({ id: result.lastInsertRowid, message: 'Jogo criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar jogo' });
    }
});

router.put('/jogos/:id', (req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const { id } = req.params;
        const { nome, imagem_url, provedor, plataforma_id, ativo } = req.body;

        db.prepare(
            'UPDATE jogos SET nome = ?, imagem_url = ?, provedor = ?, plataforma_id = ?, ativo = ? WHERE id = ?'
        ).run(nome, imagem_url, provedor, plataforma_id || null, ativo, id);

        res.json({ message: 'Jogo atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar jogo' });
    }
});

router.delete('/jogos/:id', (req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const { id } = req.params;
        db.prepare('DELETE FROM jogos WHERE id = ?').run(id);
        res.json({ message: 'Jogo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover jogo' });
    }
});

// ==================== PLATAFORMAS CRUD ====================

router.get('/plataformas', (_req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const plataformas = db.prepare('SELECT * FROM plataformas ORDER BY nome').all();
        res.json(plataformas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar plataformas' });
    }
});

router.post('/plataformas', (req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const { nome, url_afiliado, logo_url, ativo } = req.body;

        if (!nome || !url_afiliado) {
            res.status(400).json({ error: 'Nome e URL de afiliado são obrigatórios' });
            return;
        }

        const result = db.prepare(
            'INSERT INTO plataformas (nome, url_afiliado, logo_url, ativo) VALUES (?, ?, ?, ?)'
        ).run(nome, url_afiliado, logo_url || '', ativo !== undefined ? ativo : 1);

        res.status(201).json({ id: result.lastInsertRowid, message: 'Plataforma criada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar plataforma' });
    }
});

router.put('/plataformas/:id', (req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const { id } = req.params;
        const { nome, url_afiliado, logo_url, ativo } = req.body;

        db.prepare(
            'UPDATE plataformas SET nome = ?, url_afiliado = ?, logo_url = ?, ativo = ? WHERE id = ?'
        ).run(nome, url_afiliado, logo_url || '', ativo, id);

        res.json({ message: 'Plataforma atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar plataforma' });
    }
});

router.delete('/plataformas/:id', (req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const { id } = req.params;
        db.prepare('DELETE FROM plataformas WHERE id = ?').run(id);
        res.json({ message: 'Plataforma removida com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover plataforma' });
    }
});

// ==================== SCRAPING ====================

router.post('/scraping/plataformas', async (_req: AuthRequest, res: Response) => {
    try {
        const result = await scrapePlataformas();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao executar scraping de plataformas' });
    }
});

router.post('/scraping/jogos', async (req: AuthRequest, res: Response) => {
    try {
        const { url } = req.body;
        const result = await scrapeJogos(url);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao executar scraping de jogos' });
    }
});

// ==================== LOGS ====================

router.get('/logs', (_req: AuthRequest, res: Response) => {
    try {
        const db = getDatabase();
        const logs = db.prepare(
            'SELECT * FROM logs_scraping ORDER BY criado_em DESC LIMIT 100'
        ).all();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar logs' });
    }
});

export default router;
