"use client"
import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import { useWallet } from '../../../hooks/useWallet'
import BatchForm from '../../../components/BatchForm'
import { useRouter } from 'next/navigation'
import { getContract, getContractReadOnly } from '../../../lib/contract'
import { parseUnits } from 'ethers'

export default function CreateBatchPage() {
  const { account } = useWallet()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isCheckingUser, setIsCheckingUser] = useState(true)
  const [userRegistered, setUserRegistered] = useState(false)
  const [userApproved, setUserApproved] = useState(false)

  useEffect(() => {
    if (account) {
      checkUserStatus()
    } else {
      setIsCheckingUser(false)
    }
  }, [account])

  const checkUserStatus = async () => {
    setIsCheckingUser(true)
    try {
      const contract = await getContractReadOnly()
      
      // Verificar si el usuario está registrado
      const registered = await contract.isUserRegistered(account || '')
      setUserRegistered(registered)
      
      if (registered) {
        // Verificar si el usuario está aprobado
        try {
          const userInfo = await contract.getUserInfo(account || '')
          console.log('📋 Info del usuario en create page:', {
            status: userInfo.status?.toString(),
            statusType: typeof userInfo.status
          })
          // UserStatus: 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Canceled
          // Convertir a número para asegurar comparación correcta (puede venir como bigint)
          const statusNumber = Number(userInfo.status)
          const approved = statusNumber === 1 // 1 = Approved
          setUserApproved(approved)
          console.log('✅ Usuario aprobado en create page:', approved, 'Status:', statusNumber)
        } catch (error) {
          console.error('Error al obtener info del usuario:', error)
          setUserApproved(false)
        }
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error)
      setUserRegistered(false)
      setUserApproved(false)
    } finally {
      setIsCheckingUser(false)
    }
  }

  const handleCreate = async (product: string, origin: string, quantity: number) => {
    setIsCreating(true)
    try {
      // Verificar que el usuario esté registrado antes de intentar crear
      const contractReadOnly = await getContractReadOnly()
      const isRegistered = await contractReadOnly.isUserRegistered(account || '')
      
      if (!isRegistered) {
        alert('Tu cuenta no está registrada. Por favor, espera a que el sistema te registre automáticamente o contacta a un administrador.')
        setIsCreating(false)
        // Intentar registrar automáticamente
        try {
          const contractWithSigner = await getContract()
          console.log('Intentando registrar usuario automáticamente...')
          const tx = await contractWithSigner.requestUserRole('Producer')
          await tx.wait()
          console.log('Usuario registrado. Por favor, espera unos segundos e intenta de nuevo.')
          alert('Usuario registrado. Por favor, espera unos segundos e intenta crear el lote nuevamente.')
        } catch (registerError: any) {
          console.error('Error al registrar:', registerError)
          if (registerError.message && registerError.message.includes('User already requested')) {
            alert('Tu cuenta está siendo procesada. Por favor, espera unos segundos e intenta de nuevo.')
          } else {
            alert('No se pudo registrar automáticamente. Por favor, contacta a un administrador.')
          }
        }
        return
      }
      
      // Verificar que el usuario esté aprobado
      try {
        const userInfo = await contractReadOnly.getUserInfo(account || '')
        console.log('🔍 Verificando estado en handleCreate:', {
          status: userInfo.status?.toString(),
          statusType: typeof userInfo.status
        })
        
        // UserStatus: 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Canceled
        // Convertir a número para asegurar comparación correcta (puede venir como bigint)
        const statusNumber = Number(userInfo.status)
        console.log('📊 Estado procesado en handleCreate:', {
          statusRaw: userInfo.status,
          statusNumber: statusNumber,
          isApproved: statusNumber === 1
        })
        
        if (statusNumber !== 1) { // 1 = Approved
          console.log('❌ Usuario NO aprobado en handleCreate - status:', statusNumber)
          alert('Tu cuenta está pendiente de aprobación. Un administrador debe aprobar tu cuenta antes de poder crear lotes.')
          setIsCreating(false)
          return
        }
        
        console.log('✅ Usuario aprobado en handleCreate - continuando con la creación del lote')
      } catch (userInfoError: any) {
        console.error('❌ Error al verificar estado del usuario en handleCreate:', userInfoError)
        console.error('Detalles del error:', {
          message: userInfoError.message,
          code: userInfoError.code
        })
        // Continuar de todas formas, el contrato rechazará si no está aprobado
      }
      
      // Obtener instancia del contrato
      const contract = await getContract()
      
      // Convertir cantidad a wei (usando 18 decimales, pero como es kg, usaremos 0 decimales)
      // Para simplificar, multiplicamos por 1000 para tener precisión de gramos
      const quantityInUnits = parseUnits(quantity.toString(), 3) // 3 decimales para gramos
      
      // Crear features como JSON con el origen
      const features = JSON.stringify({ origin })
      
      // Llamar a createToken del smart contract
      // createToken(string memory name, uint256 totalSupply, string memory features, uint256 parentId)
      console.log('Creando token con:', { product, quantity, quantityInUnits: quantityInUnits.toString(), features, account })
      const tx = await contract.createToken(product, quantityInUnits, features, 0)
      
      console.log('Transacción enviada:', tx.hash)
      
      // Esperar confirmación de la transacción
      const receipt = await tx.wait()
      console.log('Transacción confirmada:', receipt)
      
      // Obtener el token ID del evento o del resultado
      let tokenId = null
      if (receipt.logs) {
        // Buscar el evento TokenCreated
        const event = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed && parsed.name === 'TokenCreated'
          } catch (e) {
            return false
          }
        })
        if (event) {
          try {
            const parsed = contract.interface.parseLog(event)
            tokenId = parsed?.args[0]?.toString()
            console.log('Token ID creado:', tokenId)
          } catch (e) {
            console.error('Error al parsear evento:', e)
          }
        }
      }
      
      alert(`Lote creado exitosamente en blockchain${tokenId ? ` (ID: ${tokenId})` : ''}`)
      router.push('/batches')
    } catch (error: any) {
      console.error('Error al crear lote:', error)
      let errorMessage = 'Error al crear lote'
      
      if (error.message) {
        if (error.message.includes('User not registered')) {
          errorMessage = 'Usuario no registrado. Por favor regístrate primero.'
        } else if (error.message.includes('User not approved')) {
          errorMessage = 'Usuario no aprobado. Espera la aprobación del administrador.'
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transacción rechazada por el usuario'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      alert(errorMessage)
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

  if (isCheckingUser) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>Verificando estado del usuario...</p>
        </main>
      </>
    )
  }

  // Permitir que todos los usuarios vean la página
  // El smart contract bloqueará la creación si el usuario no está aprobado

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

        {!userRegistered && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#92400e', margin: 0, fontSize: '14px' }}>
              ⚠️ Tu cuenta no está registrada. El sistema intentará registrarte automáticamente cuando conectes tu wallet.
              Si el problema persiste, contacta a un administrador.
            </p>
          </div>
        )}
        
        {userRegistered && !userApproved && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#92400e', margin: 0, fontSize: '14px' }}>
              ⚠️ Tu cuenta está pendiente de aprobación. Podrás crear lotes una vez que un administrador apruebe tu cuenta.
            </p>
          </div>
        )}

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

