
import { Role, RiskLevel, Company, Product, User, DealStatus, LedgerType, LedgerEntry, Deal, Message, AuditLog, SupportTicket, FeatureFlag, AuditReport } from './types';

export const MOCK_AUDIT_REPORTS: AuditReport[] = [
  {
    id: 'ar1',
    title: 'Q1 Financial Health Audit',
    date: '2024-01-15',
    score: 98,
    category: 'FINANCIAL',
    summary: 'Company shows strong liquidity ratios and sustainable revenue growth.',
    fileUrl: '#'
  },
  {
    id: 'ar2',
    title: 'Global Compliance Review',
    date: '2023-11-20',
    score: 94,
    category: 'COMPLIANCE',
    summary: 'Passed all KYC/AML requirements with zero red flags.',
    fileUrl: '#'
  }
];

export const MOCK_TESTIMONIALS = [
  {
    id: 't1',
    author: 'Aman Chauhan',
    role: 'Managing Director, Chauhan Steels',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    quote: 'Nexus transformed our supply chain. We closed a $2M fabrication deal in 4 days that used to take 3 months of vetting.',
    metrics: '40% Cost Reduction'
  },
  {
    id: 't2',
    author: 'Sarah Jenkins',
    role: 'VP Procurement, Saini Corp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    quote: 'The AI matching engine is scary-accurate. It found us a verified designer in Berlin for our prototypes within minutes.',
    metrics: '92% Faster Vetting'
  }
];

export const MOCK_CASE_STUDIES = [
  {
    id: 'cs1',
    title: 'Integrated Data Center Build',
    companies: ['Chauhan Steels', 'TechCore Systems'],
    outcome: 'Successful delivery of 200 metric tons of steel integrated with 3D-printed prototypes.',
    result: '$4.2M Deal Value'
  }
];

export const MOCK_FAQS = [
  { q: "How are partners verified?", a: "Every partner undergoes a 12-point audit including GST validation, financial solvency checks, and historical performance reviews." },
  { q: "What is the platform fee?", a: "We charge a flat 5% commission on successful deal settlements. No hidden membership fees for vetted entities." },
  { q: "How is my data secured?", a: "Nexus uses AES-256 encryption and SOC2-compliant infrastructure. All contracts are timestamped on an immutable ledger." }
];

export const MOCK_PARTNERS = [
  'Chauhan Steels', 'Saini Corp', 'TechCore', 'Global Logistics', 'Tata Steel', 'Reliance Ind', 'Adani Group', 'Infosys'
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Chauhan Steels',
    gst: '07AAAAA0000A1Z5',
    risk: RiskLevel.LOW,
    reputation: 4.8,
    domain: 'Manufacturing',
    capabilities: ['Metal Fabrication', 'Industrial Tooling', 'Supply Chain'],
    verified: true,
    revenue: 1250000,
    onTimeDelivery: 98,
    dealCompletionRate: 95,
    complianceScore: 99,
    status: 'ACTIVE',
    lastActive: '2024-03-24T10:00:00Z',
    auditReports: [MOCK_AUDIT_REPORTS[0], MOCK_AUDIT_REPORTS[1]]
  },
  {
    id: 'c2',
    name: 'Saini Corp',
    gst: '08BBBBB1111B2Z6',
    risk: RiskLevel.MEDIUM,
    reputation: 4.2,
    domain: 'Technology',
    capabilities: ['Cloud Infrastructure', 'SAAS Solutions', 'Enterprise Software'],
    verified: true,
    revenue: 890000,
    onTimeDelivery: 92,
    dealCompletionRate: 88,
    complianceScore: 94,
    status: 'ACTIVE',
    lastActive: '2024-03-24T12:30:00Z',
    auditReports: [MOCK_AUDIT_REPORTS[0]]
  },
  {
    id: 'c3',
    name: 'TechCore Systems',
    gst: '09CCCCC2222C3Z7',
    risk: RiskLevel.LOW,
    reputation: 4.9,
    domain: 'Designing',
    capabilities: ['UI/UX Design', '3D Modeling', 'Product Prototypes'],
    verified: true,
    revenue: 450000,
    onTimeDelivery: 99,
    dealCompletionRate: 100,
    complianceScore: 100,
    status: 'ACTIVE',
    lastActive: '2024-03-23T15:00:00Z',
    auditReports: [MOCK_AUDIT_REPORTS[1]]
  },
  {
    id: 'c4',
    name: 'Global Logistics Inc',
    gst: '10DDDDD3333D4Z8',
    risk: RiskLevel.HIGH,
    reputation: 3.5,
    domain: 'Finance',
    capabilities: ['Cross-border Trade', 'Trade Financing', 'B2B Payments'],
    verified: false,
    revenue: 2100000,
    onTimeDelivery: 85,
    dealCompletionRate: 75,
    complianceScore: 68,
    status: 'PENDING_KYC',
    lastActive: '2024-03-20T08:00:00Z'
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    buyerId: 'c2',
    sellerIds: ['c1', 'c3'],
    productId: 'p1',
    status: DealStatus.NEGOTIATION,
    amount: 45000,
    platformFee: 2250,
    payoutAmount: 42750,
    escrowStatus: 'FUNDED',
    riskScore: 24,
    completionProbability: 0.92,
    revenueSplits: [
      { companyId: 'c1', percentage: 70 },
      { companyId: 'c3', percentage: 30 }
    ],
    milestones: [
      { id: 'm1', title: 'Advance Design & Fabrication', amount: 15000, dueDate: '2024-04-01', status: 'PAID' },
      { id: 'm2', title: 'Tooling Initialization', amount: 15000, dueDate: '2024-05-01', status: 'PENDING' },
      { id: 'm3', title: 'Final Global Delivery', amount: 15000, dueDate: '2024-06-01', status: 'PENDING' }
    ],
    contracts: [
      { id: 'con1', type: 'NDA', content: 'Three-party non-disclosure regarding integrated fabrication blueprints.', version: 1, signedBy: ['c1', 'c2', 'c3'], createdAt: '2024-03-01' },
      { id: 'con2', type: 'REVENUE_SPLIT', content: 'Commercial agreement: 70% to Chauhan, 30% to TechCore.', version: 1, signedBy: ['c1', 'c3'], createdAt: '2024-03-05' }
    ],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15',
    notes: 'Heavy duty steel shipment & design integration for cloud data center construction.'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log1', userId: 'u1', action: 'VERIFY_COMPANY', resource: 'c1', timestamp: '2024-03-24T12:00:00Z', details: 'Manual override by Admin', ipAddress: '192.168.1.45' },
  { id: 'log2', userId: 'u2', action: 'WITHDRAW_FUNDS', resource: 'wallet_c1', timestamp: '2024-03-24T11:30:00Z', details: '$10,500 withdrawal initiated', ipAddress: '45.12.3.9' },
  { id: 'log3', userId: 'u1', action: 'UPDATE_FEES', resource: 'SYSTEM_CONFIG', timestamp: '2024-03-24T10:15:00Z', details: 'Platform fee adjusted to 5.2%', ipAddress: '192.168.1.45' }
];

