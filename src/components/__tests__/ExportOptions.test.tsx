import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExportOptions from '../ExportOptions';
import { vi } from 'vitest';
var jsPDFSave;
vi.mock('jspdf', () => {
  jsPDFSave = vi.fn();
  return {
    jsPDF: vi.fn().mockImplementation(() => ({
      setFont: vi.fn(),
      splitTextToSize: vi.fn(() => []),
      text: vi.fn(),
      save: jsPDFSave,
    })),
  };
});

var toBlob;
vi.mock('docx', () => {
  toBlob = vi.fn(() => Promise.resolve(new Blob()));
  return {
    Document: vi.fn().mockImplementation(() => ({})),
    Packer: { toBlob },
    Paragraph: vi.fn(),
    TextRun: vi.fn(),
  };
});

vi.mock('file-saver', () => ({ saveAs: vi.fn() }));

describe('ExportOptions', () => {
  test('항목을 클릭하면 선택 상태가 변경된다', () => {
    render(<ExportOptions />);
    const item = screen.getByText('인적사항');
    fireEvent.click(item);
    const checkbox = screen.getAllByRole('checkbox')[0];
    expect(checkbox).toBeChecked();
    fireEvent.click(item);
    expect(checkbox).not.toBeChecked();
  });

  test('파일 형식을 선택해야 다운로드 버튼이 활성화된다', async () => {
    render(<ExportOptions />);
    const downloadButton = screen.getByRole('button', { name: /파일 다운로드/i });
    expect(downloadButton).toBeDisabled();
    const selectTrigger = screen.getByText('형식을 선택해주세요');
    await userEvent.click(selectTrigger);
    const pdfOption = await screen.findByText('PDF 파일');
    await userEvent.click(pdfOption);
    expect(screen.getByRole('button', { name: /파일 다운로드/i })).toBeDisabled();
    const item = screen.getByText('인적사항');
    fireEvent.click(item);
    expect(screen.getByRole('button', { name: /파일 다운로드/i })).toBeEnabled();
  });

  test('PDF 형식으로 다운로드하면 jsPDF.save가 호출된다', async () => {
    render(<ExportOptions />);
    fireEvent.click(screen.getByText('인적사항'));
    await userEvent.click(screen.getByText('형식을 선택해주세요'));
    await userEvent.click(await screen.findByText('PDF 파일'));
    fireEvent.click(screen.getByRole('button', { name: /파일 다운로드/i }));
    await waitFor(() => expect(jsPDFSave).toHaveBeenCalled());
  });

  test('DOCX 형식으로 다운로드하면 Packer.toBlob가 호출된다', async () => {
    render(<ExportOptions />);
    fireEvent.click(screen.getByText('인적사항'));
    await userEvent.click(screen.getByText('형식을 선택해주세요'));
    await userEvent.click(await screen.findByText('Word 문서 (DOCX)'));
    fireEvent.click(screen.getByRole('button', { name: /파일 다운로드/i }));
    await waitFor(() => expect(toBlob).toHaveBeenCalled());
  });
});
