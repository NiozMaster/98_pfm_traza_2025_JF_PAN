import React from 'react'
import Web3Provider from '../contexts/Web3Context'
import ContractDiagnostics from '../components/ContractDiagnostics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Web3Provider>
          {children}
          <ContractDiagnostics />
        </Web3Provider>
      </body>
    </html>
  )
}
