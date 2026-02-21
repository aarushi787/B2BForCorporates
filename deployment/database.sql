CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TYPE "UserRole" AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE "DealStatus" AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');
CREATE TYPE "LedgerEntryType" AS ENUM ('debit', 'credit');
CREATE TYPE "CompanyMemberRole" AS ENUM ('OWNER', 'ADMIN', 'FINANCE', 'LEGAL', 'OPS', 'VIEWER');
CREATE TYPE "CompanyMemberStatus" AS ENUM ('INVITED', 'ACTIVE', 'DISABLED');
CREATE TYPE "EscrowStatus" AS ENUM ('CREATED', 'FUNDED', 'RELEASED', 'REFUNDED', 'FAILED');
CREATE TYPE "PaymentDirection" AS ENUM ('IN', 'OUT');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "DocumentStatus" AS ENUM ('UPLOADED', 'SIGNED', 'REJECTED');
CREATE TYPE "SignatureType" AS ENUM ('CLICK', 'OTP', 'DIGITAL');
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "RiskDecision" AS ENUM ('PASS', 'REVIEW', 'BLOCK');
CREATE TYPE "GdprType" AS ENUM ('EXPORT', 'DELETE');
CREATE TYPE "GdprStatus" AS ENUM ('REQUESTED', 'PROCESSING', 'COMPLETED', 'REJECTED');
CREATE TYPE "JobStatus" AS ENUM ('queued', 'processing', 'completed', 'failed');

CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(30),
  "firstName" VARCHAR(100),
  "lastName" VARCHAR(100),
  "role" "UserRole" DEFAULT 'buyer',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Company" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "gst" VARCHAR(50),
  "pan" VARCHAR(20),
  "phone" VARCHAR(30),
  "address" TEXT,
  "website" VARCHAR(255),
  "domain" VARCHAR(255),
  "industry" VARCHAR(100),
  "description" TEXT,
  "verified" BOOLEAN DEFAULT false,
  "userId" UUID,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "price" DECIMAL(15,2) NOT NULL,
  "category" VARCHAR(100),
  "inventory" INTEGER DEFAULT 0,
  "merchantId" UUID NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Deal" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "buyerId" UUID NOT NULL,
  "sellerId" UUID NOT NULL,
  "productId" UUID,
  "quantity" INTEGER,
  "totalAmount" DECIMAL(15,2),
  "status" "DealStatus" DEFAULT 'pending',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Message" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "senderId" UUID NOT NULL,
  "receiverId" UUID NOT NULL,
  "dealId" UUID,
  "content" TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Ledger" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "dealId" UUID,
  "type" "LedgerEntryType" NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CompanyMember" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "companyId" UUID NOT NULL,
  "role" "CompanyMemberRole" DEFAULT 'VIEWER',
  "status" "CompanyMemberStatus" DEFAULT 'INVITED',
  "invitedBy" UUID,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "companyId")
);

CREATE TABLE "Escrow" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "dealId" UUID NOT NULL,
  "payerCompanyId" UUID NOT NULL,
  "payeeCompanyId" UUID NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "currency" VARCHAR(10) DEFAULT 'USD',
  "status" "EscrowStatus" DEFAULT 'CREATED',
  "paymentProvider" VARCHAR(100),
  "providerReference" VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Payment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "escrowId" UUID,
  "dealId" UUID,
  "companyId" UUID,
  "amount" DECIMAL(15,2) NOT NULL,
  "currency" VARCHAR(10) DEFAULT 'USD',
  "direction" "PaymentDirection" NOT NULL,
  "status" "PaymentStatus" DEFAULT 'PENDING',
  "provider" VARCHAR(100),
  "providerReference" VARCHAR(255),
  "metadata" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Notification" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID,
  "companyId" UUID,
  "type" VARCHAR(60) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "payload" JSONB,
  "isRead" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Document" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "dealId" UUID,
  "companyId" UUID,
  "uploadedBy" UUID,
  "fileName" VARCHAR(255) NOT NULL,
  "filePath" TEXT,
  "mimeType" VARCHAR(120),
  "sizeBytes" BIGINT,
  "docType" VARCHAR(80),
  "status" "DocumentStatus" DEFAULT 'UPLOADED',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DocumentSignature" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "documentId" UUID NOT NULL,
  "userId" UUID,
  "companyId" UUID,
  "signatureType" "SignatureType" DEFAULT 'CLICK',
  "ipAddress" VARCHAR(80),
  "signedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "KycDocument" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "uploadedBy" UUID,
  "documentType" VARCHAR(80) NOT NULL,
  "encryptedMeta" TEXT,
  "status" "KycStatus" DEFAULT 'PENDING',
  "verifierUserId" UUID,
  "verifiedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ReputationEvent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "counterpartyCompanyId" UUID,
  "dealId" UUID,
  "score" INTEGER NOT NULL,
  "comment" TEXT,
  "createdBy" UUID,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuditLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID,
  "companyId" UUID,
  "action" VARCHAR(120) NOT NULL,
  "resourceType" VARCHAR(120),
  "resourceId" VARCHAR(120),
  "metadata" JSONB,
  "ipAddress" VARCHAR(80),
  "userAgent" VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AmlCheck" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "dealId" UUID,
  "escrowId" UUID,
  "companyId" UUID,
  "amount" DECIMAL(15,2),
  "currency" VARCHAR(10),
  "riskScore" INTEGER NOT NULL,
  "riskLevel" "RiskLevel" NOT NULL,
  "decision" "RiskDecision" NOT NULL,
  "reason" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GdprRequest" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "type" "GdprType" NOT NULL,
  "status" "GdprStatus" DEFAULT 'REQUESTED',
  "reason" TEXT,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "UserConsent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "purpose" VARCHAR(120) NOT NULL,
  "granted" BOOLEAN NOT NULL,
  "source" VARCHAR(120),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Job" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" VARCHAR(100) NOT NULL,
  "payload" JSONB,
  "status" "JobStatus" DEFAULT 'queued',
  "attempts" INTEGER DEFAULT 0,
  "lastError" TEXT,
  "runAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
