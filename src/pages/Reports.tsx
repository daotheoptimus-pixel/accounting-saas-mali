import { useState, useEffect } from 'react';
import { reportService } from '@/services/reportService';
import { ReportData } from '@/types/report';
import './Reports.css';

function Reports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await reportService.getDashboardData(
        new Date(startDate),
        new Date(endDate)
      );
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>📊 Rapports Financiers</h1>

      <div className="date-filter">
        <div className="filter-group">
          <label htmlFor="startDate">Date de début</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">Date de fin</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="card">Chargement du rapport...</div>
      ) : reportData ? (
        <>
          <div className="report-grid">
            <div className="report-card income">
              <h3>Revenus totaux</h3>
              <p className="amount">{reportData.totalRevenue.toLocaleString()} XOF</p>
            </div>
            <div className="report-card expenses">
              <h3>Dépenses totales</h3>
              <p className="amount">{reportData.totalExpenses.toLocaleString()} XOF</p>
            </div>
            <div className="report-card income">
              <h3>Revenu net</h3>
              <p className="amount">{reportData.netIncome.toLocaleString()} XOF</p>
            </div>
            <div className="report-card info">
              <h3>Taux de marge</h3>
              <p className="amount">
                {reportData.totalRevenue > 0
                  ? ((reportData.netIncome / reportData.totalRevenue) * 100).toFixed(2)
                  : 0}%
              </p>
            </div>
          </div>

          <div className="report-section">
            <h2>📈 Aperçu des factures</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span>Nombre de factures</span>
                <strong>{reportData.invoiceCount}</strong>
              </div>
              <div className="stat-item">
                <span>Factures payées</span>
                <strong>{reportData.paidInvoices}</strong>
              </div>
              <div className="stat-item">
                <span>Factures en attente</span>
                <strong>{reportData.pendingInvoices}</strong>
              </div>
              <div className="stat-item">
                <span>Montant moyen par facture</span>
                <strong>{reportData.averageInvoiceAmount.toLocaleString()} XOF</strong>
              </div>
            </div>
          </div>

          {reportData.topClients.length > 0 && (
            <div className="report-section">
              <h2>🏆 Top 5 Clients</h2>
              <div className="clients-ranking">
                {reportData.topClients.map((client, index) => (
                  <div key={client.clientId} className="ranking-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="name">{client.clientName}</span>
                    <span className="amount">{client.totalAmount.toLocaleString()} XOF</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(reportData.expenseByCategory).length > 0 && (
            <div className="report-section">
              <h2>💰 Dépenses par catégorie</h2>
              <div className="category-chart">
                {Object.entries(reportData.expenseByCategory).map(([category, amount]) => (
                  <div key={category} className="category-bar">
                    <div className="label">
                      <span>{category}</span>
                      <span className="amount">{amount.toLocaleString()} XOF</span>
                    </div>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${(amount / Math.max(...Object.values(reportData.expenseByCategory))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default Reports;
