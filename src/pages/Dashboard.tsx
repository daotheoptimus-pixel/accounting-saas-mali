import { useAuthStore } from '@/stores/authStore';
import { useClientStore } from '@/stores/clientStore';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useExpenseStore } from '@/stores/expenseStore';
import { reportService } from '@/services/reportService';
import { useState, useEffect } from 'react';
import { ReportData } from '@/types/report';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuthStore();
  const { clients, fetchClients } = useClientStore();
  const { invoices, fetchInvoices } = useInvoiceStore();
  const { expenses, fetchExpenses } = useExpenseStore();
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      await Promise.all([fetchClients(), fetchInvoices(), fetchExpenses()]);

      try {
        const data = await reportService.getDashboardData();
        setReportData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboard();
  }, [fetchClients, fetchInvoices, fetchExpenses]);

  const paidAmount = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status === 'sent' || inv.status === 'draft')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="page">
      <div className="dashboard-welcome">
        <h1>Bienvenue, {user?.name}! 👋</h1>
        <p>Voici votre aperçu financier</p>
      </div>

      <div className="dashboard-grid">
        <div className="card kpi">
          <h3>Revenus reçus</h3>
          <p className="amount">{paidAmount.toLocaleString()} XOF</p>
          <p className="trend">✅ Factures payées: {invoices.filter((i) => i.status === 'paid').length}</p>
        </div>
        <div className="card kpi">
          <h3>Revenus en attente</h3>
          <p className="amount">{pendingAmount.toLocaleString()} XOF</p>
          <p className="trend">⏳ Factures en attente: {invoices.filter((i) => i.status === 'sent' || i.status === 'draft').length}</p>
        </div>
        <div className="card kpi">
          <h3>Dépenses ce mois</h3>
          <p className="amount">{totalExpenses.toLocaleString()} XOF</p>
          <p className="trend">📊 {expenses.length} dépenses enregistrées</p>
        </div>
        <div className="card kpi">
          <h3>Solde net</h3>
          <p className="amount">{(paidAmount - totalExpenses).toLocaleString()} XOF</p>
          <p className="trend">💰 Bénéfice net</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>📊 Statistiques clés</h2>
        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-label">Clients actifs</span>
            <span className="stat-value">{clients.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Factures totales</span>
            <span className="stat-value">{invoices.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Taux de paiement</span>
            <span className="stat-value">
              {invoices.length > 0
                ? Math.round(
                    (invoices.filter((i) => i.status === 'paid').length / invoices.length) *
                      100
                  )
                : 0}%
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Revenu moyen par facture</span>
            <span className="stat-value">
              {invoices.length > 0
                ? (invoices.reduce((sum, i) => sum + i.totalAmount, 0) / invoices.length).toLocaleString()
                : 0}
            </span>
          </div>
        </div>
      </div>

      {reportData && (
        <div className="dashboard-section">
          <h2>💰 Revenus vs Dépenses</h2>
          <div className="comparison-cards">
            <div className="comparison-card income">
              <h4>Revenus</h4>
              <p>{reportData.totalRevenue.toLocaleString()} XOF</p>
            </div>
            <div className="comparison-card expenses">
              <h4>Dépenses</h4>
              <p>{reportData.totalExpenses.toLocaleString()} XOF</p>
            </div>
            <div className="comparison-card profit">
              <h4>Bénéfice</h4>
              <p>{reportData.netIncome.toLocaleString()} XOF</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
