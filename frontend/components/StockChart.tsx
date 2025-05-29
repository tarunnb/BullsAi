'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts'

// Sample data - in production, this would come from your API
const generateStockData = () => {
  const months = ['Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025']
  const basePrice = 400
  
  return months.map((month, index) => {
    const randomVariation = Math.sin(index * 0.5) * 50 + Math.random() * 30
    const price = basePrice + randomVariation - 20
    const volume = Math.floor(Math.random() * 3000000) + 1000000
    
    return {
      date: month,
      price: Math.round(price * 100) / 100,
      volume: volume
    }
  })
}

const stockData = generateStockData()

export default function StockChart() {
  const [timeRange, setTimeRange] = useState('1Y')
  const [chartType, setChartType] = useState('price')
  
  const timeRanges = ['1M', '6M', '1Y', '3Y', '5Y', '10Y', 'Max']
  const chartTypes = [
    { id: 'price', label: 'Price', color: '#3B82F6' },
    { id: 'pe', label: 'PE Ratio', color: '#8B5CF6' }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-sm font-semibold text-blue-400">
            Price: ₹{payload[0].value}
          </p>
          {payload[1] && (
            <p className="text-sm text-gray-400">
              Volume: {(payload[1].value / 1000000).toFixed(2)}M
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <motion.section 
      className="w-full max-w-7xl mx-auto px-6 py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
        {/* Chart Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex gap-2">
            {chartTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  chartType === type.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-all">
              More ▼
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all">
              🔔 Alerts
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stockData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis 
                yAxisId="price"
                orientation="right"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                domain={['dataMin - 20', 'dataMax + 20']}
              />
              <YAxis 
                yAxisId="volume"
                orientation="left"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Bar 
                yAxisId="volume"
                dataKey="volume" 
                fill="#3B82F6"
                opacity={0.3}
              />
              
              <Line 
                yAxisId="price"
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={false}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-400">Price on NSE</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-600" />
            <span className="text-sm text-gray-400">50 DMA</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-600" />
            <span className="text-sm text-gray-400">200 DMA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/30 rounded"></div>
            <span className="text-sm text-gray-400">Volume</span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}