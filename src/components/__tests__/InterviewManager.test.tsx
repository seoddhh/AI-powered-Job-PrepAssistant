import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';
vi.mock('@/components/ui/select', () => {
  const React = require('react');
  return {
    Select: ({ value, onValueChange, children }: any) => (
      <select value={value} onChange={e => onValueChange(e.target.value)} data-testid="company-select">
        {children}
      </select>
    ),
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <option value="">{placeholder}</option>,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  };
});

import InterviewManager from '../InterviewManager';
import { CompaniesProvider } from '@/contexts/CompaniesContext';
import * as api from '@/lib/api';

function renderWithProviders(ui: React.ReactElement) {
  return render(<CompaniesProvider>{ui}</CompaniesProvider>);
}

if (!HTMLElement.prototype.hasPointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', { value: () => {} });
}
if (!HTMLElement.prototype.releasePointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', { value: () => {} });
}
if (!HTMLElement.prototype.setPointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', { value: () => {} });
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
if (typeof ResizeObserver === 'undefined') {
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

vi.mock('@/lib/api');

const mockedGenerateQuestions = vi.mocked(api.generateInterviewQuestions);
const mockedGetFeedback = vi.mocked(api.getInterviewFeedback);

describe('InterviewManager', () => {
  test('질문 생성 후 목록이 렌더링된다', async () => {
    mockedGenerateQuestions.mockResolvedValue({ result: '질문: 질문1\n질문: 질문2' });

    renderWithProviders(<InterviewManager />);

    await userEvent.selectOptions(screen.getByTestId('company-select'), '네이버');

    await userEvent.type(screen.getByPlaceholderText('지원 직무'), '프론트엔드');
    await userEvent.type(screen.getByPlaceholderText('경력'), '신입');

    await userEvent.click(screen.getByRole('button', { name: '질문 생성' }));

    expect(await screen.findByText('질문1')).toBeInTheDocument();
    expect(screen.getByText('질문2')).toBeInTheDocument();
  });

  test('질문 선택 후 답변 입력과 피드백 요청 흐름', async () => {
    mockedGenerateQuestions.mockResolvedValue({ result: '질문: 질문1' });
    mockedGetFeedback.mockResolvedValue({ result: '좋은 답변입니다.' });

    renderWithProviders(<InterviewManager />);

    await userEvent.selectOptions(screen.getByTestId('company-select'), '네이버');
    await userEvent.type(screen.getByPlaceholderText('지원 직무'), '백엔드');
    await userEvent.type(screen.getByPlaceholderText('경력'), '3년차');
    await userEvent.click(screen.getByRole('button', { name: '질문 생성' }));

    await screen.findByText('질문1');
    await userEvent.click(screen.getByText('질문1'));

    const answer = 'a'.repeat(60);
    await userEvent.type(screen.getByPlaceholderText(/면접 답변을 작성해주세요/), answer);

    const feedbackButton = screen.getByRole('button', { name: /AI 피드백 요청/ });
    await userEvent.click(feedbackButton);

    await waitFor(() => {
      expect(mockedGetFeedback).toHaveBeenCalled();
    });
    expect(await screen.findByText('AI 피드백 결과')).toBeInTheDocument();
    expect(screen.getByText('좋은 답변입니다.')).toBeInTheDocument();
  });
});
