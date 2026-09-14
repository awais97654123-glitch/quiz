import { getCourses } from '@/app/actions/quiz';
import { CourseCard } from '@/components/CourseCard';
import { BackButton } from '@/components/BackButton';
import { PlusCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Quiz | CodeQuiz',
  description: 'Create a multiplayer quiz room. Select a course, configure settings, and share the room code with friends.',
};

export default async function CreateQuizPage() {
  const courses = await getCourses();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-6">
      <BackButton fallbackUrl="/" label="Back to Home" />
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <PlusCircle className="w-4 h-4" />
          <span>Create Quiz Room</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Select a Course
        </h1>
        <p className="text-sm text-slate-400 max-w-lg">
          Choose a technology track for your quiz room. After selecting, you&apos;ll configure the quiz settings and get a room code to share.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={course.id} course={course} linkPrefix="/create-quiz" index={index} />
        ))}
      </div>
    </div>
  );
}
