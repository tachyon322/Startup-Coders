"use server"

import { db } from "@/prisma/db"
import { Tag } from "@/components/ui/tag-input"
import { getSession } from "@/lib/getSession"

export async function getUser(username: string) {
    // First get the user's ID
    const userInfo = await db.user.findUnique({
        where: { username },
        select: { id: true }
    });
    
    if (!userInfo) {
        return null;
    }
    
    // Now use the ID to get the complete user profile
    const user = await db.user.findUnique({
        where: { username },
        include: {
            tags: true,
            createdStartups: {
                include: {
                    tags: true,
                    images: true,
                    participants: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    },
                    creatorId: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    }
                }
            },
            participatingStartups: {
                where: {
                    creatorUser: {
                        not: userInfo.id
                    }
                },
                include: {
                    tags: true,
                    images: true,
                    participants: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    },
                    creatorId: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    }
                }
            }
        }
    })
    
    return user
}

export async function getAllTags() {
    const tags = await db.tag.findMany({
        orderBy: {
            name: 'asc'
        }
    })
    
    return tags
}

export async function updateUserDescription(username: string, description: string) {
    const updatedUser = await db.user.update({
        where: { username },
        data: { description }
    })
    
    return updatedUser
}

export async function updateUserTags(username: string, tags: Tag[]) {
    // Get existing user
    const user = await db.user.findUnique({
        where: { username },
        include: { tags: true }
    })
    
    if (!user) {
        throw new Error("User not found")
    }
    
    // Separate existing tags from new tags
    const existingTagIds = tags
        .filter(tag => tag.id)
        .map(tag => ({ id: tag.id }));
    
    // For new tags, we'll need to check if they already exist in the database or create them
    const newTagNames = tags
        .filter(tag => !tag.id)
        .map(tag => tag.name);
    
    // Update user with the tags
    const updatedUser = await db.user.update({
        where: { username },
        data: {
            tags: {
                // First disconnect all tags
                set: [],
                // Then connect existing tags by ID
                connect: existingTagIds as { id: number }[],
            }
        },
        include: { tags: true }
    });
    
    // For each new tag name, either find or create the tag and connect it to the user
    for (const tagName of newTagNames) {
        // First check if this tag already exists in the database
        let tag = await db.tag.findFirst({
            where: { name: tagName }
        });
        
        // If it doesn't exist, create it
        if (!tag) {
            // Since Tag.id is an @id field and not @default(autoincrement()),
            // we need to manually handle ID generation
            // First, find the maximum ID currently in use
            const maxIdResult = await db.tag.findFirst({
                orderBy: {
                    id: 'desc'
                }
            });
            
            const nextId = maxIdResult ? maxIdResult.id + 1 : 1;
            
            // Now create the tag with the new ID
            tag = await db.tag.create({
                data: { 
                    id: nextId,
                    name: tagName 
                }
            });
        }
        
        // Connect this tag to the user
        await db.user.update({
            where: { username },
            data: {
                tags: {
                    connect: { id: tag.id }
                }
            }
        });
    }
    
    // Get the updated user with all tags
    const finalUser = await db.user.findUnique({
        where: { username },
        include: { tags: true }
    });
    
    return finalUser;
}

export async function getUserCreatedStartups(username: string, page = 1, pageSize = 9) {
    // Calculate the skip value for pagination
    const skip = (page - 1) * pageSize;

    // Get user first
    const user = await db.user.findUnique({
        where: { username },
        select: { id: true }
    })

    if (!user) {
        throw new Error("User not found")
    }

    // Get startups created by the user
    const startups = await db.startup.findMany({
        where: { 
            creatorUser: user.id 
        },
        skip,
        take: pageSize,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            tags: true,
            images: true,
            creatorId: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            },
            participants: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            }
        }
    })

    // Get the total count of startups for pagination
    const totalStartups = await db.startup.count({ 
        where: { creatorUser: user.id } 
    })

    // Calculate total pages
    const totalPages = Math.ceil(totalStartups / pageSize)

    return {
        startups,
        pagination: {
            totalItems: totalStartups,
            totalPages,
            currentPage: page,
            pageSize
        }
    }
}

export async function getUserParticipatingStartups(username: string, page = 1, pageSize = 9) {
    // Calculate the skip value for pagination
    const skip = (page - 1) * pageSize;

    // Get user first
    const user = await db.user.findUnique({
        where: { username },
        select: { id: true }
    })

    if (!user) {
        throw new Error("User not found")
    }

    // Get startups where the user is a participant but NOT the creator
    const startups = await db.startup.findMany({
        where: { 
            participants: {
                some: {
                    id: user.id
                }
            },
            NOT: {
                creatorUser: user.id
            }
        },
        skip,
        take: pageSize,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            tags: true,
            images: true,
            creatorId: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            },
            participants: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            }
        }
    })

    // Get the total count of startups for pagination
    const totalStartups = await db.startup.count({ 
        where: { 
            participants: {
                some: {
                    id: user.id
                }
            },
            NOT: {
                creatorUser: user.id
            }
        } 
    })

    // Calculate total pages
    const totalPages = Math.ceil(totalStartups / pageSize)

    return {
        startups,
        pagination: {
            totalItems: totalStartups,
            totalPages,
            currentPage: page,
            pageSize
        }
    }
}