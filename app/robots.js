export default function robots() {
  const baseUrl = 'https://ujjwal-iron.vercel.app/'; // Replace this with your actual custom domain once purchased

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
