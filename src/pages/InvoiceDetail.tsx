import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';

function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await invoiceService.getInvoice(id);
        setInvoice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <div className="page">Chargement...</div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!invoice) return <div className="page">Facture non trouvée</div>;

  return (
    <div className="page">
      <div className="invoice-detail">
        <h1>Facture {invoice.invoiceNumber}</h1>
        <div className="invoice-grid">
          <div className="invoice-section">
            <h3>Client</h3>
            <p>{invoice.client?.name}</p>
            <p>{invoice.client?.email}</p>
          </div>
          <div className="invoice-section">
            <h3>Dates</h3>
            <p>Date: {new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
            <p>Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="invoice-section">
            <h3>Statut</h3>
            <p>{invoice.status}</p>
          </div>
        </div>

        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice.toLocaleString()} {invoice.currency}</td>
                <td>{item.total.toLocaleString()} {invoice.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-total">
          <strong>Total: {invoice.totalAmount.toLocaleString()} {invoice.currency}</strong>
        </div>

        {invoice.notes && (
          <div className="invoice-notes">
            <h3>Notes</h3>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceDetail;
