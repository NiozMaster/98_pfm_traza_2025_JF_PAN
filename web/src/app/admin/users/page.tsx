"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useWallet } from '../../../hooks/useWallet'

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

  useEffect(() => {
    if (account) {
      checkAdminStatus()
      loadUsers()
    }
  }, [account])

  const checkAdminStatus = async () => {
    try {
      // TODO: Llamar a isAdmin() del smart contract
      // Por ahora, verificar si es la cuenta que desplegó el contrato
      // En producción, esto debe venir del contrato
      const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // Primera cuenta de Anvil
      setIsAdmin(account?.toLowerCase() === adminAddress.toLowerCase())
    } catch (error) {
      console.error('Error al verificar admin:', error)
      setIsAdmin(false)
    }
  }

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      // TODO: Cargar usuarios desde el smart contract
      // Datos de ejemplo
      setUsers([
        {
          id: 1,
          userAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          role: 'Producer',
          status: 'Approved'
        },
        {
          id: 2,
          userAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          role: 'Processor',
          status: 'Pending'
        }
      ])
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
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
      // TODO: Llamar a registerUserByAdmin() del smart contract
      console.log('Registrando usuario:', {
        address: newUserAddress,
        role: newUserRole,
        status: 'Approved'
      })
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert('Usuario registrado exitosamente')
      setNewUserAddress('')
      setNewUserRole('Producer')
      setShowRegisterForm(false)
      loadUsers()
    } catch (error) {
      console.error('Error al registrar usuario:', error)
      alert('Error al registrar usuario')
    } finally {
      setIsRegistering(false)
    }
  }

  const handleApproveUser = async (userAddress: string) => {
    try {
      // TODO: Llamar a changeStatusUser() del smart contract
      console.log('Aprobando usuario:', userAddress)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Usuario aprobado')
      loadUsers()
    } catch (error) {
      console.error('Error al aprobar usuario:', error)
      alert('Error al aprobar usuario')
    }
  }

  const handleRejectUser = async (userAddress: string) => {
    if (!confirm('¿Estás seguro de rechazar este usuario?')) return
    
    try {
      // TODO: Llamar a changeStatusUser() del smart contract
      console.log('Rechazando usuario:', userAddress)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Usuario rechazado')
      loadUsers()
    } catch (error) {
      console.error('Error al rechazar usuario:', error)
      alert('Error al rechazar usuario')
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
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {user.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApproveUser(user.userAddress)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleRejectUser(user.userAddress)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Rechazar
                            </button>
                          </>
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

