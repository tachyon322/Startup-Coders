import Link from "next/link"
import { UserAvatarPlaceholder } from "../ui/ImagePlaceholder"

interface UserAvatarProps {
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  size?: 'xs' | 'sm' | 'md' | 'lg'
  withLink?: boolean
}

export default function UserAvatar({ user, size = 'md', withLink = true }: UserAvatarProps) {
  const AvatarContent = () => (
    <UserAvatarPlaceholder
      user={user}
      size={size}
      alt={user.name || user.username || 'User'}
      className="hover:ring-2 hover:ring-indigo-300 transition-all"
    />
  )

  if (withLink && (user.username || user.id)) {
    return (
      <Link href={`/user/${user.username || user.id}`} className="inline-block">
        <AvatarContent />
      </Link>
    )
  }

  return <AvatarContent />
}