# SQL Database Connection & Backend Setup Guide

This guide walks you through setting up MySQL and connecting it to your B2B Nexus Marketplace backend.

## Prerequisites

- **Node.js** (v16+)
- **MySQL Server** (5.7+)
- **npm** or **yarn**

## Step 1: Install MySQL

### Windows
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. Remember the root password you set
4. MySQL will be installed and running as a service

### macOS
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

## Step 2: Create Database

Open MySQL shell:
```bash
mysql -u root -p
```

Enter your password, then run:
```sql
CREATE DATABASE b2b_nexus_marketplace;
CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON b2b_nexus_marketplace.* TO 'db_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Setup Backend

Navigate to the backend folder:
```bash
cd backend
npm install
```

Create `.env` file from the example:
```bash
cp .env.example .env
```

Update `.env` with your MySQL credentials:
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=db_user
DB_PASSWORD=secure_password
DB_NAME=b2b_nexus_marketplace

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

CORS_ORIGIN=http://localhost:5173
```

Initialize the database (creates tables):
```bash
npm run build
npm run db:init
```

Start the development server:
```bash
npm run dev
```

You should see:
```
✓ Server running on http://localhost:5000
✓ Database connected to b2b_nexus_marketplace
```

## Step 4: Setup Frontend

In the root directory, create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

Start the frontend development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Step 5: Test the Connection

### Using cURL
```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman
1. Open Postman
2. Create a new request
3. Set method to `POST`
4. URL: `http://localhost:5000/api/auth/login`
5. Headers: `Content-Type: application/json`
6. Body (raw):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## File Structure

```
b2b-nexus-marketplace/
├── backend/                    # Express backend
│   ├── src/
│   │   ├── index.ts           # Main server file
│   │   ├── config/
│   │   │   ├── database.ts     # MySQL connection
│   │   │   └── init.ts         # Database initialization
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT authentication
│   │   └── routes/
│   │       ├── auth.ts         # Auth endpoints
│   │       ├── companies.ts    # Company endpoints
│   │       ├── products.ts     # Product endpoints
│   │       ├── deals.ts        # Deal endpoints
│   │       ├── messages.ts     # Message endpoints
│   │       └── ledger.ts       # Ledger endpoints
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
├── src/                        # React frontend
│   ├── services/
│   │   └── apiClient.ts        # Frontend API client
│   └── ...
├── .env.local                  # Frontend env variables
└── BACKEND_INTEGRATION.md
```

## Common Issues

### MySQL Connection Error
**Error:** `Error: (ER_ACCESS_DENIED_FOR_USER) Access denied for user 'root'@'localhost'`

**Solution:**
- Check MySQL is running
- Verify credentials in `.env`
- Try: `mysql -u root -p` to test connection

### Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>
```

### CORS Errors
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure `CORS_ORIGIN=http://localhost:5173` in backend `.env`
- Make sure frontend is running on port 5173

### Database Not Initializing
**Error:** `Table doesn't exist`

**Solution:**
```bash
npm run build
npm run db:init
```

## Running Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

Both will now be running:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## API Authentication

Protected endpoints require a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

Get a token by logging in:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

Then use the returned `token` in subsequent requests.

## Production Deployment

Before deploying to production:

1. **Change JWT_SECRET** in `.env`
2. **Update CORS_ORIGIN** to your domain
3. **Use environment-specific `.env`** files
4. **Enable HTTPS** on your server
5. **Use strong MySQL passwords**
6. **Set `NODE_ENV=production`**
7. **Run:** `npm run build && npm start`

## Next Steps

1. ✅ MySQL database is set up
2. ✅ Backend API is running
3. ✅ Frontend is connected
4. Continue with: [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)

For detailed API endpoint documentation, see [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
