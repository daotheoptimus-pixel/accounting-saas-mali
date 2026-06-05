import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

// JWT Verification Middleware
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = (decoded as any).userId;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Mock Database
const mockUsers: Record<string, any> = {};
const mockClients: Record<string, any> = {};
const mockInvoices: Record<string, any> = {};
const mockExpenses: Record<string, any> = {};

// ============ AUTH ROUTES ============
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (mockUsers[email]) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const userId = `user_${Date.now()}`;
  mockUsers[email] = { id: userId, email, password, name };

  const token = jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    id: userId,
    email,
    name,
    token,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const user = mockUsers[email];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    token,
  });
});

app.post('/api/auth/verify', verifyToken, (req: AuthRequest, res: Response) => {
  res.json({ valid: true, userId: req.userId });
});

// ============ CLIENTS ROUTES ============
app.get('/api/clients', verifyToken, (req: AuthRequest, res: Response) => {
  const clients = Object.values(mockClients).filter(
    (c: any) => c.userId === req.userId
  );
  res.json(clients);
});

app.post('/api/clients', verifyToken, (req: AuthRequest, res: Response) => {
  const { name, email, phone, address, city, country } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const clientId = `client_${Date.now()}`;
  const newClient = {
    id: clientId,
    userId: req.userId,
    name,
    email,
    phone,
    address,
    city,
    country,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockClients[clientId] = newClient;
  res.status(201).json(newClient);
});

app.put('/api/clients/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const client = mockClients[req.params.id];

  if (!client || client.userId !== req.userId) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const updated = { ...client, ...req.body, updatedAt: new Date() };
  mockClients[req.params.id] = updated;
  res.json(updated);
});

app.delete('/api/clients/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const client = mockClients[req.params.id];

  if (!client || client.userId !== req.userId) {
    return res.status(404).json({ message: 'Client not found' });
  }

  delete mockClients[req.params.id];
  res.status(204).send();
});

// ============ INVOICES ROUTES ============
app.get('/api/invoices', verifyToken, (req: AuthRequest, res: Response) => {
  const invoices = Object.values(mockInvoices).filter(
    (i: any) => i.userId === req.userId
  );
  res.json(invoices);
});

app.post('/api/invoices', verifyToken, (req: AuthRequest, res: Response) => {
  const { clientId, date, dueDate, items, currency, notes } = req.body;

  if (!clientId || !items || items.length === 0) {
    return res.status(400).json({ message: 'Invalid invoice data' });
  }

  const invoiceId = `invoice_${Date.now()}`;
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const totalAmount = items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.unitPrice,
    0
  );

  const newInvoice = {
    id: invoiceId,
    userId: req.userId,
    invoiceNumber,
    clientId,
    date: new Date(date),
    dueDate: new Date(dueDate),
    items: items.map((item: any) => ({
      id: `item_${Date.now()}`,
      ...item,
      total: item.quantity * item.unitPrice,
    })),
    status: 'draft',
    totalAmount,
    currency,
    notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockInvoices[invoiceId] = newInvoice;
  res.status(201).json(newInvoice);
});

app.put('/api/invoices/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const invoice = mockInvoices[req.params.id];

  if (!invoice || invoice.userId !== req.userId) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  const updated = { ...invoice, ...req.body, updatedAt: new Date() };
  mockInvoices[req.params.id] = updated;
  res.json(updated);
});

app.delete('/api/invoices/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const invoice = mockInvoices[req.params.id];

  if (!invoice || invoice.userId !== req.userId) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  delete mockInvoices[req.params.id];
  res.status(204).send();
});

// ============ EXPENSES ROUTES ============
app.get('/api/expenses', verifyToken, (req: AuthRequest, res: Response) => {
  const expenses = Object.values(mockExpenses).filter(
    (e: any) => e.userId === req.userId
  );
  res.json(expenses);
});

app.post('/api/expenses', verifyToken, (req: AuthRequest, res: Response) => {
  const { description, amount, currency, category, date, supplier, paymentMethod, notes } =
    req.body;

  if (!description || !amount || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const expenseId = `expense_${Date.now()}`;
  const newExpense = {
    id: expenseId,
    userId: req.userId,
    description,
    amount,
    currency,
    category,
    date: new Date(date),
    supplier,
    paymentMethod,
    notes,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockExpenses[expenseId] = newExpense;
  res.status(201).json(newExpense);
});

app.put('/api/expenses/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const expense = mockExpenses[req.params.id];

  if (!expense || expense.userId !== req.userId) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  const updated = { ...expense, ...req.body, updatedAt: new Date() };
  mockExpenses[req.params.id] = updated;
  res.json(updated);
});

app.delete('/api/expenses/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const expense = mockExpenses[req.params.id];

  if (!expense || expense.userId !== req.userId) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  delete mockExpenses[req.params.id];
  res.status(204).send();
});

// ============ REPORTS ROUTES ============
app.get('/api/reports/dashboard', verifyToken, (req: AuthRequest, res: Response) => {
  const userInvoices = Object.values(mockInvoices).filter(
    (i: any) => i.userId === req.userId
  ) as any[];
  const userExpenses = Object.values(mockExpenses).filter(
    (e: any) => e.userId === req.userId
  ) as any[];
  const userClients = Object.values(mockClients).filter(
    (c: any) => c.userId === req.userId
  ) as any[];

  const totalRevenue = userInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalExpenses = userExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  const paidInvoices = userInvoices.filter((i) => i.status === 'paid').length;
  const pendingInvoices = userInvoices.filter(
    (i) => i.status === 'sent' || i.status === 'draft'
  ).length;

  const expenseByCategory = userExpenses.reduce(
    (acc, e) => ({
      ...acc,
      [e.category]: (acc[e.category] || 0) + e.amount,
    }),
    {} as Record<string, number>
  );

  const topClients = userClients
    .map((client) => ({
      clientId: client.id,
      clientName: client.name,
      totalAmount: userInvoices
        .filter((i) => i.clientId === client.id)
        .reduce((sum, i) => sum + i.totalAmount, 0),
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  res.json({
    totalRevenue,
    totalExpenses,
    netIncome,
    invoiceCount: userInvoices.length,
    paidInvoices,
    pendingInvoices,
    averageInvoiceAmount:
      userInvoices.length > 0
        ? totalRevenue / userInvoices.length
        : 0,
    topClients,
    expenseByCategory,
  });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
});

export default app;
