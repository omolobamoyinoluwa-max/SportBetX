# 🏈 SportBetX: Decentralized Sports Betting Platform

[![Build Status](https://github.com/olaleyeolajide81-sketch/SportBetX/workflows/CI/badge.svg)
[![Coverage](https://img.shields.io/badge/coverage-85%25-green)
[![License](https://img.shields.io/badge/license-MIT-blue)
[![Stellar](https://img.shields.io/badge/blockchain-Stellar-purple)]

A decentralized sports betting platform built on Stellar blockchain, offering transparent, fair, and secure betting on sports events with instant payouts and community governance.

## 🎯 Project Overview

SportBetX revolutionizes sports betting by eliminating intermediaries, providing transparent odds, instant payouts, and community-driven governance through blockchain technology.

### 🌟 Core Features
- **Decentralized Betting** - No intermediaries, direct peer-to-peer betting
- **Transparent Odds** - Community-driven and algorithmic odds calculation
- **Instant Payouts** - Automatic winnings distribution via smart contracts
- **Multi-Sport Support** - Football, basketball, tennis, esports, and more
- **Live Betting** - Real-time in-game betting with dynamic odds
- **Parlay Betting** - Combine multiple bets for higher payouts
- **Liquidity Pools** - Community-provided betting liquidity
- **Governance** - Token holder voting on platform decisions
- **Oracle Integration** - Real-world sports data feeds
- **Mobile Support** - Responsive design for mobile betting

### 🏈 Platform Mechanics
- **Betting Markets** - Moneyline, spread, totals, props, parlays
- **Odds Calculation** - Automated odds based on market demand
- **Liquidity Provision** - Users provide liquidity for betting pools
- **Risk Management** - Automated risk assessment and limits
- **Payout Distribution** - Instant smart contract payouts
- **Dispute Resolution** - Community governance for disputed outcomes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Bettors      │    │   Liquidity    │    │   Oracles      │
│                │◄──►│   Providers    │◄──►│                │
│ 💰📱🏈       │    │  💧💰📊       │    │  📊🔗📈       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                    ┌─────────────────┐
                    │  Frontend       │
                    │  Applications   │
                    └─────────────────┘
                                │
                    ┌─────────────────┐
                    │  Stellar       │
                    │  Blockchain     │
                    │  ⭐            │
                    └─────────────────┘
                                │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Betting      │ │   Liquidity    │ │   Governance   │
│   Markets      │◄──►│   Pools        │◄──►│                │
│                │ │                │ │                │
│ 🎯💰📊       │ │  💧💰🔄       │ │ 🗳️📊⚖️       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 🛠️ Technology Stack

### Blockchain Layer
- **Stellar Network** - Fast, low-cost transactions
- **Soroban Platform** - Smart contract capabilities
- **Rust SDK** - Secure contract development
- **Stellar Oracles** - Real-world sports data

### Frontend Applications
- **React** - Modern UI framework
- **TypeScript** - Type-safe development
- **Chart.js** - Real-time odds visualization
- **WebSocket** - Live betting updates
- **Tailwind CSS** - Responsive styling
- **Vite** - Fast build tool

### Backend Services
- **Node.js** - JavaScript runtime for backend
- **Express.js** - Web framework for APIs
- **PostgreSQL** - Primary database for bets and odds
- **Redis** - Real-time data and caching
- **WebSocket** - Live betting and odds updates
- **Oracle Integration** - Sports data feeds

### Infrastructure
- **Docker** - Container orchestration
- **Kubernetes** - Scalable deployment
- **AWS/Google Cloud** - Cloud hosting and CDN
- **Cloudflare** - DDoS protection and CDN

## 📁 Project Structure

```
sportbetx/
├── 📋 README.md                    # Project overview
├── 📄 LICENSE                      # MIT license
├── 📝 CONTRIBUTING.md              # Contribution guidelines
├── 📜 CODE_OF_CONDUCT.md           # Community standards
├── 📦 package.json                # Workspace configuration
├── 🦀 Cargo.toml                  # Rust workspace
├── 🐳 docker-compose.yml           # Development environment
├── ⚙️ .env.example                # Environment template
├── 🔧 scripts/                    # Setup and deployment scripts
├── 📚 docs/                       # Documentation
├── 🧪 tests/                      # Testing framework
├── 📁 contracts/                  # Stellar smart contracts
│   ├── shared/                    # Shared types and utilities
│   ├── betting-market/             # Betting market contracts
│   ├── liquidity-pool/            # Liquidity pool contracts
│   ├── governance/                # Platform governance
│   └── oracle/                   # Sports data oracle
├── 🔌 backend/                    # Node.js microservices
│   ├── api-gateway/              # Main API server
│   ├── betting-service/           # Betting operations
│   ├── odds-service/             # Odds calculation
│   ├── liquidity-service/         # Liquidity management
│   ├── oracle-service/            # Sports data feeds
│   └── governance-service/        # Voting and proposals
├── 🎨 frontend/                   # React applications
│   ├── betting-interface/          # Main betting platform
│   ├── live-betting/             # Real-time betting
│   ├── liquidity-dashboard/        # Liquidity provider portal
│   ├── analytics-dashboard/        # Betting analytics
│   └── governance-ui/            # Voting and proposals
├── 📁 storage/                    # Database and cache
└── 🌐 infrastructure/              # Kubernetes configs
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **Rust** 1.70+
- **Docker** & Docker Compose
- **Stellar CLI** - For contract deployment
- **Git**

### Installation
```bash
# Clone the repository
git clone https://github.com/ChainNova-Labs/SportBetX.git
cd SportBetX

# Run setup script (Linux/macOS)
chmod +x scripts/setup.sh && ./scripts/setup.sh

# Or setup manually (Windows)
npm run setup:dev

# Start development environment
npm run dev
```

### Development Setup
```bash
# Install all dependencies
npm run install:all

# Start development environment
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Deploy to staging
npm run deploy:staging
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:contracts    # Smart contracts
npm run test:backend      # Backend services
npm run test:frontend     # Frontend applications
npm run test:integration # End-to-end tests

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Docker
```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Kubernetes
```bash
# Deploy to staging
./scripts/deploy.sh --env staging

# Deploy to production
./scripts/deploy.sh --env production --version v1.0.0
```

## 📊 Applications

### Betting Interface
- **URL**: http://localhost:3100
- **Features**: Sports betting, odds display, bet placement
- **Tech**: React, TypeScript, Chart.js

### Live Betting
- **URL**: http://localhost:3200
- **Features**: Real-time betting, dynamic odds, live scores
- **Tech**: WebSocket, React, Real-time updates

### Liquidity Dashboard
- **URL**: http://localhost:3300
- **Features**: Liquidity provision, pool management, rewards
- **Tech**: React, TypeScript, Analytics

### Analytics Dashboard
- **URL**: http://localhost:3400
- **Features**: Betting analytics, market insights, performance
- **Tech**: Chart.js, React, Data visualization

### API Gateway
- **URL**: http://localhost:3000
- **Features**: RESTful APIs, WebSocket feeds
- **Tech**: Node.js, Express, PostgreSQL

## 📖 Documentation

- **Getting Started**: [docs/getting-started/](docs/getting-started/)
- **API Reference**: [docs/api/](docs/api/)
- **Smart Contracts**: [docs/contracts/](docs/contracts/)
- **Betting Guide**: [docs/betting/](docs/betting/)
- **Deployment**: [docs/deployment/](docs/deployment/)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stellar Development Foundation** - Blockchain infrastructure
- **Soroban Team** - Smart contract platform
- **Sports Data Providers** - Real-time sports feeds
- **Web3 Community** - Tools and libraries

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/ChainNova-Labs/SportBetX/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ChainNova-Labs/SportBetX/discussions)
- **Email**: info@sportbetx.io
- **Discord**: [Join our community](https://discord.gg/sportbetx)

---

**🏈 Revolutionizing sports betting with transparency and fairness on Stellar, one bet at a time!**
=======
# SportBetX
Complete Decentralized Sports Betting Platform
>>>>>>> f466627823522e3b569c2e334c097826bfde8a04
