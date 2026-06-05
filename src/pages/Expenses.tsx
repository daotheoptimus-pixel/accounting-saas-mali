function Expenses() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Dépenses</h1>
        <button className="btn btn-primary">+ Nouvelle Dépense</button>
      </div>
      <div className="card">
        <p>Aucune dépense enregistrée. Créez une nouvelle dépense pour commencer.</p>
      </div>
    </div>
  );
}

export default Expenses;
