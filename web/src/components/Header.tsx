"use client"
import React from 'react'
import Link from 'next/link'
import { useWallet } from '../hooks/useWallet'

export default function Header() {
  const { account, connect, disconnect } = useWallet()
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#111' }}>
          <strong style={{ fontSize: '20px' }}>🌾 Trazabilidad Alimentaria</strong>
        </Link>
        {account && (
          <nav style={{ display: 'flex', gap: '16px' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', color: '#666', padding: '8px 12px', borderRadius: '4px' }}>Dashboard</Link>
            <Link href="/batches" style={{ textDecoration: 'none', color: '#666', padding: '8px 12px', borderRadius: '4px' }}>Lotes</Link>
            <Link href="/events" style={{ textDecoration: 'none', color: '#666', padding: '8px 12px', borderRadius: '4px' }}>Eventos</Link>
            <Link href="/certificates" style={{ textDecoration: 'none', color: '#666', padding: '8px 12px', borderRadius: '4px' }}>Certificados</Link>
            <Link href="/actors" style={{ textDecoration: 'none', color: '#666', padding: '8px 12px', borderRadius: '4px' }}>Actores</Link>
            <Link href="/admin/users" style={{ textDecoration: 'none', color: '#ef4444', padding: '8px 12px', borderRadius: '4px', fontWeight: '500' }}>Admin</Link>
          </nav>
        )}
      </div>
      <div>
        {account ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              fontSize: '12px', 
              color: '#666',
              fontFamily: 'monospace',
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px'
            }}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button 
              onClick={disconnect}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Desconectar
            </button>
          </div>
        ) : (
          <button 
            onClick={() => connect()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Conectar Wallet
          </button>
        )}
      </div>
    </header>
  )
}
