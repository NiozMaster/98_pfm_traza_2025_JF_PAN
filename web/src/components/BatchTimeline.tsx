"use client"
import React from 'react'

interface BatchEvent {
  id: number
  eventType: string
  actor: string
  location: string
  timestamp: number
  metadata?: string
}

interface BatchTimelineProps {
  events: BatchEvent[]
}

export default function BatchTimeline({ events }: BatchTimelineProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('es-ES', {
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

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Timeline del Lote</h3>
      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        {/* Línea vertical */}
        <div style={{
          position: 'absolute',
          left: '8px',
          top: '0',
          bottom: '0',
          width: '2px',
          backgroundColor: '#e5e7eb'
        }} />
        
        {events.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No hay eventos registrados aún</p>
        ) : (
          events.map((event, index) => (
            <div key={event.id} style={{ position: 'relative', marginBottom: '24px' }}>
              {/* Punto en la línea */}
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                border: '3px solid #fff',
                boxShadow: '0 0 0 2px #3b82f6'
              }} />
              
              {/* Contenido del evento */}
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                marginLeft: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{eventIcons[event.eventType] || '📌'}</span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{event.eventType}</h4>
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
                <div style={{ marginTop: '12px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Fecha y Hora</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{formatDate(event.timestamp)}</p>
                </div>
                {event.metadata && (
                  <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{event.metadata}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

