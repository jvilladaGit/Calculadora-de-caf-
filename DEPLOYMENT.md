# Guía de Despliegue (Vercel)

Para que otras personas puedan probar la calculadora, debes publicarla en internet usando un servicio como **Vercel**. Aquí tienes los pasos exactos:

## 1. Subir el código a GitHub
Si aún no lo has hecho, asegúrate de que todos los cambios locales estén en tu repositorio de GitHub:
1. `git add .`
2. `git commit -m "Mejoras Fase 5 y cumplimiento Habeas Data"`
3. `git push origin main`

## 2. Conectar con Vercel
1. Ve a [Vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New"** > **"Project"**.
3. Selecciona el repositorio de la calculadora (`coffeeshop-calculator`).

## 3. Configurar Variables de Entorno (CRÍTICO) 🔑
Antes de darle a "Deploy", busca la sección **Environment Variables** y añade estas tres (cópiatelas de tu archivo `.env.local`):

| Key | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Tu URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Tu llave anónima de Supabase |
| `VITE_ADMIN_EMAIL` | `jvillada@ekipando.com` |

## 4. Desplegar
1. Haz clic en **"Deploy"**.
2. ¡Listo! Vercel te dará una URL (ej. `calculadora-cafe.vercel.app`) que puedes enviar a cualquier persona.

## 5. Configurar Supabase (Redirect URL)
Para que el login funcione correctamente en la versión publicada, debes avisarle a Supabase cuál es la nueva URL:
1. Ve al panel de [Supabase](https://supabase.com).
2. Entra en **Authentication** > **URL Configuration**.
3. En **Site URL**, pon la dirección que te dio Vercel.
4. En **Redirect URLs**, añade también esa misma dirección.

---
> [!NOTE]
> Gracias al archivo `vercel.json` que añadimos, la navegación interna de la app funcionará perfectamente sin errores de "404 Page Not Found" al recargar.
