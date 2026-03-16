const pool = require('../../config/database');

const seedData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Revenue metrics
    await client.query(`
      INSERT INTO revenue_metrics (date, arr, mrr, mrr_growth, new_revenue_month)
      VALUES (CURRENT_DATE, 84000000, 7000000, 6.0, 900000)
      ON CONFLICT (date) DO UPDATE SET
        arr = EXCLUDED.arr, mrr = EXCLUDED.mrr,
        mrr_growth = EXCLUDED.mrr_growth, new_revenue_month = EXCLUDED.new_revenue_month;
    `);

    // Sales metrics
    await client.query(`
      INSERT INTO sales_metrics (date, new_leads, pipeline_value, deals_closed_week, avg_deal_size)
      VALUES (CURRENT_DATE, 22, 18000000, 6, 82000)
      ON CONFLICT (date) DO UPDATE SET
        new_leads = EXCLUDED.new_leads, pipeline_value = EXCLUDED.pipeline_value,
        deals_closed_week = EXCLUDED.deals_closed_week, avg_deal_size = EXCLUDED.avg_deal_size;
    `);

    // Customer growth
    await client.query(`
      INSERT INTO customer_growth (date, restaurants_onboarded, active_restaurants, expansion_revenue, churned)
      VALUES (CURRENT_DATE, 6, 412, 300000, 1)
      ON CONFLICT (date) DO UPDATE SET
        restaurants_onboarded = EXCLUDED.restaurants_onboarded,
        active_restaurants = EXCLUDED.active_restaurants,
        expansion_revenue = EXCLUDED.expansion_revenue, churned = EXCLUDED.churned;
    `);

    // Product health
    await client.query(`
      INSERT INTO product_health (date, escalations, bugs_open, bugs_resolved, feature_releases)
      VALUES (CURRENT_DATE, 2, 11, 7, 2)
      ON CONFLICT (date) DO UPDATE SET
        escalations = EXCLUDED.escalations, bugs_open = EXCLUDED.bugs_open,
        bugs_resolved = EXCLUDED.bugs_resolved, feature_releases = EXCLUDED.feature_releases;
    `);

    // Platform activity
    await client.query(`
      INSERT INTO platform_activity (date, orders_today, restaurants_active, revenue_processed, qr_orders)
      VALUES (CURRENT_DATE, 42381, 312, 32000000, 11402)
      ON CONFLICT (date) DO UPDATE SET
        orders_today = EXCLUDED.orders_today, restaurants_active = EXCLUDED.restaurants_active,
        revenue_processed = EXCLUDED.revenue_processed, qr_orders = EXCLUDED.qr_orders;
    `);

    // Financial health
    await client.query(`
      INSERT INTO financial_health (date, cash_balance, runway_months, burn_rate, collections_today)
      VALUES (CURRENT_DATE, 28000000, 14, 2200000, 820000)
      ON CONFLICT (date) DO UPDATE SET
        cash_balance = EXCLUDED.cash_balance, runway_months = EXCLUDED.runway_months,
        burn_rate = EXCLUDED.burn_rate, collections_today = EXCLUDED.collections_today;
    `);

    // Alerts
    await client.query(`DELETE FROM alerts`);
    await client.query(`
      INSERT INTO alerts (type, message) VALUES
      ('critical', 'Escalation from premium client — Barbeque Nation'),
      ('warning', 'Cash runway approaching 6 month threshold'),
      ('warning', 'Server response time degraded — P99 > 2s'),
      ('healthy', '10 restaurants onboarded today'),
      ('healthy', 'All payment systems operational'),
      ('critical', 'POS downtime reported by 3 restaurants in Mumbai');
    `);

    // City performance
    const cities = [
      ['Bangalore', 210, 14200, 10800000],
      ['Mumbai', 74, 9800, 7200000],
      ['Hyderabad', 52, 6400, 4800000],
      ['Pune', 41, 5200, 3900000],
      ['Delhi NCR', 18, 3600, 2700000],
      ['Chennai', 12, 2100, 1500000],
      ['Kolkata', 5, 1081, 800000],
    ];

    for (const [city, restaurants, orders, revenue] of cities) {
      await client.query(`
        INSERT INTO city_performance (city, restaurants, orders_today, revenue_today, date)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
        ON CONFLICT (city, date) DO UPDATE SET
          restaurants = EXCLUDED.restaurants, orders_today = EXCLUDED.orders_today,
          revenue_today = EXCLUDED.revenue_today;
      `, [city, restaurants, orders, revenue]);
    }

    // MRR history (last 12 months)
    await client.query(`DELETE FROM mrr_history`);
    const mrrData = [
      ['Apr 2025', 2800000], ['May 2025', 3100000], ['Jun 2025', 3500000],
      ['Jul 2025', 3900000], ['Aug 2025', 4200000], ['Sep 2025', 4600000],
      ['Oct 2025', 5000000], ['Nov 2025', 5400000], ['Dec 2025', 5800000],
      ['Jan 2026', 6200000], ['Feb 2026', 6600000], ['Mar 2026', 7000000],
    ];
    for (const [month, mrr] of mrrData) {
      await client.query(`INSERT INTO mrr_history (month, mrr) VALUES ($1, $2)`, [month, mrr]);
    }

    // Orders history (last 14 days)
    await client.query(`DELETE FROM orders_history`);
    const ordersData = [
      38200, 39100, 37800, 40200, 41500, 39800, 42100,
      38900, 40800, 41200, 43100, 42800, 41900, 42381,
    ];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      await client.query(
        `INSERT INTO orders_history (date, orders) VALUES ($1, $2) ON CONFLICT (date) DO UPDATE SET orders = EXCLUDED.orders`,
        [dateStr, ordersData[13 - i]]
      );
    }

    // AI Insights
    await client.query(`DELETE FROM ai_insights`);
    await client.query(`
      INSERT INTO ai_insights (insight, category) VALUES
      ('Partner leads increased 38% this week. Pune is the fastest growing city.', 'growth'),
      ('QR ordering adoption up 22% — consider expanding to dine-in focused restaurants.', 'product'),
      ('Average deal size increased to ₹82K from ₹68K last month. Enterprise push is working.', 'sales'),
      ('3 restaurants in Mumbai reported POS slowdowns during peak hours. Investigate infrastructure.', 'product'),
      ('Collection efficiency improved to 94% this month, up from 87% last month.', 'finance');
    `);

    await client.query('COMMIT');
    console.log('Seed data inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
