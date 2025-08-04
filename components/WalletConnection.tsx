'use client'

import { useState, useEffect } from 'react'
import { Wallet, LogOut, User } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { formatPublicKey } from '@/lib/solana'

export default function WalletConnection() {
  const { wallet, connect, disconnect, connected, connecting } = useWallet()

  return (
    <div className="space-y-4">
      {!connected ? (
        <button
          onClick={connect}
          disabled={connecting}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Wallet className="w-5 h-5" />
          <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">Connected</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-mono text-gray-700">
              {formatPublicKey(wallet?.publicKey || '')}
            </span>
          </div>
          
          <button
            onClick={disconnect}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  )
} 