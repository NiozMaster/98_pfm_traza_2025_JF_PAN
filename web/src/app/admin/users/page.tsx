"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useWallet } from '../../../hooks/useWallet'
import { getContract, getContractReadOnly } from '../../../lib/contract'

interface User {
  id: number
  userAddress: string
  role: string
  status: string
}

export default function AdminUsersPage() {
  const { account } = useWallet()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [newUserAddress, setNewUserAddress] = useState('')
  const [newUserRole, setNewUserRole] = useState('Producer')
  const [isRegistering, setIsRegistering] = useState(false)
  const [approvingUser, setApprovingUser] = useState<string | null>(null)
  const [rejectingUser, setRejectingUser] = useState<string | null>(null)

  useEffect(() => {
    if (account) {
      checkAdminStatus()
      loadUsers()
    } else {
      setUsers([])
      setIsLoading(false)
    }
  }, [account])

  // Recargar cuando la página vuelve a estar visible (útil después de transacciones)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && account && isAdmin) {
        loadUsers()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [account, isAdmin])

  const checkAdminStatus = async () => {
    try {
      if (!account) {
        setIsAdmin(false)
        return
      }
      const contract = await getContractReadOnly()
      const isAdminResult = await contract.isAdmin(account)
      setIsAdmin(isAdminResult)
    } catch (error) {
      console.error('Error al verificar admin:', error)
      // Fallback: verificar si es la cuenta que desplegó el contrato
      const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      setIsAdmin(account?.toLowerCase() === adminAddress.toLowerCase())
    }
  }

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const contract = await getContractReadOnly()
      
      console.log('Obteniendo usuarios desde el blockchain...')
      
      let usersList: any[] = []
      
      // Intentar usar getAllUsers primero, pero si falla usar método alternativo
      let useAlternativeMethod = false
      
      try {
        // Verificar si la función existe en el contrato
        if (contract.getAllUsers && typeof contract.getAllUsers === 'function') {
          try {
            // Intentar llamar con un timeout y manejo de errores silencioso
            usersList = await Promise.race([
              contract.getAllUsers(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 5000)
              )
            ]) as any[]
            console.log(`Usuarios obtenidos con getAllUsers: ${usersList.length}`)
          } catch (callError: any) {
            // Si la llamada falla (execution reverted o timeout), usar método alternativo
            // No loguear el error completo para evitar spam en Anvil
            if (callError.message && !callError.message.includes('Timeout')) {
              console.log('getAllUsers no disponible en el contrato desplegado, usando método alternativo...')
            } else {
              console.log('Timeout al llamar getAllUsers, usando método alternativo...')
            }
            useAlternativeMethod = true
          }
        } else {
          useAlternativeMethod = true
        }
      } catch (error: any) {
        // Error al verificar la función, usar método alternativo
        useAlternativeMethod = true
      }
      
      // Método alternativo: iterar sobre usuarios usando el mapping público users
      if (useAlternativeMethod) {
        console.log('Usando método alternativo para obtener usuarios (iterando sobre users mapping)...')
        
        // El mapping users es público, así que podemos acceder a users(id)
        // Primero intentar obtener nextUserId si está disponible
        let maxUsers = 1000
        try {
          const nextUserId = await contract.nextUserId()
          maxUsers = Number(nextUserId) + 10 // Agregar un buffer
          console.log(`nextUserId encontrado: ${maxUsers}`)
        } catch (e) {
          console.log('nextUserId no disponible, usando rango por defecto')
        }
        
        const foundUsers: any[] = []
        let consecutiveNotFound = 0
        const maxConsecutiveNotFound = 20 // Aumentar el umbral
        
        for (let i = 1; i <= maxUsers; i++) {
          try {
            const user = await contract.users(i)
            // Verificar si el usuario existe (id != 0)
            if (user && Number(user.id) !== 0) {
              foundUsers.push(user)
              consecutiveNotFound = 0
            } else {
              consecutiveNotFound++
              // Si encontramos muchos usuarios consecutivos que no existen, probablemente no hay más
              if (consecutiveNotFound >= maxConsecutiveNotFound) {
                console.log(`Deteniendo búsqueda después de ${maxConsecutiveNotFound} usuarios consecutivos no encontrados`)
                break
              }
            }
          } catch (e: any) {
            consecutiveNotFound++
            // Si el error es que el usuario no existe, continuar
            if (consecutiveNotFound >= maxConsecutiveNotFound) {
              break
            }
          }
        }
        
        usersList = foundUsers
        console.log(`Usuarios obtenidos con método alternativo: ${usersList.length}`)
      }
      
      if (!usersList || usersList.length === 0) {
        console.log('No se encontraron usuarios')
        setUsers([])
        return
      }
      
      // Mapear los usuarios del contrato al formato del frontend
      const mappedUsers = usersList.map((user: any) => {
        // UserStatus: 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Canceled
        const statusMap: Record<number, string> = {
          0: 'Pending',
          1: 'Approved',
          2: 'Rejected',
          3: 'Canceled'
        }
        
        const mappedUser = {
          id: Number(user.id),
          userAddress: user.userAddress,
          role: user.role,
          status: statusMap[Number(user.status)] || 'Pending'
        }
        
        console.log('Usuario mapeado:', mappedUser)
        return mappedUser
      })
      
      console.log(`Total usuarios mapeados: ${mappedUsers.length}`)
      setUsers(mappedUsers)
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error)
      console.error('Detalles del error:', {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack
      })
      
      // Si hay error, intentar mantener los usuarios actuales
      console.warn('Error al cargar usuarios')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterUser = async () => {
    if (!newUserAddress || !newUserAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Por favor ingresa una dirección válida')
      return
    }

    setIsRegistering(true)
    try {
      const contract = await getContract()
      
      // UserStatus: 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Canceled
      // Registrar con estado Approved (1)
      const statusApproved = 1
      
      // Llamar a registerUserByAdmin() del smart contract
      const tx = await contract.registerUserByAdmin(
        newUserAddress,
        newUserRole,
        statusApproved
      )
      
      // Guardar la dirección antes de limpiar
      const createdUserAddress = newUserAddress
      
      // Esperar confirmación
      const receipt = await tx.wait()
      console.log('Transacción confirmada:', receipt)
      console.log('Bloque confirmado:', receipt.blockNumber)
      
      // Esperar un momento para que el estado se propague en el blockchain
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Limpiar el formulario
      setNewUserAddress('')
      setNewUserRole('Producer')
      setShowRegisterForm(false)
      
      // Recargar usuarios para mostrar el nuevo
      console.log('Recargando lista de usuarios después de crear usuario...')
      await loadUsers()
      console.log('Lista de usuarios recargada')
      
      // Verificar que el usuario se agregó
      try {
        const contractReadOnly = await getContractReadOnly()
        const userInfo = await contractReadOnly.getUserInfo(createdUserAddress)
        console.log('Usuario verificado después de crear:', userInfo)
      } catch (e) {
        console.log('Usuario aún no visible (puede tardar un momento):', e)
      }
      
      alert('Usuario registrado exitosamente en blockchain')
    } catch (error: any) {
      console.error('Error al registrar usuario:', error)
      let errorMessage = 'Error al registrar usuario'
      
      if (error.message) {
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este usuario ya está registrado'
        } else if (error.message.includes('Only admin')) {
          errorMessage = 'Solo los administradores pueden registrar usuarios'
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transacción rechazada por el usuario'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      alert(errorMessage)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleApproveUser = async (userAddress: string) => {
    setApprovingUser(userAddress)
    try {
      const contract = await getContract()
      
      // UserStatus: 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Canceled
      const statusApproved = 1
      
      console.log(`Aprobando usuario ${userAddress}...`)
      const tx = await contract.changeStatusUser(userAddress, statusApproved)
      console.log('Transacción enviada:', tx.hash)
      
      await tx.wait()
      console.log('Usuario aprobado exitosamente')
      
      // Esperar un momento para que el estado se propague
      await new Promise(resolve => setTimeout(resolve, 500))
      
      alert('✅ Usuario aprobado exitosamente en blockchain')
      await loadUsers()
    } catch (error: any) {
      console.error('Error al aprobar usuario:', error)
      let errorMessage = 'Error al aprobar usuario'
      
      if (error.message) {
        if (error.message.includes('Only admin')) {
          errorMessage = 'Solo los administradores pueden aprobar usuarios'
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transacción rechazada por el usuario'
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Usuario no encontrado en el sistema'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      alert(errorMessage)
    } finally {
      setApprovingUser(null)
    }
  }

  const handleRejectUser = async (userAddress: string) => {
    if (!confirm('¿Estás seguro de rechazar este usuario?')) return
    
    setRejectingUser(userAddress)
    try {
      const contract = await getContract()
      
      // UserStatus: 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Canceled
      const statusRejected = 2
      
      console.log(`Rechazando usuario ${userAddress}...`)
      const tx = await contract.changeStatusUser(userAddress, statusRejected)
      console.log('Transacción enviada:', tx.hash)
      
      await tx.wait()
      console.log('Usuario rechazado exitosamente')
      
      // Esperar un momento para que el estado se propague
      await new Promise(resolve => setTimeout(resolve, 500))
      
      alert('❌ Usuario rechazado exitosamente en blockchain')
      await loadUsers()
    } catch (error: any) {
      console.error('Error al rechazar usuario:', error)
      let errorMessage = 'Error al rechazar usuario'
      
      if (error.message) {
        if (error.message.includes('Only admin')) {
          errorMessage = 'Solo los administradores pueden rechazar usuarios'
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transacción rechazada por el usuario'
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Usuario no encontrado en el sistema'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      alert(errorMessage)
    } finally {
      setRejectingUser(null)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const statusColors: Record<string, string> = {
    'Pending': '#f59e0b',
    'Approved': '#10b981',
    'Rejected': '#ef4444',
    'Canceled': '#6b7280'
  }

  const roleLabels: Record<string, string> = {
    'Producer': 'Productor',
    'Processor': 'Procesador',
    'Transporter': 'Transportista',
    'Exporter': 'Exportador',
    'Authority': 'Autoridad',
    'Admin': 'Administrador'
  }

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para acceder al panel de administración.</p>
        </main>
      </>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: '#991b1b', marginTop: 0 }}>Acceso Denegado</h2>
            <p style={{ color: '#991b1b' }}>
              Solo los administradores pueden acceder a esta página.
            </p>
          </div>
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
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Gestión de Usuarios</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Administra usuarios y roles del sistema
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={loadUsers}
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              🔄 {isLoading ? 'Cargando...' : 'Recargar'}
            </button>
            <button
              onClick={() => setShowRegisterForm(!showRegisterForm)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {showRegisterForm ? '✕ Cancelar' : '➕ Registrar Nuevo Usuario'}
            </button>
          </div>
        </div>

        {showRegisterForm && (
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
              Registrar Nuevo Usuario
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Dirección de Wallet
              </label>
              <input
                type="text"
                value={newUserAddress}
                onChange={(e) => setNewUserAddress(e.target.value)}
                placeholder="0x..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Rol
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: '#fff'
                }}
              >
                <option value="Producer">Productor</option>
                <option value="Processor">Procesador</option>
                <option value="Transporter">Transportista</option>
                <option value="Exporter">Exportador</option>
                <option value="Authority">Autoridad</option>
                <option value="Admin">Administrador</option>
              </select>
            </div>

            <button
              onClick={handleRegisterUser}
              disabled={isRegistering}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isRegistering ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isRegistering ? 'not-allowed' : 'pointer'
              }}
            >
              {isRegistering ? 'Registrando...' : 'Registrar Usuario'}
            </button>
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#666' }}>Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>👥</p>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>No hay usuarios registrados</h2>
            <p style={{ color: '#666' }}>
              Comienza registrando el primer usuario
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Dirección</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Rol</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Estado</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{user.id}</td>
                    <td style={{ padding: '12px', fontSize: '14px', fontFamily: 'monospace' }}>
                      {formatAddress(user.userAddress)}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {roleLabels[user.role] || user.role}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: statusColors[user.status] || '#6b7280',
                        color: 'white'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {user.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApproveUser(user.userAddress)}
                              disabled={approvingUser === user.userAddress || rejectingUser === user.userAddress}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: approvingUser === user.userAddress ? '#9ca3af' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: approvingUser === user.userAddress ? 'not-allowed' : 'pointer',
                                opacity: approvingUser === user.userAddress ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              {approvingUser === user.userAddress ? (
                                <>⏳ Aprobando...</>
                              ) : (
                                <>✅ Aprobar</>
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectUser(user.userAddress)}
                              disabled={rejectingUser === user.userAddress || approvingUser === user.userAddress}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: rejectingUser === user.userAddress ? '#9ca3af' : '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: rejectingUser === user.userAddress ? 'not-allowed' : 'pointer',
                                opacity: rejectingUser === user.userAddress ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              {rejectingUser === user.userAddress ? (
                                <>⏳ Rechazando...</>
                              ) : (
                                <>❌ Rechazar</>
                              )}
                            </button>
                          </>
                        )}
                        {user.status === 'Approved' && (
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#10b981',
                            fontStyle: 'italic'
                          }}>
                            ✓ Aprobado
                          </span>
                        )}
                        {user.status === 'Rejected' && (
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#ef4444',
                            fontStyle: 'italic'
                          }}>
                            ✗ Rechazado
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  )
}

