<p align="center">
  <img src="https://img.shields.io/badge/InvestIQ-Africa-009739?style=for-the-badge&labelColor=000000" alt="InvestIQ Africa" />
</p>

<h1 align="center">InvestIQ Africa</h1>
<h3 align="center">ZIDA Investment Intelligence Platform</h3>

<p align="center">
  <strong>A comprehensive, production-ready investment intelligence platform built for the Zimbabwe Investment & Development Agency (ZIDA)</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-modules">Modules</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## Overview

**InvestIQ Africa** is a full-stack investment intelligence platform designed for the **Zimbabwe Investment & Development Agency (ZIDA)**. It combines advanced mathematical modeling, machine learning, and economic analytics to support investment promotion, analysis, and matching across Zimbabwe's priority sectors.

The platform enables ZIDA officers, policy analysts, and potential investors to:

- **Forecast** FDI trends using ARIMA time series models and macroeconomic regression
- **Quantify** economic impact of investments using Monte Carlo simulations and input-output models
- **Match** investors to opportunities using AI-powered hybrid recommendation algorithms
- **Analyse** sector risk-return profiles using Modern Portfolio Theory adapted for FDI
- **Generate** comprehensive reports for investment decision-making

### An Initiative by

| Name | Role | Email |
|------|------|-------|
| **Ernest Moyo** | Co-Founder | ernest@7squareinc.com |
| **Rodden Moyo** | Co-Founder | rodden@7squareinc.com |

> Built by **7Square Inc.** — Driving digital innovation for African investment ecosystems.

---

## Features

### Module 1: Predictive Investment Analytics
- **FDI Forecasting** — ARIMA/SARIMA time series models with confidence intervals
- **Sector Risk-Return Profiling** — Modern Portfolio Theory adapted for FDI with Sharpe ratios
- **Portfolio Optimisation** — Mean-variance optimisation with efficient frontier visualisation
- **Investment Pattern Detection** — K-Means clustering on historical licensing data
- **Trend Decomposition** — Seasonal decomposition of macroeconomic indicators
- **Macroeconomic Regression** — Multi-factor regression using GDP growth, inflation, exchange rates

### Module 2: Real-Time Investment Impact Calculator
- **Job Creation Modelling** — Direct, indirect, and induced employment with skills & gender breakdown
- **GDP Contribution Analysis** — Leontief input-output model calibrated to Zimbabwe's economy
- **Monte Carlo Simulation** — 10,000-run probabilistic impact estimation with VaR analysis
- **ROI Timeline Projection** — NPV, IRR, and breakeven analysis with year-by-year cash flows
- **SEZ Incentive Modelling** — Compare with-incentive vs without-incentive scenarios
- **Tax Revenue Estimation** — Corporate tax, VAT, PAYE, withholding tax projections
- **PDF/Excel Report Generation** — Downloadable comprehensive impact reports

### Module 3: AI-Powered Investment Matching Engine
- **Hybrid Recommendation** — Content-based + collaborative filtering + semantic matching
- **Investor-to-Opportunity Matching** — Ranked results with explainable 7-dimension scoring
- **Opportunity-to-Investor Matching** — Reverse matching for ZIDA proactive outreach
- **NLP Inquiry Analysis** — Extract sectors, investment size, sentiment, and inquiry classification
- **Similarity Network** — Graph-based analysis of investment relationships and patterns
- **Proactive Recommendations** — AI-generated outreach suggestions for ZIDA officers

