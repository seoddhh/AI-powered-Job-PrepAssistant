
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { generateInterviewQuestions, getInterviewFeedback } from "@/lib/api";
import { 
  MessageSquare, 
  Wand2, 
  Save, 
  CheckCircle,
  Clock,
  AlertCircle,
  Target
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  answer: string;
  status: 'unanswered' | 'pending' | 'completed';
  feedback?: string;
}

const InterviewManager = () => {
  const { toast } = useToast();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const handleGenerateQuestions = async () => {
    if (!position.trim() || !experience.trim()) {
      toast({ title: '입력 오류', description: '직무와 경력을 입력해주세요.', variant: 'destructive' });
      return;
    }
    try {
      const result = await generateInterviewQuestions(position, experience);
      const lines = (result.result || result).split('\n').filter((l: string) => l.trim());
      const items = lines.map((line: string, idx: number) => ({
        id: String(idx + 1),
        question: line.replace(/^질문:\s*/, '').trim(),
        answer: '',
        status: 'unanswered' as const,
      }));
      setQuestions(items);
      setSelectedQuestionId(null);
      toast({ title: '생성 완료', description: '면접 질문이 생성되었습니다.' });
    } catch (err) {
      console.error(err);
      toast({ title: '오류', description: '질문 생성에 실패했습니다.', variant: 'destructive' });
    }
  };

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

    setQuestions(prev => prev.map(q =>
      q.id === selectedQuestionId
        ? { ...q, status: 'pending' as const }
        : q
    ));

    try {
      const result = await getInterviewFeedback(selectedQuestion.question, selectedQuestion.answer);
      setQuestions(prev => prev.map(q =>
        q.id === selectedQuestionId
          ? { ...q, status: 'completed' as const, feedback: result.result || result }
          : q
      ));
      toast({ title: '피드백 완료', description: 'AI 피드백이 생성되었습니다.' });
    } catch (err) {
      console.error(err);
      toast({ title: '오류', description: '피드백 생성에 실패했습니다.', variant: 'destructive' });
      setQuestions(prev => prev.map(q =>
        q.id === selectedQuestionId
          ? { ...q, status: 'unanswered' as const }
          : q
      ));
    }
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
            <div className="space-y-2 pt-4">
              <input
                className="w-full border rounded p-2 text-sm"
                placeholder="지원 직무"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <input
                className="w-full border rounded p-2 text-sm"
                placeholder="경력"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
              <Button className="w-full" onClick={handleGenerateQuestions}>
                질문 생성
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {questions.length === 0 && (
                  <p className="text-sm text-slate-500">질문을 생성해주세요.</p>
                )}
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
                    <div className="bg-slate-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                      {selectedQuestion.feedback}
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
