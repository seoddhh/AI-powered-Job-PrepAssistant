import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InterviewManager from '../InterviewManager';
import { CompaniesProvider } from '@/contexts/CompaniesContext';
import { vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  generateInterviewQuestions: vi.fn(),
  getInterviewFeedback: vi.fn(),
}));

vi.mock('@/components/ui/select', async () => {
  return {
    Select: ({ children, value, onValueChange }: any) => (
      <select value={value} onChange={(e) => onValueChange(e.target.value)} data-testid="company-select">
        {children}
      </select>
    ),
    SelectTrigger: (props: any) => <>{props.children}</>,
    SelectContent: (props: any) => <>{props.children}</>,
    SelectItem: ({ value, children }: any) => <option value={value}>{children}</option>,
    SelectValue: ({ placeholder }: any) => <option value="">{placeholder}</option>,
  };
});

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
  ScrollBar: () => <div />,
}));

import * as mockApi from '@/lib/api';

function renderWithProvider() {
  return render(
    <CompaniesProvider>
      <InterviewManager />
    </CompaniesProvider>
  );
}

describe('InterviewManager', () => {
  it('면접 질문 생성 후 목록 표시', async () => {
    mockApi.generateInterviewQuestions.mockResolvedValue({
      result: '질문: 첫 번째 질문\n질문: 두 번째 질문',
    });
    renderWithProvider();

    const user = userEvent.setup();
    // 회사 선택
    await user.selectOptions(screen.getByTestId('company-select'), '네이버');
    // 직무, 경력 입력
    await user.type(screen.getByPlaceholderText('지원 직무'), '프론트엔드');
    await user.type(screen.getByPlaceholderText('경력'), '3년');
    // 질문 생성 클릭
    await user.click(screen.getByRole('button', { name: '질문 생성' }));

    await waitFor(() => {
      expect(mockApi.generateInterviewQuestions).toHaveBeenCalledWith(
        '네이버',
        '프론트엔드',
        '3년'
      );
    });

    expect(await screen.findByText('첫 번째 질문')).toBeInTheDocument();
    expect(await screen.findByText('두 번째 질문')).toBeInTheDocument();
  });

  it('답변 길이에 따라 버튼 상태 변경', async () => {
    mockApi.generateInterviewQuestions.mockResolvedValue({
      result: '질문: 샘플 질문',
    });
    renderWithProvider();
    const user = userEvent.setup();
    // company select etc.
    await user.selectOptions(screen.getByTestId('company-select'), '네이버');
    await user.type(screen.getByPlaceholderText('지원 직무'), 'FE');
    await user.type(screen.getByPlaceholderText('경력'), '1년');
    await user.click(screen.getByRole('button', { name: '질문 생성' }));
    // select generated question
    await user.click(await screen.findByText('샘플 질문'));

    const saveButton = await screen.findByRole('button', { name: '저장' });
    const feedbackButton = await screen.findByRole('button', { name: 'AI 피드백 요청' });
    const textarea = screen.getByPlaceholderText(/면접 답변을 작성해주세요/);

    expect(saveButton).toBeEnabled();
    expect(feedbackButton).toBeDisabled();

    await user.type(textarea, '짧은 답변');
    expect(feedbackButton).toBeDisabled();

    const longAnswer = 'a'.repeat(60);
    await user.clear(textarea);
    await user.type(textarea, longAnswer);
    expect(feedbackButton).toBeEnabled();
  });
});