### Executive Dashboard
- Real-time KPI cards (Total FDI, Active Investments, Jobs Created, Pending Inquiries)
- Interactive FDI trend chart with forecast overlay
- Sector investment heatmap
- Province distribution analysis
- Recent activity feed
- Top investors leaderboard

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React 18)                       │
│  ┌──────────┐ ┌───────────┐ ┌────────────┐ ┌────────────────┐  │
│  │Dashboard │ │ Analytics │ │  Impact    │ │   Matching     │  │
│  │          │ │           │ │ Calculator │ │    Engine      │  │
│  └──────────┘ └───────────┘ └────────────┘ └────────────────┘  │
│  TypeScript • Tailwind CSS • Recharts • React Query • Vite      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API (JSON)
┌──────────────────────────┴──────────────────────────────────────┐
│                      Backend (FastAPI)                            │
│  ┌──────────────┐ ┌─────────────┐ ┌─────────────────────────┐  │
│  │   API Layer  │ │  Services   │ │     ML Engine           │  │
│  │  (Routes +   │ │ (Business   │ │  ┌─────────────────┐   │  │
│  │   Schemas)   │ │  Logic)     │ │  │ FDI Forecaster  │   │  │
│  │              │ │             │ │  │ Risk Scorer     │   │  │
│  │  /analytics  │ │ Predictive  │ │  │ Monte Carlo     │   │  │
│  │  /impact     │ │ Impact Calc │ │  │ Recommender     │   │  │
│  │  /matching   │ │ Matching    │ │  │ NLP Processor   │   │  │
│  │  /dashboard  │ │ Reports     │ │  │ Multiplier Model│   │  │
│  └──────────────┘ └─────────────┘ │  └─────────────────┘   │  │
│                                    └─────────────────────────┘  │
│  Python 3.11 • SQLAlchemy • scikit-learn • statsmodels • pandas │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    PostgreSQL 16                                  │
│  investments • sectors • sez • investors • opportunities         │
│  macroeconomic_indicators • users                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI components & state management |
| **Styling** | Tailwind CSS 3.4 | Zimbabwe design system (flag colours) |
| **Charts** | Recharts | Interactive data visualisations |
| **State** | TanStack React Query | Server state management & caching |
| **Backend** | FastAPI 0.109 | REST API with auto-generated docs |
| **ORM** | SQLAlchemy 2.0 | Database models & query building |
| **Database** | PostgreSQL 16 | Primary data store |
| **Migrations** | Alembic | Schema version control |
| **ML/Stats** | scikit-learn, statsmodels | Machine learning & statistical models |
| **Data** | pandas, numpy, scipy | Data manipulation & computation |
| **NLP** | NLTK | Natural language processing |
| **Reports** | ReportLab, openpyxl | PDF & Excel generation |
| **Auth** | python-jose, passlib | JWT authentication with RBAC |
| **Container** | Docker + Docker Compose | Development & deployment |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 16+ (or Docker)
- Git

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/ernestmoyo/InvestIQ-Africa.git
cd InvestIQ-Africa

# Start all services
docker-compose up --build

# Access the application
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate
# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
alembic upgrade head

# Seed Zimbabwe reference data
python -m app.seed.run_seed

# Start the server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

---

## Project Structure

