import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { postContent, sourceSnippet, userQuestion, history } = await req.json();

    if (!userQuestion || !postContent) {
      return NextResponse.json({ error: 'postContent and userQuestion are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `
You are a helpful, encouraging, and knowledgeable AI Teaching Assistant (TA) embedded directly inside a micro-learning social feed.
A student is asking a follow-up question in the comments of a specific concept post.

Guidelines:
1. Ground your answer in the post content and original source snippet provided.
2. Be concise, direct, and conversational (keep answers within 100-200 words).
3. Provide intuitive analogies or step-by-step reasoning if the question asks for derivation or "why".
4. If the question asks for information outside the course scope, politely mention what is known from the text and give a brief guiding explanation.
`,
    });

    const prompt = `
[POST CONTEXT]
${postContent}

[SOURCE TEXT SNIPPET]
${sourceSnippet || 'Not provided'}

[PRIOR COMMENT THREAD]
${(history || []).map((h: any) => `${h.role === 'user' ? 'Student' : 'AI Tutor'}: ${h.content}`).join('\n')}

[STUDENT QUESTION]
${userQuestion}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('Error generating comment response:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate tutor reply' },
      { status: 500 }
    );
  }
}
