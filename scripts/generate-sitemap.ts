import { getPosts } from '@/apis/post.api'
import { PostProps } from '@/types/post.type'
import fs from 'fs'
import path from 'path'

const generateSitemap = () => {
  getPosts({ page: 1, limit: 999999 }).then((response) => {
    const urls = (response?.data?.data ?? []).map(
      (post: PostProps) =>
        `
            <url>
              <loc>https://eurekas.vercel.app/posts/${post._id}</loc>
              <lastmod>${new Date(post.updatedAt ?? post.createdAt ?? '').toISOString()}</lastmod>
              <priority>0.8</priority>
            </url>`
    )
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
          <urlset 
          xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          >
          ${urls.join('\n')}
          </urlset>`
    const filePath = path.join(__dirname, '../public/sitemap.xml')
    fs.writeFileSync(filePath, sitemap.trim())
  })

  console.log('✅ sitemap.xml generated')
}

generateSitemap()
