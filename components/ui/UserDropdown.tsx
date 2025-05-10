"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { User, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Session } from "@/types/base"
import { authClient } from "@/lib/auth/auth-client"

interface UserDropdownProps {
  session: Session
}

export default function UserDropdown({ session }: UserDropdownProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="cursor-pointer overflow-hidden rounded-full">
          {session.user.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name || ""} 
              width={32} 
              height={32} 
              className="rounded-full object-cover" 
            />
          ) : (
            <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center text-sm font-semibold text-white">
              {session.user.name
                ? session.user.name.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}
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
        
        <DropdownMenuItem 
          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 text-black"
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/")
                },
              },
            })}}
        >
          <LogOut size={16} />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 