```
InvestIQ-Africa/
├── backend/
│   ├── app/
│   │   ├── main.py                         # FastAPI entry point
│   │   ├── config.py                       # Environment configuration
│   │   ├── database.py                     # Database connection
│   │   ├── models/                         # SQLAlchemy ORM models
│   │   │   ├── investment.py               # Investment & SEZ models
│   │   │   ├── investor.py                 # Investor & Opportunity models
│   │   │   ├── sector.py                   # Sector model
│   │   │   ├── indicator.py                # Macroeconomic indicators
│   │   │   └── user.py                     # User & auth model
│   │   ├── schemas/                        # Pydantic request/response models
│   │   │   ├── investment.py
│   │   │   ├── investor.py
│   │   │   ├── analytics.py
│   │   │   ├── matching.py
│   │   │   └── auth.py
│   │   ├── api/routes/                     # API endpoint handlers
│   │   │   ├── auth.py                     # Authentication
│   │   │   ├── investments.py              # Investment CRUD
│   │   │   ├── analytics.py                # Predictive analytics
│   │   │   ├── impact.py                   # Impact calculator
│   │   │   ├── matching.py                 # Investment matching
│   │   │   └── dashboard.py                # Dashboard aggregation
│   │   ├── services/                       # Business logic layer
│   │   │   ├── predictive_analytics.py     # FDI forecasting service
│   │   │   ├── impact_calculator.py        # Impact calculation service
│   │   │   ├── matching_engine.py          # AI matching service
│   │   │   ├── data_ingestion.py           # Data pipeline
│   │   │   └── report_generator.py         # PDF/Excel generation
│   │   ├── ml/                             # Machine learning models
│   │   │   ├── fdi_forecaster.py           # ARIMA time series
│   │   │   ├── risk_scorer.py              # Portfolio risk analysis
│   │   │   ├── multiplier_model.py         # Economic multipliers
│   │   │   ├── monte_carlo.py              # Monte Carlo engine
│   │   │   ├── recommender.py              # Recommendation algorithms
│   │   │   └── nlp_processor.py            # NLP inquiry analysis
│   │   └── seed/                           # Zimbabwe reference data
│   │       ├── zimbabwe_sectors.py         # 9 priority sectors
│   │       ├── sez_data.py                 # 5 Special Economic Zones
│   │       ├── macroeconomic_data.py       # 2018-2024 indicators
│   │       ├── sample_investments.py       # Sample records
│   │       └── run_seed.py                 # Database seeder
│   ├── alembic/                            # Database migrations
│   ├── tests/                              # Test suite
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx                         # Router & layout
│   │   ├── pages/                          # Page components
│   │   │   ├── Dashboard.tsx               # Executive overview
│   │   │   ├── PredictiveAnalytics.tsx     # FDI forecasting
│   │   │   ├── ImpactCalculator.tsx        # Impact calculator wizard
│   │   │   ├── InvestmentMatching.tsx      # AI matching interface
│   │   │   ├── Investments.tsx             # Portfolio management
│   │   │   ├── SectorAnalysis.tsx          # Sector deep-dive
│   │   │   └── Reports.tsx                 # Report generation
│   │   ├── components/
│   │   │   ├── charts/                     # Data visualisation components
│   │   │   ├── calculators/                # Impact calculator components
│   │   │   ├── matching/                   # Matching UI components
│   │   │   ├── layout/                     # Sidebar, Header, Footer
│   │   │   └── common/                     # Shared UI components
│   │   ├── hooks/                          # React Query hooks
│   │   ├── services/api.ts                 # Axios API client
│   │   ├── types/index.ts                  # TypeScript interfaces
│   │   └── utils/                          # Formatters & constants
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Modules

### Module 1: Predictive Investment Analytics

**Purpose:** Forecast FDI trends using macroeconomic indicators, model sector risk-return profiles, and optimise investment portfolio allocation across Zimbabwe's sectors.

#### Mathematical Models

| Model | Method | Application |
|-------|--------|-------------|
| FDI Forecasting | ARIMA/SARIMA | Time series prediction of FDI inflows |
| Macro Regression | Multiple Linear Regression | FDI as function of GDP, inflation, exchange rate |
| Risk-Return | Modified Sharpe Ratio | Sector risk-adjusted return comparison |
| Portfolio Optimisation | Mean-Variance (Markowitz) | Optimal sector allocation via quadratic programming |
| Pattern Detection | K-Means Clustering | Investment archetype identification |
| Trend Decomposition | STL Decomposition | Seasonal/trend/residual separation |

#### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/analytics/fdi-forecast` | FDI forecast with confidence intervals |
| `GET` | `/api/v1/analytics/sector-risk-return` | Sector risk-return profiles |
| `POST` | `/api/v1/analytics/portfolio-optimisation` | Portfolio allocation optimisation |
| `GET` | `/api/v1/analytics/investment-patterns` | Investment clustering patterns |
| `GET` | `/api/v1/analytics/dashboard-summary` | Dashboard KPI aggregation |

---

### Module 2: Real-Time Investment Impact Calculator

**Purpose:** Quantify economic benefits of proposed investments using Zimbabwe-calibrated economic models, Monte Carlo simulations, and multiplier analysis.

#### Economic Models

| Model | Method | Output |
|-------|--------|--------|
| Job Creation | Sector Employment Multipliers | Direct/indirect/induced jobs by skill & gender |
| GDP Contribution | Leontief Input-Output | Value chain multiplier effects |
| Monte Carlo | Stochastic Simulation (N=10,000) | Probabilistic outcome distribution with VaR |
| ROI Timeline | DCF Analysis | NPV, IRR, breakeven year |
| SEZ Impact | Comparative Financial Modelling | With vs without incentive scenarios |
| Tax Revenue | Zimbabwe Tax Code Modelling | Corporate, VAT, PAYE, withholding |

