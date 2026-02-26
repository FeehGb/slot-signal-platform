import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to admin requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.url?.includes('/admin/')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin';
        }
        return Promise.reject(error);
    }
);

// ==================== PUBLIC API ====================

export const getJogos = (plataforma?: number, provedor?: string) => {
    const params = new URLSearchParams();
    if (plataforma) params.set('plataforma', String(plataforma));
    if (provedor) params.set('provedor', provedor);
    return api.get(`/api/jogos?${params}`);
};

export const getPlataformas = () => api.get('/api/plataformas');
export const getSinaisAtivos = () => api.get('/api/sinais-ativos');
export const getProvedores = () => api.get('/api/provedores');
export const getStats = () => api.get('/api/stats');

// ==================== AUTH ====================

export const login = (username: string, password: string) =>
    api.post('/auth/login', { username, password });

// ==================== ADMIN API ====================

export const adminGetJogos = () => api.get('/admin/api/jogos');
export const adminCreateJogo = (data: any) => api.post('/admin/api/jogos', data);
export const adminUpdateJogo = (id: number, data: any) => api.put(`/admin/api/jogos/${id}`, data);
export const adminDeleteJogo = (id: number) => api.delete(`/admin/api/jogos/${id}`);

export const adminGetPlataformas = () => api.get('/admin/api/plataformas');
export const adminCreatePlataforma = (data: any) => api.post('/admin/api/plataformas', data);
export const adminUpdatePlataforma = (id: number, data: any) => api.put(`/admin/api/plataformas/${id}`, data);
export const adminDeletePlataforma = (id: number) => api.delete(`/admin/api/plataformas/${id}`);

export const adminScrapePlataformas = () => api.post('/admin/api/scraping/plataformas');
export const adminScrapeJogos = (url?: string) => api.post('/admin/api/scraping/jogos', { url });
export const adminGetLogs = () => api.get('/admin/api/logs');

export default api;
