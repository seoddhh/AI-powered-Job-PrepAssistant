# 데이터베이스 스키마

다음 테이블들이 PostgreSQL 데이터베이스에 사용됩니다.

## resumes
- `id` SERIAL PRIMARY KEY
- `name` TEXT
- `position` TEXT
- `experience` TEXT
- `content` TEXT
- `feedback` TEXT

자기소개서 분석 결과를 저장합니다.

## generated_resumes
- `id` SERIAL PRIMARY KEY
- `name` TEXT
- `position` TEXT
- `experience` TEXT
- `keywords` TEXT
- `content` TEXT

키워드를 기반으로 생성된 자기소개서를 저장합니다.

## questions
- `id` SERIAL PRIMARY KEY
- `company` TEXT
- `position` TEXT
- `experience` TEXT
- `content` TEXT

면접 질문 목록을 저장합니다.

## answers
- `id` SERIAL PRIMARY KEY
- `question` TEXT
- `answer` TEXT
- `feedback` TEXT

면접 답변에 대한 피드백을 저장합니다.
