/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Configuración para exportación estática (FTP)
  output: 'export',
  trailingSlash: true,
  // Los rewrites no funcionan en modo export estático
  // La API debe estar configurada directamente en NEXT_PUBLIC_API_URL
}

module.exports = nextConfig
