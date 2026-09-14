import { PrismaClient } from '@prisma/client';
import { cssPdfQuestions } from './data/cssQuestions';

const prisma = new PrismaClient();

async function main() {
  console.log(`Starting CSS course question replacement... Total new questions: ${cssPdfQuestions.length}`);

  const cssCourse = await prisma.course.findUnique({
    where: { slug: 'css' },
  });

  if (!cssCourse) {
    throw new Error("Course with slug 'css' not found!");
  }

  console.log(`Found CSS course: ${cssCourse.name} (ID: ${cssCourse.id})`);

  // 1. Delete all old questions specifically for CSS course
  const deleted = await prisma.question.deleteMany({
    where: { courseId: cssCourse.id },
  });
  console.log(`Removed ${deleted.count} old CSS questions.`);

  // 2. Update CSS course topics to match the 10 examination bank sections
  const topics = [
    'Selectors, Specificity & Cascade',
    'The Box Model & Layout Flow',
    'Positioning & Stacking Contexts',
    'Modern Flexbox Layout',
    'CSS Grid Architecture',
    'Typography, Web Fonts & Text Flow',
    'Colors, Gradients & Visual Effects',
    'Transforms, Transitions & Keyframes',
    'Responsive Design & Media Queries',
    'Modern CSS, Native Nesting & Performance',
  ];

  await prisma.course.update({
    where: { id: cssCourse.id },
    data: {
      topics: JSON.stringify(topics),
      description: 'Master 120 curated intermediate & advanced CSS questions covering Selectors, Box Model, Stacking, Flexbox, Grid, Typography, Colors, Transforms, Media Queries, and Modern CSS.',
    },
  });

  // 3. Batch insert all 120 questions
  await prisma.question.createMany({
    data: cssPdfQuestions.map((q) => ({
      courseId: cssCourse.id,
      topic: q.topic,
      question: q.question,
      options: JSON.stringify(q.options),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    })),
  });

  const finalCount = await prisma.question.count({
    where: { courseId: cssCourse.id },
  });

  console.log(`Successfully inserted ${finalCount} new questions into the CSS course!`);
}

main()
  .catch((e) => {
    console.error('Error updating CSS questions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
