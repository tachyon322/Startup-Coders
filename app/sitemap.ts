import { MetadataRoute } from 'next'
import { getStartups } from '@/data/startup'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://startupcoders.ru'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/find`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  try {
    // Dynamic startup pages
    const { startups } = await getStartups(1, 1000) // Get all startups for sitemap
    const startupPages = startups.map((startup) => ({
      url: `${baseUrl}/startup/${startup.id}`,
      lastModified: new Date(startup.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...startupPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if dynamic content fails
    return staticPages
  }
}