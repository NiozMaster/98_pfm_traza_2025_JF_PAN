"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useWallet } from '../../hooks/useWallet'
import ActorForm from '../../components/ActorForm'

interface Actor {
  address: string
  name: string
  role: string
  location: string
  isActive: boolean
}

export default function ActorsPage() {
  const { account } = useWallet()
  const [actors, setActors] = useState<Actor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (account) {
      loadActors()
      checkAdmin()
    }
  }, [account])

  const loadActors = async () => {
    setIsLoading(true)
    try {
      // TODO: Cargar actores desde el smart contract
      // Datos de ejemplo
      setActors([
        {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
          name: 'Finca El Roble',
          role: 'Producer',
          location: 'Colombia',
          isActive: true
        },
        {
          address: '0x8ba1f109551bD432803012645Hac136c22C9',
          name: 'Procesadora Central',
          role: 'Processor',
          location: 'Bogotá, Colombia',
          isActive: true
        },
        {
          address: '0x1234567890123456789012345678901234567890',
          name: 'Transportes Rápidos',
          role: 'Transporter',
          location: 'Colombia',
          isActive: true
        }
      ])
    } catch (error) {
      console.error('Error al cargar actores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkAdmin = async () => {
    // TODO: Verificar si el usuario es admin desde el smart contract
    setIsAdmin(false) // Por ahora false
  }

  const handleRegister = async (name: string, role: string, location: string) => {
    setIsRegistering(true)
    try {
      // TODO: Integrar con smart contract
      console.log('Registrando actor:', { name, role, location })
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Actor registrado exitosamente')
      loadActors()
    } catch (error) {
      console.error('Error al registrar actor:', error)
      alert('Error al registrar actor')
    } finally {
      setIsRegistering(false)
    }
  }

  const handleDeactivate = async (address: string) => {
    if (!confirm('¿Estás seguro de desactivar este actor?')) return
    try {
      // TODO: Integrar con smart contract (solo admin)
      console.log('Desactivando actor:', address)
      alert('Actor desactivado')
      loadActors()
    } catch (error) {
      console.error('Error al desactivar actor:', error)
      alert('Error al desactivar actor')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const roleLabels: Record<string, string> = {
    'Producer': 'Productor',
    'Processor': 'Procesador',
    'Transporter': 'Transportista',
    'Exporter': 'Exportador',
    'Authority': 'Autoridad'
  }

  const roleColors: Record<string, string> = {
    'Producer': '#10b981',
    'Processor': '#3b82f6',
    'Transporter': '#f59e0b',
    'Exporter': '#8b5cf6',
    'Authority': '#ef4444'
  }

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para ver los actores.</p>
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
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Actores</h1>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px' }}>
              Gestiona los actores registrados en el sistema de trazabilidad
            </p>
          </div>
          <div>
            <ActorForm onSubmit={handleRegister} isLoading={isRegistering} />
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#666' }}>Cargando actores...</p>
          </div>
        ) : actors.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>👥</p>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>No hay actores registrados</h2>
            <p style={{ color: '#666' }}>
              Comienza registrando el primer actor en el sistema
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {actors.map(actor => (
              <div key={actor.address} style={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{actor.name}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontFamily: 'monospace', color: '#666' }}>
                      {formatAddress(actor.address)}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: roleColors[actor.role] || '#6b7280',
                    color: 'white'
                  }}>
                    {roleLabels[actor.role] || actor.role}
                  </span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Ubicación</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>{actor.location}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: actor.isActive ? '#d1fae5' : '#fee2e2',
                    color: actor.isActive ? '#065f46' : '#991b1b'
                  }}>
                    {actor.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeactivate(actor.address)}
                      disabled={!actor.isActive}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: actor.isActive ? '#ef4444' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: actor.isActive ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Desactivar
                    </button>
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

