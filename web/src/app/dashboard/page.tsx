"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useWallet } from '../../hooks/useWallet'
import Link from 'next/link'

export default function DashboardPage() {
  const { account } = useWallet()
  const [stats, setStats] = useState({
    totalBatches: 0,
    myBatches: 0,
    pendingEvents: 0,
    validCertificates: 0
  })

  useEffect(() => {
    if (account) {
      // TODO: Cargar estadísticas desde el smart contract
      // Por ahora valores de ejemplo
      setStats({
        totalBatches: 12,
        myBatches: 5,
        pendingEvents: 3,
        validCertificates: 8
      })
    }
  }, [account])

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para acceder al dashboard.</p>
        </main>
      </>
    )
  }

  const statCards = [
    { label: 'Mis Lotes', value: stats.myBatches, color: '#3b82f6', icon: '📦', link: '/batches' },
    { label: 'Total Lotes', value: stats.totalBatches, color: '#10b981', icon: '🌾', link: '/batches' },
    { label: 'Eventos Pendientes', value: stats.pendingEvents, color: '#f59e0b', icon: '⏳', link: '/events' },
    { label: 'Certificados Válidos', value: stats.validCertificates, color: '#8b5cf6', icon: '📜', link: '/certificates' }
  ]

  const quickActions = [
    { label: 'Crear Nuevo Lote', link: '/batches/create', icon: '➕', color: '#10b981' },
    { label: 'Registrar Evento', link: '/events', icon: '📝', color: '#3b82f6' },
    { label: 'Emitir Certificado', link: '/certificates', icon: '🏆', color: '#8b5cf6' },
    { label: 'Gestionar Actores', link: '/actors', icon: '👥', color: '#f59e0b' }
  ]

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
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Dashboard</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Panel de control del sistema de trazabilidad alimentaria
          </p>
        </div>

        {/* Estadísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {statCards.map((stat, index) => (
            <Link key={index} href={stat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{stat.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: stat.color }}>
                      {stat.value}
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Acciones Rápidas */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Acciones Rápidas</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {quickActions.map((action, index) => (
              <Link key={index} href={action.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.backgroundColor = '#fff'
                }}
                >
                  <span style={{ fontSize: '24px' }}>{action.icon}</span>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Información Adicional */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>
            💡 Información del Sistema
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
            Este sistema permite rastrear productos alimentarios desde su origen hasta la exportación.
            Cada lote tiene un historial inmutable registrado en blockchain, garantizando transparencia
            y verificabilidad en toda la cadena de suministro.
          </p>
        </div>
      </main>
    </>
  )
}
