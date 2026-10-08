# StudyThreads 📚💬

Transform heavy textbooks and lecture notes into an engaging **Threads-style micro-learning feed** powered by **Google Gemini API**. Features in-feed active recall quizzes with spaced repetition retry logic, plus embedded AI Teaching Assistant comments.

---

## 🚀 Key Features

1. **Sequential Micro-learning Feed**: Converts dense text into 150-250 word bite-sized, sequential posts tagged with course hashtags (e.g. `#ECON101`).
2. **In-Feed Active Recall Quizzes**: Conceptual 4-option multiple choice questions interspersed every 2 posts.
3. **Spaced Repetition Retry Engine**: If you answer a quiz incorrectly, it is dynamically queued and pushed 3 posts down your feed for reinforcement.
4. **Interactive Post Discussion (AI Tutor)**: Ask follow-up questions directly in any post's comment drawer. The AI answers grounded strictly in the original material.
5. **Private & Non-Public (Stage 1)**: Tailored for personal self-study without copyright or multi-user privacy concerns.

---

## 🛠️ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/study-threads-web.git
cd study-threads-web
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your [Google AI Studio API Key](https://aistudio.google.com/) into `.env.local`:
```env
GEMINI_API_KEY=AIzaSy...
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```
study-threads-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-feed/route.ts  # Gemini structured output pipeline
│   │   │   └── ask-comment/route.ts    # AI Teaching Assistant comment route
│   │   ├── globals.css                 # Tailwind typography & dark mode styles
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Main app page & state management
│   ├── components/
│   │   ├── Navbar.tsx                  # Navigation & course switcher
│   │   ├── PostCard.tsx                # Threads/Twitter style post card
│   │   ├── QuizCard.tsx                # Multiple-choice quiz & instant feedback
│   │   ├── CommentDrawer.tsx           # Slide-over AI Tutor discussion drawer
│   │   ├── UploadModal.tsx             # Document upload & text transformation
│   │   └── StudyFeed.tsx               # Sequential feed & retry queue engine
│   ├── lib/
│   │   └── gemini.ts                   # Gemini API client & Structured JSON Schema
│   └── types/
│       └── study.ts                    # Core TypeScript interfaces
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚢 Push to your GitHub

Initialize your repository and push to GitHub:
```bash
git init
git add .
git commit -m "feat: complete StudyThreads Next.js app with Gemini API integration"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/study-threads-web.git
git push -u origin main
```
