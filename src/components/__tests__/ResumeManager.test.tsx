import { renderWithProviders, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import ResumeManager from '../ResumeManager';
import { analyzeResume, generateResume } from '@/lib/api';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  analyzeResume: vi.fn(),
  generateResume: vi.fn(),
}));

const analyzeMock = vi.mocked(analyzeResume);
const generateMock = vi.mocked(generateResume);

describe('ResumeManager', () => {
  beforeEach(() => {
    analyzeMock.mockResolvedValue({ result: 'ok' });
    generateMock.mockResolvedValue({ result: 'ok' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('AI 첨삭 요청 버튼 클릭 시 analyzeResume 호출', async () => {
    renderWithProviders(<ResumeManager />);
    const textarea = screen.getByPlaceholderText(/자기소개서를 입력해주세요/i);
    const text = 'a'.repeat(200);
    await userEvent.type(textarea, text);
    const button = screen.getByRole('button', { name: /AI 첨삭 요청/ });
    await userEvent.click(button);

    expect(analyzeMock).toHaveBeenCalledWith(text);
  });

  it('AI 자기소개서 생성 버튼 클릭 시 generateResume 호출', async () => {
    renderWithProviders(<ResumeManager />);
    const generateTab = screen.getByRole('tab', { name: /신규 생성/ });
    await userEvent.click(generateTab);
    const keywordInput = screen.getByLabelText(/핵심 키워드 입력/);
    await userEvent.type(keywordInput, 'React, Node');
    const button = screen.getByRole('button', { name: /AI 자기소개서 생성/ });
    await userEvent.click(button);

    expect(generateMock).toHaveBeenCalledWith('React, Node');
  });
});
