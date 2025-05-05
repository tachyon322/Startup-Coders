import Image from "next/image"
import Link from "next/link"

interface UserAvatarProps {
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  size?: 'sm' | 'md' | 'lg'
  withLink?: boolean
}

export default function UserAvatar({ user, size = 'md', withLink = true }: UserAvatarProps) {
  const dimensions = {
    sm: 24,
    md: 40,
    lg: 64
  }
  
  const sizeClass = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl'
  }
  
  const AvatarContent = () => (
    <div className={`${sizeClass[size]} rounded-full bg-indigo-100 overflow-hidden`}>
      {user.image ? (
        <Image 
          src={user.image} 
          alt={user.name || 'User'} 
          width={dimensions[size]} 
          height={dimensions[size]}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-indigo-500 font-bold">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      )}
    </div>
  )

  if (withLink && (user.username || user.id)) {
    return (
      <Link href={`/user/${user.username || user.id}`}>
        <AvatarContent />
      </Link>
    )
  }

  return <AvatarContent />
} 