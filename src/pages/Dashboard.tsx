function Dashboard() {
  return (
    <div className="page">
      <h1>Tableau de Bord</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Revenus ce mois</h3>
          <p className="amount">1,250,000 XOF</p>
          <p className="trend">+15% vs mois dernier</p>
        </div>
        <div className="card">
          <h3>Dépenses ce mois</h3>
          <p className="amount">450,000 XOF</p>
          <p className="trend">+5% vs mois dernier</p>
        </div>
        <div className="card">
          <h3>Factures en attente</h3>
          <p className="amount">8</p>
          <p className="trend">Total: 350,000 XOF</p>
        </div>
        <div className="card">
          <h3>Solde net</h3>
          <p className="amount">800,000 XOF</p>
          <p className="trend">+12% vs mois dernier</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
