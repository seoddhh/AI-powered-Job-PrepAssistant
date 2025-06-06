
import { useState } from "react";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  FileText, 
  MessageSquare, 
  User,
  Building2,
  Settings,
  Check
} from "lucide-react";

const ExportOptions = () => {
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [fileFormat, setFileFormat] = useState<string>("");
  const [fontStyle, setFontStyle] = useState<string>("default");
  const [isExporting, setIsExporting] = useState(false);

  const exportItems = [
    { id: "personal", label: "인적사항", icon: User, description: "기본 개인정보 및 경력사항" },
    { id: "resume", label: "자기소개서", icon: FileText, description: "원문 및 AI 첨삭 결과" },
    { id: "companies", label: "기업 정보", icon: Building2, description: "지원 기업 및 포지션 정보" },
    { id: "questions", label: "면접 질문", icon: MessageSquare, description: "AI 생성 면접 질문 목록" },
    { id: "answers", label: "면접 답변", icon: MessageSquare, description: "작성한 답변 및 AI 피드백" },
    { id: "summary", label: "전체 요약", icon: Settings, description: "종합 분석 리포트" }
  ];

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === exportItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(exportItems.map(item => item.id));
    }
  };

  const gatherSelectedData = () => {
    const data: Record<string, string> = {
      personal: "인적사항 내용",
      resume: "자기소개서 내용",
      companies: "기업 정보 내용",
      questions: "면접 질문 내용",
      answers: "면접 답변 내용",
      summary: "전체 요약 내용",
    };
    return selectedItems.map(id => data[id]).filter(Boolean).join("\n\n");
  };

  const handleExport = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "선택 오류",
        description: "출력할 항목을 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!fileFormat) {
      toast({
        title: "형식 오류", 
        description: "파일 형식을 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    const content = gatherSelectedData();

    try {
      if (fileFormat === "pdf") {
        const doc = new jsPDF();
        const font = fontStyle === "serif" ? "Times" : fontStyle === "sans" ? "Helvetica" : "Helvetica";
        doc.setFont(font);
        const lines = doc.splitTextToSize(content, 180);
        doc.text(lines, 10, 10);
        doc.save("export.pdf");
      } else {
        const paragraphs = content.split("\n\n").map(p => new Paragraph(p));
        const doc = new Document({ sections: [{ children: paragraphs }] });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "export.docx");
      }

      toast({
        title: "출력 완료",
        description: `${fileFormat.toUpperCase()} 파일이 다운로드되었습니다.`,
      });
    } catch (e) {
      toast({
        title: "오류",
        description: "파일 생성 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-6 w-6 text-blue-600" />
            <CardTitle>PDF/Word 출력</CardTitle>
          </div>
          <CardDescription>
            작성한 내용을 PDF 또는 Word 파일로 출력하여 활용하세요
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">출력 대상 선택</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedItems.length === exportItems.length ? "전체 해제" : "전체 선택"}
              </Button>
            </div>
            <CardDescription>
              포함할 내용을 선택해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exportItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedItems.includes(item.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleItemToggle(item.id)}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => {}} // Controlled by parent click
                      className="mt-1"
                    />
                    <Icon className={`h-5 w-5 mt-0.5 ${
                      selectedItems.includes(item.id) ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">
                        {item.label}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                    {selectedItems.includes(item.id) && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">출력 설정</CardTitle>
            <CardDescription>
              파일 형식 및 스타일을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Format */}
            <div className="space-y-2">
              <Label>파일 형식 *</Label>
              <Select value={fileFormat} onValueChange={setFileFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="형식을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF 파일</SelectItem>
                  <SelectItem value="docx">Word 문서 (DOCX)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Style */}
            <div className="space-y-2">
              <Label>글꼴 스타일</Label>
              <Select value={fontStyle} onValueChange={setFontStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="글꼴을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">기본 (맑은 고딕)</SelectItem>
                  <SelectItem value="serif">명조체 (바탕)</SelectItem>
                  <SelectItem value="sans">고딕체 (돋움)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview Summary */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">출력 미리보기</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>선택된 항목: {selectedItems.length}개</p>
                <p>파일 형식: {fileFormat ? fileFormat.toUpperCase() : "미선택"}</p>
                <p>글꼴: {fontStyle === "default" ? "맑은 고딕" : fontStyle === "serif" ? "바탕" : fontStyle === "sans" ? "돋움" : "기본"}</p>
              </div>
            </div>

            {/* Export Button */}
            <Button 
              onClick={handleExport}
              disabled={isExporting || selectedItems.length === 0 || !fileFormat}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "출력 중..." : "파일 다운로드"}
            </Button>

            {/* Export Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">💡 출력 팁</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• PDF: 인쇄 및 공유에 최적화</li>
                <li>• Word: 추가 편집이 가능</li>
                <li>• 전체 요약 포함 시 더 완성도 높은 문서 생성</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">최근 출력 내역</CardTitle>
          <CardDescription>
            최근에 다운로드한 파일들을 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-800">취업준비_종합자료.pdf</p>
                  <p className="text-sm text-slate-600">2024년 6월 6일 14:30</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                재다운로드
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-slate-800">자기소개서_첨삭.docx</p>
                  <p className="text-sm text-slate-600">2024년 6월 5일 09:15</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                재다운로드
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportOptions;
