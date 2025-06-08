import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ResumeManager from "../ResumeManager";
import * as api from "@/lib/api";

vi.mock("@/lib/api", () => ({
  analyzeResume: vi.fn(),
  generateResume: vi.fn(),
}));

const mockedAnalyze = api.analyzeResume as unknown as any;
const mockedGenerate = api.generateResume as unknown as any;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ResumeManager", () => {
  it("200자 미만 입력 시 첨삭 버튼이 비활성화되어야 함", async () => {
    render(<ResumeManager />);
    const textarea = screen.getByPlaceholderText(/자기소개서를 입력해주세요/);
    const analyzeButton = screen.getByRole("button", { name: /AI 첨삭 요청/i });
    await userEvent.type(textarea, "a".repeat(199));
    expect(analyzeButton).toBeDisabled();
  });

  it("200자 이상 입력 후 버튼 클릭 시 analyzeResume 호출", async () => {
    mockedAnalyze.mockResolvedValue({ result: "" });
    render(<ResumeManager />);
    const textarea = screen.getByPlaceholderText(/자기소개서를 입력해주세요/);
    const analyzeButton = screen.getByRole("button", { name: /AI 첨삭 요청/i });
    await userEvent.type(textarea, "a".repeat(200));
    expect(analyzeButton).not.toBeDisabled();
    await userEvent.click(analyzeButton);
    expect(mockedAnalyze).toHaveBeenCalledTimes(1);
  });

  it("키워드 입력 후 생성 버튼 클릭 시 generateResume 호출", async () => {
    mockedGenerate.mockResolvedValue({ result: "" });
    render(<ResumeManager />);
    const generateTab = screen.getByRole("tab", { name: /신규 생성/ });
    await userEvent.click(generateTab);
    const input = screen.getByPlaceholderText(/예: React/);
    await userEvent.type(input, "React, 팀워크");
    const generateButton = screen.getByRole("button", { name: /AI 자기소개서 생성/ });
    await userEvent.click(generateButton);
    expect(mockedGenerate).toHaveBeenCalledTimes(1);
  });
});
