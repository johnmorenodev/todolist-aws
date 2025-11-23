import { PropsWithChildren } from 'react'
import { useMantineTheme } from '@mantine/core'

export function Container({ children }: PropsWithChildren) {
  const theme = useMantineTheme()
  
  return (
    <div 
      className="min-h-full py-2 px-4"
      style={{
        background: theme.other?.background || '#fafbfc',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}

