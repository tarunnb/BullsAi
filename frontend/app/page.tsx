'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ChatInterface from '@/components/ChatInterface'
import CursorGradient from '@/components/CursorGradient'
import FinancialMetrics from '@/components/FinancialMetrics'
import StockChart from '@/components/StockChart'
import FinancialTables from '@/components/FinancialTables'
import DocumentsSection from '@/components/DocumentsSection'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          session_id: 'default'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to the server. Please make sure the backend is running on http://localhost:8000",
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cursor-following gradient */}
      <CursorGradient />
      
      {/* Static ambient gradients for depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full filter blur-[128px] animate-pulse animation-delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <motion.h1 
          className="text-2xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          BullsAi
        </motion.h1>
        <motion.div 
          className="flex gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <a href="#" className="hover:text-blue-400 transition-colors">Demo</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Docs</a>
          <a href="#" className="hover:text-blue-400 transition-colors">About</a>
        </motion.div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            BullsAi: Tata Power AI Analyst
          </h2>
          <p className="text-xl text-gray-400">
            Ask your most complex Tata Power questions. Get institutional-grade insights instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ChatInterface 
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Intelligent Analysis Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Intelligent Analysis</h3>
            <p className="text-gray-400">
              Advanced AI algorithms analyze complex financial data to provide actionable insights.
            </p>
          </div>

          {/* Real-time Data Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-green-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Data</h3>
            <p className="text-gray-400">
              Access up-to-date financial metrics and market data for informed decision making.
            </p>
          </div>

          {/* Executive Insights Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-purple-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Executive Insights</h3>
            <p className="text-gray-400">
              Get C-suite level analysis and strategic recommendations for your business.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Financial Data Sections */}
      <div className="relative z-10">
        <FinancialMetrics />
        <StockChart />
        <FinancialTables />
        <DocumentsSection />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.15;
          }
        }
        
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}