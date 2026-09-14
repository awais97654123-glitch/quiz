import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string; attemptId: string }>;
}

export default async function QuizSlugResultRedirectPage({ params }: Props) {
  const { attemptId } = await params;
  redirect(`/quiz/result/${attemptId}`);
}
