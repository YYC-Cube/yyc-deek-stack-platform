import { integrations } from "@/app/data/integrations"
import IntegrationDetailPageClient from "./IntegrationDetailPageClient"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const integration = integrations.find((i) => i.id === params.id)

  if (!integration) {
    return {
      title: "集成未找到 | YanYuCloud³",
      description: "该集成应用不存在或已被删除",
    }
  }

  return {
    title: `${integration.name} - YanYuCloud³ 集成中心`,
    description: integration.description,
    keywords: [...integration.tags, integration.category, integration.name].join(", "),
    openGraph: {
      title: `${integration.name} - YanYuCloud³`,
      description: integration.description,
      type: "article",
      url: `https://yanyucloud.com/integrations/${integration.id}`,
      images: [
        {
          url: "/images/logo.png",
          width: 1200,
          height: 630,
          alt: integration.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: integration.name,
      description: integration.description,
      images: ["/images/logo.png"],
    },
    alternates: {
      canonical: `https://yanyucloud.com/integrations/${integration.id}`,
    },
  }
}

export default function IntegrationPage() {
  return <IntegrationDetailPageClient />
}
