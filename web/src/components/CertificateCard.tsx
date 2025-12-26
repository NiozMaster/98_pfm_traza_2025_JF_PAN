"use client"
import React from 'react'

interface CertificateCardProps {
  certificateId: number
  certificateType: string
  issuer: string
  issuedDate: number
  expiryDate: number
  status: string
  batchId: number
}

export default function CertificateCard({ 
  certificateId, 
  certificateType, 
  issuer, 
  issuedDate, 
  expiryDate, 
  status,
  batchId 
}: CertificateCardProps) {
  const statusColors: Record<string, string> = {
    'Valid': '#10b981',
    'Expired': '#ef4444',
    'Revoked': '#6b7280'
  }

  const certificateIcons: Record<string, string> = {
    'Sanitario': '🏥',
    'Calidad': '⭐',
    'Origen': '📍',
    'Comercio Justo': '🤝',
    'Sostenibilidad': '🌱',
    'Orgánico': '🌿'
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = expiryDate * 1000 < Date.now()

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{certificateIcons[certificateType] || '📜'}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{certificateType}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Certificado #{certificateId}</p>
          </div>
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
      
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Emisor</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>{issuer}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Lote</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>#{batchId}</p>
        </div>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Fecha de Emisión</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{formatDate(issuedDate)}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Fecha de Expiración</p>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '14px',
              color: isExpired ? '#ef4444' : '#111'
            }}>
              {formatDate(expiryDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

