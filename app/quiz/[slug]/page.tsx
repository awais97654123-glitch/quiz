import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function QuizSlugRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/quiz/setup/${slug}`);
}
