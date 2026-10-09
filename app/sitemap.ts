
import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export const revalidate = 3600

const BASE_URL = 'https://saraikistan.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await client.fetch(`
    {
      "people": *[_type == "person" && defined(slug.current)]{
        "slug": slug.current,
        "_updatedAt": _updatedAt
      },

      "places": *[_type == "place" && defined(slug.current)]{
        "slug": slug.current,
        "_updatedAt": _updatedAt
      },

      "culture": *[_type == "culture" && defined(slug.current)]{
        "slug": slug.current,
        "_updatedAt": _updatedAt
      },

      "stories": *[_type == "story" && defined(slug.current)]{
        "slug": slug.current,
        "_updatedAt": _updatedAt
      },

      "news": *[_type == "newsPost" && defined(slug.current)]{
        "slug": slug.current,
        "_updatedAt": _updatedAt
      }
    }
  `)

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/celebrities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/region`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/saraikistan-map`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/culture`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  const peopleRoutes: MetadataRoute.Sitemap = content.people.map(
    (item: { slug: string; _updatedAt?: string }) => ({
      url: `${BASE_URL}/celebrities/${item.slug}`,
      lastModified: item._updatedAt
        ? new Date(item._updatedAt)
        : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

  const placesRoutes: MetadataRoute.Sitemap = content.places.map(
    (item: { slug: string; _updatedAt?: string }) => ({
      url: `${BASE_URL}/region/${item.slug}`,
      lastModified: item._updatedAt
        ? new Date(item._updatedAt)
        : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

  const cultureRoutes: MetadataRoute.Sitemap = content.culture.map(
    (item: { slug: string; _updatedAt?: string }) => ({
      url: `${BASE_URL}/culture/${item.slug}`,
      lastModified: item._updatedAt
        ? new Date(item._updatedAt)
        : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

  const storiesRoutes: MetadataRoute.Sitemap = content.stories.map(
    (item: { slug: string; _updatedAt?: string }) => ({
      url: `${BASE_URL}/stories/${item.slug}`,
      lastModified: item._updatedAt
        ? new Date(item._updatedAt)
        : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

  const newsRoutes: MetadataRoute.Sitemap = content.news.map(
    (item: { slug: string; _updatedAt?: string }) => ({
      url: `${BASE_URL}/news/${item.slug}`,
      lastModified: item._updatedAt
        ? new Date(item._updatedAt)
        : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  )

  return [
    ...staticRoutes,
    ...peopleRoutes,
    ...placesRoutes,
    ...cultureRoutes,
    ...storiesRoutes,
    ...newsRoutes,
  ]
}
