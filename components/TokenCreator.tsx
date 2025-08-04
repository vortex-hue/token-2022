'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Coins, Plus, CheckCircle, AlertTriangle } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { Token2022Manager, TokenMetadata, TransferHookConfig } from '@/lib/token-2022'
import { PublicKey } from '@solana/web3.js'
import { isValidPublicKey } from '@/lib/solana'
import { Connection } from '@solana/web3.js'

interface TokenFormData {
  name: string
  symbol: string
  decimals: number
  description: string
  hookProgramId: string
  hookAuthority: string
}

export default function TokenCreator() {
  const { wallet, connected } = useWallet()
  const [isCreating, setIsCreating] = useState(false)
  const [createdToken, setCreatedToken] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TokenFormData>({
    defaultValues: {
      name: '',
      symbol: '',
      decimals: 9,
      description: '',
      hookProgramId: '',
      hookAuthority: ''
    }
  })

  const onSubmit = async (data: TokenFormData) => {
    if (!connected || !wallet) {
      setError('Please connect your wallet first')
      return
    }

    if (!isValidPublicKey(data.hookProgramId)) {
      setError('Invalid hook program ID')
      return
    }

    if (!isValidPublicKey(data.hookAuthority)) {
      setError('Invalid hook authority')
      return
    }

    try {
      setIsCreating(true)
      setError(null)

      // Create token manager instance
      const tokenManager = new Token2022Manager(
        wallet.connection || new Connection('https://api.devnet.solana.com'),
        wallet
      )

      const metadata: TokenMetadata = {
        name: data.name,
        symbol: data.symbol,
        decimals: data.decimals,
        description: data.description
      }

      const transferHookConfig: TransferHookConfig = {
        programId: new PublicKey(data.hookProgramId),
        authority: new PublicKey(data.hookAuthority)
      }

      const result = await tokenManager.createTokenWithTransferHook(
        metadata,
        transferHookConfig
      )

      setCreatedToken(result)
      reset()
    } catch (err) {
      console.error('Failed to create token:', err)
      setError(err instanceof Error ? err.message : 'Failed to create token')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Coins className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Token-2022</h1>
          <p className="text-gray-600">Create a new token with transfer hooks for AMM trading</p>
        </div>
      </div>

      {!connected && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">Please connect your wallet to create tokens</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Token Information</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token Name
              </label>
              <input
                {...register('name', { required: 'Token name is required' })}
                className="input-field"
                placeholder="My Token"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token Symbol
              </label>
              <input
                {...register('symbol', { required: 'Token symbol is required' })}
                className="input-field"
                placeholder="MTK"
              />
              {errors.symbol && (
                <p className="text-red-500 text-sm mt-1">{errors.symbol.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decimals
              </label>
              <input
                {...register('decimals', { 
                  required: 'Decimals is required',
                  min: { value: 0, message: 'Decimals must be 0 or greater' },
                  max: { value: 9, message: 'Decimals must be 9 or less' }
                })}
                type="number"
                className="input-field"
                min="0"
                max="9"
              />
              {errors.decimals && (
                <p className="text-red-500 text-sm mt-1">{errors.decimals.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                className="input-field"
                rows={3}
                placeholder="Token description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer Hook Program ID
              </label>
              <input
                {...register('hookProgramId', { required: 'Hook program ID is required' })}
                className="input-field"
                placeholder="HookProgram111111111111111111111111111111111"
              />
              {errors.hookProgramId && (
                <p className="text-red-500 text-sm mt-1">{errors.hookProgramId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hook Authority
              </label>
              <input
                {...register('hookAuthority', { required: 'Hook authority is required' })}
                className="input-field"
                placeholder="Authority111111111111111111111111111111111"
              />
              {errors.hookAuthority && (
                <p className="text-red-500 text-sm mt-1">{errors.hookAuthority.message}</p>
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

            <button
              type="submit"
              disabled={!connected || isCreating}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Token...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Token</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Transfer Hooks</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Transfer hooks allow you to add custom logic to token transfers:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Whitelist/KYC verification</li>
                <li>Fee collection</li>
                <li>Transfer restrictions</li>
                <li>Conditional transfers</li>
                <li>Compliance checks</li>
              </ul>
            </div>
          </div>

          {createdToken && (
            <div className="card bg-green-50 border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Token Created!</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Mint Address:</span>
                  <p className="font-mono text-green-700 break-all">
                    {createdToken.mint.toString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Token Account:</span>
                  <p className="font-mono text-green-700 break-all">
                    {createdToken.associatedTokenAccount.toString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Transaction:</span>
                  <p className="font-mono text-green-700 break-all">
                    {createdToken.signature}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 