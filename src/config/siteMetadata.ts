import type { Metadata } from 'expo-router/server';

// Always use the public production origin, including in authenticated previews.
export const siteMetadata = {
  name: 'こんだて日和',
  title: 'こんだて日和 | 家族の献立づくりをもっと楽しく',
  description: '毎日の献立を考える負担を少し軽く。家族の食卓を支える献立アプリです。',
  url: 'https://kondate-biyori-seven.vercel.app/',
  image: 'https://kondate-biyori-seven.vercel.app/og-kondate-biyori.png',
  imageAlt: 'こんだて日和。毎日の『何を作ろう』を、少し軽く。温かな食卓と料理のイラスト。',
} as const;

export function getSiteMetadata(): Metadata {
  return {
    title: siteMetadata.title,
    description: siteMetadata.description,
    openGraph: {
      type: 'website',
      siteName: siteMetadata.name,
      title: siteMetadata.title,
      description: siteMetadata.description,
      url: siteMetadata.url,
      locale: 'ja_JP',
      images: [{ url: siteMetadata.image, width: 1200, height: 630, alt: siteMetadata.imageAlt, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [{ url: siteMetadata.image, alt: siteMetadata.imageAlt }],
    },
  };
}
