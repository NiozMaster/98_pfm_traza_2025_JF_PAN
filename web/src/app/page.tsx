"use client"
import React, { useState } from 'react'
import Header from '../components/Header'
import { useWallet } from '../hooks/useWallet'
import ActorForm from '../components/ActorForm'

export default function Page() {
  const { account, connect } = useWallet()
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = async (name: string, role: string, location: string) => {
    setIsRegistering(true)
    try {
      // TODO: Integrar con smart contract
      console.log('Registrando actor:', { name, role, location })
      alert('Actor registrado exitosamente. Esperando aprobación del administrador.')
    } catch (error) {
      console.error('Error al registrar:', error)
      alert('Error al registrar actor')
    } finally {
      setIsRegistering(false)
    }
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
        {!account ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#111' }}>
              🌾 Sistema de Trazabilidad Alimentaria
            </h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              Plataforma blockchain para rastrear productos alimentarios desde el origen hasta la exportación.
              Garantiza transparencia, integridad y verificabilidad en toda la cadena de suministro.
            </p>
            <button
              onClick={() => connect()}
              style={{
                padding: '14px 28px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              Conectar MetaMask
            </button>
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              maxWidth: '600px',
              margin: '24px auto 0'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#0369a1', lineHeight: '1.6' }}>
                <strong>💡 Para desarrollo local:</strong><br />
                Si estás usando Anvil, verás un panel en la esquina inferior derecha con todas las cuentas disponibles.
                Puedes importarlas directamente en MetaMask haciendo clic en "Importar".
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Bienvenido</h1>
              <p style={{ color: '#666', fontSize: '16px' }}>
                Conectado como: <code style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}>{account}</code>
              </p>
            </div>

            <div style={{ 
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '32px'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>
                📝 Registro de Actor
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Para comenzar a usar el sistema, primero debes registrarte como actor en la cadena de suministro.
                Selecciona tu rol y completa el formulario. Un administrador revisará tu solicitud.
              </p>
            </div>

            <ActorForm onSubmit={handleRegister} isLoading={isRegistering} />
          </div>
        )}
      </main>
    </>
  )
}
