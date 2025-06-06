import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI API 키는 환경변수 OPENAI_API_KEY에 설정합니다.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';

async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

app.post('/api/resume/analyze', async (req, res) => {
  const { text } = req.body;

  const prompt = `
  // 여기에 자기소개서 분석을 위한 프롬프트를 작성하세요.
  ${text}
  `; // TODO: 프롬프트 내용을 원하는 대로 수정하세요.

  try {
    const result = await callOpenAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.post('/api/resume/generate', async (req, res) => {
  const { keywords } = req.body;

  const prompt = `
  // 여기에 자기소개서 생성을 위한 프롬프트를 작성하세요.
  ${keywords}
  `; // TODO: 프롬프트 내용을 원하는 대로 수정하세요.

  try {
    const result = await callOpenAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.post('/api/interview/feedback', async (req, res) => {
  const { question, answer } = req.body;

  const prompt = `
  // 여기에 면접 답변 평가 프롬프트를 작성하세요.
  // 결과는 다음 JSON 형식으로 응답하도록 지시하세요.
  // { "score": number, "improvements": string[], "suggestions": string[] }
  질문: ${question}
  답변: ${answer}
  `; // TODO: 프롬프트 내용을 원하는 대로 수정하세요.

  try {
    const resultText = await callOpenAI(prompt);
    const feedback = JSON.parse(resultText);
    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
