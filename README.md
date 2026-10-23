# DevMoon Blog

![Python](https://img.shields.io/badge/Python-Programming-blue.svg)
![Flask](https://img.shields.io/badge/Flask-API-black.svg)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57.svg)
![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)
![Next.js](https://img.shields.io/badge/Next.js-Framework-black.svg)
![Postman](https://img.shields.io/badge/Postman-API%20Testing-FF6C37?logo=postman&logoColor=white)

## Sobre el proyecto

DevMoon Blog permite compartir y explorar artículos y proyectos. Los visitantes pueden buscar publicaciones y consultar sus detalles; el sistema también permite crear cuentas e iniciar sesión.

Flask (Python) gestiona las operaciones del sitio, SQLite guarda la información, React con Next.js presenta la interfaz web y Postman ayuda a probar la API.

## Funciones

- Artículos: la API permite crear, consultar, actualizar y eliminar publicaciones con imagen, autor y fecha. Home incluye un modal con campos para el título, el contenido y la imagen.
- Usuarios: registro, inicio y cierre de sesión mediante cookies; `AuthProvider` comparte el estado de sesión en la interfaz.
- Favoritos: actualizar el estado de favorito de un artículo.
- Interfaz: `ArticleProvider` comparte los artículos, filtros y estado de carga, y gestiona el envío de nuevos artículos. El detalle en `/article/[id]` reutiliza un artículo ya cargado o lo consulta por ID, y muestra su imagen, autor y fecha.
- Navegación: opciones de menú adaptadas al estado de sesión.

## Requisitos

- Python y `pip`.
- Node.js y `npm`.

## Inicio

### API

Desde la carpeta principal, crea el entorno e inicia Flask:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

La API queda disponible en `http://127.0.0.1:5000` y crea la base de datos SQLite al iniciar.

### Frontend

En otra terminal, instala y ejecuta la aplicación web:

```powershell
cd app-blog
npm install
npm install @fortawesome/free-regular-svg-icons
npm run dev
```

Abre `http://localhost:3000`. Mantén la API en ejecución para que el frontend pueda cargar los artículos.

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/register` | Registra un usuario. |
| `POST` | `/login` | Inicia sesión. |
| `GET` | `/check-auth` | Comprueba la sesión actual. |
| `POST` | `/logout` | Cierra la sesión. |
| `GET` | `/articles` | Lista los artículos. |
| `POST` | `/create-article` | Crea un artículo asociado al usuario con sesión iniciada. |
| `GET` | `/article/<id>` | Obtiene un artículo por identificador. |
| `PUT` | `/articles/<id>` | Actualiza un artículo. |
| `DELETE` | `/articles/<id>` | Elimina un artículo. |
| `POST` | `/favorites/<id>` | Actualiza el estado de favorito. |

Las solicitudes usan JSON. Ejemplo para crear un artículo:

```json
{
  "title": "Mi artículo",
  "content": "Contenido del artículo.",
  "image_url": "https://ejemplo.com/imagen.jpg"
}
```

## Pruebas con Postman

1. Inicia la API.
2. En `postman/collections/Auth-1`, registra un usuario e inicia sesión.
3. En `postman/collections/Articles`, prueba las operaciones de artículos y la solicitud `Favorite`.

`Favorite` envía `POST /favorites/<id>` con un cuerpo como `{"isFavorite": true}`. Reemplaza `<id>` por el identificador de un artículo existente. Mantén la sesión de Postman iniciada para probar la creación de artículos.
