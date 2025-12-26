"use client"
import React, { useState, useEffect } from 'react'

interface AnvilAccount {
  index: number
  address: string
  privateKey: string
  balance: string
}

export default function AnvilAccountsHelper() {
  const [accounts, setAccounts] = useState<AnvilAccount[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)
  const [hasMetaMask, setHasMetaMask] = useState(false)

  useEffect(() => {
    // Cargar cuentas inmediatamente
    loadAnvilAccounts()
    
    // Verificar si MetaMask está disponible
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setHasMetaMask(true)
      checkNetwork()
      
      // Listener para cambios de red
      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16)
        setChainId(newChainId)
        if (newChainId === 31337) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }

      // Listener para cuando se conecta MetaMask
      const handleAccountsChanged = () => {
        checkNetwork()
      }

      ;(window as any).ethereum.on('chainChanged', handleChainChanged)
      ;(window as any).ethereum.on('accountsChanged', handleAccountsChanged)

      // Mostrar el panel por defecto en desarrollo (asumiendo que están usando Anvil)
      // También verificar cada 2 segundos si están en Anvil
      const interval = setInterval(() => {
        checkNetwork()
      }, 2000)

      // Mostrar inmediatamente si estamos en desarrollo
      setIsVisible(true)

      return () => {
        if ((window as any).ethereum) {
          ;(window as any).ethereum.removeListener('chainChanged', handleChainChanged)
          ;(window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
        clearInterval(interval)
      }
    } else {
      // Si no hay MetaMask, mostrar el panel de todas formas en desarrollo
      setIsVisible(true)
    }
  }, [])

  const checkNetwork = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      // Si no hay MetaMask, asumimos que estamos en desarrollo y mostramos el panel
      setIsVisible(true)
      return
    }

    try {
      const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)
      setChainId(chainId)

      // Si estamos en Anvil (Chain ID 31337), mostrar las cuentas
      if (chainId === 31337) {
        setIsVisible(true)
      } else {
        // También mostrar si no hay red conectada (modo desarrollo)
        setIsVisible(true)
      }
    } catch (error) {
      console.error('Error checking network:', error)
      // En caso de error, mostrar el panel de todas formas
      setIsVisible(true)
    }
  }

  const loadAnvilAccounts = () => {
    // Cuentas estándar de Anvil (las primeras 10)
    const anvilAccounts: AnvilAccount[] = [
      {
        index: 0,
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        balance: '10000 ETH'
      },
      {
        index: 1,
        address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        balance: '10000 ETH'
      },
      {
        index: 2,
        address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        balance: '10000 ETH'
      },
      {
        index: 3,
        address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
        balance: '10000 ETH'
      },
      {
        index: 4,
        address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
        privateKey: '0x47e179ec197488593b187f80a00eb1da4f19f4612328c6ac7ec3a6a77181d92b',
        balance: '10000 ETH'
      },
      {
        index: 5,
        address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        privateKey: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b7e21f8419744f8e8dbff9',
        balance: '10000 ETH'
      },
      {
        index: 6,
        address: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
        privateKey: '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
        balance: '10000 ETH'
      },
      {
        index: 7,
        address: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
        privateKey: '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356',
        balance: '10000 ETH'
      },
      {
        index: 8,
        address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
        privateKey: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
        balance: '10000 ETH'
      },
      {
        index: 9,
        address: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
        privateKey: '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
        balance: '10000 ETH'
      }
    ]

    setAccounts(anvilAccounts)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    alert(`${type} copiado al portapapeles`)
  }

  const importToMetaMask = async (privateKey: string) => {
    try {
      // Copiar la private key al portapapeles
      await navigator.clipboard.writeText(privateKey)
      
      // Mostrar instrucciones
      const message = `Private key copiada al portapapeles.\n\n` +
        `Para importar esta cuenta en MetaMask:\n\n` +
        `1. Abre MetaMask\n` +
        `2. Haz clic en el icono de cuenta (arriba a la derecha)\n` +
        `3. Selecciona "Importar cuenta" o "Import Account"\n` +
        `4. Pega la private key (ya está en tu portapapeles)\n` +
        `5. Haz clic en "Importar"\n\n` +
        `Después de importar, vuelve a hacer clic en "Conectar Wallet" para ver todas tus cuentas.`
      
      alert(message)
      
      // Si hay MetaMask disponible, intentar refrescar después de un momento
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Esperar un poco para que el usuario importe la cuenta
        setTimeout(() => {
          // Disparar un evento para que el sistema detecte las nuevas cuentas
          if ((window as any).ethereum) {
            (window as any).ethereum.request({ method: 'eth_requestAccounts' })
              .then(() => {
                console.log('Cuentas actualizadas después de importar')
              })
              .catch(() => {
                // Ignorar errores silenciosamente
              })
          }
        }, 3000)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al copiar la private key. Por favor cópiala manualmente.')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Si está minimizado, mostrar solo un botón flotante
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Mostrar cuentas de Anvil"
      >
        🔧
      </button>
    )
  }

  if (!isVisible) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '600px',
      backgroundColor: '#fff',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      zIndex: 1000,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
            🔧 Cuentas de Anvil
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
            {chainId === 31337 
              ? 'Red Local (Chain ID: 31337)' 
              : hasMetaMask 
                ? `Red Actual (Chain ID: ${chainId || 'N/A'})` 
                : 'Modo Desarrollo - Cuentas de Anvil'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Minimizar"
          >
            −
          </button>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            title="Cerrar"
          >
            ×
          </button>
        </div>
      </div>

      <div style={{
        padding: '16px',
        overflowY: 'auto',
        maxHeight: '500px'
      }}>
        <p style={{ 
          margin: '0 0 12px 0', 
          fontSize: '12px', 
          color: '#666',
          lineHeight: '1.5'
        }}>
          Estas son las cuentas predeterminadas de Anvil. Cada una tiene 10,000 ETH.
          {hasMetaMask 
            ? ' Puedes importarlas en MetaMask usando sus private keys.'
            : ' Instala MetaMask y conéctate a la red de Anvil para importarlas.'}
        </p>
        
        {chainId !== 31337 && hasMetaMask && (
          <div style={{
            marginBottom: '12px',
            padding: '12px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#92400e'
          }}>
            ⚠️ <strong>No estás en la red de Anvil.</strong> Cambia a Chain ID 31337 para usar estas cuentas.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {accounts.map((account) => (
            <div
              key={account.index}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#f9fafb'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#111',
                    marginBottom: '4px'
                  }}>
                    Cuenta #{account.index}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#666'
                  }}>
                    {formatAddress(account.address)}
                  </div>
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#10b981'
                }}>
                  {account.balance}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '6px',
                marginTop: '8px'
              }}>
                <button
                  onClick={() => copyToClipboard(account.address, 'Dirección')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    fontSize: '11px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  📋 Copiar Address
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(account.privateKey, 'Private Key')
                    importToMetaMask(account.privateKey)
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    fontSize: '11px',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  🔑 Importar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        fontSize: '11px',
        color: '#666'
      }}>
        💡 <strong>Tip:</strong> Haz clic en "Importar" para copiar la private key e importar la cuenta en MetaMask
      </div>
    </div>
  )
}

