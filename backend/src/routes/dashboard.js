const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');

// Full dashboard data — single endpoint for fast mobile loading
router.get('/', async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
});

// Individual section endpoints
router.get('/revenue', async (req, res) => {
  try {
    const data = await dashboardService.getRevenueMetrics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch revenue data' });
  }
});

router.get('/sales', async (req, res) => {
  try {
    const data = await dashboardService.getSalesMetrics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sales data' });
  }
});

router.get('/growth', async (req, res) => {
  try {
    const data = await dashboardService.getCustomerGrowth();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch growth data' });
  }
});

router.get('/platform', async (req, res) => {
  try {
    const data = await dashboardService.getPlatformActivity();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch platform data' });
  }
});

router.get('/finance', async (req, res) => {
  try {
    const data = await dashboardService.getFinancialHealth();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch finance data' });
  }
});

router.get('/cities', async (req, res) => {
  try {
    const { city } = req.query;
    const data = await dashboardService.getCityPerformance(city);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch city data' });
  }
});

module.exports = router;
