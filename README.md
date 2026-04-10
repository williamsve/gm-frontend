# Proyecto Next.js - Global Mantenimiento C.A.

Este repositorio contiene la conversión de una plantilla HTML a una aplicación Next.js (routing `pages/`) usando Tailwind CSS.

Estado actual
- Next.js con routing `pages/`
- Tailwind CSS (v3) configurado
- Componentes extraídos: `Header`, `Hero`, `Services`, `Footer`, `ContactCTA`
- Contacto: ahora se usa un CTA a WhatsApp (`ContactCTA`) en lugar de un formulario; esto evita la necesidad de backend o base de datos.

Cómo ejecutar (local)
1. Instalar dependencias:

```powershell
pnpm install
```

2. Ejecutar en modo desarrollo:

```powershell
pnpm dev
```

3. Abrir en el navegador: http://localhost:3000

Despliegue a Vercel
- Vercel detecta automáticamente Next.js. Sube este repo y configura el proyecto en Vercel. Usa `pnpm` como paquete manager si deseas.
- Nota: si planeas usar optimizaciones nativas (sharp, lightningcss), autoriza los build scripts de pnpm o habilita los binarios necesarios. Para la mayoría de los usos la configuración actual (Tailwind v3) evita dependencias nativas.

Siguientes pasos sugeridos
- Revisar y pulir estilos Tailwind (ya convertidos en su mayoría). 
 - Si deseas recibir mensajes en un sistema propio, considera integrar un webhook o un servicio de correo; actualmente el contacto se hace por WhatsApp.
 - Preparar pruebas e integración continua.
