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

export async function requestToParticipate(startupId: string, message: string) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Check if user is already a participant
  const startup = await db.startup.findUnique({
    where: { id: startupId },
    include: {
      participants: true,
      StartupRequest: {
        include: {
          requestBy: true
        }
      }
    }
  })

  if (!startup) {
    throw new Error("Startup not found")
  }

  // Check if user is already a participant
  if (startup.participants.some(p => p.id === session.user.id)) {
    throw new Error("You are already a participant")
  }

  // Check if user already has a pending request
  if (startup.StartupRequest?.requestBy.some(u => u.id === session.user.id)) {
    throw new Error("You already have a pending request")
  }

  // Create or connect to existing request
  const request = await db.startupRequest.upsert({
    where: {
      id: startup.startupRequestId || 0
    },
    create: {
      message,
      requestBy: {
        connect: { id: session.user.id }
      },
      startup: {
        connect: { id: startupId }
      }
    },
    update: {
      message,
      requestBy: {
        connect: { id: session.user.id }
      }
    }
  })

  return request
}

export async function hasRequestedAccess(startupId: string) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    return false
  }

  const startup = await db.startup.findUnique({
    where: { id: startupId },
    include: {
      StartupRequest: {
        include: {
          requestBy: true
        }
      }
    }
  })

  if (!startup) {
    return false
  }

  // Check if user has a pending request
  return startup.StartupRequest?.requestBy.some(u => u.id === session.user.id) ?? false
}

export async function getUserRequests() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Get all requests where the user is one of the requesters
  const requests = await db.startupRequest.findMany({
    where: {
      requestBy: {
        some: {
          id: session.user.id
        }
      }
    },
    include: {
      startup: {
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
          }
        }
      },
      requestBy: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      }
    }
  })

  // Get all startups created by the user
  const createdStartups = await db.startup.findMany({
    where: {
      creatorUser: session.user.id
    },
    include: {
      StartupRequest: {
        include: {
          requestBy: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true
            }
          }
        }
      },
      tags: true,
      images: true
    }
  })

  // Extract all incoming requests from the user's startups
  const incomingRequests = createdStartups.flatMap(startup => 
    startup.StartupRequest ? [{ 
      ...startup.StartupRequest,
      startup: {
        id: startup.id,
        name: startup.name,
        tags: startup.tags,
        images: startup.images
      }
    }] : []
  )

  return {
    outgoing: requests,
    incoming: incomingRequests
  }
}

export async function acceptRequest(requestId: string) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Convert requestId to number since it's defined as Int in Prisma schema
  const requestIdNum = parseInt(requestId, 10)
  if (isNaN(requestIdNum)) {
    throw new Error("Invalid request ID")
  }

  // First get the request
  const request = await db.startupRequest.findUnique({
    where: { id: requestIdNum },
    include: {
      startup: true,
      requestBy: true
    }
  })

  if (!request) {
    throw new Error("Request not found")
  }

  // Get startups related to this request
  if (!request.startup || request.startup.length === 0) {
    throw new Error("No startup associated with this request")
  }

  const startup = request.startup[0]
  
  // Verify that the current user is the startup creator
  if (startup.creatorUser !== session.user.id) {
    throw new Error("Only the startup creator can accept requests")
  }

  // Add all requesters to the startup participants
  if (request.requestBy && request.requestBy.length > 0) {
    await db.startup.update({
      where: { id: startup.id },
      data: {
        participants: {
          connect: request.requestBy.map(user => ({ id: user.id }))
        }
      }
    })
  }

  // Delete the request
  await db.startupRequest.delete({
    where: { id: requestIdNum }
  })

  return true
}

export async function rejectRequest(requestId: string) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Convert requestId to number since it's defined as Int in Prisma schema
  const requestIdNum = parseInt(requestId, 10)
  if (isNaN(requestIdNum)) {
    throw new Error("Invalid request ID")
  }

  // First get the request
  const request = await db.startupRequest.findUnique({
    where: { id: requestIdNum },
    include: {
      startup: true
    }
  })

  if (!request) {
    throw new Error("Request not found")
  }
  
  // Get startups related to this request
  if (!request.startup || request.startup.length === 0) {
    throw new Error("No startup associated with this request")
  }

  const startup = request.startup[0]

  // Verify that the current user is the startup creator
  if (startup.creatorUser !== session.user.id) {
    throw new Error("Only the startup creator can reject requests")
  }

  // Delete the request
  await db.startupRequest.delete({
    where: { id: requestIdNum }
  })

  return true
} 