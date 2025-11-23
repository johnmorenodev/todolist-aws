import { PropsWithChildren } from 'react'

export function Container({ children }: PropsWithChildren) {
  return (
    <div className="bg-gray-50 min-h-full py-2 px-4">
      {children}
    </div>
  )
}

