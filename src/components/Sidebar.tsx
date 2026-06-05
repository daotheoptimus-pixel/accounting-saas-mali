import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>AccuMali</h1>
        <p className="subtitle">SaaS Comptable</p>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          📊 Tableau de Bord
        </Link>
        <Link
          to="/invoices"
          className={`nav-link ${isActive('/invoices') ? 'active' : ''}`}
        >
          📄 Factures
        </Link>
        <Link
          to="/expenses"
          className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
        >
          💰 Dépenses
        </Link>
        <Link
          to="/clients"
          className={`nav-link ${isActive('/clients') ? 'active' : ''}`}
        >
          👥 Clients
        </Link>
        <Link
          to="/reports"
          className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
        >
          📊 Rapports
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name[0]?.toUpperCase()}</div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
