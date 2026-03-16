const pool = require('../../config/database');

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Revenue metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS revenue_metrics (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        arr BIGINT NOT NULL DEFAULT 0,
        mrr BIGINT NOT NULL DEFAULT 0,
        mrr_growth DECIMAL(5,2) NOT NULL DEFAULT 0,
        new_revenue_month BIGINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date)
      );
    `);

    // Sales metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sales_metrics (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        new_leads INT NOT NULL DEFAULT 0,
        pipeline_value BIGINT NOT NULL DEFAULT 0,
        deals_closed_week INT NOT NULL DEFAULT 0,
        avg_deal_size BIGINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date)
      );
    `);

    // Customer growth table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customer_growth (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        restaurants_onboarded INT NOT NULL DEFAULT 0,
        active_restaurants INT NOT NULL DEFAULT 0,
        expansion_revenue BIGINT NOT NULL DEFAULT 0,
        churned INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date)
      );
    `);

    // Product health table
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_health (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        escalations INT NOT NULL DEFAULT 0,
        bugs_open INT NOT NULL DEFAULT 0,
        bugs_resolved INT NOT NULL DEFAULT 0,
        feature_releases INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date)
      );
    `);

    // Platform activity table
    await client.query(`
      CREATE TABLE IF NOT EXISTS platform_activity (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        orders_today INT NOT NULL DEFAULT 0,
        restaurants_active INT NOT NULL DEFAULT 0,
        revenue_processed BIGINT NOT NULL DEFAULT 0,
        qr_orders INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date)
      );
    `);

    // Financial health table
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_health (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        cash_balance BIGINT NOT NULL DEFAULT 0,
        runway_months INT NOT NULL DEFAULT 0,
        burn_rate BIGINT NOT NULL DEFAULT 0,
        collections_today BIGINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date)
      );
    `);

    // Alerts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL CHECK (type IN ('critical', 'warning', 'healthy')),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // City performance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS city_performance (
        id SERIAL PRIMARY KEY,
        city VARCHAR(100) NOT NULL,
        restaurants INT NOT NULL DEFAULT 0,
        orders_today INT NOT NULL DEFAULT 0,
        revenue_today BIGINT NOT NULL DEFAULT 0,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(city, date)
      );
    `);

    // MRR history for charts
    await client.query(`
      CREATE TABLE IF NOT EXISTS mrr_history (
        id SERIAL PRIMARY KEY,
        month VARCHAR(20) NOT NULL,
        mrr BIGINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Orders history for charts
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders_history (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        orders INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date)
      );
    `);

    // AI insights table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_insights (
        id SERIAL PRIMARY KEY,
        insight TEXT NOT NULL,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

if (require.main === module) {
  migrate();
}

module.exports = migrate;
