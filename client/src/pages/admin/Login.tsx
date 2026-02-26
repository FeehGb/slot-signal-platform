import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if already logged in
    if (localStorage.getItem('admin_token')) {
        navigate('/admin/dashboard', { replace: true });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(username, password);
            localStorage.setItem('admin_token', response.data.token);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login">
            <div className="login__card">
                <div className="login__header">
                    <span className="login__logo">🔐</span>
                    <h1 className="login__title">Painel Admin</h1>
                    <p className="login__subtitle">Faça login para gerenciar a plataforma</p>
                </div>

                <form className="login__form" onSubmit={handleSubmit}>
                    {error && <div className="login__error">{error}</div>}

                    <div className="login__field">
                        <label className="login__label">Usuário</label>
                        <input
                            type="text"
                            className="login__input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div className="login__field">
                        <label className="login__label">Senha</label>
                        <input
                            type="password"
                            className="login__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="login__submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <a href="/" className="login__back">← Voltar ao site</a>
            </div>
        </div>
    );
}
