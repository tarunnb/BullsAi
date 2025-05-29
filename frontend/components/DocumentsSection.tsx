'use client'

import { motion } from 'framer-motion'

interface Document {
  title: string
  date: string
  description?: string
  tags: string[]
}

interface DocumentCardProps {
  title: string
  documents: Document[]
  icon: string
}

const DocumentCard = ({ title, documents, icon }: DocumentCardProps) => (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <span>{icon}</span> {title}
    </h3>
    <div className="space-y-3">
      {documents.map((doc, index) => (
        <div key={index} className="border-b border-gray-800/50 pb-3 last:border-0">
          <h4 className="text-sm font-medium text-blue-400 hover:text-blue-300 cursor-pointer mb-1">
            {doc.title}
          </h4>
          {doc.description && (
            <p className="text-xs text-gray-500 mb-2">{doc.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{doc.date}</span>
            <div className="flex gap-2">
              {doc.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-gray-800 text-xs rounded text-gray-400 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function DocumentsSection() {
  const announcements = [
    {
      title: 'Announcement under Regulation 30 (LODR) - Newspaper Publication',
      description: 'Advertisement Published in newspapers for Transfer of Shares to IEPF',
      date: '1d',
      tags: ['Recent', 'Important']
    },
    {
      title: 'Announcement under Regulation 30 (LODR) - Analyst / Investor Meet',
      description: 'The Company will be attending the B&K Securities and Bank of America Investor Conferences',
      date: '22 May',
      tags: ['Search', 'All']
    }
  ]

  const annualReports = [
    { title: 'Financial Year 2024', date: 'from bse', tags: [] },
    { title: 'Financial Year 2023', date: 'from bse', tags: [] },
    { title: 'Financial Year 2022', date: 'from bse', tags: [] },
    { title: 'Financial Year 2021', date: 'from bse', tags: [] }
  ]

  const creditRatings = [
    { title: 'Rating update', date: '10 Oct 2024 from crisil', tags: [] },
    { title: 'Rating update', date: '4 Jul 2024 from icra', tags: [] },
    { title: 'Rating update', date: '20 Jun 2024 from care', tags: [] },
    { title: 'Rating update', date: '19 Apr 2024 from crisil', tags: [] }
  ]

  const concalls = [
    { title: 'May 2025', date: '', tags: ['Transcript', 'Notes', 'REC'] },
    { title: 'May 2025', date: '', tags: ['Transcript', 'Notes', 'PPT', 'REC'] },
    { title: 'Feb 2025', date: '', tags: ['Transcript', 'Notes', 'PPT'] },
    { title: 'Dec 2024', date: '', tags: ['Transcript', 'Notes', 'PPT'] }
  ]

  return (
    <motion.section 
      className="w-full max-w-7xl mx-auto px-6 py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Documents</h2>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">
          🗂️ Add Missing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DocumentCard 
          title="Announcements" 
          documents={announcements} 
          icon="📢"
        />
        <DocumentCard 
          title="Annual reports" 
          documents={annualReports} 
          icon="📊"
        />
        <DocumentCard 
          title="Credit ratings" 
          documents={creditRatings} 
          icon="⭐"
        />
        <DocumentCard 
          title="Concalls" 
          documents={concalls} 
          icon="📞"
        />
      </div>

      {/* Right Issue Banner */}
      <div className="mt-8 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
        <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
          RIGHT ISSUE →
        </button>
      </div>
    </motion.section>
  )
}