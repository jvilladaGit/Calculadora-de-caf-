# Guía Detallada: Cómo subir tu código a GitHub

Tu código está guardado localmente en tu computadora en esta carpeta:
`Users/macbook/Desktop/2.Estudios/3.Aplicaciones/2.Antigravity/coffeeshop-calculator`

Sigue estos pasos para subirlo a GitHub:

## Paso 1: Crea un Repositorio en GitHub
1. Abre [GitHub.com](https://github.com) e inicia sesión.
2. Haz clic en el botón **"+"** arriba a la derecha y selecciona **"New repository"**.
3. Ponle un nombre (ej. `coffeeshop-calculator`).
4. Déjalo como **Public** o **Private** (como prefieras).
5. **IMPORTANTE**: No marques ninguna de las opciones de "Initialize this repository with" (ni README, ni .gitignore, ni license). Queremos un repositorio vacío.
6. Haz clic en **"Create repository"**.

## Paso 2: Conecta tu carpeta local con GitHub
GitHub te mostrará una pantalla con varios comandos. Los que necesitamos son estos. Abre tu **Terminal** en tu Mac y asegúrate de estar dentro de la carpeta del proyecto (o simplemente copia y pega estos comandos uno a uno):

> [!TIP]
> Si no sabes cómo abrir la terminal en esa carpeta, puedes arrastrar la carpeta `coffeeshop-calculator` directamente sobre el icono de la Terminal.

Ejecuta estos comandos:

1. **Copia y pega este comando para vincular tu carpeta con GitHub:**
   ```bash
   git remote add origin https://github.com/jvilladaGit/Calculadora-de-caf-.git
   ```

2. **Asegúrate de estar en la rama principal:**
   ```bash
   git branch -M main
   ```

3. **Prepara todos tus archivos (punto importante):**
   ```bash
   git add .
   ```

4. **Guarda los cambios con un nombre:**
   ```bash
   git commit -m "Subida inicial de la calculadora"
   ```

5. **Sube todo finalmente a GitHub:**
   ```bash
   git push -u origin main
   ```

## Paso 3: ¿Qué sigue?
Una vez que veas que el comando `git push` termina sin errores, refresca la página de GitHub. ¡Verás todos tus archivos allí!

Ahora ya puedes seguir con la [Guía de Despliegue (Vercel)](file:///Users/macbook/Desktop/2.Estudios/3.Aplicaciones/2.Antigravity/coffeeshop-calculator/DEPLOYMENT.md).

---
**¿Dónde está el código exactamente?**
Si quieres verlo en tu Mac, está en:
`/Users/macbook/Desktop/2.Estudios/3.Aplicaciones/2.Antigravity/coffeeshop-calculator`
Puedes abrir esa carpeta en el **Finder** para ver los archivos como `App.tsx`, `package.json`, etc.
