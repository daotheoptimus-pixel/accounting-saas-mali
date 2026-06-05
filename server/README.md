# Backend API - Accounting SaaS Mali

## Installation

```bash
cd server
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

## Development

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Building

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics

## Technology Stack

- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **CORS** - Cross-origin requests

## Future Enhancements

- [ ] PostgreSQL database integration
- [ ] Advanced authentication (OAuth)
- [ ] PDF generation for invoices
- [ ] Email notifications
- [ ] File uploads
- [ ] Advanced reporting
- [ ] Role-based access control
