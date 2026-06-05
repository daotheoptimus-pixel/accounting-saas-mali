function Invoices() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Factures</h1>
        <button className="btn btn-primary">+ Nouvelle Facture</button>
      </div>
      <div className="card">
        <p>Aucune facture trouvée. Créez une nouvelle facture pour commencer.</p>
      </div>
    </div>
  );
}

export default Invoices;
