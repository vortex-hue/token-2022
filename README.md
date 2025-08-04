# Token-2022 AMM Trading Platform

A comprehensive solution for making Token-2022 with Transfer Hooks tradable on Solana AMMs. This project addresses the challenge of integrating programmable tokens with automated market makers while maintaining security and compliance.

## 🎯 Project Overview

This platform enables the creation and trading of Token-2022 tokens with transfer hooks on Solana AMMs. It provides a complete solution for:

- **Token Creation**: Create Token-2022 tokens with custom transfer hooks
- **AMM Integration**: Trade tokens with transfer hooks on automated market makers
- **Pool Management**: Create and manage liquidity pools
- **Transfer Hook Validation**: Secure whitelisting and validation system

## 🚀 Key Features

### ✅ Core Functionality
- **Token-2022 Creation**: Create tokens with transfer hooks for programmable behavior
- **AMM Trading**: Trade Token-2022 tokens on automated market makers
- **Pool Creation**: Create liquidity pools for Token-2022 tokens
- **Transfer Hook Middleware**: Secure validation and approval system

### 🔒 Security Features
- **Whitelisted Hooks**: Only approved transfer hook programs are allowed
- **Pre-trade Simulation**: Validate transfers before execution
- **Hook Approval System**: Permissionless but safe hook validation
- **Compliance Checks**: Built-in compliance and KYC support

### 🎨 User Experience
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Live pool data and trading information
- **Wallet Integration**: Seamless Solana wallet connection
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Blockchain**: Solana Web3.js, SPL Token-2022
- **AMM Integration**: Raydium SDK, Orca SDK
- **State Management**: Zustand, React Hook Form
- **Development**: ESLint, Prettier, Jest

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vortex-hue/token-2022.git
   cd token-2022
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage Guide

### Creating Token-2022 Tokens

1. **Connect Wallet**: Connect your Solana wallet (Phantom, Solflare, etc.)
2. **Navigate to Create Token**: Click on "Create Token" in the sidebar
3. **Fill Token Details**:
   - Token Name and Symbol
   - Decimals (0-9)
   - Description (optional)
4. **Configure Transfer Hook**:
   - Transfer Hook Program ID
   - Hook Authority
5. **Create Token**: Click "Create Token" to deploy

### Trading on AMMs

1. **Select Pool**: Choose from available liquidity pools
2. **Enter Trade Details**:
   - Input amount
   - Slippage tolerance
3. **Execute Trade**: The system will:
   - Validate transfer hook
   - Simulate the trade
   - Execute if approved

### Managing Pools

1. **Create Pool**: Provide token addresses and initial liquidity
2. **Add Liquidity**: Contribute to existing pools
3. **Remove Liquidity**: Withdraw your LP tokens

## 🔧 Architecture

### Core Components

#### Token-2022 Manager (`lib/token-2022.ts`)
- Handles Token-2022 creation with transfer hooks
- Manages mint and account operations
- Integrates with SPL Token-2022 program

#### AMM Manager (`lib/amm.ts`)
- Interfaces with AMM protocols (Raydium, Orca)
- Handles trade execution and pool management
- Implements transfer hook validation

#### Transfer Hook Middleware
- Validates whitelisted hook programs
- Pre-approves trades through simulation
- Ensures security and compliance

### Security Model

1. **Whitelisted Hooks**: Only approved transfer hook programs are allowed
2. **Pre-trade Validation**: All trades are simulated before execution
3. **Hook Approval**: Transfer hooks must approve trades
4. **Compliance Checks**: Built-in compliance validation

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm run build
vercel --prod
```

## 📊 Demo Features

### Live Demo
- **Devnet Deployment**: [https://token-2022-amm.vercel.app](https://token-2022-amm.vercel.app)
- **Testnet Support**: Full testnet integration
- **Mainnet Ready**: Production-ready code

### Video Demo
- Complete walkthrough of token creation
- AMM trading demonstration
- Pool management showcase
- Transfer hook validation process

## 🔍 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📈 Performance

- **Fast Loading**: Optimized bundle size and lazy loading
- **Real-time Updates**: WebSocket connections for live data
- **Efficient Queries**: Optimized blockchain queries
- **Caching**: Smart caching for improved performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for Token-2022 program
- **Raydium** and **Orca** for AMM protocols
- **Superteam Vietnam** for the bounty opportunity
- **Community** for feedback and testing

## 📞 Support

- **Discord**: Join our community for support
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive docs at [docs.token-2022-amm.com](https://docs.token-2022-amm.com)

## 🏆 Contest Submission

This project addresses all contest requirements:

✅ **UI for Token Creation**: Complete token creation interface
✅ **LP Pool Creation**: Full pool management system
✅ **Trading Functionality**: AMM trading with transfer hooks
✅ **Video Demo**: Complete walkthrough available
✅ **Live Demo**: Deployed on devnet/testnet
✅ **Source Code**: Open source and well-documented

### Bonus Features
✅ **Multiple Hook Support**: Extensible hook system
✅ **Permissionless Safety**: Secure hook approval system
✅ **Direct AMM Integration**: Native protocol integration

---

**Built with ❤️ for the Solana ecosystem** 