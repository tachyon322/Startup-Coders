"use server"

import { db } from "@/prisma/db"
import { Tag } from "@/components/ui/tag-input"
import { cache } from "react"

export const getUser = cache(async function getUser(identifier: string) {
    // Check if the identifier is a username or ID
    let userId: string;
    let userInfo;
    
    // Try to find the user by username first
    userInfo = await db.user.findUnique({
        where: { username: identifier },
        select: { id: true }
    });
    
    // If not found by username, try by ID
    if (!userInfo) {
        userInfo = await db.user.findUnique({
            where: { id: identifier },
            select: { id: true }
        });
        
        if (!userInfo) {
            return null;
        }
    }
    
    userId = userInfo.id;
    
    // Now use the ID to get the complete user profile
    const user = await db.user.findUnique({
        where: { id: userId },
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
                        not: userId
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
})

export async function getAllTags() {
    const tags = await db.tag.findMany({
        orderBy: {
            name: 'asc'
        }
    })
    
    return tags
}

export async function updateUserDescription(identifier: string, description: string) {
    // Check if the identifier is a username or ID
    let where: { username: string } | { id: string };
    
    // Try to find if this is a valid username first
    const userByUsername = await db.user.findUnique({
        where: { username: identifier },
        select: { id: true }
    });
    
    if (userByUsername) {
        where = { username: identifier };
    } else {
        // Assume it's an ID
        where = { id: identifier };
    }
    
    const updatedUser = await db.user.update({
        where,
        data: { description }
    })
    
    return updatedUser
}

export async function updateUserTags(identifier: string, tags: Tag[]) {
    // Check if the identifier is a username or ID
    let where: { username: string } | { id: string };
    
    // Try to find if this is a valid username first
    const userByUsername = await db.user.findUnique({
        where: { username: identifier },
        select: { id: true }
    });
    
    if (userByUsername) {
        where = { username: identifier };
    } else {
        // Assume it's an ID
        where = { id: identifier };
    }
    
    // Get existing user
    const user = await db.user.findUnique({
        where,
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
        where,
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
            where,
            data: {
                tags: {
                    connect: { id: tag.id }
                }
            }
        });
    }
    
    // Get the updated user with all tags
    const finalUser = await db.user.findUnique({
        where,
        include: { tags: true }
    });
    
    return finalUser;
}

export const getUserCreatedStartups = cache(async function getUserCreatedStartups(identifier: string, page = 1, pageSize = 9) {
    // Calculate the skip value for pagination
    const skip = (page - 1) * pageSize;

    // Check if the identifier is a username or ID
    let where: { username: string } | { id: string };
    let userId: string;
    
    // Try to find if this is a valid username first
    const userByUsername = await db.user.findUnique({
        where: { username: identifier },
        select: { id: true }
    });
    
    if (userByUsername) {
        userId = userByUsername.id;
    } else {
        // Assume it's an ID
        const userById = await db.user.findUnique({
            where: { id: identifier },
            select: { id: true }
        });
        
        if (!userById) {
            throw new Error("User not found");
        }
        
        userId = userById.id;
    }

    // Get startups created by the user
    const startups = await db.startup.findMany({
        where: { 
            creatorUser: userId 
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
        where: { creatorUser: userId } 
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
})

export const getUserParticipatingStartups = cache(async function getUserParticipatingStartups(identifier: string, page = 1, pageSize = 9) {
    // Calculate the skip value for pagination
    const skip = (page - 1) * pageSize;

    // Check if the identifier is a username or ID
    let where: { username: string } | { id: string };
    let userId: string;
    
    // Try to find if this is a valid username first
    const userByUsername = await db.user.findUnique({
        where: { username: identifier },
        select: { id: true }
    });
    
    if (userByUsername) {
        userId = userByUsername.id;
    } else {
        // Assume it's an ID
        const userById = await db.user.findUnique({
            where: { id: identifier },
            select: { id: true }
        });
        
        if (!userById) {
            throw new Error("User not found");
        }
        
        userId = userById.id;
    }

    // Get startups where the user is a participant but NOT the creator
    const startups = await db.startup.findMany({
        where: { 
            participants: {
                some: {
                    id: userId
                }
            },
            NOT: {
                creatorUser: userId
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
                    id: userId
                }
            },
            NOT: {
                creatorUser: userId
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
})

/**
 * Get most active users based on startup participation and creation
 * This is used for static site generation
 */
export const getMostActiveUsers = cache(async function getMostActiveUsers(limit: number = 10) {
  const users = await db.user.findMany({
    take: limit,
    orderBy: [
      {
        createdStartups: {
          _count: 'desc'
        }
      },
      {
        participatingStartups: {
          _count: 'desc'
        }
      }
    ],
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      _count: {
        select: {
          createdStartups: true,
          participatingStartups: true
        }
      }
    }
  });
  
  return users;
});

export async function updateUserUsername(identifier: string, username: string) {
    // Check if the identifier is a username or ID
    let where: { username: string } | { id: string };
    
    // Try to find if this is a valid username first
    const userByUsername = await db.user.findUnique({
        where: { username: identifier },
        select: { id: true }
    });
    
    if (userByUsername) {
        where = { username: identifier };
    } else {
        // Assume it's an ID
        where = { id: identifier };
    }
    
    // Check if the new username is already taken
    const existingUser = await db.user.findUnique({
        where: { username }
    });
    
    if (existingUser) {
        throw new Error("Username already taken");
    }
    
    // Update the username
    const updatedUser = await db.user.update({
        where,
        data: { username }
    });
    
    return updatedUser;
}

export async function updateUserName(identifier: string, name: string) {
    // Check if the identifier is a username or ID
    let where: { username: string } | { id: string };
    
    // Try to find if this is a valid username first
    const userByUsername = await db.user.findUnique({
        where: { username: identifier },
        select: { id: true }
    });
    
    if (userByUsername) {
        where = { username: identifier };
    } else {
        // Assume it's an ID
        where = { id: identifier };
    }
    
    // Update the name
    const updatedUser = await db.user.update({
        where,
        data: { name }
    });
    
    return updatedUser;
}

export async function updateUserImage(identifier: string, imageUrl: string) {
    // Check if the identifier is a username or ID
    let where: { username: string } | { id: string };
    
    // Try to find if this is a valid username first
    const userByUsername = await db.user.findUnique({
        where: { username: identifier },
        select: { id: true }
    });
    
    if (userByUsername) {
        where = { username: identifier };
    } else {
        // Assume it's an ID
        where = { id: identifier };
    }
    
    // Update the image URL
    const updatedUser = await db.user.update({
        where,
        data: { image: imageUrl }
    });
    
    return updatedUser;
}