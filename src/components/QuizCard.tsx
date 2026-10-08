'use client';

import React from 'react';
import { QuizQuestion, QuizAttemptState } from '@/types/study';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface QuizCardProps {
  quiz: QuizQuestion;
  state?: QuizAttemptState;
  isRetry?: boolean;
  onAnswer: (quizId: string, selectedIndex: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  state,
  isRetry,
  onAnswer,
}) => {
  const isAnswered = state && state.status !== 'unanswered';
  const isCorrect = state?.status === 'correct';
  const isIncorrect = state?.status === 'incorrect';

  return (
    <div
      className={`border rounded-2xl p-5 mb-4 transition-all shadow-sm ${
        isCorrect
          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
          : isIncorrect
          ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
          : isRetry
          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
          : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              isCorrect
                ? 'bg-emerald-600 text-white'
                : isIncorrect
                ? 'bg-rose-600 text-white'
                : isRetry
                ? 'bg-amber-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : isIncorrect ? (
              <XCircle className="w-4 h-4" />
            ) : isRetry ? (
              <RotateCcw className="w-4 h-4" />
            ) : (
              <HelpCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {isRetry ? 'Spaced Repetition Review' : 'Knowledge Checkpoint'}
            </h4>
            <p className="text-[11px] text-zinc-500">
              {isRetry
                ? 'Reviewing previous misstep to reinforce memory'
                : `Tests concepts up to Post #${quiz.associatedPostOrder}`}
            </p>
          </div>
        </div>

        {isRetry && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Retry Round
          </span>
        )}
      </div>

      {/* Question */}
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4 leading-snug">
        {quiz.question}
      </h3>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {quiz.options.map((option, idx) => {
          const isSelected = state?.selectedOptionIndex === idx;
          const isRightAnswer = idx === quiz.correctAnswerIndex;

          let optionStyle =
            'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-zinc-800 dark:text-zinc-200';

          if (isAnswered) {
            if (isRightAnswer) {
              optionStyle =
                'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
            } else if (isSelected && !isRightAnswer) {
              optionStyle =
                'border-rose-500 bg-rose-100/70 dark:bg-rose-900/50 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500';
            } else {
              optionStyle = 'opacity-50 border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 text-zinc-500';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => onAnswer(quiz.id, idx)}
              className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 ${optionStyle}`}
            >
              <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 leading-snug">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation & Retry Feedback */}
      {isAnswered && (
        <div className="pt-3 border-t border-zinc-200/70 dark:border-zinc-800/80 text-xs">
          <div className="flex items-center gap-1.5 font-bold mb-1.5">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Correct! Nice work.
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Incorrect. Queued for spaced repetition!
              </span>
            )}
          </div>

          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Explanation: </span>
            {quiz.explanation}
          </p>

          {isIncorrect && (
            <div className="p-2.5 rounded-lg bg-rose-100/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                This quiz has been pushed 3 posts down your feed. You will see it again soon!
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Retry Scheduled</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
