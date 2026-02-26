import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

// Hash is generated once at startup
let adminPassHash: string;
(async () => {
    adminPassHash = await bcrypt.hash(ADMIN_PASS, 10);
})();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
            return;
        }

        if (username !== ADMIN_USER) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        // Compare against hash or raw (for first run before hash is ready)
        const isValid = adminPassHash
            ? await bcrypt.compare(password, adminPassHash)
            : password === ADMIN_PASS;

        if (!isValid) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        const token = jwt.sign({ userId: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: { username: ADMIN_USER } });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router;
