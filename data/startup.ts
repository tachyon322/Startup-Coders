"use server"

import { db } from "@/prisma/db"
import { getSession } from "@/lib/getSession"
import { Tag } from "@/components/ui/tag-input"

export async function getTags() {
  const tags = await db.tag.findMany()
  return tags
}

export async function getStartups(
  page = 1,
  pageSize = 10,
  searchQuery?: string,
  tagIds?: number[]
) {
  // Calculate the skip value for pagination
  const skip = (page - 1) * pageSize;

  // Build where clause based on search parameters
  const where: any = {};
  
  // Add name search if provided
  if (searchQuery) {
    where.name = {
      contains: searchQuery,
      mode: 'insensitive'
    };
  }
  
  // Add tag filtering if provided
  if (tagIds && tagIds.length > 0) {
    where.tags = {
      some: {
        id: {
          in: tagIds
        }
      }
    };
  }

  // Fetch startups with pagination and filters
  const startups = await db.startup.findMany({
    where,
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

  // Get the total count of startups for pagination with the same filters
  const totalStartups = await db.startup.count({ where })

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

export async function createStartup(
  name: string,
  description: string,
  tags: Tag[],
  images: { id: string, url: string }[] = []
) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Process tags - connect existing ones and create new ones
  const existingTags = tags.filter(tag => tag.id).map(tag => ({ id: tag.id as number }))
  const newTagNames = tags.filter(tag => !tag.id).map(tag => tag.name)
  
  // First, create any new tags and get their IDs
  let allTagIds = [...existingTags]
  
  if (newTagNames.length > 0) {
    // Create a unique set of new tag names
    const uniqueNewTagNames = Array.from(new Set(newTagNames))
    
    // Create tags one by one and collect their IDs
    for (const tagName of uniqueNewTagNames) {
      // Check if tag already exists by name
      const existingTag = await db.tag.findFirst({
        where: { name: tagName }
      })
      
      if (existingTag) {
        // If tag exists, just connect it
        allTagIds.push({ id: existingTag.id })
      } else {
        // Create a new tag - we need to find the highest existing ID
        const highestIdTag = await db.tag.findFirst({
          orderBy: { id: 'desc' }
        })
        
        const newId = highestIdTag ? highestIdTag.id + 1 : 1
        
        const newTag = await db.tag.create({
          data: {
            id: newId,
            name: tagName
          }
        })
        
        allTagIds.push({ id: newTag.id })
      }
    }
  }
  
  // Now create the startup with the connected tags
  const startup = await db.startup.create({
    data: {
      name,
      description,
      creatorUser: session.user.id,
      tags: {
        connect: allTagIds
      },
      participants: {
        connect: { id: session.user.id }
      },
      images: {
        create: images.map(image => ({
          url: image.url
        }))
      }
    },
    include: {
      images: true,
      tags: true,
      creatorId: true
    }
  })
  
  return startup
}

export async function getStartupById(startupId: string) {
  const startup = await db.startup.findUnique({
    where: {
      id: startupId
    },
    include: {
      tags: true,
      images: true,
      creatorId: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          description: true
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

  if (!startup) {
    return null
  }

  return startup
} 