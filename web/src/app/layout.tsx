import React from 'react'
import Web3Provider from '../contexts/Web3Context'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  )
}
