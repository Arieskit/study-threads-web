import { NextRequest, NextResponse } from 'next/server';
import { genAI, studyMaterialSchema, STUDY_BREAKDOWN_SYSTEM_PROMPT } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { materialText, courseTitle, primaryTag } = await req.json();

    if (!materialText || materialText.trim().length === 0) {
      return NextResponse.json({ error: 'Material text is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: studyMaterialSchema,
        temperature: 0.2,
      },
      systemInstruction: STUDY_BREAKDOWN_SYSTEM_PROMPT,
    });

    const userPrompt = `
Transform the following study material into a sequential micro-learning social feed with interspersed MC quizzes:

Course/Subject: ${courseTitle || 'Untitled Course'}
Preferred Primary Tag: ${primaryTag || '#CourseStudy'}

--- STUDY MATERIAL ---
${materialText}
--- END MATERIAL ---
`;

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating study feed:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate study feed' },
      { status: 500 }
    );
  }
}
