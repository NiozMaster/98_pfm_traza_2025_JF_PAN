"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import AnvilAccountsHelper from '../components/AnvilAccountsHelper'
import { getContract, getContractReadOnly } from '../lib/contract'

type Web3State = {
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshAccounts: () => Promise<void>;
}

const Web3Context = createContext<Web3State | undefined>(undefined)

// Función auxiliar para obtener todas las cuentas disponibles
const getAllAccounts = async (): Promise<string[]> => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return []
  }

  try {
    // Primero solicitar acceso (esto actualiza la lista si hay nuevas cuentas)
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
    
    // Luego obtener todas las cuentas
    const accounts = await (window as any).ethereum.request({ 
      method: 'eth_accounts' 
    })

    return accounts || []
  } catch (error) {
    console.error('Error obteniendo cuentas:', error)
    return []
  }
}

// Componente Modal para seleccionar cuenta
function AccountSelectorModal({ 
  accounts, 
  onSelect, 
  onClose,
  onRefresh
}: { 
  accounts: string[]; 
  onSelect: (account: string) => void; 
  onClose: () => void;
  onRefresh?: () => Promise<void>;
}) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Seleccionar Cuenta
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {onRefresh && (
              <button
                onClick={async () => {
                  if (onRefresh) {
                    await onRefresh()
                    // Recargar la página para actualizar la lista
                    window.location.reload()
                  }
                }}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Actualizar lista de cuentas (útil después de importar nuevas cuentas)"
              >
                🔄 Actualizar
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
        
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#666', 
          fontSize: '14px' 
        }}>
          Selecciona la cuenta de MetaMask que deseas usar:
          {accounts.length > 0 && (
            <span style={{ 
              display: 'block', 
              marginTop: '8px', 
              fontSize: '12px', 
              color: '#9ca3af',
              fontStyle: 'italic'
            }}>
              {accounts.length} cuenta{accounts.length !== 1 ? 's' : ''} disponible{accounts.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {accounts.map((acc, index) => (
            <button
              key={acc}
              onClick={() => onSelect(acc)}
              style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6'
                e.currentTarget.style.backgroundColor = '#f0f9ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.backgroundColor = '#fff'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  {formatAddress(acc)}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666' 
                }}>
                  Cuenta {index + 1}
                </div>
              </div>
              <div style={{ color: '#3b82f6', fontSize: '20px' }}>→</div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '10px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#666'
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [showAccountSelector, setShowAccountSelector] = useState(false)
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([])

  // Función para manejar la conexión de cuenta y registro automático
  const handleAccountConnection = async (accountAddress: string) => {
    setAccount(accountAddress)
    localStorage.setItem('sc:account', accountAddress)
    
    // Verificar y registrar automáticamente al usuario si no está registrado
    try {
      const contract = await getContractReadOnly()
      let isRegistered = false
      
      try {
        isRegistered = await contract.isUserRegistered(accountAddress)
      } catch (checkError: any) {
        console.error('Error al verificar registro:', checkError)
        // Si falla la verificación, asumir que no está registrado e intentar registrar
        isRegistered = false
      }
      
      if (!isRegistered) {
        // Usuario no registrado, registrarlo automáticamente
        console.log('Usuario no registrado, registrando automáticamente...')
        try {
          const contractWithSigner = await getContract()
          // Registrar con rol "Producer" por defecto
          // El usuario puede cambiar su rol más tarde si es necesario
          const tx = await contractWithSigner.requestUserRole('Producer')
          console.log('Transacción de registro enviada:', tx.hash)
          const receipt = await tx.wait()
          console.log('Usuario registrado automáticamente con rol Producer. Receipt:', receipt)
          
          // Verificar que el registro fue exitoso
          await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar propagación
          const verifyRegistered = await contract.isUserRegistered(accountAddress)
          if (verifyRegistered) {
            console.log('✅ Registro verificado exitosamente')
          } else {
            console.warn('⚠️ Registro completado pero verificación falló. Puede necesitar esperar.')
          }
        } catch (registerError: any) {
          // Si el error es que ya está registrado, verificar de nuevo
          if (registerError.message && registerError.message.includes('User already requested')) {
            console.log('Usuario ya estaba registrado')
            // Verificar de nuevo para estar seguros
            try {
              const verifyRegistered = await contract.isUserRegistered(accountAddress)
              if (verifyRegistered) {
                console.log('✅ Usuario confirmado como registrado')
              }
            } catch (e) {
              console.error('Error al verificar después de "already requested":', e)
            }
          } else {
            console.error('❌ Error al registrar usuario automáticamente:', registerError)
            console.error('Detalles del error:', {
              message: registerError.message,
              code: registerError.code,
              data: registerError.data
            })
            // Mostrar un mensaje más visible al usuario
            if (registerError.message && !registerError.message.includes('user rejected')) {
              console.warn('⚠️ No se pudo registrar automáticamente. El usuario necesitará ser registrado por un administrador.')
            }
          }
        }
      } else {
        console.log('✅ Usuario ya está registrado')
      }
    } catch (error: any) {
      console.error('❌ Error al verificar registro de usuario:', error)
      console.error('Detalles:', {
        message: error.message,
        code: error.code
      })
      // No bloquear la conexión si hay error, solo loguear
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sc:account')
      if (stored) {
        // Verificar y registrar automáticamente si hay cuenta guardada
        handleAccountConnection(stored).catch(error => {
          console.error('Error al verificar cuenta guardada:', error)
        })
      }
      
      if ((window as any).ethereum) {
        // Listener para cambios de cuentas (cuando se importan nuevas o se cambian)
        const handleAccountsChanged = async (accounts: string[]) => {
          if (accounts.length === 0) {
            setAccount(null)
            localStorage.removeItem('sc:account')
            setShowAccountSelector(false)
            setAvailableAccounts([])
          } else {
            // Si hay cuentas, obtener todas las disponibles
            const allAccounts = await getAllAccounts()
            if (allAccounts.length > 0) {
              await handleAccountConnection(allAccounts[0])
              // Si hay múltiples cuentas, actualizar la lista del selector
              if (allAccounts.length > 1) {
                setAvailableAccounts(allAccounts)
              }
            }
          }
        }

        ;(window as any).ethereum.on('accountsChanged', handleAccountsChanged)

        // También escuchar cambios de red
        const handleChainChanged = () => {
          // Recargar cuentas cuando cambia la red
          getAllAccounts().then(accounts => {
            if (accounts.length > 0) {
              setAvailableAccounts(accounts)
            }
          })
        }

        ;(window as any).ethereum.on('chainChanged', handleChainChanged)

        return () => {
          if ((window as any).ethereum) {
            ;(window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged)
            ;(window as any).ethereum.removeListener('chainChanged', handleChainChanged)
          }
        }
      }
    }
  }, [])

  const refreshAccounts = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      return
    }

    try {
      const accounts = await getAllAccounts()
      if (accounts.length > 1) {
        setAvailableAccounts(accounts)
      }
    } catch (error) {
      console.error('Error refrescando cuentas:', error)
    }
  }

  async function connect() {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('MetaMask no encontrado. Por favor instala MetaMask.')
      return
    }
    
    try {
      // Verificar la red actual
      const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)

      // Si estamos en Anvil (Chain ID 31337), sugerir agregar la red si no está configurada
      if (chainId !== 31337) {
        const switchToAnvil = confirm(
          'No estás conectado a la red de Anvil (Chain ID: 31337).\n\n' +
          '¿Deseas cambiar a la red de Anvil?\n\n' +
          'Si no tienes la red configurada, agrega:\n' +
          '- Network Name: Anvil Local\n' +
          '- RPC URL: http://localhost:8545\n' +
          '- Chain ID: 31337\n' +
          '- Currency Symbol: ETH'
        )

        if (switchToAnvil) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7A69', // 31337 en hexadecimal
                chainName: 'Anvil Local',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['http://localhost:8545']
              }]
            })
          } catch (addError) {
            console.error('Error al agregar red:', addError)
            alert('No se pudo agregar la red de Anvil. Por favor agrégalo manualmente en MetaMask.')
          }
        }
      }

      // Obtener todas las cuentas disponibles (esto también solicita acceso)
      const accounts = await getAllAccounts()

      if (accounts.length === 0) {
        alert('No se encontraron cuentas en MetaMask.\n\n' +
              '💡 Tip: Importa las cuentas de Anvil usando el panel que aparece en la esquina inferior derecha.\n\n' +
              'Después de importar, vuelve a hacer clic en "Conectar Wallet".')
        return
      }

      // Si solo hay una cuenta, conectar directamente
      if (accounts.length === 1) {
        await handleAccountConnection(accounts[0])
        return
      }

      // Si hay múltiples cuentas, mostrar selector con todas las cuentas
      setAvailableAccounts(accounts)
      setShowAccountSelector(true)
    } catch (e: any) {
      console.error('Error al conectar:', e)
      if (e.code === 4001) {
        alert('Conexión rechazada por el usuario')
      } else {
        alert('Error al conectar con MetaMask: ' + (e.message || 'Error desconocido'))
      }
    }
  }

  async function handleAccountSelect(selectedAccount: string) {
    await handleAccountConnection(selectedAccount)
    setShowAccountSelector(false)
    setAvailableAccounts([])
  }

  function disconnect() {
    setAccount(null)
    localStorage.removeItem('sc:account')
    // Limpiar también el selector si está abierto
    setShowAccountSelector(false)
    setAvailableAccounts([])
  }

  return (
    <Web3Context.Provider value={{ account, connect, disconnect, refreshAccounts }}>
      {children}
      {showAccountSelector && (
        <AccountSelectorModal
          accounts={availableAccounts}
          onSelect={handleAccountSelect}
          onClose={async () => {
            setShowAccountSelector(false)
            setAvailableAccounts([])
          }}
          onRefresh={refreshAccounts}
        />
      )}
      <AnvilAccountsHelper />
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const ctx = useContext(Web3Context)
  if (!ctx) throw new Error('useWeb3 must be used within Web3Provider')
  return ctx
}
