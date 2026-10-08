import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

export const genAI = new GoogleGenerativeAI(apiKey);

export const studyMaterialSchema = {
  type: SchemaType.OBJECT,
  description: 'Schema for breaking down study materials into sequential social media posts and interspersed MC quizzes',
  properties: {
    courseTitle: {
      type: SchemaType.STRING,
      description: 'The title of the course or book topic',
    },
    primaryTag: {
      type: SchemaType.STRING,
      description: 'The primary hashtag for this course (e.g. #ECON101, #Algorithms)',
    },
    posts: {
      type: SchemaType.ARRAY,
      description: 'A continuous sequence of social-media style study posts',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          sequenceOrder: {
            type: SchemaType.INTEGER,
            description: '1-indexed sequential position of this post (1, 2, 3...)',
          },
          title: {
            type: SchemaType.STRING,
            description: 'Engaging micro-concept headline',
          },
          content: {
            type: SchemaType.STRING,
            description: 'Threads/Twitter style post breakdown (150-250 words) with concise bullet points and clear explanations',
          },
          keyTakeaway: {
            type: SchemaType.STRING,
            description: 'One sentence core summary takeaway',
          },
          sourceSnippet: {
            type: SchemaType.STRING,
            description: 'Key reference text from the original material for ground truth reference',
          },
          tags: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'Hashtags related to this concept',
          },
        },
        required: ['sequenceOrder', 'title', 'content', 'keyTakeaway', 'tags'],
      },
    },
    quizzes: {
      type: SchemaType.ARRAY,
      description: 'Multiple choice quizzes interspersed after every 2 posts to test active recall',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: {
            type: SchemaType.STRING,
            description: 'Unique quiz identifier like q_1, q_2',
          },
          associatedPostOrder: {
            type: SchemaType.INTEGER,
            description: 'The post order after which this quiz should initially appear (e.g. 2, 4, 6...)',
          },
          question: {
            type: SchemaType.STRING,
            description: 'Conceptual multiple-choice question testing understanding rather than simple memorization',
          },
          options: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'Exactly 4 plausible options (A, B, C, D)',
          },
          correctAnswerIndex: {
            type: SchemaType.INTEGER,
            description: 'Index of the correct option (0, 1, 2, or 3)',
          },
          explanation: {
            type: SchemaType.STRING,
            description: 'Clear breakdown explaining why the answer is correct and why other choices are incorrect',
          },
        },
        required: ['id', 'associatedPostOrder', 'question', 'options', 'correctAnswerIndex', 'explanation'],
      },
    },
  },
  required: ['courseTitle', 'primaryTag', 'posts', 'quizzes'],
};

export const STUDY_BREAKDOWN_SYSTEM_PROMPT = `
You are an elite academic educator and social media content strategist.
Your mission is to transform dense, academic, or textbook materials into an addictive, educational "Threads / Twitter" style micro-learning feed.

Requirements:
1. Strict Grounding: Rely strictly on the provided material. Do not hallucinate or add facts not present in or reasonably inferred from the material.
2. Sequence & Progression: Break down concepts into sequential, bite-sized posts (sequenceOrder: 1, 2, 3...). Each post must focus on ONE distinct micro-concept.
3. Engaging Format: Keep posts between 150-250 words. Write in an approachable, engaging, and clear tone with bullet points and emojis to minimize cognitive load.
4. Active Recall Quizzes: For every 2 posts, generate 1 conceptual multiple-choice quiz question with 4 plausible options, testing comprehension of the preceding concepts.
5. Hashtags: Tag each post with the primary course tag and 1-2 concept tags.
`;
