"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useWallet } from '../../hooks/useWallet'
import CertificateCard from '../../components/CertificateCard'
import Link from 'next/link'

interface Certificate {
  id: number
  certificateType: string
  issuer: string
  issuedDate: number
  expiryDate: number
  status: string
  batchId: number
}

export default function CertificatesPage() {
  const { account } = useWallet()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'valid' | 'expired' | 'revoked'>('all')

  useEffect(() => {
    if (account) {
      loadCertificates()
    }
  }, [account])

  const loadCertificates = async () => {
    setIsLoading(true)
    try {
      // TODO: Cargar certificados desde el smart contract
      // Datos de ejemplo
      setCertificates([
        {
          id: 1,
          certificateType: 'Sanitario',
          issuer: 'Autoridad Sanitaria Nacional',
          issuedDate: Math.floor(Date.now() / 1000) - 86400 * 4,
          expiryDate: Math.floor(Date.now() / 1000) + 86400 * 30,
          status: 'Valid',
          batchId: 1
        },
        {
          id: 2,
          certificateType: 'Calidad',
          issuer: 'Instituto de Calidad Alimentaria',
          issuedDate: Math.floor(Date.now() / 1000) - 86400 * 3,
          expiryDate: Math.floor(Date.now() / 1000) + 86400 * 60,
          status: 'Valid',
          batchId: 1
        },
        {
          id: 3,
          certificateType: 'Origen',
          issuer: 'Consejo Regulador de Origen',
          issuedDate: Math.floor(Date.now() / 1000) - 86400 * 10,
          expiryDate: Math.floor(Date.now() / 1000) - 86400 * 1,
          status: 'Expired',
          batchId: 2
        },
        {
          id: 4,
          certificateType: 'Comercio Justo',
          issuer: 'Fair Trade International',
          issuedDate: Math.floor(Date.now() / 1000) - 86400 * 5,
          expiryDate: Math.floor(Date.now() / 1000) + 86400 * 90,
          status: 'Valid',
          batchId: 2
        }
      ])
    } catch (error) {
      console.error('Error al cargar certificados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'all') return true
    return cert.status.toLowerCase() === filter
  })

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para ver los certificados.</p>
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
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Certificados</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Gestiona y visualiza todos los certificados emitidos
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'valid', 'expired', 'revoked'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: filter === f ? '#3b82f6' : '#fff',
                  color: filter === f ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: filter === f ? '500' : '400'
                }}
              >
                {f === 'all' ? 'Todos' : f === 'valid' ? 'Válidos' : f === 'expired' ? 'Expirados' : 'Revocados'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#666' }}>Cargando certificados...</p>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📜</p>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>No hay certificados</h2>
            <p style={{ color: '#666' }}>
              {filter === 'all' 
                ? 'No hay certificados registrados en el sistema'
                : `No hay certificados ${filter === 'valid' ? 'válidos' : filter === 'expired' ? 'expirados' : 'revocados'}`
              }
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredCertificates.map(cert => (
              <div key={cert.id}>
                <CertificateCard {...cert} />
                <Link href={`/batches/${cert.batchId}`} style={{
                  display: 'block',
                  marginTop: '12px',
                  textAlign: 'center',
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Ver Lote #{cert.batchId}
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

