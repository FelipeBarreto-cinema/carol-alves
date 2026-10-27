import type { ReactNode } from 'react'

// Substitui o @macaly/bridge, que só funciona dentro do editor do Macaly.
export function MacalyBridge({ children }: { children: ReactNode }) {
  return <>{children}</>
}
