
import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

const baseUrl = 'https://saraikistan.org'

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
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/culture`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/region`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/celebrities`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const peopleRoutes: MetadataRoute.Sitemap = content.people.map(
    (item: any) => ({
      url: `${baseUrl}/celebrities/${item.slug}`,
      lastModified: item._updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

  const placeRoutes: MetadataRoute.Sitemap = content.places.map(
    (item: any) => ({
      url: `${baseUrl}/region/${item.slug}`,
      lastModified: item._updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

  const cultureRoutes: MetadataRoute.Sitemap = content.culture.map(
    (item: any) => ({
      url: `${baseUrl}/culture/${item.slug}`,
      lastModified: item._updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

  const storyRoutes: MetadataRoute.Sitemap = content.stories.map(
    (item: any) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item._updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

  const newsRoutes: MetadataRoute.Sitemap = content.news.map(
    (item: any) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: item._updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  )

  return [
    ...staticRoutes,
    ...peopleRoutes,
    ...placeRoutes,
    ...cultureRoutes,
    ...storyRoutes,
    ...newsRoutes,
  ]
}
