import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useClientStore } from '@/stores/clientStore';
import { invoiceService } from '@/services/invoiceService';
import { CreateInvoiceDTO } from '@/types/invoice';
import './Invoices.css';

function Invoices() {
  const navigate = useNavigate();
  const { invoices, isLoading, fetchInvoices, addInvoice, removeInvoice } =
    useInvoiceStore();
  const { clients, fetchClients } = useClientStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateInvoiceDTO>({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    currency: 'XOF',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, [fetchInvoices, fetchClients]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      clientId: e.target.value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...(formData.items as any[])];
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index] = { ...newItems[index], [field]: Number(value) };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const invoiceData: CreateInvoiceDTO = {
        ...formData,
        date: new Date(formData.date),
        dueDate: new Date(formData.dueDate),
      };
      const newInvoice = await invoiceService.createInvoice(invoiceData);
      addInvoice(newInvoice);
      setShowForm(false);
      setFormData({
        clientId: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        currency: 'XOF',
        notes: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette facture?')) {
      return;
    }

    try {
      await invoiceService.deleteInvoice(id);
      removeInvoice(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: '📝',
      sent: '✉️',
      paid: '✅',
      overdue: '⚠️',
      cancelled: '❌',
    };
    return badges[status] || status;
  };

  const getTotalAmount = () => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>📄 Factures</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + Nouvelle Facture
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>Créer une nouvelle facture</h3>
          <form onSubmit={handleSubmit} className="invoice-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientId">Client *</label>
                <select
                  id="clientId"
                  value={formData.clientId}
                  onChange={handleClientChange}
                  required
                  disabled={submitting}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="currency">Devise *</label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }))
                  }
                  disabled={submitting}
                >
                  <option value="XOF">XOF (FCFA)</option>
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
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  required
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Date d'échéance *</label>
                <input
                  type="date"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-section">
              <h4>Articles</h4>
              {formData.items.map((item, index) => (
                <div key={index} className="invoice-item">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, 'description', e.target.value)
                    }
                    disabled={submitting}
                  />
                  <input
                    type="number"
                    placeholder="Quantité"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    disabled={submitting}
                  />
                  <input
                    type="number"
                    placeholder="Prix unitaire"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, 'unitPrice', e.target.value)
                    }
                    disabled={submitting}
                  />
                  <div className="item-total">
                    {(item.quantity * item.unitPrice).toLocaleString()}
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeItem(index)}
                      disabled={submitting}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-add-item"
                onClick={addItem}
                disabled={submitting}
              >
                + Ajouter un article
              </button>
              <div className="invoice-total">
                <strong>Total: {getTotalAmount().toLocaleString()} {formData.currency}</strong>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Notes additionnelles..."
                disabled={submitting}
                rows={4}
              />
            </textarea>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Création...' : 'Créer la facture'}
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

      {isLoading ? (
        <div className="card">Chargement des factures...</div>
      ) : invoices.length === 0 ? (
        <div className="card empty-state">
          <p>Aucune facture trouvée. Créez une nouvelle facture pour commencer.</p>
        </div>
      ) : (
        <div className="invoices-table-container">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>N° Facture</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-number">{invoice.invoiceNumber}</td>
                  <td>{invoice.client?.name || 'N/A'}</td>
                  <td>{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                  <td className="amount">
                    {invoice.totalAmount.toLocaleString()} {invoice.currency}
                  </td>
                  <td className="status">{getStatusBadge(invoice.status)}</td>
                  <td className="actions">
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      title="Voir détails"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(invoice.id)}
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

export default Invoices;
