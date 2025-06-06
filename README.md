# AI 취업 준비 매니저

AI 기반 자기소개서 첨삭과 면접 준비를 돕는 웹 애플리케이션입니다. React와 Express를 사용하여 프론트엔드와 백엔드를 구성하고, Anthropic Claude API를 활용해 문서 분석과 생성 기능을 제공합니다.

## 주요 기능

- **자기소개서 분석**: 사용자가 입력한 자기소개서를 AI가 분석하여 강점과 개선점을 알려줍니다.
- **자기소개서 생성**: 키워드를 기반으로 새로운 자기소개서를 작성해 줍니다.
- **면접 질문 생성**: 지원 기업과 포지션 정보를 입력하면 예상 면접 질문을 생성합니다.
- **면접 답변 피드백**: 면접 답변에 대한 구체적인 피드백을 제공합니다.
- **기업 정보 및 인적사항 관리**: 지원 기업 목록과 개인 정보를 편리하게 관리할 수 있습니다.
- **PDF/Word 내보내기**: 작성한 내용은 파일로 저장하여 활용할 수 있습니다.

## 폴더 구조와 핵심 컴포넌트

```
AI-powered-Job-PrepAssistant/
├─ public/           # 정적 파일 (favicon 등)
├─ server/           # Express 서버 코드
│  └─ server.js      # Anthropic API와 통신하는 REST 엔드포인트 정의
├─ src/              # React 소스
│  ├─ components/    # 재사용 가능한 UI 컴포넌트
│  │  ├─ PersonalInfoForm.tsx
│  │  ├─ ResumeManager.tsx
│  │  ├─ CompanyManager.tsx
│  │  └─ InterviewManager.tsx
│  ├─ pages/         # 라우트별 페이지 컴포넌트
│  ├─ contexts/      # 전역 상태 관리(Context API)
│  ├─ hooks/         # 커스텀 훅
│  └─ lib/           # 서버와 통신하는 API 함수
├─ package.json      # npm 스크립트 및 의존성 관리
└─ vite.config.ts    # Vite 설정
```

`src/lib/api.ts`에서 정의한 함수들이 `server/server.js`의 REST 엔드포인트와 연결되어 있으며, 각 UI 컴포넌트는 이러한 함수를 호출해 AI 서비스를 이용합니다. `App.tsx`는 React Router로 페이지를 관리하며, 주요 페이지는 `src/pages/Index.tsx`에 구현되어 있습니다.

## 개발 및 실행 방법

1. 저장소 클론 후 의존성 설치

   ```bash
   npm install
   ```

2. `.env` 파일을 생성하고 필요한 환경 변수를 입력합니다 (`.env.example` 참고).

3. 백엔드 서버 실행

   ```bash
   npm run server
   ```

   기본 포트는 **3001**이며 `.env`의 `PORT` 값으로 변경할 수 있습니다.

4. 프론트엔드 개발 서버 실행

   ```bash
   npm run dev
   ```

   브라우저에서 `http://localhost:5173` (Vite 기본 포트)로 접속하면 애플리케이션을 확인할 수 있습니다.

빌드가 필요할 경우 `npm run build` 명령을 사용할 수 있습니다.

## .env에 필요한 항목

```
ANTHROPIC_API_KEY=your-anthropic-api-key
PORT=3001 # 선택 사항, 기본값 3001
```

`ANTHROPIC_API_KEY`는 Claude API 호출에 사용되며, `PORT`는 Express 서버가 실행될 포트를 지정합니다.
