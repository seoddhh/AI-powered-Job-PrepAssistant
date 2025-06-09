
import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
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
  CheckCircle
} from "lucide-react";

const ResumeManager = () => {
  const { toast } = useToast();
  const { setResume } = useDashboard();
  const [originalText, setOriginalText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [generated, setGenerated] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          setOriginalText(text);
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "파일 오류",
        description: "지원하지 않는 파일 형식입니다. txt 파일을 업로드해주세요.",
        variant: "destructive",
      });
    }
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
      const result = await analyzeResume(originalText);
      setFeedback(result.result || result);
      setResume({ completed: true, progress: 100 });
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
      const result = await generateResume(keywords);
      setGenerated(result.result || result);
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
              <div className="space-y-2">
                <Label htmlFor="resume-file">파일 업로드 (.txt)</Label>
                <Input
                  id="resume-file"
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                />
              </div>
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
              <CardContent>
                <Textarea
                  readOnly
                  value={feedback}
                  placeholder="AI 분석 결과가 여기에 표시됩니다."
                  className="w-full"
                  rows={15}
                />
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
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {generated || "생성된 자기소개서가 여기에 표시됩니다..."}
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
