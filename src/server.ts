import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';
import { getDatabase } from './database/init';
import { gerarSinais } from './services/signalGenerator';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
getDatabase();
console.log('✅ Banco de dados inicializado');

// Generate initial signals
gerarSinais();
console.log('✅ Sinais iniciais gerados');

// API Routes
app.use('/api', apiRoutes);
app.use('/admin/api', adminRoutes);
app.use('/auth', authRoutes);

// Cron job: generate new signals every 10 minutes
cron.schedule('*/10 * * * *', () => {
    console.log('[Cron] Gerando novos sinais...');
    gerarSinais();
});

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servey Frontend em Produção
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Fallback do React Router (Qualquer rota que não for /api cai aqui e carrega a SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Admin API: http://localhost:${PORT}/admin/api`);
    console.log(`🔐 Login: POST http://localhost:${PORT}/auth/login`);
});

export default app;
