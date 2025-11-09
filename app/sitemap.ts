import type { MetadataRoute } from "next"
import { integrations } from "./data/integrations"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yanyucloud.com"

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/integrations`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/developer/guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  // 动态集成页面
  const integrationPages: MetadataRoute.Sitemap = integrations.map((integration) => ({
    url: `${baseUrl}/integrations/${integration.id}`,
    lastModified: new Date(integration.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: integration.featured ? 0.8 : 0.6,
  }))

  return [...staticPages, ...integrationPages]
}
