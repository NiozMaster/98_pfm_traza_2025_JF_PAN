"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useWallet } from '../../hooks/useWallet'
import Link from 'next/link'

interface BatchEvent {
  id: number
  batchId: number
  eventType: string
  actor: string
  location: string
  timestamp: number
  metadata?: string
}

export default function EventsPage() {
  const { account } = useWallet()
  const [events, setEvents] = useState<BatchEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (account) {
      loadEvents()
    }
  }, [account])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      // TODO: Cargar eventos desde el smart contract
      // Datos de ejemplo
      setEvents([
        {
          id: 1,
          batchId: 1,
          eventType: 'Cosecha',
          actor: account || '0x0000000000000000000000000000000000000000',
          location: 'Finca El Roble',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 5,
          metadata: 'Cosecha realizada en condiciones óptimas'
        },
        {
          id: 2,
          batchId: 1,
          eventType: 'Secado',
          actor: account || '0x0000000000000000000000000000000000000000',
          location: 'Planta de Secado Central',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 4,
          metadata: 'Secado al sol durante 5 días'
        },
        {
          id: 3,
          batchId: 2,
          eventType: 'Transporte',
          actor: account || '0x0000000000000000000000000000000000000000',
          location: 'En tránsito a planta de procesamiento',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
        },
        {
          id: 4,
          batchId: 2,
          eventType: 'Procesamiento',
          actor: account || '0x0000000000000000000000000000000000000000',
          location: 'Planta de Procesamiento',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 1,
        }
      ])
    } catch (error) {
      console.error('Error al cargar eventos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const eventIcons: Record<string, string> = {
    'Cosecha': '🌾',
    'Secado': '☀️',
    'Tostado': '🔥',
    'Transporte': '🚚',
    'Almacenamiento': '📦',
    'Procesamiento': '⚙️',
    'Empaquetado': '📋',
    'Exportación': '✈️',
    'Entrega': '✅',
    'Control de Calidad': '🔍'
  }

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para ver los eventos.</p>
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
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Eventos</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Historial completo de eventos registrados en la cadena de suministro
          </p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#666' }}>Cargando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📅</p>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>No hay eventos registrados</h2>
            <p style={{ color: '#666' }}>
              Los eventos aparecerán aquí cuando se registren en los lotes
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map(event => (
              <div key={event.id} style={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                alignItems: 'start',
                gap: '20px'
              }}>
                <div style={{ fontSize: '32px' }}>{eventIcons[event.eventType] || '📌'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{event.eventType}</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                        Lote #{event.batchId} • {formatDate(event.timestamp)}
                      </p>
                    </div>
                    <Link href={`/batches/${event.batchId}`} style={{
                      padding: '6px 12px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      Ver Lote
                    </Link>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Ubicación</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>{event.location}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Actor</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontFamily: 'monospace' }}>
                        {formatAddress(event.actor)}
                      </p>
                    </div>
                  </div>
                  {event.metadata && (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{event.metadata}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

