export async function analyzeResume(text: string) {
  const res = await fetch('http://localhost:3001/api/resume/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to analyze resume');
  return res.json();
}

export async function generateResume(keywords: string) {
  const res = await fetch('http://localhost:3001/api/resume/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords }),
  });
  if (!res.ok) throw new Error('Failed to generate resume');
  return res.json();
}

export async function getInterviewFeedback(question: string, answer: string) {
  const res = await fetch('http://localhost:3001/api/interview/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer }),
  });
  if (!res.ok) throw new Error('Failed to get interview feedback');
  return res.json() as Promise<{
    feedback: {
      score: number;
      improvements: string[];
      suggestions: string[];
    };
  }>;
}
