import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pulse — Open-Source API Reliability & Incident Management',
  description: 'Enterprise-grade open-source API monitoring, synthetic endpoint testing, and automated AI incident resolution platform.',
  keywords: ['API Monitoring', 'Incident Management', 'Open Source', 'Temporal Workflows', 'Ollama AI', 'Go Backend'],
  authors: [{ name: 'Pulse Open Source Community' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060911] text-gray-100 antialiased selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />
        {children}
      </body>
    </html>
  )
}
