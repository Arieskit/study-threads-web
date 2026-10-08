'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { StudyFeed } from '@/components/StudyFeed';
import { UploadModal } from '@/components/UploadModal';
import { StudyDocument } from '@/types/study';
import { Sparkles, BookOpen, Layers } from 'lucide-react';

const INITIAL_DEMO_DOCUMENT: StudyDocument = {
  id: 'doc_demo_econ101',
  title: 'Microeconomics: Supply, Demand & Elasticity',
  courseTag: '#ECON101',
  tags: ['#Microeconomics', '#SupplyAndDemand', '#Elasticity'],
  createdAt: '2026-10-07',
  posts: [
    {
      id: 'post_1',
      sequenceOrder: 1,
      title: 'The Law of Demand: Why Prices Dictate Buying Decisions',
      content: `The fundamental rule of markets: when prices rise, consumers buy less. 📉

• Other things being equal (ceteris paribus), there is an inverse relationship between price and quantity demanded.
• Downward-sloping curve: as price drops from $10 to $5, more people are willing and able to purchase.
• Substitution effect: buyers switch to cheaper alternatives when a good gets expensive.
• Income effect: higher prices erode real purchasing power.`,
      keyTakeaway: 'Price and quantity demanded move in opposite directions under ceteris paribus.',
      sourceSnippet: 'The Law of Demand states that, other things equal, the quantity demanded of a good falls when the price of the good rises.',
      tags: ['#DemandCurve', '#ConsumerBehavior', '#ECON101'],
    },
    {
      id: 'post_2',
      sequenceOrder: 2,
      title: 'The Law of Supply: How Producers React to Prices',
      content: `Producers seek profit. When prices climb, suppliers rush to sell more! 📈

• Positive relationship: Higher prices provide an incentive for firms to produce more units.
• Upward-sloping curve: At $5, a bakery makes 50 loaves; at $10, it pays overtime to bake 120 loaves.
• Marginal cost: Producing extra units costs more, so firms require higher prices to justify expansion.`,
      keyTakeaway: 'Price and quantity supplied move in the same direction—higher prices incentivize higher production.',
      sourceSnippet: 'The Law of Supply states that, other things equal, the quantity supplied of a good rises when the price of the good rises.',
      tags: ['#SupplyCurve', '#Production', '#Profit'],
    },
    {
      id: 'post_3',
      sequenceOrder: 3,
      title: 'Market Equilibrium: Where Buyers and Sellers Agree',
      content: `What happens when demand and supply cross paths? You get Equilibrium. ⚖️

• Equilibrium Price: The exact price where Quantity Supplied (Qs) = Quantity Demanded (Qd).
• No Shortage: If price is too low, buyers scramble (shortage), bidding prices back up.
• No Surplus: If price is too high, unsold goods pile up (surplus), forcing sellers to discount.
• Market clearing: The invisible hand naturally pulls competitive markets toward this equilibrium point.`,
      keyTakeaway: 'Equilibrium is the self-stabilizing point where there is neither excess demand nor excess supply.',
      sourceSnippet: 'Equilibrium is a situation in which market price has reached the level where quantity supplied equals quantity demanded.',
      tags: ['#MarketClearing', '#Equilibrium', '#InvisibleHand'],
    },
    {
      id: 'post_4',
      sequenceOrder: 4,
      title: 'Price Elasticity of Demand: How Sensitive Are Buyers?',
      content: `Does a 10% price bump cut sales by 2% or 50%? Elasticity tells you. 🎯

• Formula: % Change in Quantity Demanded ÷ % Change in Price.
• Elastic (|E| > 1): Buyers are hyper-sensitive (e.g. restaurant meals, luxury goods).
• Inelastic (|E| < 1): Buyers cannot easily cut back (e.g. insulin, tap water, essential electricity).
• Unit Elastic (|E| = 1): Quantity changes in exact equal proportion to price.`,
      keyTakeaway: 'Elastic goods have many substitutes and high buyer price-sensitivity; inelastic goods are essentials.',
      sourceSnippet: 'Price Elasticity of Demand measures how much the quantity demanded responds to a change in price.',
      tags: ['#Elasticity', '#PricingStrategy', '#Substitutes'],
    },
  ],
  quizzes: [
    {
      id: 'quiz_1',
      associatedPostOrder: 2,
      question: 'According to the Law of Supply, what happens when the selling price of a laptop increases from $800 to $1,200 (ceteris paribus)?',
      options: [
        'Quantity supplied decreases because fewer consumers will buy it',
        'Quantity supplied increases because producers have higher profit incentives',
        'Supply shifts to the left because raw materials cost more',
        'Quantity demanded increases simultaneously to match production',
      ],
      correctAnswerIndex: 1,
      explanation: 'The Law of Supply dictates a positive relationship: as price rises, suppliers are motivated to produce and sell a higher quantity to maximize profit.',
    },
    {
      id: 'quiz_2',
      associatedPostOrder: 4,
      question: 'If a pharmacy raises the price of life-saving insulin by 20% and sales only drop by 1%, what type of elasticity does this product demonstrate?',
      options: [
        'Highly Elastic (|E| > 1)',
        'Unit Elastic (|E| = 1)',
        'Inelastic (|E| < 1)',
        'Perfectly Elastic (|E| = ∞)',
      ],
      correctAnswerIndex: 2,
      explanation: '% Change in Quantity (1%) divided by % Change in Price (20%) = 0.05. Since 0.05 is significantly less than 1, demand is strongly inelastic because there are no substitutes for essential medicine.',
    },
  ],
};

export default function Home() {
  const [courses, setCourses] = useState<StudyDocument[]>([INITIAL_DEMO_DOCUMENT]);
  const [currentCourseId, setCurrentCourseId] = useState<string>(INITIAL_DEMO_DOCUMENT.id);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const activeCourse = courses.find((c) => c.id === currentCourseId) || courses[0];

  const handleUploadSuccess = (generatedData: any) => {
    const newDoc: StudyDocument = {
      id: 'doc_' + Date.now(),
      title: generatedData.courseTitle || 'New Course Material',
      courseTag: generatedData.primaryTag || '#NewStudy',
      tags: [generatedData.primaryTag || '#NewStudy'],
      createdAt: new Date().toISOString().split('T')[0],
      posts: (generatedData.posts || []).map((p: any, idx: number) => ({
        ...p,
        id: `post_${Date.now()}_${idx}`,
      })),
      quizzes: (generatedData.quizzes || []).map((q: any, idx: number) => ({
        ...q,
        id: `quiz_${Date.now()}_${idx}`,
      })),
    };

    setCourses((prev) => [newDoc, ...prev]);
    setCurrentCourseId(newDoc.id);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        availableCourses={courses.map((c) => ({ id: c.id, title: c.title, tag: c.courseTag }))}
        currentCourseId={currentCourseId}
        onSelectCourse={setCurrentCourseId}
      />

      <main className="flex-1">
        {activeCourse ? (
          <StudyFeed
            courseTitle={activeCourse.title}
            courseTag={activeCourse.courseTag}
            posts={activeCourse.posts}
            quizzes={activeCourse.quizzes}
          />
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h2 className="text-base font-semibold">No study stream active</h2>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              Add Material
            </button>
          </div>
        )}
      </main>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
