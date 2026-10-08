'use client';

import React from 'react';
import { StudyPost } from '@/types/study';
import { MessageCircle, Bookmark, Share2, Sparkles, Hash } from 'lucide-react';

interface PostCardProps {
  post: StudyPost;
  totalPosts: number;
  courseTag: string;
  onOpenComments: (post: StudyPost) => void;
  commentCount: number;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  totalPosts,
  courseTag,
  onOpenComments,
  commentCount,
}) => {
  return (
    <article className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      {/* Header with sequence badge and course tag */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {post.sequenceOrder}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{courseTag}</span>
              <span className="text-zinc-400 text-xs">•</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-xs">Concept {post.sequenceOrder} of {totalPosts}</span>
            </div>
            <p className="text-xs text-zinc-400">Sequential Study Stream</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium">
          Part {post.sequenceOrder}
        </span>
      </div>

      {/* Post Title */}
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug">
        {post.title}
      </h3>

      {/* Main Content */}
      <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line mb-3">
        {post.content}
      </div>

      {/* Key Takeaway Box */}
      {post.keyTakeaway && (
        <div className="bg-zinc-50 dark:bg-zinc-800/60 border-l-4 border-indigo-500 rounded-r-lg p-3 my-3 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 block mb-0.5">Key Takeaway</span>
            <p>{post.keyTakeaway}</p>
          </div>
        </div>
      )}

      {/* Hashtags */}
      <div className="flex flex-wrap gap-1.5 my-3">
        {post.tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md hover:underline cursor-pointer"
          >
            <Hash className="w-3 h-3 mr-0.5 opacity-60" />
            {tag.replace(/^#/, '')}
          </span>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-zinc-500 text-xs">
        <button
          onClick={() => onOpenComments(post)}
          className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ask AI Tutor & Discussion {commentCount > 0 && `(${commentCount})`}</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
