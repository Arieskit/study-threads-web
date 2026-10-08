import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudyThreads - AI Micro-Learning Feed',
  description: 'Turn your textbooks and lecture notes into a Threads-like study stream with in-feed spaced repetition quizzes and AI tutoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
