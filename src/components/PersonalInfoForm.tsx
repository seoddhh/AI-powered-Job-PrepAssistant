
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";

const PersonalInfoForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    desiredPosition: "",
    experienceYears: "",
    detailedExperience: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "입력 오류",
        description: "이름을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    // Save logic would go here
    toast({
      title: "저장 완료",
      description: "인적사항이 성공적으로 저장되었습니다.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-blue-600" />
          <CardTitle>인적사항 입력</CardTitle>
        </div>
        <CardDescription>
          기본 정보를 입력해주세요. 이 정보는 자기소개서 및 면접 질문 생성에 활용됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="홍길동"
                className="w-full"
              />
            </div>

            {/* Desired Position Field */}
            <div className="space-y-2">
              <Label htmlFor="position">희망 직무 *</Label>
              <Select 
                value={formData.desiredPosition} 
                onValueChange={(value) => handleInputChange("desiredPosition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="직무를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">프론트엔드 개발자</SelectItem>
                  <SelectItem value="backend">백엔드 개발자</SelectItem>
                  <SelectItem value="fullstack">풀스택 개발자</SelectItem>
                  <SelectItem value="mobile">모바일 개발자</SelectItem>
                  <SelectItem value="devops">DevOps 엔지니어</SelectItem>
                  <SelectItem value="data">데이터 사이언티스트</SelectItem>
                  <SelectItem value="ai">AI/ML 엔지니어</SelectItem>
                  <SelectItem value="pm">프로덕트 매니저</SelectItem>
                  <SelectItem value="designer">UI/UX 디자이너</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience Years Field */}
            <div className="space-y-2">
              <Label htmlFor="experience">경력 년수 *</Label>
              <Select 
                value={formData.experienceYears} 
                onValueChange={(value) => handleInputChange("experienceYears", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="경력을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">신입 (0년)</SelectItem>
                  <SelectItem value="1">1년</SelectItem>
                  <SelectItem value="2">2년</SelectItem>
                  <SelectItem value="3">3년</SelectItem>
                  <SelectItem value="4">4년</SelectItem>
                  <SelectItem value="5">5년</SelectItem>
                  <SelectItem value="6-10">6-10년</SelectItem>
                  <SelectItem value="10+">10년 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Detailed Experience Field */}
          <div className="space-y-2">
            <Label htmlFor="detailedExperience">세부 경력 및 기술 스택</Label>
            <Textarea
              id="detailedExperience"
              value={formData.detailedExperience}
              onChange={(e) => handleInputChange("detailedExperience", e.target.value)}
              placeholder="주요 프로젝트 경험, 사용 기술, 성과 등을 자유롭게 입력해주세요. (예: React, Node.js를 활용한 웹 서비스 개발, 팀 프로젝트 리딩 경험 등)"
              rows={6}
              className="w-full"
            />
            <p className="text-sm text-slate-500">
              최대 1000자까지 입력 가능합니다. ({formData.detailedExperience.length}/1000)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              초기화
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              저장하기
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
