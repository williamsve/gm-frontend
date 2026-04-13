/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Para Vercel: no usamos output: 'export' 
  // Vercel maneja el build automáticamente
  // Variables de entorno embebidas en el build
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.globalmantenimiento.site',
  },
}

module.exports = nextConfig
