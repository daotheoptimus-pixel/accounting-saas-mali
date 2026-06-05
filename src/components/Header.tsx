import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h2>Bienvenue</h2>
      </div>
      <div className="header-right">
        <button className="header-btn">🔔</button>
        <button className="header-btn">⚙️</button>
        <div className="user-avatar">👤</div>
      </div>
    </header>
  );
}

export default Header;
