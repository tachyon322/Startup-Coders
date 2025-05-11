import { redirect } from 'next/navigation';

interface CreatedPageProps {
  params: Promise<{ user: string }>;
}

export default async function CreatedPage({ params }: CreatedPageProps) {
  const userName = (await params).user;
  // Redirect to the main user profile page
  redirect(`/user/${userName}`);
}