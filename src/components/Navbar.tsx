'use client';

import React from 'react';
import { Sparkles, Plus, Layers, BookMarked, Github } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  availableCourses: { id: string; title: string; tag: string }[];
  currentCourseId: string;
  onSelectCourse: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  availableCourses,
  currentCourseId,
  onSelectCourse,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            StudyThreads
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              Personal Web
            </span>
          </span>
        </div>

        {/* Course Switcher & Actions */}
        <div className="flex items-center gap-2">
          {availableCourses.length > 0 && (
            <select
              value={currentCourseId}
              onChange={(e) => onSelectCourse(e.target.value)}
              className="text-xs bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-3 py-1.5 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tag} - {c.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Material</span>
          </button>
        </div>
      </div>
    </header>
  );
};
