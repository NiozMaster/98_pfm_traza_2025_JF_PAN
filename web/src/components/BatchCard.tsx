"use client"
import React from 'react'
import Link from 'next/link'

interface BatchCardProps {
  batchId: number
  product: string
  origin: string
  quantity: number
  status: string
  dateCreated: number
}

export default function BatchCard({ batchId, product, origin, quantity, status, dateCreated }: BatchCardProps) {
  const statusColors: Record<string, string> = {
    'Created': '#3b82f6',
    'InTransit': '#f59e0b',
    'Processing': '#8b5cf6',
    'QualityCheck': '#10b981',
    'Exported': '#06b6d4',
    'Delivered': '#059669'
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES')
  }

  return (
    <Link href={`/batches/${batchId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
      }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111' }}>{product}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>Lote #{batchId}</p>
          </div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: statusColors[status] || '#6b7280',
            color: 'white'
          }}>
            {status}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Origen</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>{origin}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Cantidad</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>{quantity} kg</p>
          </div>
        </div>
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
            Creado: {formatDate(dateCreated)}
          </p>
        </div>
      </div>
    </Link>
  )
}

