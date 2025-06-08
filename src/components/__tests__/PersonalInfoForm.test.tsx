import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import PersonalInfoForm from '../PersonalInfoForm';
import * as useToast from '@/hooks/use-toast';

vi.mock('@/hooks/use-toast');

describe('PersonalInfoForm', () => {
  const toastMock = vi.fn();

  beforeEach(() => {
    vi.mocked(useToast.useToast).mockReturnValue({
      toast: toastMock,
    } as unknown as ReturnType<typeof useToast.useToast>);
    toastMock.mockClear();
  });

  it('이름 미입력 상태에서 제출하면 오류 토스트가 호출된다', async () => {
    render(<PersonalInfoForm />);

    await userEvent.click(screen.getByRole('button', { name: /저장하기/i }));

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: '입력 오류' })
    );
  });

  it('필수 필드를 모두 입력하고 제출하면 성공 토스트가 호출된다', async () => {
    const { container } = render(<PersonalInfoForm />);

    await userEvent.type(screen.getByLabelText('이름 *'), '홍길동');

    // 희망 직무 선택 (hidden select element)
    const selects = container.querySelectorAll('select');
    fireEvent.change(selects[0], { target: { value: 'frontend' } });

    // 경력 년수 선택
    fireEvent.change(selects[1], { target: { value: '0' } });

    await userEvent.click(screen.getByRole('button', { name: /저장하기/i }));

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: '저장 완료' })
    );
  });
});
