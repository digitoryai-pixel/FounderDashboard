const pool = require('../../config/database');

class DashboardService {
  async getDashboardData() {
    const client = await pool.connect();
    try {
      const [revenue, sales, growth, product, platform, finance, alerts, cities, mrrHistory, ordersHistory, insights] = await Promise.all([
        client.query('SELECT * FROM revenue_metrics WHERE date = CURRENT_DATE LIMIT 1'),
        client.query('SELECT * FROM sales_metrics WHERE date = CURRENT_DATE LIMIT 1'),
        client.query('SELECT * FROM customer_growth WHERE date = CURRENT_DATE LIMIT 1'),
        client.query('SELECT * FROM product_health WHERE date = CURRENT_DATE LIMIT 1'),
        client.query('SELECT * FROM platform_activity WHERE date = CURRENT_DATE LIMIT 1'),
        client.query('SELECT * FROM financial_health WHERE date = CURRENT_DATE LIMIT 1'),
        client.query('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 10'),
        client.query('SELECT * FROM city_performance WHERE date = CURRENT_DATE ORDER BY restaurants DESC'),
        client.query('SELECT * FROM mrr_history ORDER BY id ASC'),
        client.query('SELECT * FROM orders_history ORDER BY date ASC'),
        client.query('SELECT * FROM ai_insights ORDER BY created_at DESC LIMIT 5'),
      ]);

      const r = revenue.rows[0] || {};
      const s = sales.rows[0] || {};
      const g = growth.rows[0] || {};
      const pr = product.rows[0] || {};
      const pl = platform.rows[0] || {};
      const f = finance.rows[0] || {};

      return {
        last_updated: new Date().toISOString(),
        summary: this.generateMorningSummary(g, f, pr, r),
        alerts: alerts.rows.map(a => ({
          id: a.id,
          type: a.type,
          message: a.message,
          is_read: a.is_read,
          created_at: a.created_at,
        })),
        revenue: {
          arr: Number(r.arr) || 0,
          mrr: Number(r.mrr) || 0,
          mrr_growth: Number(r.mrr_growth) || 0,
          new_revenue_month: Number(r.new_revenue_month) || 0,
        },
        sales: {
          new_leads: s.new_leads || 0,
          pipeline_value: Number(s.pipeline_value) || 0,
          deals_closed_week: s.deals_closed_week || 0,
          avg_deal_size: Number(s.avg_deal_size) || 0,
        },
        growth: {
          restaurants_onboarded: g.restaurants_onboarded || 0,
          active_restaurants: g.active_restaurants || 0,
          expansion_revenue: Number(g.expansion_revenue) || 0,
          churned: g.churned || 0,
        },
        product: {
          escalations: pr.escalations || 0,
          bugs_open: pr.bugs_open || 0,
          bugs_resolved: pr.bugs_resolved || 0,
          feature_releases: pr.feature_releases || 0,
        },
        platform: {
          orders_today: pl.orders_today || 0,
          restaurants_active: pl.restaurants_active || 0,
          revenue_processed: Number(pl.revenue_processed) || 0,
          qr_orders: pl.qr_orders || 0,
        },
        finance: {
          cash_balance: Number(f.cash_balance) || 0,
          runway_months: f.runway_months || 0,
          burn_rate: Number(f.burn_rate) || 0,
          collections_today: Number(f.collections_today) || 0,
        },
        cities: cities.rows.map(c => ({
          city: c.city,
          restaurants: c.restaurants,
          orders_today: c.orders_today,
          revenue_today: Number(c.revenue_today),
        })),
        charts: {
          mrr_history: mrrHistory.rows.map(m => ({
            month: m.month,
            mrr: Number(m.mrr),
          })),
          orders_history: ordersHistory.rows.map(o => ({
            date: o.date,
            orders: o.orders,
          })),
        },
        insights: insights.rows.map(i => ({
          id: i.id,
          insight: i.insight,
          category: i.category,
          created_at: i.created_at,
        })),
      };
    } finally {
      client.release();
    }
  }

  generateMorningSummary(growth, finance, product, revenue) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    const lines = [];
    if (growth.restaurants_onboarded) {
      lines.push(`${growth.restaurants_onboarded} restaurants onboarded yesterday`);
    }
    if (finance.collections_today) {
      lines.push(`₹${(Number(finance.collections_today) / 100000).toFixed(1)}L collected yesterday`);
    }
    if (product.escalations > 0) {
      lines.push(`${product.escalations} client escalations pending`);
    }
    if (revenue.new_revenue_month) {
      lines.push(`MRR grew by ₹${(Number(revenue.new_revenue_month) / 100000).toFixed(0)}L this month`);
    }

    return {
      greeting: `${greeting}, Shiv`,
      highlights: lines,
    };
  }

  async getRevenueMetrics() {
    const result = await pool.query('SELECT * FROM revenue_metrics WHERE date = CURRENT_DATE LIMIT 1');
    return result.rows[0] || null;
  }

  async getSalesMetrics() {
    const result = await pool.query('SELECT * FROM sales_metrics WHERE date = CURRENT_DATE LIMIT 1');
    return result.rows[0] || null;
  }

  async getCustomerGrowth() {
    const result = await pool.query('SELECT * FROM customer_growth WHERE date = CURRENT_DATE LIMIT 1');
    return result.rows[0] || null;
  }

  async getPlatformActivity() {
    const result = await pool.query('SELECT * FROM platform_activity WHERE date = CURRENT_DATE LIMIT 1');
    return result.rows[0] || null;
  }

  async getFinancialHealth() {
    const result = await pool.query('SELECT * FROM financial_health WHERE date = CURRENT_DATE LIMIT 1');
    return result.rows[0] || null;
  }

  async getCityPerformance(city) {
    if (city) {
      const result = await pool.query(
        'SELECT * FROM city_performance WHERE city = $1 AND date = CURRENT_DATE',
        [city]
      );
      return result.rows[0] || null;
    }
    const result = await pool.query(
      'SELECT * FROM city_performance WHERE date = CURRENT_DATE ORDER BY restaurants DESC'
    );
    return result.rows;
  }
}

module.exports = new DashboardService();
