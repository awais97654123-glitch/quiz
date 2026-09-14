'use client';

import { CountdownScreen } from '@/components/CountdownScreen';
import { useSearchParams } from 'next/navigation';
import { use, Suspense } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

function CountdownContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const count = searchParams.get('count') || '10';
  const difficulty = searchParams.get('difficulty') || 'ALL';

  const redirectUrl = `/quiz/play/${slug}?count=${count}&difficulty=${difficulty}`;

  return <CountdownScreen redirectUrl={redirectUrl} />;
}

export default function CountdownPage({ params }: Props) {
  const { slug } = use(params);

  return (
    <Suspense fallback={<CountdownScreen redirectUrl={`/quiz/play/${slug}`} />}>
      <CountdownContent slug={slug} />
    </Suspense>
  );
}
