"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { User, LogOut, ChartNoAxesGantt } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Session } from "@/types/base"
import { authClient } from "@/lib/auth/auth-client"
import { UserAvatarPlaceholder } from "./ImagePlaceholder"

interface UserDropdownProps {
  session: Session
}

export default function UserDropdown({ session }: UserDropdownProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="cursor-pointer">
          <UserAvatarPlaceholder
            user={{
              name: session.user.name,
              username: session.user.username,
              image: session.user.image
            }}
            size="sm"
            className="bg-indigo-400 text-white hover:bg-indigo-500 transition-colors"
            alt={session.user.name || "User menu"}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white rounded-md shadow-md py-1 mt-1 min-w-[200px] mr-4 border border-gray-200 z-10">
        <DropdownMenuLabel className="px-4 py-2 text-sm text-gray-500">
          {session.user.name || "User"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="h-px bg-gray-100" />

        <Link href={session.user.username ? `/user/${session.user.username}` : `/user/${session.user.id}`}>
          <DropdownMenuItem className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 text-black">
            <User size={16} />
            <span>Профиль</span>
          </DropdownMenuItem>
        </Link>

        <Link href={"/requests"}>
          <DropdownMenuItem className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 text-black">
            <ChartNoAxesGantt size={16} />
            <span>Управление</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 text-black"
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/")
                },
              },
            })
          }}
        >
          <LogOut size={16} />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 