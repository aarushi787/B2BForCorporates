# B2B Nexus Marketplace Backend

Node.js Express backend with MySQL database for B2B Nexus Marketplace.

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your MySQL credentials:**
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=b2b_nexus_marketplace
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Initialize database (creates tables):**
   ```bash
   npm run build
   npm run db:init
   ```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

All endpoints are prefixed with `/api`. See [BACKEND_INTEGRATION.md](../BACKEND_INTEGRATION.md) for detailed endpoint documentation.

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `POST /auth/change-password` - Change password
- `POST /auth/validate-token` - Validate JWT

### Companies
- `GET /companies` - Get all companies
- `GET /companies/{id}` - Get company by ID
- `POST /companies` - Create company
- `PUT /companies/{id}` - Update company
- `DELETE /companies/{id}` - Delete company
- `PUT /companies/{id}/verify` - Verify company
- `GET /companies/search?q={query}` - Search companies
- `GET /companies/domain/{domain}` - Get by domain

### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `GET /products/merchant/{merchantId}` - Get by merchant
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `GET /products/search?q={query}` - Search products
- `GET /products/category/{category}` - Get by category
- `PUT /products/{id}/inventory` - Update inventory

### Deals
- `GET /deals` - Get all deals
- `GET /deals/{id}` - Get deal by ID
- `GET /deals/buyer/{buyerId}` - Get buyer deals
- `GET /deals/seller/{sellerId}` - Get seller deals
- `POST /deals` - Create deal
- `PUT /deals/{id}` - Update deal
- `DELETE /deals/{id}` - Delete deal
- `PUT /deals/{id}/status` - Update status
- `PUT /deals/{id}/approve` - Approve deal
- `PUT /deals/{id}/reject` - Reject deal
- `GET /deals/status/{status}` - Get by status

### Messages
- `GET /messages` - Get all messages
- `GET /messages/company/{companyId}` - Get company messages
- `GET /messages/thread` - Get message thread
- `GET /messages/deal/{dealId}` - Get deal messages
- `POST /messages/send` - Send message
- `PUT /messages/{id}/read` - Mark as read
- `DELETE /messages/{id}` - Delete message

### Ledger
- `GET /ledger` - Get all entries
- `GET /ledger/company/{companyId}` - Get company entries
- `GET /ledger/deal/{dealId}` - Get deal entries
- `POST /ledger` - Create entry
- `GET /ledger/balance/{companyId}` - Get company balance
- `GET /ledger/company/{companyId}/type/{type}` - Get by type
- `GET /ledger/company/{companyId}/month/{month}` - Get monthly report

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 3306 |
| `DB_USER` | MySQL user | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | b2b_nexus_marketplace |
| `JWT_SECRET` | JWT signing key | change_this |
| `JWT_EXPIRY` | JWT expiration time | 7d |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:5173 |
| `NODE_ENV` | Environment | development |

## Database Schema

### Users Table
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password (VARCHAR, hashed)
- firstName, lastName
- role (enum: buyer, seller, admin)
- timestamps

### Companies Table
- id (UUID, Primary Key)
- name, email (unique), domain
- industry, description
- verified (boolean)
- userId (FK to users)
- timestamps

### Products Table
- id (UUID, Primary Key)
- name, description
- price (DECIMAL)
- category, inventory
- merchantId (FK to companies)
- timestamps

### Deals Table
- id (UUID, Primary Key)
- title, description
- buyerId, sellerId (FK to companies)
- productId (FK to products)
- quantity, totalAmount
- status (enum: pending, approved, rejected, completed, cancelled)
- timestamps

### Messages Table
- id (UUID, Primary Key)
- senderId, receiverId (FK to companies)
- dealId (FK to deals, optional)
- content
- isRead (boolean)
- timestamp

### Ledger Table
- id (UUID, Primary Key)
- companyId (FK to companies)
- dealId (FK to deals, optional)
- type (enum: debit, credit)
- amount (DECIMAL)
- description
- timestamp

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from the login endpoint and expire based on `JWT_EXPIRY`.

## Error Handling

The API returns JSON error responses with appropriate HTTP status codes:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Server Error

## Development

Use TypeScript for type safety. The project uses:
- **Express** - Web framework
- **MySQL2** - MySQL driver
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **UUID** - Unique ID generation

## Notes

- All IDs are UUIDs
- Timestamps are automatically managed
- Passwords are hashed using bcryptjs
- CORS is configured for the frontend
- Database transactions can be added for multi-step operations
