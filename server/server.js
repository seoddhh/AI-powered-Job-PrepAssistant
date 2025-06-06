import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

app.post('/api/resume/analyze', async (req, res) => {
  try {
    const { name = '사용자', position = '', experience = '', content, text } = req.body;
    const resumeContent = content || text;

    if (!resumeContent) {
      return res.status(400).json({ error: '자기소개서 내용을 입력해주세요.' });
    }

    const prompt = `다음은 ${name}님의 자기소개서입니다.
지원 포지션: ${position}
경력: ${experience}
내용: ${resumeContent}

위 자기소개서를 분석하여 다음 항목에 대해 피드백을 제공해주세요:
1. 강점
2. 개선이 필요한 부분
3. 구체적인 개선 제안
4. 전체적인 평가`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ result: response.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from Claude' });
  }
});

app.post('/api/resume/generate', async (req, res) => {
  try {
    const { name = '사용자', position = '', experience = '', keywords } = req.body;

    if (!keywords) {
      return res.status(400).json({ error: '키워드를 입력해주세요.' });
    }

    const prompt = `${name}님의 자기소개서를 작성해주세요.
지원 포지션: ${position}
경력: ${experience}
포함할 키워드: ${keywords}

다음 형식으로 작성해주세요:
1. 자기소개
2. 지원 동기
3. 경력 및 프로젝트
4. 향후 목표`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ result: response.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from Claude' });
  }
});

app.post('/api/interview/questions', async (req, res) => {
  try {
    const { position, experience } = req.body;

    if (!position || !experience) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const prompt = `${position} 포지션에 대한 면접 질문을 생성해주세요.
경력: ${experience}

다음 카테고리별로 3개씩 질문을 생성해주세요:
1. 기술 관련 질문
2. 프로젝트 경험 관련 질문
3. 상황 대처 관련 질문
4. 커리어 목표 관련 질문

각 질문은 "질문: "으로 시작해주세요.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ result: response.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from Claude' });
  }
});

app.post('/api/interview/feedback', async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: '질문과 답변을 모두 입력해주세요.' });
    }

    const prompt = `다음 면접 질문과 답변을 평가해주세요.

질문: ${question}
답변: ${answer}

다음 항목에 대해 피드백을 제공해주세요:
1. 답변의 장점
2. 개선이 필요한 부분
3. 구체적인 개선 제안
4. 전체적인 평가`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ result: response.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from Claude' });
  }
});

app.post('/api/test/claude', async (req, res) => {
  const prompt = req.body.prompt || 'Hello Claude!';
  try {
    const result = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ result: result.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get response from Claude', detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
