
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Wand2, 
  Save, 
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  Target
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  answer: string;
  status: 'unanswered' | 'pending' | 'completed';
  feedback?: {
    score: number;
    improvements: string[];
    suggestions: string[];
  };
}

const InterviewManager = () => {
  const { toast } = useToast();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "자기소개를 해주세요.",
      answer: "",
      status: 'unanswered'
    },
    {
      id: "2", 
      question: "왜 우리 회사에 지원하셨나요?",
      answer: "네이버는 혁신적인 기술로 사용자들의 일상을 변화시키는 회사입니다. 특히 프론트엔드 개발자로서 수많은 사용자가 사용하는 서비스를 만들고 싶습니다.",
      status: 'completed',
      feedback: {
        score: 75,
        improvements: ["구체적인 경험 사례 추가 필요", "회사의 구체적인 가치나 프로젝트 언급"],
        suggestions: ["본인의 기술 스택과 회사의 기술 스택 연결점 설명", "실제 네이버 서비스 사용 경험 언급"]
      }
    },
    {
      id: "3",
      question: "프론트엔드 개발에서 가장 중요하게 생각하는 것은 무엇인가요?",
      answer: "사용자 경험이라고 생각합니다. 아무리 좋은 기능이라도 사용자가 쉽게 사용할 수 없다면 의미가 없다고 봅니다.",
      status: 'pending'
    },
    {
      id: "4",
      question: "팀 프로젝트에서 갈등이 생겼을 때 어떻게 해결하시나요?",
      answer: "",
      status: 'unanswered'
    },
    {
      id: "5",
      question: "본인의 강점과 약점을 말씀해주세요.",
      answer: "",
      status: 'unanswered'
    }
  ]);

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const handleAnswerChange = (value: string) => {
    if (!selectedQuestionId) return;
    
    setQuestions(prev => prev.map(q => 
      q.id === selectedQuestionId 
        ? { ...q, answer: value, status: value.trim() ? 'pending' : 'unanswered' as const }
        : q
    ));
  };

  const handleSaveAnswer = () => {
    if (!selectedQuestion?.answer.trim()) {
      toast({
        title: "입력 오류",
        description: "답변을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (selectedQuestion.answer.length < 50) {
      toast({
        title: "입력 오류", 
        description: "답변은 최소 50자 이상 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "저장 완료",
      description: "답변이 저장되었습니다.",
    });
  };

  const handleRequestFeedback = async () => {
    if (!selectedQuestion?.answer.trim()) return;

    // Simulate AI feedback request
    setQuestions(prev => prev.map(q => 
      q.id === selectedQuestionId 
        ? { ...q, status: 'pending' as const }
        : q
    ));

    // Simulate AI response after 3 seconds
    setTimeout(() => {
      setQuestions(prev => prev.map(q => 
        q.id === selectedQuestionId 
          ? { 
              ...q, 
              status: 'completed' as const,
              feedback: {
                score: Math.floor(Math.random() * 30) + 70,
                improvements: [
                  "구체적인 사례를 더 추가해주세요",
                  "결과와 성과를 정량적으로 표현해보세요"
                ],
                suggestions: [
                  "STAR 기법을 활용해보세요",
                  "본인의 역할과 기여도를 명확히 해주세요"
                ]
              }
            }
          : q
      ));
      
      toast({
        title: "피드백 완료",
        description: "AI 피드백이 생성되었습니다.",
      });
    }, 3000);
  };

  const getStatusIcon = (status: Question['status']) => {
    switch (status) {
      case 'unanswered':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusText = (status: Question['status']) => {
    switch (status) {
      case 'unanswered':
        return '미입력';
      case 'pending':
        return '피드백 대기';
      case 'completed':
        return '완료';
    }
  };

  const getStatusColor = (status: Question['status']) => {
    switch (status) {
      case 'unanswered':
        return 'bg-gray-100 text-gray-600';
      case 'pending':
        return 'bg-orange-100 text-orange-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <CardTitle>면접 질문 및 답변</CardTitle>
          </div>
          <CardDescription>
            AI가 생성한 면접 질문에 답변하고 피드백을 받아보세요
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">면접 질문 목록</CardTitle>
            <CardDescription>
              질문을 선택하여 답변해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    onClick={() => setSelectedQuestionId(question.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedQuestionId === question.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 mb-2 line-clamp-2">
                          {question.question}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(question.status)}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(question.status)}`}>
                            {getStatusText(question.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Answer Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedQuestion ? "답변 작성" : "질문을 선택해주세요"}
            </CardTitle>
            {selectedQuestion && (
              <CardDescription>
                {selectedQuestion.question}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedQuestion ? (
              <div className="space-y-6">
                {/* Answer Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">답변 입력</h4>
                    <span className="text-sm text-slate-500">
                      {selectedQuestion.answer.length}/1000자
                    </span>
                  </div>
                  <Textarea
                    value={selectedQuestion.answer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="면접 답변을 작성해주세요. 구체적인 경험과 사례를 포함하면 더 좋은 피드백을 받을 수 있습니다."
                    rows={8}
                    className="w-full"
                  />
                  {selectedQuestion.answer.length > 0 && selectedQuestion.answer.length < 50 && (
                    <p className="text-sm text-orange-500">
                      최소 50자 이상 입력해주세요
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={handleSaveAnswer} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </Button>
                  <Button 
                    onClick={handleRequestFeedback}
                    disabled={!selectedQuestion.answer.trim() || selectedQuestion.answer.length < 50}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI 피드백 요청
                  </Button>
                </div>

                {/* Feedback Section */}
                {selectedQuestion.feedback && (
                  <div className="space-y-4 pt-6 border-t">
                    <h4 className="font-medium text-slate-800 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      AI 피드백 결과
                    </h4>
                    
                    {/* Score */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-blue-800">종합 점수</span>
                        <Badge variant="secondary">{selectedQuestion.feedback.score}/100</Badge>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${selectedQuestion.feedback.score}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Improvements */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        개선이 필요한 부분
                      </h5>
                      <ul className="space-y-1">
                        {selectedQuestion.feedback.improvements.map((item, index) => (
                          <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        개선 제안사항
                      </h5>
                      <ul className="space-y-1">
                        {selectedQuestion.feedback.suggestions.map((item, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  질문을 선택해주세요
                </h3>
                <p className="text-slate-500">
                  왼쪽 목록에서 답변할 질문을 선택하세요
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewManager;
