"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useWallet } from '../../hooks/useWallet'
import BatchCard from '../../components/BatchCard'
import Link from 'next/link'

interface Batch {
  id: number
  product: string
  origin: string
  quantity: number
  status: string
  dateCreated: number
}

export default function BatchesPage() {
  const { account } = useWallet()
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (account) {
      loadBatches()
    }
  }, [account])

  const loadBatches = async () => {
    setIsLoading(true)
    try {
      // TODO: Cargar lotes desde el smart contract
      // Datos de ejemplo por ahora
      setBatches([
        {
          id: 1,
          product: 'Café Arábica',
          origin: 'Finca El Roble',
          quantity: 500,
          status: 'Processing',
          dateCreated: Math.floor(Date.now() / 1000) - 86400 * 5
        },
        {
          id: 2,
          product: 'Cacao Premium',
          origin: 'Finca La Esperanza',
          quantity: 750,
          status: 'InTransit',
          dateCreated: Math.floor(Date.now() / 1000) - 86400 * 3
        },
        {
          id: 3,
          product: 'Café Arábica',
          origin: 'Finca El Roble',
          quantity: 300,
          status: 'Exported',
          dateCreated: Math.floor(Date.now() / 1000) - 86400 * 10
        }
      ])
    } catch (error) {
      console.error('Error al cargar lotes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para ver los lotes.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main style={{ 
        padding: '40px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Lotes</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Gestiona y visualiza todos los lotes de productos alimentarios
            </p>
          </div>
          <Link href="/batches/create">
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              ➕ Crear Nuevo Lote
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#666' }}>Cargando lotes...</p>
          </div>
        ) : batches.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📦</p>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>No hay lotes registrados</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Comienza creando tu primer lote de producto alimentario
            </p>
            <Link href="/batches/create">
              <button style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Crear Primer Lote
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {batches.map(batch => (
              <BatchCard key={batch.id} {...batch} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

