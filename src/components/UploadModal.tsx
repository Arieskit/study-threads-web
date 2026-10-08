'use client';

import React, { useState } from 'react';
import { X, Sparkles, UploadCloud, BookOpen, Loader2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [primaryTag, setPrimaryTag] = useState('#ECON101');
  const [materialText, setMaterialText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialText.trim()) {
      setErrorMsg('Please paste your lecture notes or textbook excerpt.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/generate-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle,
          primaryTag,
          materialText,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to transform material');
      }

      onSuccess(json.data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong while contacting Gemini API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setCourseTitle('Microeconomics: Supply, Demand & Elasticity');
    setPrimaryTag('#ECON101');
    setMaterialText(`The Law of Demand states that, other things equal, the quantity demanded of a good falls when the price of the good rises. A demand curve is a graph of the relationship between the price of a good and the quantity demanded. Market demand is the sum of all individual demands for a particular good or service.

The Law of Supply states that, other things equal, the quantity supplied of a good rises when the price of the good rises. A supply curve shows the relationship between price and quantity supplied.

Equilibrium is a situation in which market price has reached the level where quantity supplied equals quantity demanded. At the equilibrium price, there is neither a shortage nor a surplus.

Price Elasticity of Demand measures how much the quantity demanded responds to a change in price. It is computed as the percentage change in quantity demanded divided by the percentage change in price. If elasticity is greater than 1, demand is elastic. If elasticity is less than 1, demand is inelastic. If elasticity is exactly 1, demand has unit elasticity.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Upload Study Material</h2>
              <p className="text-xs text-zinc-500">Transform your notes into an interactive Threads feed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Course / Topic Name
              </label>
              <input
                type="text"
                placeholder="e.g. Intro to Macroeconomics"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Course Hashtag
              </label>
              <input
                type="text"
                placeholder="#ECON101"
                value={primaryTag}
                onChange={(e) => setPrimaryTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Lecture Notes or Book Excerpt
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" /> Load Sample Economics Text
              </button>
            </div>
            <textarea
              rows={6}
              placeholder="Paste book chapters, lecture slides transcripts, or notes here..."
              value={materialText}
              onChange={(e) => setMaterialText(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Feed with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Transform to Social Feed
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
