'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FinancialTables() {
  const [activeTab, setActiveTab] = useState('quarterly')

  const quarterlyData = [
    { period: 'Mar 2025', sales: 17096, expenses: 14028, operatingProfit: 3068, opm: '18%', netProfit: 1306, eps: 3.26 },
    { period: 'Dec 2024', sales: 15391, expenses: 12312, operatingProfit: 3079, opm: '20%', netProfit: 1188, eps: 3.23 },
    { period: 'Sep 2024', sales: 15698, expenses: 12427, operatingProfit: 3271, opm: '21%', netProfit: 1093, eps: 2.90 },
    { period: 'Jun 2024', sales: 17294, expenses: 14232, operatingProfit: 3062, opm: '18%', netProfit: 1189, eps: 3.04 },
    { period: 'Mar 2024', sales: 15847, expenses: 13540, operatingProfit: 2307, opm: '15%', netProfit: 1046, eps: 2.80 },
  ]

  const annualData = [
    { period: 'Mar 2025', sales: 65478, expenses: 52525, operatingProfit: 12954, opm: '20%', netProfit: 4775, eps: 12.43 },
    { period: 'Mar 2024', sales: 61449, expenses: 50714, operatingProfit: 10735, opm: '17%', netProfit: 4280, eps: 11.57 },
    { period: 'Mar 2023', sales: 55109, expenses: 47381, operatingProfit: 7728, opm: '14%', netProfit: 3810, eps: 10.44 },
    { period: 'Mar 2022', sales: 42816, expenses: 35785, operatingProfit: 7031, opm: '16%', netProfit: 2156, eps: 5.45 },
    { period: 'Mar 2021', sales: 32703, expenses: 25782, operatingProfit: 6921, opm: '21%', netProfit: 1439, eps: 3.53 },
  ]

  const compoundedGrowth = [
    { metric: 'Sales Growth', '10Y': '7%', '5Y': '18%', '3Y': '15%', 'TTM': '7%' },
    { metric: 'Profit Growth', '10Y': '38%', '5Y': '48%', '3Y': '24%', 'TTM': '17%' },
    { metric: 'Stock Price CAGR', '10Y': '18%', '5Y': '61%', '3Y': '19%', '1Y': '-8%' },
    { metric: 'Return on Equity', '10Y': '8%', '5Y': '10%', '3Y': '12%', 'Last': '12%' },
  ]

  return (
    <motion.section 
      className="w-full max-w-7xl mx-auto px-6 py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('quarterly')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'quarterly'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          Quarterly Results
        </button>
        <button
          onClick={() => setActiveTab('annual')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'annual'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          Annual Results
        </button>
      </div>

      {/* Tables */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {activeTab === 'quarterly' ? 'Quarterly Results' : 'Profit & Loss'}
            </h3>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-all">
              🎯 PRODUCT SEGMENTS
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Consolidated Figures in Rs. Crores / <span className="text-blue-400 cursor-pointer hover:underline">View Standalone</span>
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Period</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Sales</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Expenses</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Operating Profit</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">OPM %</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Net Profit</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">EPS</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'quarterly' ? quarterlyData : annualData).map((row, index) => (
                  <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="py-3 px-4 text-sm">{row.period}</td>
                    <td className="text-right py-3 px-4 text-sm">{row.sales.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-sm">{row.expenses.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-sm">{row.operatingProfit.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-sm">{row.opm}</td>
                    <td className="text-right py-3 px-4 text-sm">{row.netProfit.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-sm">{row.eps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compounded Growth Metrics */}
        {activeTab === 'annual' && (
          <div className="border-t border-gray-800 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {compoundedGrowth.map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">{item.metric}</h4>
                  <div className="space-y-2">
                    {Object.entries(item).slice(1).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-500">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  )
}