import { PrismaClient } from '@prisma/client';
import { javascriptPdfQuestions } from './data/javascriptQuestions';

const prisma = new PrismaClient();

async function main() {
  console.log(`Starting JavaScript course question replacement... Total new questions: ${javascriptPdfQuestions.length}`);

  let jsCourse = await prisma.course.findUnique({
    where: { slug: 'javascript' },
  });

  if (!jsCourse) {
    console.log("Course 'javascript' not found, creating it...");
    jsCourse = await prisma.course.create({
      data: {
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Master the top 100 essential JavaScript questions covering Basics, Variables, Operators, Conditionals, Loops, Functions, Arrays, Objects, String Methods, and DOM Events.',
        icon: 'Zap',
        color: 'from-yellow-400 to-amber-500',
        badge: 'Core Language',
      },
    });
  }

  console.log(`Found JavaScript course: ${jsCourse.name} (ID: ${jsCourse.id})`);

  // 1. Delete all old questions specifically for JavaScript course
  const deleted = await prisma.question.deleteMany({
    where: { courseId: jsCourse.id },
  });
  console.log(`Removed ${deleted.count} old JavaScript questions.`);

  // 2. Update JavaScript course topics to match the 8 examination bank sections
  const topics = [
    'Basics, Syntax & Variables',
    'Operators & Expressions',
    'Conditional Statements (If-Else & Switch)',
    'Loops & Iteration',
    'Functions Basics',
    'Arrays & Array Methods',
    'Objects & String Methods',
    'DOM & Event Basics',
  ];

  await prisma.course.update({
    where: { id: jsCourse.id },
    data: {
      topics: JSON.stringify(topics),
      description: 'Master the top 100 essential JavaScript questions covering Basics, Variables, Operators, Conditionals, Loops, Functions, Arrays, Objects, String Methods, and DOM Events.',
    },
  });

  // 3. Batch insert all 100 questions
  await prisma.question.createMany({
    data: javascriptPdfQuestions.map((q) => ({
      courseId: jsCourse.id,
      topic: q.topic,
      question: q.question,
      options: JSON.stringify(q.options),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    })),
  });

  const finalCount = await prisma.question.count({
    where: { courseId: jsCourse.id },
  });

  console.log(`✅ Successfully replaced JavaScript questions! New question count: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error('Error updating JavaScript questions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
