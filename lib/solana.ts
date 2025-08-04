import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token-2022'

// Token-2022 Program ID
export const TOKEN_2022_PROGRAM_ID_STRING = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'

// Network configuration
export const NETWORKS = {
  devnet: {
    name: 'Devnet',
    endpoint: clusterApiUrl('devnet'),
    tokenProgram: TOKEN_2022_PROGRAM_ID,
  },
  testnet: {
    name: 'Testnet',
    endpoint: clusterApiUrl('testnet'),
    tokenProgram: TOKEN_2022_PROGRAM_ID,
  },
  mainnet: {
    name: 'Mainnet',
    endpoint: clusterApiUrl('mainnet-beta'),
    tokenProgram: TOKEN_2022_PROGRAM_ID,
  },
}

// Default connection
export const getConnection = (network: keyof typeof NETWORKS = 'devnet') => {
  return new Connection(NETWORKS[network].endpoint, 'confirmed')
}

// Utility functions
export const formatPublicKey = (publicKey: PublicKey | string) => {
  const key = typeof publicKey === 'string' ? publicKey : publicKey.toString()
  return `${key.slice(0, 4)}...${key.slice(-4)}`
}

export const isValidPublicKey = (key: string) => {
  try {
    new PublicKey(key)
    return true
  } catch {
    return false
  }
}

// Transfer hook validation
export const WHITELISTED_HOOK_PROGRAMS = [
  // Add your whitelisted hook programs here
  'HookProgram111111111111111111111111111111111',
]

export const isWhitelistedHook = (programId: string) => {
  return WHITELISTED_HOOK_PROGRAMS.includes(programId)
} 