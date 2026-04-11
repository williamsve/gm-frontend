/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Exportar como archivos estáticos (HTML/CSS/JS)
  output: 'export',
  // Carpeta de salida para DonWeb (public_html)
  distDir: 'public_html',
  //Sin trailing slash para compatibilidad con servidores estáticos
  trailingSlash: false,
}

module.exports = nextConfig
