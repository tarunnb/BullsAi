'use client'

import { motion } from 'framer-motion'

interface MetricCardProps {
  label: string
  value: string | number
  prefix?: string
  suffix?: string
  highlight?: boolean
}

const MetricCard = ({ label, value, prefix = '', suffix = '', highlight = false }: MetricCardProps) => (
  <div className={`p-4 rounded-xl ${highlight ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-gray-900/50 border border-gray-800'} backdrop-blur-sm`}>
    <p className="text-sm text-gray-400 mb-1">{label}</p>
    <p className={`text-xl font-semibold ${highlight ? 'text-blue-400' : 'text-white'}`}>
      {prefix}{value}{suffix}
    </p>
  </div>
)

export default function FinancialMetrics() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <motion.section 
      className="w-full max-w-7xl mx-auto px-6 py-16"
      {...fadeIn}
    >
      {/* Company Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4">Tata Power Company Ltd</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <a href="https://tatapower.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <span className="text-blue-400">🔗</span> tatapower.com
          </a>
          <span className="flex items-center gap-2">
            <span className="text-purple-400">📊</span> BSE: 500400
          </span>
          <span className="flex items-center gap-2">
            <span className="text-purple-400">📊</span> NSE: TATAPOWER
          </span>
        </div>
      </div>

      {/* Price and Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
            <p className="text-sm text-gray-300 mb-2">Current Price</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">₹397</span>
              <span className="text-green-400 text-sm">↑ 0.09%</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">29 May 3:21 p.m.</p>
          </div>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <MetricCard label="Market Cap" value="1,26,775" prefix="₹" suffix=" Cr." highlight />
          <MetricCard label="High / Low" value="495 / 326" prefix="₹" />
        </div>
      </div>

      {/* Financial Ratios Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Stock P/E" value="31.4" />
        <MetricCard label="Book Value" value="112" prefix="₹" />
        <MetricCard label="Dividend Yield" value="0.57" suffix="%" />
        <MetricCard label="ROCE" value="11.3" suffix="%" />
        <MetricCard label="ROE" value="11.9" suffix="%" />
        <MetricCard label="Face Value" value="1.00" prefix="₹" />
        <MetricCard label="Industry PE" value="27.7" />
        <MetricCard label="EV/EBITDA" value="11.7" />
        <MetricCard label="Sales" value="65,478" prefix="₹" suffix=" Cr." />
        <MetricCard label="EBIT" value="11,144" prefix="₹" suffix=" Cr." />
        <MetricCard label="Profit after tax" value="4,048" prefix="₹" suffix=" Cr." />
        <MetricCard label="Debt" value="62,866" prefix="₹" suffix=" Cr." />
        <MetricCard label="Enterprise Value" value="1,77,890" prefix="₹" suffix=" Cr." />
        <MetricCard label="Qtr Sales Var" value="7.88" suffix="%" />
        <MetricCard label="Qtr Profit Var" value="18.2" suffix="%" />
        <MetricCard label="EPS" value="12.4" prefix="₹" />
        <MetricCard label="Price to book value" value="3.54" />
        <MetricCard label="Price to Sales" value="1.94" />
        <MetricCard label="OPM" value="19.8" suffix="%" />
        <MetricCard label="NPM last year" value="7.43" suffix="%" />
      </div>
    </motion.section>
  )
}