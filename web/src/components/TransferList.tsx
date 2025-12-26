import React from 'react'

export default function TransferList({ items }: { items: Array<any> }) {
  return (
    <div>
      {items.length === 0 ? <p>No transfers</p> : items.map((t, i) => (
        <div key={i} style={{border:'1px solid #eee',padding:8,margin:6}}>
          <div>From: {t.from}</div>
          <div>To: {t.to}</div>
          <div>Amount: {t.amount}</div>
        </div>
      ))}
    </div>
  )
}
