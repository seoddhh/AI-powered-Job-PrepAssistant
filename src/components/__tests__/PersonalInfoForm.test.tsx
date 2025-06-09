import { describe, test, expect } from "vitest"
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import PersonalInfoForm from '../PersonalInfoForm'
import { Toaster } from '@/components/ui/toaster'
import '@testing-library/jest-dom';

function setup() {
  renderWithProviders(
    <>
      <PersonalInfoForm />
      <Toaster />
    </>
  )
}

describe('PersonalInfoForm', () => {
  test('이름 없이 제출하면 오류 토스트가 나타난다', async () => {
    setup()
    await userEvent.click(screen.getByRole('button', { name: /저장하기/ }))
    expect(await screen.findByText('이름을 입력해주세요.')).toBeInTheDocument()
  })
})
