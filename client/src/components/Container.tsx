import { PropsWithChildren } from 'react'

export function Container({ children }: PropsWithChildren) {
  return (
    <div className="bg-gray-50 min-h-full p-2">
      {children}
    </div>
  )
}

