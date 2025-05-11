"use server"

import { db } from "@/prisma/db"
import { Tag } from "@/components/ui/tag-input"
import { cache } from "react"

// Optimized function to find user by identifier (username or id)
// This is extracted to avoid code duplication and improve performance
const findUserByIdentifier = cache(async (identifier: string) => {
    // Try to find the user by username first
    let userInfo = await db.user.findUnique({
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
    
    return userInfo;
});

// Base user selection model to be consistent and avoid overfetching
const baseUserSelect = {
    id: true,
    name: true,
    username: true,
    image: true
};

// Base tag selection model
const baseTagSelect = {
    id: true,
    name: true
};

// Base image selection model
const baseImageSelect = {
    id: true,
    url: true
};

// Optimized user query with proper data selection
export const getUser = cache(async function getUser(identifier: string) {
    const userInfo = await findUserByIdentifier(identifier);
    
    if (!userInfo) {
        return null;
    }
    
    const userId = userInfo.id;
    
    // Now use the ID to get the complete user profile with optimized includes
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            tags: {
                select: baseTagSelect
            },
            createdStartups: {
                include: {
                    tags: {
                        select: baseTagSelect
                    },
                    images: {
                        select: baseImageSelect,
                        take: 1 // Optimize by only taking first image when needed
                    },
                    participants: {
                        select: baseUserSelect,
                        take: 5 // Limit participants to 5 for performance
                    },
                    creatorId: {
                        select: baseUserSelect
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
                    tags: {
                        select: baseTagSelect
                    },
                    images: {
                        select: baseImageSelect,
                        take: 1 // Optimize by only taking first image when needed
                    },
                    participants: {
                        select: baseUserSelect,
                        take: 5 // Limit participants to 5 for performance
                    },
                    creatorId: {
                        select: baseUserSelect
                    }
                }
            }
        }
    })
    
    return user
})

export const getAllTags = cache(async function getAllTags() {
    const tags = await db.tag.findMany({
        select: baseTagSelect,
        orderBy: {
            name: 'asc'
        }
    })
    
    return tags
})

export async function updateUserDescription(identifier: string, description: string) {
    const userInfo = await findUserByIdentifier(identifier);
    
    if (!userInfo) {
        throw new Error("User not found");
    }
    
    const updatedUser = await db.user.update({
        where: { id: userInfo.id },
        data: { description }
    })
    
    return updatedUser
}

export async function updateUserTags(identifier: string, tags: Tag[]) {
    const userInfo = await findUserByIdentifier(identifier);
    
    if (!userInfo) {
        throw new Error("User not found");
    }
    
    // Get existing user
    const user = await db.user.findUnique({
        where: { id: userInfo.id },
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
        where: { id: userInfo.id },
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
    // Using Promise.all for better performance with parallel operations
    await Promise.all(newTagNames.map(async (tagName) => {
        // First check if this tag already exists in the database
        let tag = await db.tag.findFirst({
            where: { name: tagName }
        });
        
        // If it doesn't exist, create it
        if (!tag) {
            // Use a transaction to safely generate next ID and create the tag
            tag = await db.$transaction(async (tx) => {
                // Find the maximum ID currently in use
                const maxIdResult = await tx.tag.findFirst({
                    orderBy: {
                        id: 'desc'
                    }
                });
                
                const nextId = maxIdResult ? maxIdResult.id + 1 : 1;
                
                // Now create the tag with the new ID
                return tx.tag.create({
                    data: { 
                        id: nextId,
                        name: tagName 
                    }
                });
            });
        }
        
        // Connect this tag to the user
        await db.user.update({
            where: { id: userInfo.id },
            data: {
                tags: {
                    connect: { id: tag.id }
                }
            }
        });
    }));
    
    // Get the updated user with all tags
    const finalUser = await db.user.findUnique({
        where: { id: userInfo.id },
        include: { tags: true }
    });
    
    return finalUser;
}

// Optimized pagination function for user created startups
export const getUserCreatedStartups = cache(async function getUserCreatedStartups(identifier: string, page = 1, pageSize = 9) {
    // Calculate the skip value for pagination
    const skip = (page - 1) * pageSize;

    const userInfo = await findUserByIdentifier(identifier);
    
    if (!userInfo) {
        throw new Error("User not found");
    }
    
    const userId = userInfo.id;

    // Use Promise.all for parallel queries to improve performance
    const [startups, totalStartups] = await Promise.all([
        // Get startups created by the user
        db.startup.findMany({
            where: { 
                creatorUser: userId 
            },
            skip,
            take: pageSize,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                tags: {
                    select: baseTagSelect
                },
                images: {
                    select: baseImageSelect,
                    take: 1 // Only take first image for performance
                },
                creatorId: {
                    select: baseUserSelect
                },
                participants: {
                    select: baseUserSelect,
                    take: 5 // Limit participants for performance
                }
            }
        }),
        
        // Get the total count of startups for pagination
        db.startup.count({ 
            where: { creatorUser: userId } 
        })
    ]);

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

// Optimized pagination function for user participating startups
export const getUserParticipatingStartups = cache(async function getUserParticipatingStartups(identifier: string, page = 1, pageSize = 9) {
    // Calculate the skip value for pagination
    const skip = (page - 1) * pageSize;

    const userInfo = await findUserByIdentifier(identifier);
    
    if (!userInfo) {
        throw new Error("User not found");
    }
    
    const userId = userInfo.id;

    // Use Promise.all for parallel queries to improve performance
    const [startups, totalStartups] = await Promise.all([
        // Get startups where the user is a participant but NOT the creator
        db.startup.findMany({
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
                tags: {
                    select: baseTagSelect
                },
                images: {
                    select: baseImageSelect,
                    take: 1 // Only take first image for performance
                },
                creatorId: {
                    select: baseUserSelect
                },
                participants: {
                    select: baseUserSelect,
                    take: 5 // Limit participants for performance
                }
            }
        }),
        
        // Get the total count of startups for pagination
        db.startup.count({ 
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
    ]);

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
      ...baseUserSelect,
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
    const userInfo = await findUserByIdentifier(identifier);
    
    if (!userInfo) {
        throw new Error("User not found");
    }
    
    // Check if the new username is already taken
    const existingUser = await db.user.findUnique({
        where: { username },
        select: { id: true }
    });
    
    if (existingUser) {
        throw new Error("Username already taken");
    }
    
    // Update the username
    const updatedUser = await db.user.update({
        where: { id: userInfo.id },
        data: { username },
        select: {
            id: true,
            username: true
        }
    });
    
    return updatedUser;
}

export async function updateUserName(identifier: string, name: string) {
    const userInfo = await findUserByIdentifier(identifier);
    
    if (!userInfo) {
        throw new Error("User not found");
    }
    
    // Update the name
    const updatedUser = await db.user.update({
        where: { id: userInfo.id },
        data: { name },
        select: {
            id: true,
            name: true
        }
    });
    
    return updatedUser;
}

export async function updateUserImage(identifier: string, imageUrl: string) {
    const userInfo = await findUserByIdentifier(identifier);
    
    if (!userInfo) {
        throw new Error("User not found");
    }
    
    // Update the image URL
    const updatedUser = await db.user.update({
        where: { id: userInfo.id },
        data: { image: imageUrl },
        select: {
            id: true,
            image: true
        }
    });
    
    return updatedUser;
}