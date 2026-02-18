import pool from './database.js';

const hasColumn = async (connection: any, table: string, column: string): Promise<boolean> => {
  const [rows] = await connection.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?
     LIMIT 1`,
    [table, column]
  );
  return (rows as any[]).length > 0;
};

const addColumnIfMissing = async (connection: any, table: string, column: string, definition: string) => {
  if (!(await hasColumn(connection, table, column))) {
    await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
};

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('Creating tables...');

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(30),
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        role ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Companies table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        gst VARCHAR(50),
        pan VARCHAR(20),
        phone VARCHAR(30),
        address TEXT,
        website VARCHAR(255),
        domain VARCHAR(255),
        industry VARCHAR(100),
        description TEXT,
        verified BOOLEAN DEFAULT FALSE,
        userId VARCHAR(36),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Backward-compatible migrations for existing DBs and older MySQL versions
    await addColumnIfMissing(connection, 'users', 'phone', 'VARCHAR(30)');
    await addColumnIfMissing(connection, 'companies', 'gst', 'VARCHAR(50)');
    await addColumnIfMissing(connection, 'companies', 'pan', 'VARCHAR(20)');
    await addColumnIfMissing(connection, 'companies', 'phone', 'VARCHAR(30)');
    await addColumnIfMissing(connection, 'companies', 'address', 'TEXT');
    await addColumnIfMissing(connection, 'companies', 'website', 'VARCHAR(255)');

    // Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(15, 2) NOT NULL,
        category VARCHAR(100),
        inventory INT DEFAULT 0,
        merchantId VARCHAR(36) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (merchantId) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    // Deals table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS deals (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        buyerId VARCHAR(36) NOT NULL,
        sellerId VARCHAR(36) NOT NULL,
        productId VARCHAR(36),
        quantity INT,
        totalAmount DECIMAL(15, 2),
        status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (buyerId) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (sellerId) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);

    // Messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        senderId VARCHAR(36) NOT NULL,
        receiverId VARCHAR(36) NOT NULL,
        dealId VARCHAR(36),
        content TEXT NOT NULL,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (receiverId) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (dealId) REFERENCES deals(id) ON DELETE CASCADE
      )
    `);

    // Ledger table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ledger (
        id VARCHAR(36) PRIMARY KEY,
        companyId VARCHAR(36) NOT NULL,
        dealId VARCHAR(36),
        type ENUM('debit', 'credit') NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (dealId) REFERENCES deals(id)
      )
    `);

    // Company members (multi-user roles per company)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS company_members (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        companyId VARCHAR(36) NOT NULL,
        role ENUM('OWNER', 'ADMIN', 'FINANCE', 'LEGAL', 'OPS', 'VIEWER') DEFAULT 'VIEWER',
        status ENUM('INVITED', 'ACTIVE', 'DISABLED') DEFAULT 'INVITED',
        invitedBy VARCHAR(36),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_company (userId, companyId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    // Escrow records
    await connection.query(`
      CREATE TABLE IF NOT EXISTS escrows (
        id VARCHAR(36) PRIMARY KEY,
        dealId VARCHAR(36) NOT NULL,
        payerCompanyId VARCHAR(36) NOT NULL,
        payeeCompanyId VARCHAR(36) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status ENUM('CREATED', 'FUNDED', 'RELEASED', 'REFUNDED', 'FAILED') DEFAULT 'CREATED',
        paymentProvider VARCHAR(100),
        providerReference VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (dealId) REFERENCES deals(id) ON DELETE CASCADE,
        FOREIGN KEY (payerCompanyId) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (payeeCompanyId) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    // Payment transactions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        escrowId VARCHAR(36),
        dealId VARCHAR(36),
        companyId VARCHAR(36),
        amount DECIMAL(15, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        direction ENUM('IN', 'OUT') NOT NULL,
        status ENUM('PENDING', 'SUCCEEDED', 'FAILED') DEFAULT 'PENDING',
        provider VARCHAR(100),
        providerReference VARCHAR(255),
        metadata JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (escrowId) REFERENCES escrows(id) ON DELETE SET NULL,
        FOREIGN KEY (dealId) REFERENCES deals(id) ON DELETE SET NULL,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE SET NULL
      )
    `);

    // Notifications (plus real-time stream support in route layer)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36),
        companyId VARCHAR(36),
        type VARCHAR(60) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        payload JSON,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE SET NULL
      )
    `);

    // Documents + signatures (upload metadata + e-sign)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(36) PRIMARY KEY,
        dealId VARCHAR(36),
        companyId VARCHAR(36),
        uploadedBy VARCHAR(36),
        fileName VARCHAR(255) NOT NULL,
        filePath TEXT,
        mimeType VARCHAR(120),
        sizeBytes BIGINT,
        docType VARCHAR(80),
        status ENUM('UPLOADED', 'SIGNED', 'REJECTED') DEFAULT 'UPLOADED',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (dealId) REFERENCES deals(id) ON DELETE SET NULL,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE SET NULL,
        FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS document_signatures (
        id VARCHAR(36) PRIMARY KEY,
        documentId VARCHAR(36) NOT NULL,
        userId VARCHAR(36),
        companyId VARCHAR(36),
        signatureType ENUM('CLICK', 'OTP', 'DIGITAL') DEFAULT 'CLICK',
        ipAddress VARCHAR(80),
        signedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE SET NULL
      )
    `);

    // KYC documents (sensitive metadata encrypted at app layer before storage)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kyc_documents (
        id VARCHAR(36) PRIMARY KEY,
        companyId VARCHAR(36) NOT NULL,
        uploadedBy VARCHAR(36),
        documentType VARCHAR(80) NOT NULL,
        encryptedMeta LONGTEXT,
        status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
        verifierUserId VARCHAR(36),
        verifiedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (verifierUserId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Reputation events
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reputation_events (
        id VARCHAR(36) PRIMARY KEY,
        companyId VARCHAR(36) NOT NULL,
        counterpartyCompanyId VARCHAR(36),
        dealId VARCHAR(36),
        score INT NOT NULL,
        comment TEXT,
        createdBy VARCHAR(36),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (counterpartyCompanyId) REFERENCES companies(id) ON DELETE SET NULL,
        FOREIGN KEY (dealId) REFERENCES deals(id) ON DELETE SET NULL,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Audit logs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36),
        companyId VARCHAR(36),
        action VARCHAR(120) NOT NULL,
        resourceType VARCHAR(120),
        resourceId VARCHAR(120),
        metadata JSON,
        ipAddress VARCHAR(80),
        userAgent VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE SET NULL
      )
    `);

    // AML checks for payment/escrow operations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS aml_checks (
        id VARCHAR(36) PRIMARY KEY,
        dealId VARCHAR(36),
        escrowId VARCHAR(36),
        companyId VARCHAR(36),
        amount DECIMAL(15, 2),
        currency VARCHAR(10),
        riskScore INT NOT NULL,
        riskLevel ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
        decision ENUM('PASS', 'REVIEW', 'BLOCK') NOT NULL,
        reason TEXT,
        metadata JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dealId) REFERENCES deals(id) ON DELETE SET NULL,
        FOREIGN KEY (escrowId) REFERENCES escrows(id) ON DELETE SET NULL,
        FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE SET NULL
      )
    `);

    // GDPR data rights and consent tracking
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gdpr_requests (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        type ENUM('EXPORT', 'DELETE') NOT NULL,
        status ENUM('REQUESTED', 'PROCESSING', 'COMPLETED', 'REJECTED') DEFAULT 'REQUESTED',
        reason TEXT,
        completedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_consents (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        purpose VARCHAR(120) NOT NULL,
        granted BOOLEAN NOT NULL,
        source VARCHAR(120),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Queue jobs (DB-backed queue layer; Redis adapter can sit on top)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(36) PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        payload JSON,
        status ENUM('queued', 'processing', 'completed', 'failed') DEFAULT 'queued',
        attempts INT DEFAULT 0,
        lastError TEXT,
        runAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ All tables created successfully!');
    connection.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();
