# MySQL + Backend Setup Complete ✓

Your B2B Nexus Marketplace now has a complete Node.js/Express backend with MySQL database connection.

## What's Been Set Up

### ✅ Backend Structure
- **Express.js** server with TypeScript
- **MySQL 2** database driver with connection pooling
- **JWT** authentication with bcryptjs password hashing
- **CORS** configuration for frontend integration
- **Error handling** and middleware

### ✅ Database Schema
Complete MySQL database with 6 tables:
- **users** - User accounts and authentication
- **companies** - Company profiles
- **products** - Product inventory
- **deals** - Business deals/transactions
- **messages** - Company communication
- **ledger** - Financial tracking

### ✅ API Routes (28 endpoints)
- **Auth** (7 endpoints) - Register, login, profile management
- **Companies** (8 endpoints) - CRUD operations + search
- **Products** (8 endpoints) - Inventory management + search
- **Deals** (9 endpoints) - Deal lifecycle management
- **Messages** (6 endpoints) - Communication system
- **Ledger** (6 endpoints) - Financial records + reporting

### ✅ TypeScript Support
- Full type safety across backends
- Environment variable typing
- Request/Response types

## Files Created

```
backend/
├── src/
│   ├── index.ts                    # Main server (Express app, listeners)
│   ├── config/
│   │   ├── database.ts             # MySQL connection pool
│   │   └── init.ts                 # Database table creation
│   ├── middleware/
│   │   └── auth.ts                 # JWT auth + error handling
│   └── routes/
│       ├── auth.ts                 # 7 auth endpoints
│       ├── companies.ts            # 8 company endpoints
│       ├── products.ts             # 8 product endpoints
│       ├── deals.ts                # 9 deal endpoints
│       ├── messages.ts             # 6 message endpoints
│       └── ledger.ts               # 6 ledger endpoints
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── README.md                       # Backend documentation
└── dist/                           # (Generated after build)

Root directory:
├── SQL_SETUP_GUIDE.md              # Complete setup instructions
├── QUICK_START.md                  # Quick command reference
├── .env.example                    # Frontend env template
└── [existing frontend files]
```

## Quick Start

### 1. Install MySQL (if not already installed)
- **Windows:** https://dev.mysql.com/downloads/mysql/
- **Mac:** `brew install mysql`
- **Linux:** `sudo apt-get install mysql-server`

### 2. Create Database
```bash
mysql -u root -p
CREATE DATABASE b2b_nexus_marketplace;
CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON b2b_nexus_marketplace.* TO 'db_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run build
npm run db:init
npm run dev
```

### 4. Setup Frontend
```bash
# In root directory
cp .env.example .env.local
# Update VITE_API_BASE_URL and API keys
npm run dev
```

### 5. Test Connection
```bash
curl http://localhost:5000/api/health
```

## Configuration

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=db_user
DB_PASSWORD=secure_password
DB_NAME=b2b_nexus_marketplace
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_API_KEY=your_gemini_key
GEMINI_API_KEY=placeholder
```

## Available Commands

### Backend
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled server
- `npm run db:init` - Initialize database tables

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Examples

### Register User
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "buyer"
  }
}
```

### Create Company (Requires Auth)
```bash
POST http://localhost:5000/api/companies
Authorization: Bearer <token>
{
  "name": "Acme Corp",
  "email": "company@acme.com",
  "domain": "acme.com",
  "industry": "Technology",
  "description": "Leading tech company"
}
```

### Get All Companies
```bash
GET http://localhost:5000/api/companies
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Environment variables (no hardcoded secrets)
- ✅ Input validation
- ✅ Error handling

## Performance Features

- ✅ Connection pooling (MySQL)
- ✅ Async/await
- ✅ TypeScript type checking
- ✅ UUID primary keys
- ✅ Indexed foreign keys

## Next Steps

1. **Start both servers:** Backend on 5000, Frontend on 5173
2. **Test the API:** Use curl, Postman, or the browser
3. **Build features:** Use the provided endpoints
4. **Deploy:** See deployment section in SQL_SETUP_GUIDE.md

## Documentation

- **Full API Docs:** [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)
- **Setup Guide:** [SQL_SETUP_GUIDE.md](SQL_SETUP_GUIDE.md)
- **Quick Commands:** [QUICK_START.md](QUICK_START.md)
- **Backend Readme:** [backend/README.md](backend/README.md)

## Troubleshooting

**Can't connect to MySQL?**
- Check MySQL is running
- Verify credentials in `.env`
- Try: `mysql -u db_user -p`

**Port 5000 already in use?**
- Change `PORT` in `.env`
- Or kill process: `lsof -i :5000`

**Database tables not created?**
- Run: `npm run build && npm run db:init`
- Check console for errors

**CORS errors?**
- Ensure `CORS_ORIGIN=http://localhost:5173`
- Frontend must be on port 5173

## Support

All endpoints are documented in [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)
