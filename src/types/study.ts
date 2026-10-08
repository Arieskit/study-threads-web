export interface StudyDocument {
  id: string;
  title: string;
  courseTag: string;
  tags: string[];
  createdAt: string;
  posts: StudyPost[];
  quizzes: QuizQuestion[];
}

export interface StudyPost {
  id: string;
  sequenceOrder: number;
  title: string;
  content: string;
  keyTakeaway: string;
  sourceSnippet?: string;
  tags: string[];
  commentsCount?: number;
}

export interface QuizQuestion {
  id: string;
  associatedPostOrder: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizAttemptState {
  quizId: string;
  status: 'unanswered' | 'correct' | 'incorrect';
  selectedOptionIndex?: number;
  attemptsCount: number;
  reappearAfterPostOrder?: number;
}

export interface PostComment {
  id: string;
  postId: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: string;
}

export type FeedItem =
  | { type: 'post'; data: StudyPost }
  | { type: 'quiz'; data: QuizQuestion; state?: QuizAttemptState; isRetry?: boolean };
