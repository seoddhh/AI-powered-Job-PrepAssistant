import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';
import CompanyManager from '../CompanyManager';
import { CompaniesProvider } from '@/contexts/CompaniesContext';

function renderWithProviders(ui: React.ReactElement) {
  return render(<CompaniesProvider>{ui}</CompaniesProvider>);
}

describe('CompanyManager', () => {
  test('기본 회사 목록이 표시되어야 한다', () => {
    renderWithProviders(<CompanyManager />);
    expect(screen.getByText('네이버')).toBeInTheDocument();
    expect(screen.getByText('카카오')).toBeInTheDocument();
  });

  test('새 회사를 추가하면 목록이 증가한다', async () => {
    renderWithProviders(<CompanyManager />);
    await userEvent.click(screen.getAllByRole('button', { name: /기업 추가/ })[0]);

    await userEvent.type(screen.getByLabelText(/기업명/), '라인');
    await userEvent.type(screen.getByLabelText(/포지션명/), '백엔드 개발자');
    await userEvent.click(screen.getByRole('button', { name: /추가하기/ }));

    expect(screen.getByText('라인')).toBeInTheDocument();
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(4);
  });
});
