import React from 'react'

export default function TokenCard({ name, qty }: { name: string; qty: number }) {
  return (
    <div style={{border:'1px solid #ddd',borderRadius:8,padding:12,margin:8}}>
      <h3>{name}</h3>
      <p>Balance: {qty}</p>
    </div>
  )
}
