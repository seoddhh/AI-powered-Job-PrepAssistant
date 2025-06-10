import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { PersonalInfoProvider } from '@/contexts/PersonalInfoContext'
import { CompaniesProvider } from '@/contexts/CompaniesContext'
import { DashboardProvider } from '@/contexts/DashboardContext'

const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const queryClient = new QueryClient()

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PersonalInfoProvider>
          <CompaniesProvider>
            <DashboardProvider>{children}</DashboardProvider>
          </CompaniesProvider>
        </PersonalInfoProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { renderWithProviders }

