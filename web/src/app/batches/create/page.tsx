"use client"
import React, { useState } from 'react'
import Header from '../../../components/Header'
import { useWallet } from '../../../hooks/useWallet'
import BatchForm from '../../../components/BatchForm'
import { useRouter } from 'next/navigation'

export default function CreateBatchPage() {
  const { account } = useWallet()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async (product: string, origin: string, quantity: number) => {
    setIsCreating(true)
    try {
      // TODO: Integrar con smart contract
      console.log('Creando lote:', { product, origin, quantity })
      
      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Lote creado exitosamente')
      router.push('/batches')
    } catch (error) {
      console.error('Error al crear lote:', error)
      alert('Error al crear lote')
    } finally {
      setIsCreating(false)
    }
  }

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para crear un lote.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main style={{ 
        padding: '40px 24px',
        maxWidth: '800px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Crear Nuevo Lote</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Registra un nuevo lote de producto alimentario en el sistema de trazabilidad
          </p>
        </div>

        <BatchForm onSubmit={handleCreate} isLoading={isCreating} />

        <div style={{
          marginTop: '32px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>
            ℹ️ Información
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px', lineHeight: '1.8' }}>
            <li>El lote será registrado en blockchain de forma inmutable</li>
            <li>Una vez creado, podrás registrar eventos y certificados</li>
            <li>El identificador del lote se generará automáticamente</li>
            <li>Solo actores con rol de Productor pueden crear lotes</li>
          </ul>
        </div>
      </main>
    </>
  )
}

