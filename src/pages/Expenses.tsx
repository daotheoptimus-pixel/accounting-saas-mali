import { useState, useEffect } from 'react';
import { useExpenseStore } from '@/stores/expenseStore';
import { expenseService } from '@/services/expenseService';
import { CreateExpenseDTO, EXPENSE_CATEGORIES } from '@/types/expense';
import './Expenses.css';

function Expenses() {
  const { expenses, isLoading, fetchExpenses, addExpense, updateExpense, removeExpense } =
    useExpenseStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateExpenseDTO>({
    description: '',
    amount: 0,
    currency: 'XOF',
    category: '',
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    paymentMethod: 'cash',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const expenseData: CreateExpenseDTO = {
        ...formData,
        date: new Date(formData.date),
      };
      const newExpense = await expenseService.createExpense(expenseData);
      addExpense(newExpense);
      setFormData({
        description: '',
        amount: 0,
        currency: 'XOF',
        category: '',
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        paymentMethod: 'cash',
        notes: '',
      });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense?')) {
      return;
    }

    try {
      await expenseService.deleteExpense(id);
      removeExpense(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const expense = expenses.find((e) => e.id === id);
      if (!expense) return;

      const updatedExpense = await expenseService.updateExpense(id, {
        status: newStatus,
      });
      updateExpense(updatedExpense);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
    }
  };

  const filteredExpenses =
    filter === 'all'
      ? expenses
      : expenses.filter((exp) => exp.status === filter);

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const expensesByCategory = filteredExpenses.reduce(
    (acc, exp) => ({
      ...acc,
      [exp.category]: (acc[exp.category] || 0) + exp.amount,
    }),
    {} as Record<string, number>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>💰 Dépenses</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + Nouvelle Dépense
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>Enregistrer une nouvelle dépense</h3>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Montant *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="currency">Devise *</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="XOF">XOF</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="paymentMethod">Mode de paiement</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="cash">Espèces</option>
                  <option value="bank">Virement bancaire</option>
                  <option value="card">Carte</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="supplier">Fournisseur</label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={submitting}
                rows={3}
              />
            </textarea>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Enregistrement...' : 'Enregistrer la dépense'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total des dépenses</h4>
          <p className="stat-value">{totalExpenses.toLocaleString()} XOF</p>
        </div>
        <div className="stat-card">
          <h4>Nombre de dépenses</h4>
          <p className="stat-value">{filteredExpenses.length}</p>
        </div>
      </div>

      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card">
          <h3>Dépenses par catégorie</h3>
          <div className="category-breakdown">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="category-item">
                <span>{category}</span>
                <span className="amount">{amount.toLocaleString()} XOF</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="filter-bar">
        <label>Filtrer par statut:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvées</option>
          <option value="rejected">Rejetées</option>
        </select>
      </div>

      {isLoading ? (
        <div className="card">Chargement des dépenses...</div>
      ) : filteredExpenses.length === 0 ? (
        <div className="card empty-state">
          <p>Aucune dépense enregistrée. Ajoutez une nouvelle dépense pour commencer.</p>
        </div>
      ) : (
        <div className="expenses-table-container">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="description">{expense.description}</td>
                  <td>{expense.category}</td>
                  <td className="amount">{expense.amount.toLocaleString()} {expense.currency}</td>
                  <td>{new Date(expense.date).toLocaleDateString('fr-FR')}</td>
                  <td className="status">
                    <select
                      value={expense.status}
                      onChange={(e) =>
                        handleStatusChange(
                          expense.id,
                          e.target.value as 'pending' | 'approved' | 'rejected'
                        )
                      }
                      className="status-select"
                    >
                      <option value="pending">En attente</option>
                      <option value="approved">Approuvée</option>
                      <option value="rejected">Rejetée</option>
                    </select>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(expense.id)}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Expenses;
