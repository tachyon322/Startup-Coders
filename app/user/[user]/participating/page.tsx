import { redirect } from 'next/navigation';

export default function ParticipatingPage({ params }: { params: { user: string } }) {
  // Redirect to the main user profile page
  redirect(`/user/${params.user}`);
}