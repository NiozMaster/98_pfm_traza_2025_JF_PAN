"use client"
import React, { useState } from 'react'

interface EventFormProps {
  batchId: number
  onSubmit: (eventType: string, location: string, metadata: string) => Promise<void>
  isLoading?: boolean
}

export default function EventForm({ batchId, onSubmit, isLoading = false }: EventFormProps) {
  const [eventType, setEventType] = useState('Cosecha')
  const [location, setLocation] = useState('')
  const [metadata, setMetadata] = useState('')

  const eventTypes = [
    'Cosecha',
    'Secado',
    'Tostado',
    'Transporte',
    'Almacenamiento',
    'Procesamiento',
    'Empaquetado',
    'Control de Calidad',
    'Exportación',
    'Entrega'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location) {
      alert('Por favor completa todos los campos requeridos')
      return
    }
    await onSubmit(eventType, location, metadata)
    setLocation('')
    setMetadata('')
    setEventType('Cosecha')
  }

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px',
      maxWidth: '500px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
        Registrar Evento - Lote #{batchId}
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Tipo de Evento
        </label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            backgroundColor: '#fff'
          }}
          required
        >
          {eventTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Ubicación
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ej: Finca El Roble, Almacén Central"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
          required
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Metadatos (Opcional)
        </label>
        <textarea
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          placeholder="Información adicional en formato JSON o texto libre"
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Registrando...' : 'Registrar Evento'}
      </button>
    </form>
  )
}

