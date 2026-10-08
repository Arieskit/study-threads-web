'use client';

import React, { useState } from 'react';
import { StudyPost, PostComment } from '@/types/study';
import { X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface CommentDrawerProps {
  post: StudyPost | null;
  isOpen: boolean;
  onClose: () => void;
  comments: PostComment[];
  onAddComment: (comment: PostComment) => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  post,
  isOpen,
  onClose,
  comments,
  onAddComment,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !post) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isLoading) return;

    const userComment: PostComment = {
      id: 'cmt_' + Date.now(),
      postId: post.id,
      role: 'user',
      content: inputQuestion.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onAddComment(userComment);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postContent: post.content,
          sourceSnippet: post.sourceSnippet,
          userQuestion: userComment.content,
          history: comments,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const aiComment: PostComment = {
          id: 'cmt_ai_' + Date.now(),
          postId: post.id,
          role: 'ai',
          content: data.reply,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onAddComment(aiComment);
      }
    } catch (err) {
      console.error('Failed to get AI reply:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full flex flex-col shadow-2xl border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              #{post.sequenceOrder}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Discussion & AI Tutor</h3>
              <p className="text-xs text-zinc-500 truncate max-w-[220px]">{post.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Snippet Summary */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-zinc-200 block mb-0.5">Post Concept:</span>
          <p className="line-clamp-2">{post.content}</p>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 p-6">
              <Sparkles className="w-8 h-8 text-indigo-400 mb-2 opacity-60" />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">No questions yet!</p>
              <p className="text-xs mt-1">Ask the AI Tutor anything about this concept. It will answer using your course material.</p>
            </div>
          ) : (
            comments.map((cmt) => (
              <div
                key={cmt.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  cmt.role === 'ai' ? 'items-start' : 'items-start'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${
                    cmt.role === 'ai'
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {cmt.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                      {cmt.role === 'ai' ? 'AI Teaching Assistant' : 'You'}
                    </span>
                    <span className="text-[10px] text-zinc-400">{cmt.createdAt}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${
                      cmt.role === 'ai'
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-zinc-800 dark:text-zinc-200 border border-indigo-100 dark:border-indigo-900/50'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {cmt.content}
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-zinc-400">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>AI Tutor is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask a question about this post..."
              className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
