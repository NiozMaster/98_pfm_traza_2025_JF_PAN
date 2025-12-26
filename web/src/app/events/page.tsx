"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useWallet } from '../../hooks/useWallet'
import Link from 'next/link'
import { getContractReadOnly } from '../../lib/contract'
import { formatUnits } from 'ethers'

interface PlatformEvent {
  id: string
  eventType: string
  timestamp: number
  blockNumber: number
  transactionHash: string
  // Datos específicos según el tipo de evento
  tokenId?: number
  batchId?: number
  creator?: string
  from?: string
  to?: string
  user?: string
  role?: string
  status?: string
  amount?: number
  product?: string
  metadata?: string
}

export default function EventsPage() {
  const { account } = useWallet()
  const [events, setEvents] = useState<PlatformEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (account) {
      loadEvents()
    } else {
      setEvents([])
      setIsLoading(false)
    }
  }, [account])

  // Recargar cuando la página vuelve a estar visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && account) {
        loadEvents()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [account])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      console.log('🔄 Iniciando carga de actividades desde la blockchain...')
      
      const contract = await getContractReadOnly()
      console.log('✅ Contrato obtenido')
      
      const provider = contract.provider
      
      if (!provider) {
        throw new Error('Provider no disponible')
      }

      console.log('✅ Provider disponible')
      
      const allEvents: PlatformEvent[] = []
      
      // PRIMERO: Intentar obtener actividades desde el contrato (más eficiente)
      try {
        console.log('🔍 Intentando obtener actividades desde getAllActivities()...')
        if (contract.getAllActivities && typeof contract.getAllActivities === 'function') {
          const activities = await contract.getAllActivities()
          console.log(`✅ Actividades obtenidas desde contrato: ${activities.length}`)
          console.log('📋 Primeras actividades (raw):', activities.slice(0, 3))
          
          // Mapear actividades del contrato a eventos de la plataforma
          for (const activity of activities) {
            try {
              console.log('🔍 Procesando actividad:', {
                id: activity.id?.toString(),
                activityType: activity.activityType?.toString(),
                actor: activity.actor,
                timestamp: activity.timestamp?.toString(),
                relatedId: activity.relatedId?.toString(),
                description: activity.description
              })
              
              // ActivityType enum: 0=TokenCreated, 1=TransferRequested, 2=TransferAccepted, 
              // 3=TransferRejected, 4=UserRoleRequested, 5=UserStatusChanged, 6=UserRegisteredByAdmin
              const activityTypeNum = Number(activity.activityType)
              console.log(`  → Tipo de actividad: ${activityTypeNum}`)
              
              let eventType = 'Actividad'
              let icon = '📌'
              let color = '#6b7280'
              
              switch (activityTypeNum) {
                case 0: // TokenCreated
                  eventType = 'Lote Creado'
                  icon = '📦'
                  color = '#10b981'
                  break
                case 1: // TransferRequested
                  eventType = 'Transferencia Solicitada'
                  icon = '📤'
                  color = '#3b82f6'
                  break
                case 2: // TransferAccepted
                  eventType = 'Transferencia Aceptada'
                  icon = '✅'
                  color = '#10b981'
                  break
                case 3: // TransferRejected
                  eventType = 'Transferencia Rechazada'
                  icon = '❌'
                  color = '#ef4444'
                  break
                case 4: // UserRoleRequested
                  eventType = 'Solicitud de Registro'
                  icon = '👤'
                  color = '#f59e0b'
                  break
                case 5: // UserStatusChanged
                  eventType = 'Cambio de Estado de Usuario'
                  icon = '🔄'
                  color = '#8b5cf6'
                  break
                case 6: // UserRegisteredByAdmin
                  eventType = 'Usuario Registrado por Admin'
                  icon = '👨‍💼'
                  color = '#8b5cf6'
                  break
                case 7: // BatchEvent
                  eventType = 'Evento de Lote'
                  icon = '📝'
                  color = '#06b6d4'
                  break
              }
              
              // Obtener información adicional según el tipo de actividad
              let tokenId: number | undefined
              let batchId: number | undefined
              let product: string | undefined
              let amount: number | undefined
              
              if (activityTypeNum === 0 && activity.relatedId > 0) {
                // TokenCreated - obtener detalles del token
                try {
                  const token = await contract.getToken(activity.relatedId)
                  tokenId = Number(activity.relatedId)
                  batchId = tokenId
                  product = token.name
                  amount = parseFloat(formatUnits(token.totalSupply || 0, 3))
                } catch (e) {
                  console.warn(`No se pudo obtener detalles del token ${activity.relatedId}:`, e)
                }
              } else if ((activityTypeNum === 1 || activityTypeNum === 2 || activityTypeNum === 3) && activity.relatedId > 0) {
                // Transfer - obtener detalles de la transferencia
                try {
                  const transfer = await contract.getTransfer(activity.relatedId)
                  tokenId = Number(transfer.tokenId)
                  batchId = tokenId
                  amount = parseFloat(formatUnits(transfer.amount || 0, 3))
                } catch (e) {
                  console.warn(`No se pudo obtener detalles de transfer ${activity.relatedId}:`, e)
                }
              } else if (activityTypeNum === 7 && activity.relatedId > 0) {
                // BatchEvent - obtener detalles del token/lote
                try {
                  const token = await contract.getToken(activity.relatedId)
                  tokenId = Number(activity.relatedId)
                  batchId = tokenId
                  product = token.name
                } catch (e) {
                  console.warn(`No se pudo obtener detalles del token ${activity.relatedId}:`, e)
                  // Aún así usar el relatedId como batchId
                  tokenId = Number(activity.relatedId)
                  batchId = tokenId
                }
              }
              
              const eventData = {
                id: `activity-${activity.id}-${activity.timestamp}`,
                eventType: eventType,
                timestamp: Number(activity.timestamp),
                blockNumber: 0, // Las actividades no tienen blockNumber directo
                transactionHash: '', // Se puede obtener del evento ActivityRecorded si es necesario
                tokenId: tokenId,
                batchId: batchId,
                creator: activityTypeNum === 0 ? activity.actor : undefined,
                from: (activityTypeNum === 1 || activityTypeNum === 2 || activityTypeNum === 3) ? activity.actor : undefined,
                to: undefined, // Se puede obtener de la transferencia si es necesario
                user: (activityTypeNum === 4 || activityTypeNum === 5 || activityTypeNum === 6) ? activity.actor : undefined,
                product: product,
                amount: amount,
                metadata: activity.description || `Actividad #${activity.id}`
              }
              
              console.log(`  ✓ Evento creado:`, eventData)
              allEvents.push(eventData)
            } catch (activityError: any) {
              console.error(`❌ Error procesando actividad ${activity.id}:`, activityError)
              console.error('Detalles del error:', {
                message: activityError.message,
                stack: activityError.stack,
                activity: activity
              })
            }
          }
          
          console.log(`✅ ${allEvents.length} actividades procesadas desde el contrato`)
        } else {
          console.log('⚠️ getAllActivities no disponible en el contrato, usando eventos históricos...')
          throw new Error('getAllActivities no disponible')
        }
      } catch (activityError: any) {
        console.log('⚠️ No se pudieron obtener actividades desde el contrato, usando eventos históricos...')
        console.log('Detalles del error:', {
          message: activityError.message,
          code: activityError.code,
          data: activityError.data
        })
        
        // FALLBACK: Obtener eventos históricos (método anterior)
        const currentBlock = await provider.getBlockNumber()
        const fromBlock = 0
        console.log(`📊 Buscando eventos desde el bloque ${fromBlock} hasta ${currentBlock}`)
        
        // 1. TokenCreated events
      try {
        console.log('🔍 Buscando eventos TokenCreated...')
        const tokenCreatedFilter = contract.filters.TokenCreated()
        const tokenCreatedEvents = await contract.queryFilter(tokenCreatedFilter, fromBlock, currentBlock)
        console.log(`✅ TokenCreated events encontrados: ${tokenCreatedEvents.length}`)
        
        for (const event of tokenCreatedEvents) {
          try {
            const block = await provider.getBlock(event.blockNumber)
            
            // Intentar acceder a los args de diferentes formas (ethers v6 puede tener diferentes estructuras)
            let tokenId: bigint | number
            let creator: string
            let name: string
            let totalSupply: bigint
            
            if (event.args) {
              // Si args es un array
              if (Array.isArray(event.args)) {
                tokenId = event.args[0]
                creator = event.args[1]
                name = event.args[2]
                totalSupply = event.args[3]
              } 
              // Si args tiene propiedades nombradas
              else if (event.args.tokenId !== undefined) {
                tokenId = event.args.tokenId
                creator = event.args.creator
                name = event.args.name
                totalSupply = event.args.totalSupply
              } else {
                console.warn('⚠️ Evento TokenCreated con estructura desconocida:', event)
                continue
              }
              
              const tokenIdNum = Number(tokenId)
              const creatorStr = String(creator)
              const nameStr = String(name)
              const totalSupplyBigInt = BigInt(totalSupply || 0)
              
              allEvents.push({
                id: `token-${tokenIdNum}-${event.transactionHash}`,
                eventType: 'Lote Creado',
                timestamp: block?.timestamp || 0,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                tokenId: tokenIdNum,
                batchId: tokenIdNum,
                creator: creatorStr,
                product: nameStr,
                amount: parseFloat(formatUnits(totalSupplyBigInt, 3)),
                metadata: `Lote "${nameStr}" creado con ${formatUnits(totalSupplyBigInt, 3)} kg`
              })
              console.log(`  ✓ Evento TokenCreated procesado: tokenId=${tokenIdNum}, name=${nameStr}`)
            } else {
              console.warn('⚠️ Evento TokenCreated sin args:', event)
            }
          } catch (eventError: any) {
            console.error('❌ Error procesando evento TokenCreated:', eventError)
            console.error('Detalles:', { message: eventError.message, event: event })
          }
        }
      } catch (error: any) {
        console.error('❌ Error al obtener TokenCreated events:', error)
        console.error('Detalles:', { message: error.message, code: error.code })
      }
      
      // 2. TransferRequested events
      try {
        console.log('🔍 Buscando eventos TransferRequested...')
        const transferRequestedFilter = contract.filters.TransferRequested()
        const transferRequestedEvents = await contract.queryFilter(transferRequestedFilter, fromBlock, currentBlock)
        console.log(`✅ TransferRequested events encontrados: ${transferRequestedEvents.length}`)
        
        for (const event of transferRequestedEvents) {
          try {
            const block = await provider.getBlock(event.blockNumber)
            
            let transferId: bigint | number
            let from: string
            let to: string
            let tokenId: bigint | number
            let amount: bigint
            
            if (event.args) {
              if (Array.isArray(event.args)) {
                transferId = event.args[0]
                from = event.args[1]
                to = event.args[2]
                tokenId = event.args[3]
                amount = event.args[4]
              } else if (event.args.transferId !== undefined) {
                transferId = event.args.transferId
                from = event.args.from
                to = event.args.to
                tokenId = event.args.tokenId
                amount = event.args.amount
              } else {
                console.warn('⚠️ Evento TransferRequested con estructura desconocida:', event)
                continue
              }
              
              const transferIdNum = Number(transferId)
              const fromStr = String(from)
              const toStr = String(to)
              const tokenIdNum = Number(tokenId)
              const amountBigInt = BigInt(amount || 0)
              
              allEvents.push({
                id: `transfer-request-${transferIdNum}-${event.transactionHash}`,
                eventType: 'Transferencia Solicitada',
                timestamp: block?.timestamp || 0,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                tokenId: tokenIdNum,
                batchId: tokenIdNum,
                from: fromStr,
                to: toStr,
                amount: parseFloat(formatUnits(amountBigInt, 3)),
                metadata: `Transferencia de ${formatUnits(amountBigInt, 3)} kg del lote #${tokenIdNum}`
              })
              console.log(`  ✓ Evento TransferRequested procesado: transferId=${transferIdNum}`)
            } else {
              console.warn('⚠️ Evento TransferRequested sin args:', event)
            }
          } catch (eventError: any) {
            console.error('❌ Error procesando evento TransferRequested:', eventError)
            console.error('Detalles:', { message: eventError.message, event: event })
          }
        }
      } catch (error: any) {
        console.error('❌ Error al obtener TransferRequested events:', error)
        console.error('Detalles:', { message: error.message, code: error.code })
      }
      
      // 3. TransferAccepted events
      try {
        console.log('🔍 Buscando eventos TransferAccepted...')
        const transferAcceptedFilter = contract.filters.TransferAccepted()
        const transferAcceptedEvents = await contract.queryFilter(transferAcceptedFilter, fromBlock, currentBlock)
        console.log(`✅ TransferAccepted events encontrados: ${transferAcceptedEvents.length}`)
        
        for (const event of transferAcceptedEvents) {
          try {
            const block = await provider.getBlock(event.blockNumber)
            
            let transferId: bigint | number
            
            if (event.args) {
              if (Array.isArray(event.args)) {
                transferId = event.args[0]
              } else if (event.args.transferId !== undefined) {
                transferId = event.args.transferId
              } else {
                console.warn('⚠️ Evento TransferAccepted con estructura desconocida:', event)
                continue
              }
              
              const transferIdNum = Number(transferId)
              
              // Obtener detalles de la transferencia
              try {
                const transfer = await contract.getTransfer(transferIdNum)
                allEvents.push({
                  id: `transfer-accept-${transferIdNum}-${event.transactionHash}`,
                  eventType: 'Transferencia Aceptada',
                  timestamp: block?.timestamp || 0,
                  blockNumber: event.blockNumber,
                  transactionHash: event.transactionHash,
                  tokenId: Number(transfer.tokenId),
                  batchId: Number(transfer.tokenId),
                  from: transfer.from,
                  to: transfer.to,
                  amount: parseFloat(formatUnits(transfer.amount || 0, 3)),
                  metadata: `Transferencia aceptada: ${formatUnits(transfer.amount || 0, 3)} kg del lote #${transfer.tokenId}`
                })
                console.log(`  ✓ Evento TransferAccepted procesado: transferId=${transferIdNum}`)
              } catch (e: any) {
                console.warn(`⚠️ No se pudo obtener detalles de transfer ${transferIdNum}:`, e.message)
                // Agregar evento básico sin detalles de transfer
                allEvents.push({
                  id: `transfer-accept-${transferIdNum}-${event.transactionHash}`,
                  eventType: 'Transferencia Aceptada',
                  timestamp: block?.timestamp || 0,
                  blockNumber: event.blockNumber,
                  transactionHash: event.transactionHash,
                  metadata: `Transferencia #${transferIdNum} aceptada`
                })
              }
            } else {
              console.warn('⚠️ Evento TransferAccepted sin args:', event)
            }
          } catch (eventError: any) {
            console.error('❌ Error procesando evento TransferAccepted:', eventError)
            console.error('Detalles:', { message: eventError.message, event: event })
          }
        }
      } catch (error: any) {
        console.error('❌ Error al obtener TransferAccepted events:', error)
        console.error('Detalles:', { message: error.message, code: error.code })
      }
      
      // 4. TransferRejected events
      try {
        console.log('🔍 Buscando eventos TransferRejected...')
        const transferRejectedFilter = contract.filters.TransferRejected()
        const transferRejectedEvents = await contract.queryFilter(transferRejectedFilter, fromBlock, currentBlock)
        console.log(`✅ TransferRejected events encontrados: ${transferRejectedEvents.length}`)
        
        for (const event of transferRejectedEvents) {
          try {
            const block = await provider.getBlock(event.blockNumber)
            
            let transferId: bigint | number
            
            if (event.args) {
              if (Array.isArray(event.args)) {
                transferId = event.args[0]
              } else if (event.args.transferId !== undefined) {
                transferId = event.args.transferId
              } else {
                console.warn('⚠️ Evento TransferRejected con estructura desconocida:', event)
                continue
              }
              
              const transferIdNum = Number(transferId)
              
              try {
                const transfer = await contract.getTransfer(transferIdNum)
                allEvents.push({
                  id: `transfer-reject-${transferIdNum}-${event.transactionHash}`,
                  eventType: 'Transferencia Rechazada',
                  timestamp: block?.timestamp || 0,
                  blockNumber: event.blockNumber,
                  transactionHash: event.transactionHash,
                  tokenId: Number(transfer.tokenId),
                  batchId: Number(transfer.tokenId),
                  from: transfer.from,
                  to: transfer.to,
                  amount: parseFloat(formatUnits(transfer.amount || 0, 3)),
                  metadata: `Transferencia rechazada: ${formatUnits(transfer.amount || 0, 3)} kg del lote #${transfer.tokenId}`
                })
                console.log(`  ✓ Evento TransferRejected procesado: transferId=${transferIdNum}`)
              } catch (e: any) {
                console.warn(`⚠️ No se pudo obtener detalles de transfer ${transferIdNum}:`, e.message)
                // Agregar evento básico sin detalles de transfer
                allEvents.push({
                  id: `transfer-reject-${transferIdNum}-${event.transactionHash}`,
                  eventType: 'Transferencia Rechazada',
                  timestamp: block?.timestamp || 0,
                  blockNumber: event.blockNumber,
                  transactionHash: event.transactionHash,
                  metadata: `Transferencia #${transferIdNum} rechazada`
                })
              }
            } else {
              console.warn('⚠️ Evento TransferRejected sin args:', event)
            }
          } catch (eventError: any) {
            console.error('❌ Error procesando evento TransferRejected:', eventError)
            console.error('Detalles:', { message: eventError.message, event: event })
          }
        }
      } catch (error: any) {
        console.error('❌ Error al obtener TransferRejected events:', error)
        console.error('Detalles:', { message: error.message, code: error.code })
      }
      
      // 5. UserRoleRequested events
      try {
        console.log('🔍 Buscando eventos UserRoleRequested...')
        const userRoleRequestedFilter = contract.filters.UserRoleRequested()
        const userRoleRequestedEvents = await contract.queryFilter(userRoleRequestedFilter, fromBlock, currentBlock)
        console.log(`✅ UserRoleRequested events encontrados: ${userRoleRequestedEvents.length}`)
        
        for (const event of userRoleRequestedEvents) {
          try {
            const block = await provider.getBlock(event.blockNumber)
            
            let user: string
            let role: string
            
            if (event.args) {
              if (Array.isArray(event.args)) {
                user = event.args[0]
                role = event.args[1]
              } else if (event.args.user !== undefined) {
                user = event.args.user
                role = event.args.role
              } else {
                console.warn('⚠️ Evento UserRoleRequested con estructura desconocida:', event)
                continue
              }
              
              const userStr = String(user)
              const roleStr = String(role)
              
              allEvents.push({
                id: `user-request-${userStr}-${event.transactionHash}`,
                eventType: 'Solicitud de Registro',
                timestamp: block?.timestamp || 0,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                user: userStr,
                role: roleStr,
                metadata: `Usuario ${userStr.slice(0, 6)}...${userStr.slice(-4)} solicitó rol: ${roleStr}`
              })
              console.log(`  ✓ Evento UserRoleRequested procesado: user=${userStr.slice(0, 6)}...${userStr.slice(-4)}, role=${roleStr}`)
            } else {
              console.warn('⚠️ Evento UserRoleRequested sin args:', event)
            }
          } catch (eventError: any) {
            console.error('❌ Error procesando evento UserRoleRequested:', eventError)
            console.error('Detalles:', { message: eventError.message, event: event })
          }
        }
      } catch (error: any) {
        console.error('❌ Error al obtener UserRoleRequested events:', error)
        console.error('Detalles:', { message: error.message, code: error.code })
      }
      
      // 6. UserStatusChanged events
      try {
        console.log('🔍 Buscando eventos UserStatusChanged...')
        const userStatusChangedFilter = contract.filters.UserStatusChanged()
        const userStatusChangedEvents = await contract.queryFilter(userStatusChangedFilter, fromBlock, currentBlock)
        console.log(`✅ UserStatusChanged events encontrados: ${userStatusChangedEvents.length}`)
        
        for (const event of userStatusChangedEvents) {
          try {
            const block = await provider.getBlock(event.blockNumber)
            
            let user: string
            let statusValue: bigint | number
            
            if (event.args) {
              if (Array.isArray(event.args)) {
                user = event.args[0]
                statusValue = event.args[1]
              } else if (event.args.user !== undefined) {
                user = event.args.user
                statusValue = event.args.status
              } else {
                console.warn('⚠️ Evento UserStatusChanged con estructura desconocida:', event)
                continue
              }
              
              const userStr = String(user)
              const statusNum = Number(statusValue)
              
              const statusMap: Record<number, string> = {
                0: 'Pendiente',
                1: 'Aprobado',
                2: 'Rechazado',
                3: 'Cancelado'
              }
              const statusText = statusMap[statusNum] || 'Desconocido'
              
              allEvents.push({
                id: `user-status-${userStr}-${event.transactionHash}`,
                eventType: 'Cambio de Estado de Usuario',
                timestamp: block?.timestamp || 0,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                user: userStr,
                status: statusText,
                metadata: `Estado del usuario ${userStr.slice(0, 6)}...${userStr.slice(-4)} cambiado a: ${statusText}`
              })
              console.log(`  ✓ Evento UserStatusChanged procesado: user=${userStr.slice(0, 6)}...${userStr.slice(-4)}, status=${statusText}`)
            } else {
              console.warn('⚠️ Evento UserStatusChanged sin args:', event)
            }
          } catch (eventError: any) {
            console.error('❌ Error procesando evento UserStatusChanged:', eventError)
            console.error('Detalles:', { message: eventError.message, event: event })
          }
        }
      } catch (error: any) {
        console.error('❌ Error al obtener UserStatusChanged events:', error)
        console.error('Detalles:', { message: error.message, code: error.code })
      }
      
        // Ordenar eventos por timestamp (más recientes primero)
        allEvents.sort((a, b) => b.timestamp - a.timestamp)
        
        console.log(`✅ Total de eventos cargados: ${allEvents.length}`)
        if (allEvents.length > 0) {
          console.log('📋 Primeros eventos:', allEvents.slice(0, 3).map(e => ({ 
            type: e.eventType, 
            timestamp: e.timestamp,
            block: e.blockNumber 
          })))
        } else {
          console.log('ℹ️ No se encontraron eventos en el rango de bloques consultado')
          console.log('💡 Sugerencia: Asegúrate de que hay transacciones en la blockchain (crear lotes, transferencias, etc.)')
        }
      } // Cierre del catch del try interno (activityError)
      
      setEvents(allEvents)
    } catch (error: any) {
      console.error('❌ Error al cargar eventos:', error)
      console.error('Detalles del error:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      })
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const eventIcons: Record<string, string> = {
    'Lote Creado': '📦',
    'Transferencia Solicitada': '📤',
    'Transferencia Aceptada': '✅',
    'Transferencia Rechazada': '❌',
    'Solicitud de Registro': '👤',
    'Cambio de Estado de Usuario': '🔄',
    'Usuario Registrado por Admin': '👨‍💼',
    'Evento de Lote': '📝'
  }

  const eventColors: Record<string, string> = {
    'Lote Creado': '#10b981',
    'Transferencia Solicitada': '#3b82f6',
    'Transferencia Aceptada': '#10b981',
    'Transferencia Rechazada': '#ef4444',
    'Solicitud de Registro': '#f59e0b',
    'Cambio de Estado de Usuario': '#8b5cf6',
    'Usuario Registrado por Admin': '#8b5cf6',
    'Evento de Lote': '#06b6d4'
  }

  if (!account) {
    return (
      <>
        <Header />
        <main style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p>Por favor conecta tu wallet para ver los eventos.</p>
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
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Eventos</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
              Historial completo de actividades y transacciones registradas en la blockchain
            </p>
          </div>
          <button
            onClick={loadEvents}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            🔄 {isLoading ? 'Cargando...' : 'Recargar'}
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#666' }}>Cargando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📅</p>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>No hay eventos registrados</h2>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              Los eventos aparecerán aquí cuando se realicen actividades en la plataforma:
            </p>
            <ul style={{ 
              textAlign: 'left', 
              display: 'inline-block',
              color: '#666',
              marginBottom: '16px'
            }}>
              <li>Creación de lotes</li>
              <li>Solicitudes y aceptaciones de transferencias</li>
              <li>Registros y cambios de estado de usuarios</li>
            </ul>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Asegúrate de que Anvil esté ejecutándose y que haya transacciones en la blockchain
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map(event => (
              <div key={event.id} style={{
                backgroundColor: '#fff',
                border: `2px solid ${eventColors[event.eventType] || '#e5e7eb'}`,
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                alignItems: 'start',
                gap: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  fontSize: '32px',
                  padding: '8px',
                  backgroundColor: `${eventColors[event.eventType] || '#e5e7eb'}20`,
                  borderRadius: '8px'
                }}>
                  {eventIcons[event.eventType] || '📌'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '18px', 
                        fontWeight: '600',
                        color: eventColors[event.eventType] || '#000'
                      }}>
                        {event.eventType}
                      </h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                        {formatDate(event.timestamp)} • Bloque #{event.blockNumber}
                      </p>
                    </div>
                    {event.batchId && (
                    <Link href={`/batches/${event.batchId}`} style={{
                      padding: '6px 12px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                        Ver Lote #{event.batchId}
                    </Link>
                    )}
                  </div>
                  
                  {/* Información específica según el tipo de evento */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                    {event.creator && (
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Creador</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontFamily: 'monospace' }}>
                          {formatAddress(event.creator)}
                        </p>
                      </div>
                    )}
                    {event.from && (
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>De</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontFamily: 'monospace' }}>
                          {formatAddress(event.from)}
                        </p>
                      </div>
                    )}
                    {event.to && (
                    <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Para</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontFamily: 'monospace' }}>
                          {formatAddress(event.to)}
                        </p>
                    </div>
                    )}
                    {event.user && (
                    <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Usuario</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontFamily: 'monospace' }}>
                          {formatAddress(event.user)}
                        </p>
                      </div>
                    )}
                    {event.role && (
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Rol</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>
                          {event.role}
                        </p>
                      </div>
                    )}
                    {event.status && (
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Estado</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>
                          {event.status}
                        </p>
                      </div>
                    )}
                    {event.amount !== undefined && (
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Cantidad</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>
                          {event.amount.toFixed(3)} kg
                        </p>
                      </div>
                    )}
                    {event.product && (
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Producto</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '500' }}>
                          {event.product}
                      </p>
                    </div>
                    )}
                  </div>
                  
                  {event.metadata && (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{event.metadata}</p>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#0369a1', fontFamily: 'monospace' }}>
                      TX: {formatAddress(event.transactionHash)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

