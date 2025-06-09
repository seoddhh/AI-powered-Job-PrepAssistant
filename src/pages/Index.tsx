import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  FileText, 
  Building2, 
  MessageSquare, 
  BarChart3,
  Download,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import ResumeManager from "@/components/ResumeManager";
import CompanyManager from "@/components/CompanyManager";
import InterviewManager from "@/components/InterviewManager";
import ExportOptions from "@/components/ExportOptions";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { resume, interviews } = useDashboard();

  const dashboardStats = {
    personalInfo: { completed: true, progress: 100 },
    resume,
    companies: { count: 3, completed: true },
    interviews
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            AI 취업 준비 매니저
          </h1>
          <p className="text-lg text-slate-600">
            AI 기반 자기소개서 첨삭 및 면접 준비 시스템
          </p>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              대시보드
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              인적사항
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              자기소개서
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              기업정보
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              면접준비
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              출력/내보내기
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Personal Info Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">인적사항</CardTitle>
                  {dashboardStats.personalInfo.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {dashboardStats.personalInfo.completed ? "완료" : "미완료"}
                  </div>
                  <Progress value={dashboardStats.personalInfo.progress} className="mt-2" />
                </CardContent>
              </Card>

              {/* Resume Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">자기소개서</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {dashboardStats.resume.progress}%
                  </div>
                  <Progress value={dashboardStats.resume.progress} className="mt-2" />
                  <p className="text-xs text-slate-600 mt-2">
                    {dashboardStats.resume.completed ? 'AI 첨삭 완료' : 'AI 첨삭 진행중'}
                  </p>
                </CardContent>
              </Card>

              {/* Companies Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">지원 기업</CardTitle>
                  <Building2 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {dashboardStats.companies.count}개
                  </div>
                  <p className="text-xs text-slate-600 mt-2">기업 정보 등록됨</p>
                </CardContent>
              </Card>

              {/* Interview Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">면접 준비</CardTitle>
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {dashboardStats.interviews.answered}/{dashboardStats.interviews.total}
                  </div>
                  <Progress value={dashboardStats.interviews.progress} className="mt-2" />
                  <p className="text-xs text-slate-600 mt-2">
                    {dashboardStats.interviews.progress === 100 ? '모든 질문 답변 완료' : '질문 답변 진행중'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>
                  최근 AI 분석 및 피드백 현황을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">자기소개서 AI 첨삭 완료</h4>
                      <p className="text-sm text-slate-600">문법 및 구성 개선 사항 3건 발견</p>
                    </div>
                    <Button variant="outline" size="sm">
                      확인하기
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">면접 질문 생성 완료</h4>
                      <p className="text-sm text-slate-600">네이버 프론트엔드 개발자 면접 질문 10개 생성</p>
                    </div>
                    <Button variant="outline" size="sm">
                      답변하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="personal">
            <PersonalInfoForm />
          </TabsContent>

          <TabsContent value="resume">
            <ResumeManager />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyManager />
          </TabsContent>

          <TabsContent value="interview">
            <InterviewManager />
          </TabsContent>

          <TabsContent value="export">
            <ExportOptions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
