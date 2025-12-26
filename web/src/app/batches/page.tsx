"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useWallet } from '../../hooks/useWallet'
import BatchCard from '../../components/BatchCard'
import Link from 'next/link'
import { getContractReadOnly } from '../../lib/contract'
import { formatUnits } from 'ethers'

interface Batch {
  id: number
  product: string
  origin: string
  quantity: number
  status: string
  dateCreated: number
}

export default function BatchesPage() {
  const { account } = useWallet()
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRegistered, setUserRegistered] = useState(false)
  const [userApproved, setUserApproved] = useState(false)
  const [isCheckingUser, setIsCheckingUser] = useState(false)

  useEffect(() => {
    if (account) {
      checkUserStatus()
      loadBatches()
    } else {
      setBatches([])
      setIsLoading(false)
      setUserRegistered(false)
      setUserApproved(false)
    }
  }, [account])

  // Recargar cuando la página vuelve a estar visible (útil después de crear un lote o ser aprobado)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && account) {
        checkUserStatus()
        loadBatches()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [account])

  const checkUserStatus = async () => {
    if (!account) return
    
    setIsCheckingUser(true)
    try {
      const contract = await getContractReadOnly()
      
      // Verificar si el usuario está registrado
      const registered = await contract.isUserRegistered(account)
      setUserRegistered(registered)
      console.log('🔍 Verificando estado del usuario:', account)
      console.log('✅ Usuario registrado:', registered)
      
      if (registered) {
        // Verificar si el usuario está aprobado
        try {
          const userInfo = await contract.getUserInfo(account)
          console.log('📋 Información del usuario obtenida:', {
            id: userInfo.id?.toString(),
            userAddress: userInfo.userAddress,
            role: userInfo.role,
            status: userInfo.status?.toString(),
            statusType: typeof userInfo.status
          })
          
          // UserStatus: 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Canceled
          // Convertir a número para asegurar comparación correcta (puede venir como bigint)
          const statusNumber = Number(userInfo.status)
          const approved = statusNumber === 1 // 1 = Approved
          
          console.log('📊 Estado procesado:', {
            statusRaw: userInfo.status,
            statusNumber: statusNumber,
            approved: approved
          })
          
          setUserApproved(approved)
          
          if (approved) {
            console.log('✅ Usuario APROBADO - puede crear lotes')
          } else {
            console.log('⏳ Usuario NO aprobado - status:', statusNumber, '(0=Pending, 1=Approved, 2=Rejected, 3=Canceled)')
          }
        } catch (error: any) {
          console.error('❌ Error al obtener info del usuario:', error)
          console.error('Detalles del error:', {
            message: error.message,
            code: error.code,
            data: error.data
          })
          setUserApproved(false)
        }
      } else {
        setUserApproved(false)
        console.log('⚠️ Usuario no registrado')
      }
    } catch (error: any) {
      console.error('❌ Error al verificar usuario:', error)
      console.error('Detalles del error:', {
        message: error.message,
        code: error.code
      })
      setUserRegistered(false)
      setUserApproved(false)
    } finally {
      setIsCheckingUser(false)
    }
  }

  const loadBatches = async () => {
    setIsLoading(true)
    try {      
      // Obtener instancia del contrato (solo lectura)
      const contract = await getContractReadOnly()
      console.log('✅ Contrato obtenido')
      
      if (!account) {
        console.log('⚠️ No hay cuenta conectada')
        setBatches([])
        return
      }

      // Obtener todos los token IDs del usuario usando la nueva función getAllUserTokens
      // Esta función devuelve tokens con balance > 0 O tokens creados por el usuario
      let allTokenIdsArray: bigint[] = []
      try {
        console.log('🔄 Llamando getAllUserTokens...')
        allTokenIdsArray = await contract.getAllUserTokens(account)
        console.log(`✅ Total de tokens encontrados: ${allTokenIdsArray.length} para el usuario ${account}`)
      } catch (error: any) {
        console.error('❌ Error al obtener tokens del usuario:', error)
        console.error('Detalles del error:', {
          message: error.message,
          code: error.code,
          data: error.data
        })
        // Si la función no existe (contrato antiguo), intentar con getUserTokens
        if (error.message && (error.message.includes('getAllUserTokens') || error.message.includes('is not a function'))) {
          console.log('⚠️ Función getAllUserTokens no encontrada, usando getUserTokens como fallback')
          try {
            allTokenIdsArray = await contract.getUserTokens(account)
            console.log(`✅ Tokens con balance: ${allTokenIdsArray.length}`)
          } catch (fallbackError: any) {
            console.error('❌ Error al obtener tokens con balance:', fallbackError)
            console.error('Detalles del error fallback:', {
              message: fallbackError.message,
              code: fallbackError.code
            })
          }
        }
      }
      
      // Obtener detalles de cada token
      const batchPromises = allTokenIdsArray.map(async (tokenId: bigint) => {
        try {
          const token = await contract.getToken(tokenId)
          
          // Verificar el balance del usuario para este token
          let userBalance = BigInt(0)
          try {
            userBalance = await contract.getTokenBalance(tokenId, account)
            console.log(`Token ${tokenId}: balance=${userBalance.toString()}, creator=${token.creator}, account=${account}`)
          } catch (e) {
            console.warn(`No se pudo obtener balance para token ${tokenId}:`, e)
          }
          
          // Parsear features (JSON con el origen)
          let origin = 'Origen desconocido'
          try {
            if (token.features && token.features !== '') {
              const features = JSON.parse(token.features)
              origin = features.origin || origin
            }
          } catch (e) {
            // Si no es JSON válido, usar el string directamente
            origin = token.features || origin
          }
          
          // Convertir totalSupply de wei/units a kg (usamos 3 decimales)
          const quantity = parseFloat(formatUnits(token.totalSupply, 3))
          
          // Determinar status (por ahora todos son 'Created' o 'Processing')
          // En el futuro esto podría venir del contrato o de eventos
          const status = 'Processing'
          
          return {
            id: Number(tokenId),
            product: token.name,
            origin: origin,
            quantity: quantity,
            status: status,
            dateCreated: Number(token.dateCreated)
          }
        } catch (error) {
          console.error(`Error al cargar token ${tokenId}:`, error)
          return null
        }
      })
      
      const batchesData = await Promise.all(batchPromises)
      // Filtrar nulos y ordenar por fecha de creación (más recientes primero)
      const validBatches = batchesData
        .filter((batch): batch is Batch => batch !== null)
        .sort((a, b) => b.dateCreated - a.dateCreated)
      
      setBatches(validBatches)
    } catch (error: any) {
      console.error('Error al cargar lotes:', error)
      // Si hay error, mostrar array vacío en lugar de datos falsos
      setBatches([])
      
      if (error.message && error.message.includes('User not found')) {
        console.log('Usuario no registrado en el contrato')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para ver los lotes.</p>
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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Lotes</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Gestiona y visualiza todos los lotes de productos alimentarios
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => {
                checkUserStatus()
                loadBatches()
              }}
              disabled={isLoading || isCheckingUser}
              style={{
                padding: '12px 24px',
                backgroundColor: (isLoading || isCheckingUser) ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: (isLoading || isCheckingUser) ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              🔄 {(isLoading || isCheckingUser) ? 'Cargando...' : 'Recargar'}
            </button>
            <Link href="/batches/create">
              <button 
                disabled={!userApproved}
                style={{
                  padding: '12px 24px',
                  backgroundColor: userApproved ? '#10b981' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: userApproved ? 'pointer' : 'not-allowed',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  opacity: userApproved ? 1 : 0.6
                }}
              >
                ➕ Crear Nuevo Lote
              </button>
            </Link>
          </div>
        </div>

        {/* Indicador de estado del usuario */}
        {account && (
          <div style={{ marginBottom: '24px' }}>
            {isCheckingUser ? (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>⏳</span>
                <p style={{ margin: 0, color: '#0369a1', fontSize: '14px' }}>
                  Verificando estado de tu cuenta...
                </p>
              </div>
            ) : !userRegistered ? (
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>⚠️</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: '#92400e', fontSize: '14px', fontWeight: '500' }}>
                    Tu cuenta no está registrada
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: '#92400e', fontSize: '13px' }}>
                    El sistema intentará registrarte automáticamente. Si el problema persiste, contacta a un administrador.
                  </p>
                </div>
              </div>
            ) : !userApproved ? (
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span>⏳</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#92400e', fontSize: '14px', fontWeight: '500' }}>
                      Tu cuenta está pendiente de aprobación
                    </p>
                    <p style={{ margin: '4px 0 0 0', color: '#92400e', fontSize: '13px' }}>
                      Un administrador debe aprobar tu cuenta antes de que puedas crear lotes. Si ya fuiste aprobado, haz clic en "Verificar Estado" para actualizar.
                    </p>
                  </div>
                </div>
                <button
                  onClick={checkUserStatus}
                  disabled={isCheckingUser}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: isCheckingUser ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isCheckingUser ? 'Verificando...' : 'Verificar Estado'}
                </button>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#d1fae5',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>✅</span>
                <p style={{ margin: 0, color: '#065f46', fontSize: '14px', fontWeight: '500' }}>
                  Tu cuenta está aprobada. Puedes crear lotes.
                </p>
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#666' }}>Cargando lotes...</p>
          </div>
        ) : batches.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📦</p>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>No hay lotes registrados</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Comienza creando tu primer lote de producto alimentario
            </p>
            <Link href="/batches/create">
              <button style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Crear Primer Lote
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {batches.map(batch => (
              <BatchCard key={batch.id} batchId={batch.id} product={batch.product} origin={batch.origin} quantity={batch.quantity} status={batch.status} dateCreated={batch.dateCreated} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

