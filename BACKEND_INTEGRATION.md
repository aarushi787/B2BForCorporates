# Backend Integration Guide

## Overview

Your B2B Nexus Marketplace is now configured to connect to a backend API. The application includes service layers for:

- **Companies Management** (`companiesService`)
- **Products Management** (`productsService`)
- **Deals Management** (`dealsService`)
- **Authentication** (`authService`)
- **Messages** (`messagesService`)
- **Financial Ledger** (`ledgerService`)

---

## Configuration

### Environment Variables

Update `.env.local` with your backend API settings:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

Change `VITE_API_BASE_URL` to your actual backend server URL.

---

## API Endpoints Expected

Your backend should implement the following endpoints:

### Authentication (`/auth`)
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update user profile
- `POST /auth/change-password` - Change password
- `POST /auth/validate-token` - Validate JWT token

### Companies (`/companies`)
- `GET /companies` - Get all companies
- `GET /companies/{id}` - Get company by ID
- `POST /companies` - Create new company
- `PUT /companies/{id}` - Update company
- `DELETE /companies/{id}` - Delete company
- `PUT /companies/{id}/verify` - Verify company
- `GET /companies/search?q={query}` - Search companies
- `GET /companies/domain/{domain}` - Get companies by domain

### Products (`/products`)
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `GET /products/merchant/{merchantId}` - Get products by merchant
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `GET /products/search?q={query}` - Search products
- `GET /products/category/{category}` - Get by category
- `PUT /products/{id}/inventory` - Update inventory

### Deals (`/deals`)
- `GET /deals` - Get all deals
- `GET /deals/{id}` - Get deal by ID
- `GET /deals/buyer/{buyerId}` - Get deals by buyer
- `GET /deals/seller/{sellerId}` - Get deals by seller
- `POST /deals` - Create deal
- `PUT /deals/{id}` - Update deal
- `DELETE /deals/{id}` - Delete deal
- `PUT /deals/{id}/status` - Update deal status
- `PUT /deals/{id}/approve` - Approve deal
- `PUT /deals/{id}/reject` - Reject deal
- `GET /deals/status/{status}` - Get deals by status

### Messages (`/messages`)
- `GET /messages` - Get all messages
- `GET /messages/company/{companyId}` - Get user messages
- `GET /messages/thread?sender={id}&receiver={id}` - Get message thread
- `GET /messages/deal/{dealId}` - Get deal messages
- `POST /messages/send` - Send message
- `PUT /messages/{id}/read` - Mark as read
- `DELETE /messages/{id}` - Delete message

### Ledger (`/ledger`)
- `GET /ledger` - Get all entries
- `GET /ledger/company/{companyId}` - Get company entries
- `GET /ledger/deal/{dealId}` - Get deal entries
- `POST /ledger` - Create entry
- `GET /ledger/balance/{companyId}` - Get balance
- `GET /ledger/company/{companyId}/type/{type}` - Get entries by type
- `GET /ledger/company/{companyId}/month/{month}` - Get monthly report

---

## Fallback Behavior

If your backend is not available, the application will:

1. Display a loading screen with an API error notification
2. Automatically fall back to **mock data** for development
3. Allow you to continue testing UI/UX without a backend

This graceful degradation ensures you can develop client-side features independently.

---

## Using the Services in Components

### Example: Fetching Companies

```typescript
import { companiesService } from './services';

const MyComponent = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    companiesService.getAllCompanies()
      .then(data => setCompanies(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return <div>{/* render companies */}</div>;
};
```

### Example: Creating a Deal

```typescript
import { dealsService } from './services';

const createDeal = async () => {
  try {
    const deal = await dealsService.createDeal({
      buyerId: 'company-1',
      sellerIds: ['company-2'],
      productId: 'product-1',
      status: 'ENQUIRY',
      amount: 50000,
      platformFee: 2500,
      revenueSplits: [{ companyId: 'company-2', percentage: 100 }],
      milestones: [],
      contracts: [],
      notes: 'New collaboration',
      escrowStatus: 'UNFUNDED',
      riskScore: 25,
      completionProbability: 0.9
    });
    console.log('Deal created:', deal);
  } catch (error) {
    console.error('Failed to create deal:', error);
  }
};
```

---

## Error Handling

All service calls include error handling with fallbacks:

- **Network Errors**: Caught and logged with local fallback data
- **API Errors**: HTTP status codes are checked and errors are thrown
- **Graceful Degradation**: App continues to function with mock data

---

## Next Steps

1. **Implement Backend Server** - Create your API using Node.js, Python, Go, etc.
2. **Implement Database** - Set up PostgreSQL, MongoDB, or your preferred database
3. **Add Authentication** - Implement JWT or OAuth 2.0
4. **Deploy** - Host your backend (AWS, Heroku, Azure, etc.)
5. **Update Environment** - Change `VITE_API_BASE_URL` to your production URL
6. **Remove Mock Data** - Once stable, remove reliance on mock data from `constants.ts`

---

## Development Tips

### Enable Debug Logging

Edit `.env.local`:
```dotenv
VITE_DEBUG_API=true
```

Then update `apiClient.ts` to log all requests:
```typescript
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    if (import.meta.env.VITE_DEBUG_API) {
      console.log(`GET ${endpoint}`);
    }
    // ... rest of implementation
  }
}
```

### Mock Data for Testing

- Modify `constants.tsx` to add more test data
- Use React DevTools to inspect state
- Mock specific API calls in unit tests

---

## Support

For issues with backend integration, check:
1. Network tab in browser DevTools
2. Backend server logs
3. CORS configuration on backend
4. API endpoint format matches expected routes
