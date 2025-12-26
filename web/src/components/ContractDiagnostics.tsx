"use client"
import React, { useState } from 'react'
import { getContractReadOnly, verifyContract } from '../lib/contract'
import { useWallet } from '../hooks/useWallet'
import { CONTRACT_ADDRESS } from '../contracts/config'

export default function ContractDiagnostics() {
  const { account } = useWallet()
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runDiagnostics = async () => {
    setIsChecking(true)
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      account: account || 'No conectado',
      contractAddress: CONTRACT_ADDRESS,
      checks: {}
    }

    try {
      // Verificar que el contrato existe
      try {
        await verifyContract()
        diagnostics.checks.contractExists = { status: '✅ OK', message: 'Contrato desplegado correctamente' }
      } catch (e: any) {
        diagnostics.checks.contractExists = { status: '❌ ERROR', message: e.message }
      }

      // Verificar funciones básicas
      if (account) {
        const contract = await getContractReadOnly()
        
        // Verificar admin
        try {
          const admin = await contract.admin()
          diagnostics.checks.admin = { status: '✅ OK', value: admin }
        } catch (e: any) {
          diagnostics.checks.admin = { status: '❌ ERROR', message: e.message }
        }

        // Verificar isAdmin
        try {
          const isAdmin = await contract.isAdmin(account)
          diagnostics.checks.isAdmin = { status: '✅ OK', value: isAdmin }
        } catch (e: any) {
          diagnostics.checks.isAdmin = { status: '❌ ERROR', message: e.message }
        }

        // Verificar isUserRegistered
        try {
          const isRegistered = await contract.isUserRegistered(account)
          diagnostics.checks.isUserRegistered = { status: '✅ OK', value: isRegistered }
        } catch (e: any) {
          diagnostics.checks.isUserRegistered = { status: '❌ ERROR', message: e.message }
        }

        // Verificar getTotalTokens
        try {
          const totalTokens = await contract.getTotalTokens()
          diagnostics.checks.getTotalTokens = { status: '✅ OK', value: totalTokens.toString() }
        } catch (e: any) {
          diagnostics.checks.getTotalTokens = { status: '❌ ERROR', message: e.message }
        }

        // Verificar getAllUserTokens
        try {
          const userTokens = await contract.getAllUserTokens(account)
          diagnostics.checks.getAllUserTokens = { status: '✅ OK', value: `${userTokens.length} tokens` }
        } catch (e: any) {
          diagnostics.checks.getAllUserTokens = { status: '❌ ERROR', message: e.message }
        }
      }
    } catch (error: any) {
      diagnostics.error = error.message
    }

    setResults(diagnostics)
    setIsChecking(false)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#fff',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '400px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
        🔍 Diagnóstico del Contrato
      </h3>
      <button
        onClick={runDiagnostics}
        disabled={isChecking}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isChecking ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: isChecking ? 'not-allowed' : 'pointer',
          marginBottom: '12px'
        }}
      >
        {isChecking ? 'Verificando...' : 'Ejecutar Diagnóstico'}
      </button>
      
      {results && (
        <div style={{ fontSize: '12px', maxHeight: '300px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '8px', fontWeight: '600' }}>
            Contrato: {results.contractAddress.slice(0, 10)}...
          </div>
          <div style={{ marginBottom: '8px' }}>
            Cuenta: {results.account.slice(0, 10)}...
          </div>
          {Object.entries(results.checks).map(([key, value]: [string, any]) => (
            <div key={key} style={{ marginBottom: '6px', padding: '6px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
              <div style={{ fontWeight: '500', marginBottom: '2px' }}>{key}:</div>
              <div>{value.status} {value.value || value.message}</div>
            </div>
          ))}
          {results.error && (
            <div style={{ color: '#ef4444', marginTop: '8px' }}>
              Error general: {results.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

