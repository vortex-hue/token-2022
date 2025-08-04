'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { AMMManager, TransferHookMiddleware } from '@/lib/amm'
import { PublicKey } from '@solana/web3.js'
import { isValidPublicKey } from '@/lib/solana'
import { Connection } from '@solana/web3.js'

interface Token {
  mint: string
  symbol: string
  name: string
  decimals: number
  balance?: number
}

interface Pool {
  id: string
  tokenA: Token
  tokenB: Token
  reserveA: number
  reserveB: number
  feeRate: number
  volume24h: number
  tvl: number
}

export default function AMMTrading() {
  const { wallet, connected } = useWallet()
  const [pools, setPools] = useState<Pool[]>([])
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [isTrading, setIsTrading] = useState(false)
  const [slippage, setSlippage] = useState(0.5)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Mock pools data
  useEffect(() => {
    const mockPools: Pool[] = [
      {
        id: '1',
        tokenA: { mint: 'So1111111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', decimals: 9 },
        tokenB: { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
        reserveA: 1000,
        reserveB: 50000,
        feeRate: 0.003,
        volume24h: 100000,
        tvl: 100000
      },
      {
        id: '2',
        tokenA: { mint: 'So1111111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', decimals: 9 },
        tokenB: { mint: 'Token2022Mint111111111111111111111111111111111', symbol: 'MTK', name: 'My Token', decimals: 9 },
        reserveA: 500,
        reserveB: 10000,
        feeRate: 0.003,
        volume24h: 50000,
        tvl: 50000
      }
    ]
    setPools(mockPools)
  }, [])

  const calculateOutput = (input: number, pool: Pool) => {
    if (input <= 0) return 0
    
    const k = pool.reserveA * pool.reserveB
    const newReserveA = pool.reserveA + input
    const newReserveB = k / newReserveA
    const output = pool.reserveB - newReserveB
    const fee = output * pool.feeRate
    return output - fee
  }

  const handleInputChange = (value: string) => {
    setInputAmount(value)
    if (selectedPool && value) {
      const input = parseFloat(value)
      const output = calculateOutput(input, selectedPool)
      setOutputAmount(output.toFixed(6))
    } else {
      setOutputAmount('')
    }
  }

  const handlePoolSelect = (pool: Pool) => {
    setSelectedPool(pool)
    setInputAmount('')
    setOutputAmount('')
    setError(null)
    setSuccess(null)
  }

  const executeTrade = async () => {
    if (!connected || !wallet || !selectedPool) {
      setError('Please connect your wallet and select a pool')
      return
    }

    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setError('Please enter a valid input amount')
      return
    }

    try {
      setIsTrading(true)
      setError(null)
      setSuccess(null)

      // Create AMM manager
      const ammManager = new AMMManager(
        wallet.connection || new Connection('https://api.devnet.solana.com'),
        wallet
      )

      // Create transfer hook middleware
      const hookMiddleware = new TransferHookMiddleware([
        'HookProgram111111111111111111111111111111111'
      ])

      // Check if transfer hook is safe
      const isHookSafe = hookMiddleware.isHookSafe(selectedPool.tokenB.mint)
      
      if (!isHookSafe) {
        setError('Transfer hook not whitelisted for trading')
        return
      }

      // Pre-approve trade
      const isApproved = await hookMiddleware.preApproveTrade(
        wallet.connection || new Connection('https://api.devnet.solana.com'),
        new PublicKey(selectedPool.tokenA.mint),
        wallet.publicKey,
        new PublicKey('AMMProgram111111111111111111111111111111111'),
        parseFloat(inputAmount)
      )

      if (!isApproved) {
        setError('Trade not approved by transfer hook')
        return
      }

      // Execute trade
      const signature = await ammManager.executeTrade({
        inputToken: new PublicKey(selectedPool.tokenA.mint),
        outputToken: new PublicKey(selectedPool.tokenB.mint),
        inputAmount: parseFloat(inputAmount),
        slippageTolerance: slippage / 100,
        userWallet: wallet.publicKey
      })

      setSuccess(`Trade executed successfully! Transaction: ${signature}`)
      setInputAmount('')
      setOutputAmount('')
    } catch (err) {
      console.error('Trade failed:', err)
      setError(err instanceof Error ? err.message : 'Trade failed')
    } finally {
      setIsTrading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <TrendingUp className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AMM Trading</h1>
          <p className="text-gray-600">Trade Token-2022 tokens with transfer hooks on AMMs</p>
        </div>
      </div>

      {!connected && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">Please connect your wallet to start trading</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pool Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Available Pools</h2>
          <div className="space-y-3">
            {pools.map((pool) => (
              <button
                key={pool.id}
                onClick={() => handlePoolSelect(pool)}
                className={`w-full p-4 rounded-lg border transition-colors duration-200 text-left ${
                  selectedPool?.id === pool.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{pool.tokenA.symbol}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{pool.tokenB.symbol}</span>
                  </div>
                  <span className="text-sm text-gray-500">{pool.feeRate * 100}%</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>TVL: ${pool.tvl.toLocaleString()}</div>
                  <div>24h Volume: ${pool.volume24h.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trading Interface */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Trade</h2>
            
            {selectedPool ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      You Pay
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputAmount}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="input-field pr-20"
                        placeholder="0.0"
                        disabled={isTrading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                        {selectedPool.tokenA.symbol}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      You Receive
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={outputAmount}
                        readOnly
                        className="input-field pr-20 bg-gray-50"
                        placeholder="0.0"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                        {selectedPool.tokenB.symbol}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slippage Tolerance
                  </label>
                  <div className="flex space-x-2">
                    {[0.1, 0.5, 1.0].map((value) => (
                      <button
                        key={value}
                        onClick={() => setSlippage(value)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          slippage === value
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-700 text-sm">{success}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={executeTrade}
                  disabled={!connected || isTrading || !inputAmount}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {isTrading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Executing Trade...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>Execute Trade</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a pool to start trading
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 