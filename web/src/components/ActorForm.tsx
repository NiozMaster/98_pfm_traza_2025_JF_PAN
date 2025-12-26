"use client"
import React, { useState } from 'react'

interface ActorFormProps {
  onSubmit: (name: string, role: string, location: string) => Promise<void>
  isLoading?: boolean
}

export default function ActorForm({ onSubmit, isLoading = false }: ActorFormProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Producer')
  const [location, setLocation] = useState('')

  const roles = [
    { value: 'Producer', label: 'Productor' },
    { value: 'Processor', label: 'Procesador' },
    { value: 'Transporter', label: 'Transportista' },
    { value: 'Exporter', label: 'Exportador' },
    { value: 'Authority', label: 'Autoridad' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !location) {
      alert('Por favor completa todos los campos')
      return
    }
    await onSubmit(name, role, location)
    setName('')
    setLocation('')
    setRole('Producer')
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
        Registrar Nuevo Actor
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del actor"
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

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Rol
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
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
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Ubicación
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ciudad, País"
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
        {isLoading ? 'Registrando...' : 'Registrar Actor'}
      </button>
    </form>
  )
}

