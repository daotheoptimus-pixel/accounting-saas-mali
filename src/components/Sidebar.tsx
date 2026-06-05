import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
          📈 Rapports
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">Se déconnecter</button>
      </div>
    </aside>
  );
}

export default Sidebar;
