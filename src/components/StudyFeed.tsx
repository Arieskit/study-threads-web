'use client';

import React, { useState, useMemo } from 'react';
import { StudyPost, QuizQuestion, QuizAttemptState, PostComment, FeedItem } from '@/types/study';
import { PostCard } from './PostCard';
import { QuizCard } from './QuizCard';
import { CommentDrawer } from './CommentDrawer';
import { BookOpen, CheckCircle, RotateCcw, Award } from 'lucide-react';

interface StudyFeedProps {
  courseTitle: string;
  courseTag: string;
  posts: StudyPost[];
  quizzes: QuizQuestion[];
}

export const StudyFeed: React.FC<StudyFeedProps> = ({
  courseTitle,
  courseTag,
  posts,
  quizzes,
}) => {
  // State for quiz attempts: quizId -> QuizAttemptState
  const [quizAttempts, setQuizAttempts] = useState<Record<string, QuizAttemptState>>({});
  
  // State for active comment drawer
  const [activeCommentPost, setActiveCommentPost] = useState<StudyPost | null>(null);
  
  // Comments store: postId -> PostComment[]
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>({});

  // Answer handler
  const handleAnswerQuiz = (quizId: string, selectedIndex: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    const isCorrect = selectedIndex === quiz.correctAnswerIndex;
    const prevAttempts = quizAttempts[quizId]?.attemptsCount || 0;

    setQuizAttempts((prev) => ({
      ...prev,
      [quizId]: {
        quizId,
        status: isCorrect ? 'correct' : 'incorrect',
        selectedOptionIndex: selectedIndex,
        attemptsCount: prevAttempts + 1,
        // If wrong, schedule it to reappear after 3 more posts!
        reappearAfterPostOrder: !isCorrect ? quiz.associatedPostOrder + 3 : undefined,
      },
    }));
  };

  const handleAddComment = (comment: PostComment) => {
    setCommentsMap((prev) => ({
      ...prev,
      [comment.postId]: [...(prev[comment.postId] || []), comment],
    }));
  };

  // Compile the interactive sequential Feed:
  // Interleaving Posts, scheduled Quizzes, and dynamically scheduled Retry Quizzes
  const feedItems = useMemo(() => {
    const items: FeedItem[] = [];

    // Map of initial quizzes by associatedPostOrder
    const initialQuizzesByOrder: Record<number, QuizQuestion[]> = {};
    quizzes.forEach((q) => {
      if (!initialQuizzesByOrder[q.associatedPostOrder]) {
        initialQuizzesByOrder[q.associatedPostOrder] = [];
      }
      initialQuizzesByOrder[q.associatedPostOrder].push(q);
    });

    // Map of retry quizzes by reappearAfterPostOrder
    const retryQuizzesByOrder: Record<number, QuizQuestion[]> = {};
    Object.values(quizAttempts).forEach((attempt) => {
      if (attempt.status === 'incorrect' && attempt.reappearAfterPostOrder) {
        const targetQuiz = quizzes.find((q) => q.id === attempt.quizId);
        if (targetQuiz) {
          if (!retryQuizzesByOrder[attempt.reappearAfterPostOrder]) {
            retryQuizzesByOrder[attempt.reappearAfterPostOrder] = [];
          }
          retryQuizzesByOrder[attempt.reappearAfterPostOrder].push(targetQuiz);
        }
      }
    });

    posts.forEach((post) => {
      items.push({ type: 'post', data: post });

      // Insert normal quiz if scheduled right after this post
      const scheduledNormal = initialQuizzesByOrder[post.sequenceOrder] || [];
      scheduledNormal.forEach((quiz) => {
        items.push({
          type: 'quiz',
          data: quiz,
          state: quizAttempts[quiz.id],
          isRetry: false,
        });
      });

      // Insert retry quiz if scheduled right after this post!
      const scheduledRetries = retryQuizzesByOrder[post.sequenceOrder] || [];
      scheduledRetries.forEach((quiz) => {
        items.push({
          type: 'quiz',
          data: quiz,
          state: quizAttempts[quiz.id],
          isRetry: true,
        });
      });
    });

    return items;
  }, [posts, quizzes, quizAttempts]);

  // Statistics
  const passedQuizzesCount = Object.values(quizAttempts).filter((a) => a.status === 'correct').length;
  const pendingRetryCount = Object.values(quizAttempts).filter((a) => a.status === 'incorrect').length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Sticky Feed Header / Progress */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-14 z-30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {courseTag}
          </span>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-xs sm:max-w-md">
            {courseTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{passedQuizzesCount}/{quizzes.length} Quizzes</span>
          </div>

          {pendingRetryCount > 0 && (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg animate-pulse">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{pendingRetryCount} in Retry</span>
            </div>
          )}
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-1">
        {feedItems.map((item, index) => {
          if (item.type === 'post') {
            const comments = commentsMap[item.data.id] || [];
            return (
              <PostCard
                key={`post_${item.data.id}_${index}`}
                post={item.data}
                totalPosts={posts.length}
                courseTag={courseTag}
                onOpenComments={(post) => setActiveCommentPost(post)}
                commentCount={comments.length}
              />
            );
          } else {
            return (
              <QuizCard
                key={`quiz_${item.data.id}_${index}`}
                quiz={item.data}
                state={item.state}
                isRetry={item.isRetry}
                onAnswer={handleAnswerQuiz}
              />
            );
          }
        })}
      </div>

      {/* Feed Completed Footer Card */}
      {posts.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800/80 border border-indigo-100 dark:border-zinc-800 rounded-3xl p-8 text-center my-8 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            You've reached the end of this study stream!
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
            You completed {posts.length} concept posts and answered {passedQuizzesCount} checkpoints.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-indigo-100 dark:border-zinc-700">
            <BookOpen className="w-4 h-4" />
            Upload more notes to continue expanding your knowledge feed.
          </div>
        </div>
      )}

      {/* Slide-over Comments Drawer */}
      <CommentDrawer
        post={activeCommentPost}
        isOpen={!!activeCommentPost}
        onClose={() => setActiveCommentPost(null)}
        comments={activeCommentPost ? commentsMap[activeCommentPost.id] || [] : []}
        onAddComment={handleAddComment}
      />
    </div>
  );
};
