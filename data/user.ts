"use server"

import { db } from "@/prisma/db"

export async function getUser(username: string) {
    const user = await db.user.findUnique({
        where: { username: username },
        include: {
            tags: true,
            createdStartups: true,
            participatingStartups: true
        }
    })
    
    return user
}