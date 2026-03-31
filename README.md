# ProyectoNegocio

Portafolio estático para una agencia que vende sistemas, marketing y diseño gráfico.

## Archivos principales

- `index.html`: estructura del sitio
- `styles.css`: diseño visual y responsive
- `script.js`: menú móvil, animaciones y botones de copiado
- `assets/favicon.svg`: favicon del sitio

## Antes de publicar

Edita en `index.html` estos datos:

- `ProyectoNegocio` si quieres otro nombre de agencia
- `hola@proyectonegocio.com`
- `+591 70000000`
- textos de servicios o propuestas si quieres ajustarlos a tu oferta real

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube estos archivos a la rama `main`.
3. En GitHub, abre `Settings > Pages`.
4. En `Build and deployment`, elige `Deploy from a branch`.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda y espera a que GitHub genere la URL pública.

`.nojekyll` ya está incluido para que GitHub Pages publique este sitio estático sin intentar procesarlo como proyecto Jekyll.

## Desarrollo local

Puedes abrir `index.html` directamente en el navegador o levantar un servidor simple:

```bash
python3 -m http.server 8000
```
