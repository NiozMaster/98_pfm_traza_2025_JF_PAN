"use client"
import React, { useState } from 'react'

interface CertificateFormProps {
  batchId: number
  onSubmit: (certType: string, issuer: string, docHash: string, expiryDate: number) => Promise<void>
  isLoading?: boolean
}

export default function CertificateForm({ batchId, onSubmit, isLoading = false }: CertificateFormProps) {
  const [certType, setCertType] = useState('Sanitario')
  const [issuer, setIssuer] = useState('')
  const [docHash, setDocHash] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  const certTypes = [
    'Sanitario',
    'Calidad',
    'Origen',
    'Comercio Justo',
    'Sostenibilidad',
    'Orgánico'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!issuer || !docHash || !expiryDate) {
      alert('Por favor completa todos los campos')
      return
    }
    const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000)
    if (expiryTimestamp <= Date.now() / 1000) {
      alert('La fecha de expiración debe ser futura')
      return
    }
    await onSubmit(certType, issuer, docHash, expiryTimestamp)
    setIssuer('')
    setDocHash('')
    setExpiryDate('')
    setCertType('Sanitario')
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
        Emitir Certificado - Lote #{batchId}
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Tipo de Certificado
        </label>
        <select
          value={certType}
          onChange={(e) => setCertType(e.target.value)}
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
          {certTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Emisor
        </label>
        <input
          type="text"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          placeholder="Nombre de la autoridad emisora"
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
          Hash del Documento
        </label>
        <input
          type="text"
          value={docHash}
          onChange={(e) => setDocHash(e.target.value)}
          placeholder="Hash del PDF del certificado (IPFS)"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            fontFamily: 'monospace'
          }}
          required
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Fecha de Expiración
        </label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
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
          backgroundColor: isLoading ? '#9ca3af' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Emitiendo...' : 'Emitir Certificado'}
      </button>
    </form>
  )
}

