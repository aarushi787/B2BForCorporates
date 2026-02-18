# Quick Start Commands

## One-time Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run build
npm run db:init
```

### 2. Create MySQL Database
```bash
mysql -u root -p
CREATE DATABASE b2b_nexus_marketplace;
CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON b2b_nexus_marketplace.* TO 'db_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Frontend Setup
```bash
# In root directory
cp .env.example .env.local
# Update VITE_API_BASE_URL and API keys
```

## Running Development Servers

### Terminal 1: Backend (Port 5000)
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend (Port 5173)
```bash
npm run dev
```

## Testing API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Database Management

### View Database
```bash
mysql -u db_user -p b2b_nexus_marketplace
SHOW TABLES;
DESC users;
DESCRIBE companies;
```

### Reset Database
```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE b2b_nexus_marketplace;"
mysql -u root -p -e "CREATE DATABASE b2b_nexus_marketplace; GRANT ALL PRIVILEGES ON b2b_nexus_marketplace.* TO 'db_user'@'localhost';"
# Then reinitialize
npm run db:init
```

## Build & Deploy

### Build Backend
```bash
cd backend
npm run build
```

### Build Frontend
```bash
npm run build
```

## Endpoints Reference

- **Health:** `GET http://localhost:5000/api/health`
- **Auth:** `POST http://localhost:5000/api/auth/login`
- **Companies:** `GET http://localhost:5000/api/companies`
- **Products:** `GET http://localhost:5000/api/products`
- **Deals:** `GET http://localhost:5000/api/deals`
- **Messages:** `GET http://localhost:5000/api/messages`
- **Ledger:** `GET http://localhost:5000/api/ledger`

See BACKEND_INTEGRATION.md for full endpoint documentation.
