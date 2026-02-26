import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin) return null;

    return (
        <nav className="navbar">
            <div className="navbar__container">
                <Link to="/" className="navbar__brand">
                    <img src="/logo_transparent.png" alt="Fortune Wise Logo" className="navbar__logo-img" />

                </Link>

                <div className="navbar__links">
                    <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>
                        Início
                    </Link>
                    <Link to="/como-funciona" className={`navbar__link ${location.pathname === '/como-funciona' ? 'navbar__link--active' : ''}`}>
                        Como o Robô Funciona
                    </Link>
                </div>
            </div>
        </nav>
    );
}