export const MOCK_TICKETS: SupportTicket[] = [
  { id: 't1', companyId: 'c2', subject: 'Escrow release delay for Deal D1', priority: 'HIGH', status: 'IN_PROGRESS', createdAt: '2024-03-24T09:00:00Z' },
  { id: 't2', companyId: 'c4', subject: 'KYC Document Verification Status', priority: 'MEDIUM', status: 'OPEN', createdAt: '2024-03-23T14:20:00Z' }
];

export const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  { id: 'f1', key: 'MAINTENANCE_MODE', enabled: false, description: 'Disables all trading activities' },
  { id: 'f2', key: 'AI_MATCHING_V2', enabled: true, description: 'Enables advanced Gemini-driven matching' },
  { id: 'f3', key: 'CRYPTO_SETTLEMENT', enabled: false, description: 'Enables USDC/USDT escrow options' }
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'c2', receiverId: 'c1', dealId: 'd1', content: 'Hey Aman, can we discuss the delivery timeline for the steel sheets?', timestamp: '2024-03-02T10:00:00Z', type: 'text' },
  { id: 'm2', senderId: 'c1', receiverId: 'c2', dealId: 'd1', content: 'Sure Deepak, we are on track for the April 1st milestone.', timestamp: '2024-03-02T10:05:00Z', type: 'text' },
  { id: 'm3', senderId: 'c2', receiverId: 'c1', dealId: 'd1', content: 'Approved Scope Change #2: Increased sheet thickness.', timestamp: '2024-03-02T10:10:00Z', type: 'decision' }
];

export const MOCK_LEDGER: LedgerEntry[] = [
  { id: 'l1', dealId: 'd1', amount: 45000, type: LedgerType.ESCROW_DEPOSIT, timestamp: '2024-03-05', status: 'COMPLETED', counterparty: 'Saini Corp' },
  { id: 'l2', dealId: 'd1', amount: 2250, type: LedgerType.COMMISSION, timestamp: '2024-03-05', status: 'COMPLETED', counterparty: 'Platform' },
  { id: 'l3', dealId: 'd1', amount: 10500, type: LedgerType.PAYOUT, timestamp: '2024-03-06', status: 'COMPLETED', counterparty: 'Chauhan Steels' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    merchantId: 'c1',
    name: 'Industrial Grade Steel Sheets',
    description: 'High tensile strength stainless steel sheets for manufacturing.',
    category: 'Manufacturing',
    price: 450,
    moq: 100,
    inventory: 5000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    certifications: ['ISO 9001', 'Bureau of Indian Standards']
  },
  {
    id: 'p2',
    merchantId: 'c2',
    name: 'Enterprise CRM Suite',
    description: 'Cloud-based CRM specifically designed for B2B relationship management.',
    category: 'Technology',
    price: 1200,
    moq: 1,
    inventory: 1000,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800',
    certifications: ['SOC2 Type II', 'GDPR Compliant']
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'admin@example.com', role: Role.ADMIN, name: 'System Admin', companyId: 'nexus' },
  { id: 'u2', email: 'sales@chauhan.com', role: Role.SELLER, name: 'Aman Chauhan', companyId: 'c1' },
  { id: 'u3', email: 'procure@saini.com', role: Role.BUYER, name: 'Deepak Saini', companyId: 'c2' }
];

export const CATEGORIES = ['All', 'Manufacturing', 'Technology', 'Designing', 'Marketing', 'Finance', 'Legal'];
