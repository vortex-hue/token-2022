'use client'

import { useState, useEffect, useCallback } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getConnection } from '@/lib/solana'

interface Wallet {
  publicKey: PublicKey
  signTransaction: (transaction: any) => Promise<any>
  signAllTransactions: (transactions: any[]) => Promise<any[]>
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    // Initialize connection
    setConnection(getConnection())
    
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && window.solana) {
      if (window.solana.isConnected) {
        setWallet(window.solana)
        setConnected(true)
      }
    }
  }, [])

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.solana) {
      alert('Please install Phantom or another Solana wallet')
      return
    }

    try {
      setConnecting(true)
      
      // Request wallet connection
      const response = await window.solana.connect()
      
      if (response.publicKey) {
        setWallet(window.solana)
        setConnected(true)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert('Failed to connect wallet')
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (wallet) {
      try {
        await wallet.disconnect()
        setWallet(null)
        setConnected(false)
      } catch (error) {
        console.error('Failed to disconnect wallet:', error)
      }
    }
  }, [wallet])

  return {
    wallet,
    connected,
    connecting,
    connection,
    connect,
    disconnect
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    solana?: {
      isConnected: boolean
      publicKey: PublicKey
      connect: () => Promise<{ publicKey: PublicKey }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      signAllTransactions: (transactions: any[]) => Promise<any[]>
    }
  }
} 