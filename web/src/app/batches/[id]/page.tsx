"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useWallet } from '../../../hooks/useWallet'
import BatchTimeline from '../../../components/BatchTimeline'
import CertificateCard from '../../../components/CertificateCard'
import EventForm from '../../../components/EventForm'
import CertificateForm from '../../../components/CertificateForm'
import { useParams, useRouter } from 'next/navigation'

interface Batch {
  id: number
  product: string
  origin: string
  quantity: number
  status: string
  dateCreated: number
  creator: string
}

interface BatchEvent {
  id: number
  eventType: string
  actor: string
  location: string
  timestamp: number
  metadata?: string
}

interface Certificate {
  id: number
  certificateType: string
  issuer: string
  issuedDate: number
  expiryDate: number
  status: string
  batchId: number
}

export default function BatchDetailPage() {
  const { account } = useWallet()
  const params = useParams()
  const router = useRouter()
  const batchId = parseInt(params.id as string)
  
  const [batch, setBatch] = useState<Batch | null>(null)
  const [events, setEvents] = useState<BatchEvent[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'certificates' | 'add-event' | 'add-certificate'>('timeline')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (account && batchId) {
      loadBatchData()
    }
  }, [account, batchId])

  const loadBatchData = async () => {
    setIsLoading(true)
    try {
      // TODO: Cargar datos desde el smart contract
      // Datos de ejemplo
      setBatch({
        id: batchId,
        product: 'Café Arábica',
        origin: 'Finca El Roble',
        quantity: 500,
        status: 'Processing',
        dateCreated: Math.floor(Date.now() / 1000) - 86400 * 5,
        creator: account || '0x0000000000000000000000000000000000000000'
      })

      setEvents([
        {
          id: 1,
          eventType: 'Cosecha',
          actor: account || '0x0000000000000000000000000000000000000000',
          location: 'Finca El Roble',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 5,
          metadata: 'Cosecha realizada en condiciones óptimas'
        },
        {
          id: 2,
          eventType: 'Secado',
          actor: account || '0x0000000000000000000000000000000000000000',
          location: 'Planta de Secado Central',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 4,
          metadata: 'Secado al sol durante 5 días'
        },
        {
          id: 3,
          eventType: 'Transporte',
          actor: account || '0x0000000000000000000000000000000000000000',
          location: 'En tránsito a planta de procesamiento',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
        }
      ])

      setCertificates([
        {
          id: 1,
          certificateType: 'Sanitario',
          issuer: 'Autoridad Sanitaria Nacional',
          issuedDate: Math.floor(Date.now() / 1000) - 86400 * 4,
          expiryDate: Math.floor(Date.now() / 1000) + 86400 * 30,
          status: 'Valid',
          batchId: batchId
        }
      ])
    } catch (error) {
      console.error('Error al cargar lote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEventSubmit = async (eventType: string, location: string, metadata: string) => {
    setIsSubmitting(true)
    try {
      // TODO: Integrar con smart contract
      console.log('Registrando evento:', { batchId, eventType, location, metadata })
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Evento registrado exitosamente')
      setActiveTab('timeline')
      loadBatchData()
    } catch (error) {
      console.error('Error al registrar evento:', error)
      alert('Error al registrar evento')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCertificateSubmit = async (certType: string, issuer: string, docHash: string, expiryDate: number) => {
    setIsSubmitting(true)
    try {
      // TODO: Integrar con smart contract
      console.log('Emitiendo certificado:', { batchId, certType, issuer, docHash, expiryDate })
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Certificado emitido exitosamente')
      setActiveTab('certificates')
      loadBatchData()
    } catch (error) {
      console.error('Error al emitir certificado:', error)
      alert('Error al emitir certificado')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para ver los detalles del lote.</p>
        </main>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Cargando información del lote...</p>
        </main>
      </>
    )
  }

  if (!batch) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Lote no encontrado</p>
          <button onClick={() => router.push('/batches')} style={{
            marginTop: '16px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Volver a Lotes
          </button>
        </main>
      </>
    )
  }

  const statusColors: Record<string, string> = {
    'Created': '#3b82f6',
    'InTransit': '#f59e0b',
    'Processing': '#8b5cf6',
    'QualityCheck': '#10b981',
    'Exported': '#06b6d4',
    'Delivered': '#059669'
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
        {/* Header del Lote */}
        <div style={{ marginBottom: '32px' }}>
          <button 
            onClick={() => router.push('/batches')}
            style={{
              marginBottom: '16px',
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Volver a Lotes
          </button>
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{batch.product}</h1>
                <p style={{ color: '#666', fontSize: '16px', margin: '4px 0' }}>Lote #{batch.id}</p>
              </div>
              <span style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: statusColors[batch.status] || '#6b7280',
                color: 'white'
              }}>
                {batch.status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Origen</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '500' }}>{batch.origin}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Cantidad</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '500' }}>{batch.quantity} kg</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Creado</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '500' }}>
                  {new Date(batch.dateCreated * 1000).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'timeline', label: 'Timeline', icon: '📅' },
              { id: 'certificates', label: 'Certificados', icon: '📜' },
              { id: 'add-event', label: 'Registrar Evento', icon: '➕' },
              { id: 'add-certificate', label: 'Emitir Certificado', icon: '🏆' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  color: activeTab === tab.id ? '#3b82f6' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de las Tabs */}
        <div>
          {activeTab === 'timeline' && (
            <BatchTimeline events={events} />
          )}

          {activeTab === 'certificates' && (
            <div>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Certificados del Lote</h3>
              {certificates.length === 0 ? (
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No hay certificados registrados para este lote</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                  {certificates.map(cert => (
                    <CertificateCard key={cert.id} {...cert} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'add-event' && (
            <div style={{ maxWidth: '600px' }}>
              <EventForm 
                batchId={batchId} 
                onSubmit={handleEventSubmit}
                isLoading={isSubmitting}
              />
            </div>
          )}

          {activeTab === 'add-certificate' && (
            <div style={{ maxWidth: '600px' }}>
              <CertificateForm 
                batchId={batchId} 
                onSubmit={handleCertificateSubmit}
                isLoading={isSubmitting}
              />
            </div>
          )}
        </div>
      </main>
    </>
  )
}

