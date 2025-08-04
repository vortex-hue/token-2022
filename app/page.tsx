'use client'

import { useState } from 'react'
import { Wallet, Coins, TrendingUp, Settings, Menu, X } from 'lucide-react'
import TokenCreator from '@/components/TokenCreator'
import AMMTrading from '@/components/AMMTrading'
import PoolManager from '@/components/PoolManager'
import WalletConnection from '@/components/WalletConnection'

export default function Home() {
  const [activeTab, setActiveTab] = useState('trading')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const tabs = [
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'create', label: 'Create Token', icon: Coins },
    { id: 'pools', label: 'Pool Manager', icon: Settings },
  ]

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-xl font-bold text-gradient">Token-2022 AMM</h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <div className="mb-6">
            <WalletConnection />
          </div>

          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${activeTab === tab.id 
                      ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <h1 className="text-lg font-bold text-gradient">Token-2022 AMM</h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'trading' && <AMMTrading />}
            {activeTab === 'create' && <TokenCreator />}
            {activeTab === 'pools' && <PoolManager />}
          </div>
        </main>
      </div>
    </div>
  )
} 