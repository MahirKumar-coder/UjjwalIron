export default function robots() {
  const baseUrl = 'https://ujjwaliron.com'; // Replace this with your actual custom domain once purchased

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
