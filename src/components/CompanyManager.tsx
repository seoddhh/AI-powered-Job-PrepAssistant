
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  position: string;
  keywords: string[];
}

const CompanyManager = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "네이버",
      position: "프론트엔드 개발자",
      keywords: ["React", "TypeScript", "사용자 경험", "팀워크", "성장"]
    },
    {
      id: "2", 
      name: "카카오",
      position: "풀스택 개발자",
      keywords: ["Vue.js", "Node.js", "혁신", "도전정신", "커뮤니케이션"]
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    keywords: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.position.trim()) {
      toast({
        title: "입력 오류",
        description: "기업명과 포지션명을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    const keywordsArray = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .slice(0, 5);

    if (editingId) {
      // Edit existing company
      setCompanies(prev => prev.map(company => 
        company.id === editingId 
          ? { ...company, name: formData.name, position: formData.position, keywords: keywordsArray }
          : company
      ));
      setEditingId(null);
    } else {
      // Add new company
      const newCompany: Company = {
        id: Date.now().toString(),
        name: formData.name,
        position: formData.position,
        keywords: keywordsArray
      };
      setCompanies(prev => [...prev, newCompany]);
      setIsAdding(false);
    }

    setFormData({ name: "", position: "", keywords: "" });
    toast({
      title: "저장 완료",
      description: editingId ? "기업 정보가 수정되었습니다." : "새 기업이 추가되었습니다.",
    });
  };

  const handleEdit = (company: Company) => {
    setFormData({
      name: company.name,
      position: company.position,
      keywords: company.keywords.join(', ')
    });
    setEditingId(company.id);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
    toast({
      title: "삭제 완료",
      description: "기업 정보가 삭제되었습니다.",
    });
  };

  const handleCancel = () => {
    setFormData({ name: "", position: "", keywords: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <CardTitle>기업/직무 정보 관리</CardTitle>
            </div>
            <Button 
              onClick={() => setIsAdding(true)}
              disabled={isAdding || editingId !== null}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              기업 추가
            </Button>
          </div>
          <CardDescription>
            지원할 기업과 포지션 정보를 관리하세요. 이 정보는 맞춤형 면접 질문 생성에 활용됩니다.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "기업 정보 수정" : "새 기업 추가"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">기업명 *</Label>
                  <Input
                    id="companyName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="예: 네이버"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">포지션명 *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="예: 프론트엔드 개발자"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">요구 역량 키워드 (최대 5개)</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="예: React, TypeScript, 팀워크, 문제해결, 커뮤니케이션"
                />
                <p className="text-sm text-slate-500">
                  쉼표(,)로 구분하여 입력해주세요
                </p>
              </div>

              {formData.keywords && (
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.split(',').filter(k => k.trim()).slice(0, 5).map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingId ? "수정하기" : "추가하기"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Companies List */}
      <div className="space-y-4">
        {companies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                등록된 기업이 없습니다
              </h3>
              <p className="text-slate-500 mb-4">
                첫 번째 기업을 추가해보세요
              </p>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                기업 추가
              </Button>
            </CardContent>
          </Card>
        ) : (
          companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {company.name}
                      </h3>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        {company.position}
                      </Badge>
                    </div>
                    
                    {company.keywords.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600">
                          요구 역량 키워드:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {company.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(company)}
                      disabled={isAdding || editingId !== null}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(company.id)}
                      disabled={isAdding || editingId !== null}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyManager;
