import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientCookiesProvider } from '@/utils/cookies/cookies-provider'
import { cookies } from 'next/headers'
import { AuthProvider } from '@/contexts/Auth'
import { AppProvider } from '@/contexts/App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EvoTraining',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const client = new QueryClient()

  return (
    <html lang="en">
      <ClientCookiesProvider value={cookies().getAll()}>
          <AppProvider>
            <body className='h-screen w-screen'>{children}</body>
          </AppProvider>
      </ClientCookiesProvider>
    </html>
  )
}
