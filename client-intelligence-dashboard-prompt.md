# Build Prompt: Client Intelligence Dashboard Platform (Frontend Prototype)

## 1. Project Summary

Build a **frontend-only prototype** of a **Client Intelligence Dashboard Platform**. The narrative for this platform is that it aggregates data from multiple backend/data sources (HRMS, Asset/Property Management systems, Finance/ERP systems) into a single pane of glass, and surfaces insights derived from that raw data — trends, anomalies, comparisons, and recommendations — not just static numbers.

Since this is a prototype, **there is no real backend**. All data must be:
- Realistic, richly seeded **mock/dummy datasets** (JSON or JS objects), large enough to make charts, tables, and filters feel real (not 3-row placeholder data).
- Stored and mutated entirely on the **frontend** (in-memory state + `localStorage`/`IndexedDB` for persistence across refreshes — no backend calls, no auth server).
- Structured so that swapping in a real API later is trivial (i.e., keep a clean data-service layer/abstraction even though it's mocked).

This is a **multi-dashboard** platform, not a single screen. Treat it like a real internal product with a shell (nav/sidebar/topbar), multiple dashboard modules, drill-downs, and a consistent design system throughout.

---

## 2. Tech & Architecture Expectations

- Frontend framework of your choice (React preferred, with a modern build tool). Component-driven architecture.
- Client-side routing between dashboards (each dashboard is its own route/page).
- Centralized mock data layer (e.g. `/data` or `/mocks` folder) with typed models (TypeScript preferred) for: Employees, Departments, Assets, Properties, Financial Transactions, Budgets, Vendors, etc.
- Global state management (Context API, Zustand, or Redux — pick what's cleanest) for filters, theme (light/dark), and cross-dashboard selections.
- A dedicated **charting library** (Recharts, Chart.js, ECharts, or Nivo) — must support smooth animated transitions, tooltips, and responsive resizing out of the box.
- Persist user preferences (last visited dashboard, theme, saved filters) to `localStorage`.
- Code should be modular enough that each dashboard, each chart, and each KPI card is its own reusable component.

---

## 3. Design Requirements

### 3.1 Visual Style
- **Modern, premium SaaS aesthetic** — think Linear, Vercel dashboard, Notion, or modern BI tools (Tableau/PowerBI-inspired but cleaner). Avoid generic Bootstrap-default look.
- Clean typographic hierarchy, generous whitespace, subtle elevation/shadows, rounded corners, and a cohesive color system (primary brand color + semantic colors for success/warning/danger/info).
- Support **light and dark mode**, toggleable, with both fully polished (not an afterthought).
- Use a consistent design token system (spacing scale, color scale, radius scale) — define these once and reuse everywhere.

### 3.2 Responsiveness (in priority order)
1. **Desktop (primary)** — full multi-column dashboard grid, sidebars expanded, dense data views, side-by-side charts.
2. **Tablet (secondary)** — sidebar collapses to icons or an overlay drawer, grid reflows to 2-column, charts resize gracefully.
3. **Mobile (tertiary but must work)** — single-column stacked layout, bottom nav or hamburger drawer, charts remain readable (simplify legends/labels if needed), tables convert to card-based lists instead of horizontal scroll where possible.

Test breakpoints roughly at: `≥1280px` desktop, `768–1279px` tablet, `<768px` mobile.

### 3.3 Animation & Motion
- Charts should **animate in** on load and on data/filter change (bars growing, lines drawing, donut segments sweeping in, counters counting up to their value).
- KPI cards should have subtle entrance animations (fade + slide) staggered slightly across the grid.
- Micro-interactions: hover states on cards/rows, smooth transitions when toggling filters/date ranges, animated skeleton loaders while "data loads" (simulate a short loading state even though data is local, to sell the product feel).
- Sidebar/drawer open-close, modal open-close, and route transitions should be smoothly animated, not instant jumps.
- Keep animation durations short and purposeful (150–400ms) — polished, not gimmicky or slow.

---

## 4. Application Shell

- **Top bar**: platform/product name & logo, global search (can be non-functional/mocked), notifications bell (mock notifications), theme toggle, user profile menu.
- **Sidebar navigation**: grouped links to each dashboard module (see Section 5), collapsible, with active-route highlighting and icons.
- **Global filter bar** (where relevant): date range picker, entity/department/property selector — filters should actually affect the charts/KPIs shown on that page (recalculate mock data client-side).
- **Breadcrumbs** on nested/drill-down pages.
- A landing/**overview/home dashboard** that aggregates top-line KPIs from all three domains (HR, Assets/Property, Finance) into one executive summary view, with quick links into each detailed module.

---

## 5. Dashboard Modules

### 5.1 Executive Overview Dashboard (Home)
- Cross-domain KPI summary cards: headcount, total asset value, monthly revenue/burn, open issues/alerts.
- A combined "insights feed" panel — auto-generated-looking natural language insights (e.g., "Attrition in Engineering rose 12% this quarter", "Office A utilization dropped below 40%", "Vendor spend exceeded budget by 8%"). These can be pre-written mock insights, but should look dynamically generated and be tagged by domain/severity.
- Trend chart combining/comparing metrics across domains.
- Quick-access cards linking into each dashboard below.

### 5.2 HR Intelligence Dashboard
- KPI cards: Total Headcount, Attrition Rate, Open Positions, Avg. Tenure, Diversity ratio.
- Charts: headcount trend over time (line), department-wise headcount (bar), attrition by department/reason (stacked bar or donut), hiring funnel (funnel chart), gender/age distribution (donut/pyramid).
- Employee directory table: searchable, sortable, filterable, paginated, with drill-down into an individual employee detail view (profile card, tenure, performance trend, leave balance — mocked).
- Leave/attendance heatmap calendar view.

### 5.3 Asset & Property Intelligence Dashboard
- KPI cards: Total Asset Value, Total Properties/Locations, Assets Under Maintenance, Utilization Rate, Depreciation this year.
- Charts: asset category breakdown (donut/treemap), asset value trend/depreciation curve (area chart), maintenance cost trend (bar), property utilization by location (horizontal bar or heatmap).
- Asset registry table: searchable/filterable list of assets with status (active, in maintenance, retired), drill-down to asset detail (purchase date, depreciation schedule, assigned location/owner, maintenance history timeline).
- A simple **map or floor/location visual** (can be a stylized SVG layout or a list-as-map fallback) showing properties/locations with a status indicator per site.

### 5.4 Finance Metrics Dashboard
- KPI cards: Revenue, Expenses, Net Margin, Budget Variance, Outstanding Receivables.
- Charts: revenue vs. expense trend (combo line/bar), budget vs. actual by department (grouped bar), expense category breakdown (donut), cash flow trend (area chart), vendor spend ranking (horizontal bar).
- Transactions table: searchable/filterable, with status tags (paid, pending, overdue), drill-down into transaction/invoice detail.
- Budget planning view: department budgets vs. actual spend, with variance highlighted (color-coded).

### 5.5 Insights & Reports Panel (Cross-cutting)
- A dedicated page that lists all auto-generated insights across domains, filterable by domain/severity/date, styled like a notification/activity feed with icons and trend arrows.
- Ability to "star"/save an insight and to export a mock report (can just trigger a styled print/PDF-looking view or a mock "Report generated" confirmation — no real backend export needed).

---

## 6. Data & Interactivity Requirements

- Every dashboard's charts and KPIs must react to the global date range and any relevant filters — no static, dead numbers.
- Include realistic-looking mock datasets: at least 50–100 employees, 100+ assets across 5–10 properties/locations, and 12+ months of financial transaction history, so trends and tables feel populated.
- Tables should support: search, column sort, pagination, and at least one filter (status/category/department).
- Include loading skeleton states and empty states (styled, not just blank divs) even though data is local — simulate a brief fetch delay when switching dashboards or applying filters.
- All numbers (currency, percentages, counts) should be formatted properly (thousands separators, currency symbol, % signs, abbreviated large numbers like 1.2M where appropriate).

---

## 7. Deliverable Expectations

- A working, navigable multi-page prototype (Home/Overview + HR + Assets/Property + Finance + Insights, minimum 5 routes).
- Fully responsive across desktop → tablet → mobile as specified.
- Polished light + dark themes.
- Animated charts, KPI counters, and page/component transitions throughout.
- Clean, componentized, readable code with a clearly separated mock data layer that could later be swapped for real API calls with minimal refactor.
- No backend, no real authentication, no external API calls — everything self-contained and running purely in the browser.