#### Zimbabwe-Specific Multipliers

| Sector | Output | Employment | Income | Tax Rate |
|--------|--------|------------|--------|----------|
| Mining | 2.1x | 1.8x | 1.6x | 12% |
| Agriculture | 2.4x | 3.2x | 1.9x | 8% |
| Manufacturing | 2.3x | 2.5x | 2.0x | 15% |
| Tourism | 2.0x | 2.8x | 1.7x | 10% |
| ICT | 1.8x | 1.5x | 2.2x | 18% |
| Energy | 2.5x | 1.4x | 1.5x | 14% |
| Infrastructure | 2.7x | 3.0x | 2.1x | 11% |

> Sources: ZIMSTAT National Accounts, World Bank Development Indicators, RBZ Quarterly Reports. Figures marked as estimates where exact data unavailable.

#### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/impact/job-creation` | Job creation impact calculation |
| `POST` | `/api/v1/impact/gdp-contribution` | GDP contribution analysis |
| `POST` | `/api/v1/impact/monte-carlo` | Monte Carlo simulation |
| `POST` | `/api/v1/impact/roi-timeline` | ROI & breakeven analysis |
| `POST` | `/api/v1/impact/sez-incentives` | SEZ incentive comparison |
| `POST` | `/api/v1/impact/comprehensive-report` | Full impact assessment |

---

### Module 3: AI-Powered Investment Matching Engine

**Purpose:** Match investors to Zimbabwe investment opportunities using hybrid recommendation algorithms with explainable scoring.

#### Matching Algorithm

The composite match score (0–100) combines seven weighted dimensions:

| Dimension | Weight | Method |
|-----------|--------|--------|
| Sector Alignment | 25 pts | Exact + adjacent sector matching |
| Investment Size Fit | 20 pts | Budget range overlap calculation |
| Risk Compatibility | 15 pts | Risk appetite vs opportunity risk |
| Geographic Match | 10 pts | Province preference alignment |
| SEZ Alignment | 10 pts | SEZ interest + zone fit |
| Historical Similarity | 10 pts | Collaborative filtering from past investments |
| Semantic Match | 10 pts | NLP similarity of inquiry to opportunity |

#### NLP Inquiry Pipeline

```
Raw Inquiry Text
  → Tokenisation & Preprocessing
  → Sector Extraction (keyword matching)
  → Investment Size Detection (regex patterns)
  → Inquiry Classification (exploratory / serious / ready-to-invest)
  → Sentiment Analysis (positive / neutral / negative)
  → Entity Extraction (companies, countries, amounts)
  → Department Routing Recommendation
  → Response Template Generation
```

#### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/matching/investor-to-opportunities/{id}` | Find matching opportunities |
| `POST` | `/api/v1/matching/opportunity-to-investors/{id}` | Find matching investors |
| `POST` | `/api/v1/matching/analyse-inquiry` | NLP inquiry analysis |
| `GET` | `/api/v1/matching/similarity-network` | Investment similarity graph |
| `GET` | `/api/v1/matching/recommendations/proactive` | Proactive outreach suggestions |

---

## Zimbabwe Reference Data

The platform ships with Zimbabwe-specific reference data sourced from public government and international databases:

### Priority Sectors (9 sectors)
Mining & Quarrying, Agriculture & Agro-processing, Tourism & Hospitality, Manufacturing, ICT & Digital Economy, Energy, Infrastructure & Construction, Financial Services, Health & Pharmaceuticals

### Special Economic Zones (5 SEZs)
| SEZ | Province | Area | Key Incentives |
|-----|----------|------|----------------|
| Sunway City | Harare | 498 ha | 0% corporate tax (5yr), duty-free imports |
| Beitbridge | Mat. South | 200 ha | 0% corporate tax (5yr), free profit repatriation |
| Feruka-Mutare | Manicaland | 310 ha | 15% corporate tax, duty-free raw materials |
| Victoria Falls | Mat. North | 150 ha | 0% corporate tax (5yr), tourism incentives |
| Bulawayo | Bulawayo | 250 ha | 0% corporate tax (5yr), industrial incentives |

