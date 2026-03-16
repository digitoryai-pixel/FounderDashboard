# Digitory Founder Command Center

A mobile-first Founder Operating System for Digitory — a restaurant technology platform providing POS, Inventory Management, Recipe Management, QR Ordering, Kitchen Display System, and CRM/Loyalty solutions.

See your entire company health in 30 seconds every morning.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Mobile App (Expo)               │
│  React Native + TypeScript                   │
│  ┌─────────┬───────┬─────────┬────────────┐ │
│  │Dashboard│ Sales │Customers│  Finance    │ │
│  │ (main)  │       │         │  Settings   │ │
│  └─────────┴───────┴─────────┴────────────┘ │
│      ↓ REST API          ↓ WebSocket        │
├─────────────────────────────────────────────┤
│            Backend (Node.js + Express)       │
│  /api/dashboard  →  Single aggregated call  │
│  /ws             →  Real-time order updates │
├─────────────────────────────────────────────┤
│            PostgreSQL Database               │
│  revenue_metrics, sales_metrics,             │
│  customer_growth, platform_activity,         │
│  financial_health, alerts, city_performance  │
└─────────────────────────────────────────────┘
```

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React Native (Expo), TypeScript   |
| Charts    | SVG-based Mini Charts (react-native-svg) |
| Backend   | Node.js, Express                  |
| Database  | PostgreSQL                        |
| Realtime  | WebSockets (ws)                   |
| Caching   | AsyncStorage (offline support)    |
| Notifications | Expo Notifications            |

## Project Structure

```
FounderDashboard/
├── backend/
│   ├── config/database.js          # PostgreSQL connection pool
│   ├── src/
│   │   ├── server.js               # Express + WebSocket server
│   │   ├── routes/dashboard.js     # REST API routes
│   │   ├── services/dashboardService.js  # Business logic
│   │   ├── models/migrate.js       # Database schema migration
│   │   └── seed/seedData.js        # Sample data generator
│   ├── .env.example
│   └── package.json
│
├── mobile/
│   ├── App.tsx                     # Root component
│   ├── src/
│   │   ├── screens/
│   │   │   ├── DashboardScreen.tsx # Main founder dashboard
│   │   │   ├── SalesScreen.tsx     # Sales pipeline
│   │   │   ├── CustomersScreen.tsx # Customer growth & cities
│   │   │   ├── ProductScreen.tsx   # Product health & platform
│   │   │   ├── FinanceScreen.tsx   # Financial health
│   │   │   └── SettingsScreen.tsx  # App settings
│   │   ├── components/
│   │   │   ├── Card.tsx            # Reusable section card
│   │   │   ├── MetricRow.tsx       # Key-value metric display
│   │   │   ├── AlertItem.tsx       # Color-coded alert badge
│   │   │   ├── MiniChart.tsx       # SVG line chart
│   │   │   ├── CityRow.tsx         # City performance bar
│   │   │   └── InsightCard.tsx     # AI insight display
│   │   ├── hooks/useDashboard.ts   # Data fetching + caching hook
│   │   ├── services/
│   │   │   ├── api.ts              # REST API client + types
│   │   │   ├── websocket.ts        # WebSocket client
│   │   │   ├── mockData.ts         # Mock data for dev
│   │   │   └── notifications.ts    # Push notification setup
│   │   ├── navigation/TabNavigator.tsx
│   │   ├── constants/
│   │   │   ├── theme.ts            # Colors, spacing, typography
│   │   │   └── api.ts              # API URLs, intervals
│   │   └── utils/format.ts         # Currency, number formatters
│   ├── app.json
│   ├── babel.config.js
│   └── package.json
└── README.md
```

## Dashboard Sections

1. **Morning Summary** — AI-generated greeting with key overnight metrics
2. **Alerts** — Critical (red), Warning (yellow), Healthy (green) badges
3. **Platform Activity** — Live orders, active restaurants, revenue processed, QR orders
4. **Revenue Engine** — ARR, MRR, growth rate, MRR trend chart
5. **Sales Engine** — Leads, pipeline, deals closed, avg deal size
6. **Customer Growth** — Onboarded, active, expansion revenue, churn
7. **Product Health** — Escalations, bugs, feature releases
8. **Financial Health** — Cash balance, runway, burn rate, collections
9. **Orders Trend** — 14-day orders line chart
10. **City Performance** — Horizontal bar chart by city with tap-to-drill
11. **AI Founder Insights** — Smart suggestions based on trends

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or use Supabase)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator / Expo Go app

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL connection string

npm install
npm run migrate   # Create database tables
npm run seed      # Insert sample data
npm run dev       # Start server on port 3001
```

### Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

The app starts in **mock mode** by default (no backend needed). To connect to the backend, edit `mobile/src/hooks/useDashboard.ts` and set `USE_MOCK = false`.

### Running on Device

- **iOS Simulator**: Press `i` in the Expo terminal
- **Android Emulator**: Press `a` in the Expo terminal
- **Physical Device**: Scan QR code with Expo Go app

## API Endpoints

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | `/api/dashboard`      | Full aggregated dashboard data  |
| GET    | `/api/dashboard/revenue` | Revenue metrics only         |
| GET    | `/api/dashboard/sales`   | Sales metrics only           |
| GET    | `/api/dashboard/growth`  | Customer growth only         |
| GET    | `/api/dashboard/platform`| Platform activity only       |
| GET    | `/api/dashboard/finance` | Financial health only        |
| GET    | `/api/dashboard/cities`  | City performance (with ?city=) |
| GET    | `/api/health`         | Server health check             |
| WS     | `/ws`                 | Real-time platform updates      |

## Database Schema

11 tables covering all business metrics:
- `revenue_metrics` — ARR, MRR, growth
- `sales_metrics` — Leads, pipeline, deals
- `customer_growth` — Onboarding, churn
- `product_health` — Escalations, bugs
- `platform_activity` — Orders, QR usage
- `financial_health` — Cash, runway, burn
- `alerts` — Typed alerts (critical/warning/healthy)
- `city_performance` — Per-city restaurant & order data
- `mrr_history` — Monthly MRR for charting
- `orders_history` — Daily order counts for charting
- `ai_insights` — AI-generated business insights

## UX Features

- Loads in < 1 second (single API call + mock mode)
- Auto-refreshes every 5 minutes
- Pull-to-refresh support
- Last updated timestamp
- Offline cache via AsyncStorage
- Daily morning push notification at 8 AM
- Real-time order count updates via WebSocket

## Design System

Inspired by **Stripe, Linear, Notion**:
- White background with subtle card shadows
- Rounded cards (16px radius)
- Clear Inter-style typography
- Color-coded metrics (green = good, red = alert)
- Minimal iconography — data speaks first

## Deployment

### Backend (Railway / Render / Fly.io)

```bash
cd backend
# Deploy to your preferred platform
# Set DATABASE_URL environment variable
# Run: npm run migrate && npm run seed
```

### Mobile (Expo EAS Build)

```bash
cd mobile
npx eas build --platform all
npx eas submit
```

## Connecting to Live Digitory APIs

To connect to real restaurant data, update `mobile/src/constants/api.ts` with your production API URL, and modify `backend/src/services/dashboardService.js` to fetch from Digitory's internal microservices instead of the local PostgreSQL tables.
