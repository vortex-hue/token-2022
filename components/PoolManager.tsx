'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Settings, Plus, Trash2, TrendingUp, DollarSign } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { AMMManager } from '@/lib/amm'
import { PublicKey } from '@solana/web3.js'
import { isValidPublicKey } from '@/lib/solana'

interface PoolFormData {
  tokenA: string
  tokenB: string
  initialLiquidityA: string
  initialLiquidityB: string
  feeRate: number
}

interface Pool {
  id: string
  tokenA: string
  tokenB: string
  reserveA: number
  reserveB: number
  feeRate: number
  tvl: number
  volume24h: number
  lpTokens: number
}

export default function PoolManager() {
  const { wallet, connected } = useWallet()
  const [pools, setPools] = useState<Pool[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PoolFormData>({
    defaultValues: {
      tokenA: '',
      tokenB: '',
      initialLiquidityA: '',
      initialLiquidityB: '',
      feeRate: 0.3
    }
  })

  // Mock pools data
  useEffect(() => {
    const mockPools: Pool[] = [
      {
        id: '1',
        tokenA: 'So1111111111111111111111111111111111111111112',
        tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        reserveA: 1000,
        reserveB: 50000,
        feeRate: 0.3,
        tvl: 100000,
        volume24h: 100000,
        lpTokens: 1000
      },
      {
        id: '2',
        tokenA: 'So1111111111111111111111111111111111111111112',
        tokenB: 'Token2022Mint111111111111111111111111111111111',
        reserveA: 500,
        reserveB: 10000,
        feeRate: 0.3,
        tvl: 50000,
        volume24h: 50000,
        lpTokens: 500
      }
    ]
    setPools(mockPools)
  }, [])

  const onSubmit = async (data: PoolFormData) => {
    if (!connected || !wallet) {
      setError('Please connect your wallet first')
      return
    }

    if (!isValidPublicKey(data.tokenA)) {
      setError('Invalid token A address')
      return
    }

    if (!isValidPublicKey(data.tokenB)) {
      setError('Invalid token B address')
      return
    }

    try {
      setIsCreating(true)
      setError(null)

      // Create AMM manager
      const ammManager = new AMMManager(
        wallet.connection || new Connection('https://api.devnet.solana.com'),
        wallet
      )

      const signature = await ammManager.createPool({
        tokenA: new PublicKey(data.tokenA),
        tokenB: new PublicKey(data.tokenB),
        initialLiquidityA: parseFloat(data.initialLiquidityA),
        initialLiquidityB: parseFloat(data.initialLiquidityB),
        feeRate: data.feeRate / 100,
        creator: wallet.publicKey
      })

      setSuccess(`Pool created successfully! Transaction: ${signature}`)
      reset()
    } catch (err) {
      console.error('Failed to create pool:', err)
      setError(err instanceof Error ? err.message : 'Failed to create pool')
    } finally {
      setIsCreating(false)
    }
  }

  const addLiquidity = async (poolId: string) => {
    // Implementation for adding liquidity
    console.log('Adding liquidity to pool:', poolId)
  }

  const removeLiquidity = async (poolId: string) => {
    // Implementation for removing liquidity
    console.log('Removing liquidity from pool:', poolId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pool Manager</h1>
          <p className="text-gray-600">Create and manage liquidity pools for Token-2022 tokens</p>
        </div>
      </div>

      {!connected && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">Please connect your wallet to manage pools</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Pool Form */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Create New Pool</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token A Address
              </label>
              <input
                {...register('tokenA', { required: 'Token A address is required' })}
                className="input-field"
                placeholder="Token A mint address"
              />
              {errors.tokenA && (
                <p className="text-red-500 text-sm mt-1">{errors.tokenA.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token B Address
              </label>
              <input
                {...register('tokenB', { required: 'Token B address is required' })}
                className="input-field"
                placeholder="Token B mint address"
              />
              {errors.tokenB && (
                <p className="text-red-500 text-sm mt-1">{errors.tokenB.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Liquidity A
                </label>
                <input
                  {...register('initialLiquidityA', { 
                    required: 'Initial liquidity A is required',
                    min: { value: 0, message: 'Amount must be positive' }
                  })}
                  type="number"
                  className="input-field"
                  placeholder="0.0"
                  step="0.000001"
                />
                {errors.initialLiquidityA && (
                  <p className="text-red-500 text-sm mt-1">{errors.initialLiquidityA.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Liquidity B
                </label>
                <input
                  {...register('initialLiquidityB', { 
                    required: 'Initial liquidity B is required',
                    min: { value: 0, message: 'Amount must be positive' }
                  })}
                  type="number"
                  className="input-field"
                  placeholder="0.0"
                  step="0.000001"
                />
                {errors.initialLiquidityB && (
                  <p className="text-red-500 text-sm mt-1">{errors.initialLiquidityB.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Rate (%)
              </label>
              <input
                {...register('feeRate', { 
                  required: 'Fee rate is required',
                  min: { value: 0.01, message: 'Fee rate must be at least 0.01%' },
                  max: { value: 10, message: 'Fee rate must be at most 10%' }
                })}
                type="number"
                className="input-field"
                placeholder="0.3"
                step="0.01"
              />
              {errors.feeRate && (
                <p className="text-red-500 text-sm mt-1">{errors.feeRate.message}</p>
              )}
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
              type="submit"
              disabled={!connected || isCreating}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Pool...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Pool</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Pool List */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Your Pools</h2>
          
          <div className="space-y-4">
            {pools.map((pool) => (
              <div key={pool.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Pool {pool.id}</span>
                    <span className="text-sm text-gray-500">({pool.feeRate}% fee)</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addLiquidity(pool.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => removeLiquidity(pool.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>TVL</span>
                    </div>
                    <div className="font-medium">${pool.tvl.toLocaleString()}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>24h Volume</span>
                    </div>
                    <div className="font-medium">${pool.volume24h.toLocaleString()}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-600">Reserve A</div>
                    <div className="font-medium">{pool.reserveA.toLocaleString()}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-600">Reserve B</div>
                    <div className="font-medium">{pool.reserveB.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {pools.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pools found. Create your first pool above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 