### Macroeconomic Indicators (2018–2024)
GDP growth, inflation rate (ZWL/USD), exchange rates, FDI inflows, trade balance, unemployment rate, and ease of doing business scores sourced from ZIMSTAT, Reserve Bank of Zimbabwe, World Bank, and IMF.

### Provinces
All 10 provinces: Harare, Bulawayo, Manicaland, Mashonaland Central, Mashonaland East, Mashonaland West, Masvingo, Matabeleland North, Matabeleland South, Midlands

---

## API Documentation

Once the backend is running, interactive API documentation is available at:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

All endpoints follow RESTful conventions with:
- Pydantic request/response validation
- Proper HTTP status codes (200, 201, 400, 404, 422, 500)
- Pagination for list endpoints (`?page=1&per_page=20`)
- Filtering and sorting capabilities
- JWT Bearer authentication for protected routes

---

## Design System

The UI follows a professional, government-appropriate design aesthetic using Zimbabwe's national flag colours:

| Colour | Hex | Usage |
|--------|-----|-------|
| 🟢 Green | `#009739` | Positive metrics, growth indicators, primary actions |
| 🟡 Gold | `#FFD200` | Highlights, warnings, accent elements |
| 🔴 Red | `#D21034` | Alerts, negative trends, critical indicators |
| ⚫ Black | `#000000` | Primary text, headers |
| ⚪ White | `#FFFFFF` | Backgrounds, cards |

**Typography:** Inter (body), Plus Jakarta Sans (headings)

---

## Testing

```bash
# Run backend tests
cd backend
pytest tests/ -v --cov=app

# Run specific test modules
pytest tests/test_multiplier_model.py -v
pytest tests/test_monte_carlo.py -v
pytest tests/test_api.py -v
```

All mathematical models include test cases with known correct outputs to ensure calculation accuracy.

---

## Deployment

### Production with Docker

```bash
# Build and deploy
docker-compose -f docker-compose.yml up -d --build

# Check service health
docker-compose ps
docker-compose logs -f backend
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://investiq:...@db:5432/investiq_africa` |
| `SECRET_KEY` | JWT signing key | — (required) |
| `DEBUG` | Enable debug mode | `false` |
| `CORS_ORIGINS` | Allowed CORS origins | `["http://localhost:3000"]` |
| `DB_PASSWORD` | Database password | — (required) |

---

## Contributing

We welcome contributions to InvestIQ Africa. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

### Code Standards
- **Python:** PEP 8, type hints, docstrings
- **TypeScript:** Strict mode, proper interfaces
- **Commits:** Conventional commit messages
- **Tests:** Required for all mathematical functions

---

## Data Sources & Attribution

| Source | Data | URL |
|--------|------|-----|
| ZIMSTAT | National accounts, employment, trade | [zimstat.co.zw](https://www.zimstat.co.zw) |
| Reserve Bank of Zimbabwe | Exchange rates, monetary policy | [rbz.co.zw](https://www.rbz.co.zw) |
| World Bank | Development indicators, ease of business | [data.worldbank.org](https://data.worldbank.org) |
| IMF | Economic outlook, fiscal data | [imf.org](https://www.imf.org) |
| ZIDA | Investment regulations, SEZ data | [zida.co.zw](https://www.zida.co.zw) |

> **Disclaimer:** Some economic parameters are estimates based on published reports and are clearly marked. For official investment decisions, always verify with authoritative sources.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>InvestIQ Africa</strong> — Empowering Investment Intelligence for Zimbabwe's Growth
  <br />
  An initiative by <strong>Ernest Moyo</strong> & <strong>Rodden Moyo</strong> | <strong>7Square Inc.</strong>
  <br />
  <a href="mailto:ernest@7squareinc.com">ernest@7squareinc.com</a> • <a href="mailto:rodden@7squareinc.com">rodden@7squareinc.com</a>
</p>
