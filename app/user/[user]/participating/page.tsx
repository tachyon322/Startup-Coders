import { redirect } from 'next/navigation';

interface ParticipatingPageProps {
  params: Promise<{ user: string }>;
}

export default async function ParticipatingPage({ params }: ParticipatingPageProps) {
  const userName = (await params).user;
  // Redirect to the main user profile page
  redirect(`/user/${userName}`);
}