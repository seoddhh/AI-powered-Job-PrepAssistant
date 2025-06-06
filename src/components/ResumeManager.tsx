
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeResume, generateResume } from "@/lib/api";
import { 
  FileText, 
  Wand2, 
  Eye, 
  Save, 
  Copy,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

const ResumeManager = () => {
  const { toast } = useToast();
  const [originalText, setOriginalText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock feedback data
  const feedbackData = {
    grammarIssues: [
      { line: 2, issue: "문장이 너무 길어 가독성이 떨어집니다.", suggestion: "두 개의 문장으로 나누어 작성해보세요." },
      { line: 5, issue: "수동태 표현보다 능동태로 작성하는 것이 좋습니다.", suggestion: "주체를 명확히 하여 능동적으로 표현해보세요." }
    ],
    structureIssues: [
      { section: "도입부", issue: "지원동기가 명확하지 않습니다.", suggestion: "회사와 직무에 대한 구체적인 관심사를 표현해보세요." },
      { section: "경험 설명", issue: "성과에 대한 구체적인 수치가 부족합니다.", suggestion: "프로젝트 결과를 정량적으로 표현해보세요." }
    ]
  };

  const handleAnalyze = async () => {
    if (!originalText.trim()) {
      toast({
        title: "입력 오류",
        description: "분석할 자기소개서를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeResume(originalText);
      toast({
        title: "분석 완료",
        description: "AI 첨삭이 완료되었습니다. 결과를 확인해보세요.",
      });
    } catch (err) {
      toast({
        title: "오류",
        description: "분석 요청 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast({
        title: "입력 오류",
        description: "키워드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await generateResume(keywords);
      toast({
        title: "생성 완료",
        description: "AI가 자기소개서를 생성했습니다.",
      });
    } catch (err) {
      toast({
        title: "오류",
        description: "생성 요청 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <CardTitle>자기소개서 관리</CardTitle>
          </div>
          <CardDescription>
            AI를 활용하여 자기소개서를 작성하고 첨삭받으세요
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="write">원문 입력/수정</TabsTrigger>
          <TabsTrigger value="feedback">AI 첨삭 보기</TabsTrigger>
          <TabsTrigger value="generate">신규 생성</TabsTrigger>
        </TabsList>

        {/* Write Tab */}
        <TabsContent value="write" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">자기소개서 작성</CardTitle>
              <CardDescription>
                자기소개서를 작성하거나 기존 내용을 수정하세요 (200-5000자)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="자기소개서를 입력해주세요. AI가 문법, 구성, 표현력 등을 종합적으로 분석하여 개선 방안을 제시해드립니다."
                rows={15}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">
                  {originalText.length}/5000자 
                  {originalText.length < 200 && originalText.length > 0 && (
                    <span className="text-orange-500 ml-2">최소 200자 이상 입력해주세요</span>
                  )}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    임시저장
                  </Button>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || originalText.length < 200}
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="h-4 w-4" />
                    {isAnalyzing ? "분석 중..." : "AI 첨삭 요청"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  원문
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {originalText || "분석할 자기소개서를 먼저 입력해주세요."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  AI 첨삭 결과
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Grammar Issues */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    문법 및 표현 개선
                  </h4>
                  <div className="space-y-2">
                    {feedbackData.grammarIssues.map((item, index) => (
                      <div key={index} className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-orange-800">
                          {index + 1}줄: {item.issue}
                        </p>
                        <p className="text-sm text-orange-600 mt-1">
                          💡 {item.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structure Issues */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    구성 및 내용 개선
                  </h4>
                  <div className="space-y-2">
                    {feedbackData.structureIssues.map((item, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          {item.section}: {item.issue}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          💡 {item.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  개선된 버전 복사
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI 자기소개서 생성</CardTitle>
              <CardDescription>
                키워드를 입력하면 AI가 맞춤형 자기소개서를 생성해드립니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">핵심 키워드 입력 (최대 5개)</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="예: React, 팀워크, 문제해결, 성장마인드, 커뮤니케이션"
                />
                <p className="text-sm text-slate-500">
                  쉼표(,)로 구분하여 입력해주세요
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {keywords.split(',').filter(k => k.trim()).map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword.trim()}
                  </Badge>
                ))}
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isAnalyzing || !keywords.trim()}
                className="w-full"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isAnalyzing ? "생성 중..." : "AI 자기소개서 생성"}
              </Button>

              {/* Generated Result Preview */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    생성된 자기소개서
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    AI가 생성한 자기소개서입니다. 필요에 따라 수정하여 사용하세요.
                  </p>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm leading-relaxed">
                      생성된 자기소개서가 여기에 표시됩니다...
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      복사
                    </Button>
                    <Button size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      저장 후 편집
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeManager;
