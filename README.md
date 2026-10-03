# Blog API

API sencilla para administrar artículos y usuarios. Está construida con Flask y guarda la información en una base de datos SQLite.

![Python](https://img.shields.io/badge/Python-Programming-blue.svg)
![Flask](https://img.shields.io/badge/Flask-API-black.svg)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57.svg)
![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)
![Next.js](https://img.shields.io/badge/Next.js-Framework-black.svg)
![Postman](https://img.shields.io/badge/Postman-API%20Testing-FF6C37?logo=postman&logoColor=white)

## Funciones

- Crear, consultar, actualizar y eliminar artículos.
- Registrar usuarios e iniciar sesión.
- Guardar las contraseñas como hashes.
- Probar las solicitudes con las colecciones de Postman incluidas.

## Requisitos

- Python instalado.
- `pip` para instalar las dependencias.
- Node.js y `npm` para ejecutar el frontend.

## Instalación y ejecución

Desde la carpeta principal del proyecto, ejecuta:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

La API estará disponible en `http://127.0.0.1:5000`. La base de datos SQLite se crea al iniciar la aplicación.

## Rutas de la API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/register` | Registra un usuario. |
| `POST` | `/login` | Inicia sesión. |
| `GET` | `/articles` | Obtiene todos los artículos. |
| `POST` | `/create-article` | Crea un artículo. |
| `GET` | `/article/<id>` | Obtiene un artículo por su identificador. |
| `PUT` | `/articles/<id>` | Actualiza un artículo. |
| `DELETE` | `/articles/<id>` | Elimina un artículo. |

Las solicitudes de registro y de artículos usan JSON. Por ejemplo, para crear un artículo:

```json
{
	"title": "Mi artículo",
	"content": "Contenido del artículo."
}
```

Para registrar un usuario, envía `username`, `email` y `password`. Para iniciar sesión, envía `email` y `password`.

## Pruebas con Postman

1. Inicia la API siguiendo los pasos anteriores y déjala ejecutándose.
2. Abre las solicitudes de `postman/collections` en Postman.
3. Elige una solicitud y envíala a `http://127.0.0.1:5000`.

La carpeta `Articles` contiene solicitudes para crear, consultar, actualizar y eliminar artículos. La carpeta `Auth-1` contiene solicitudes para registrar usuarios e iniciar sesión. Las solicitudes incluyen ejemplos de los datos JSON necesarios.

## Frontend

El frontend está en `app-blog/` y está desarrollado con React y Next.js. La página principal consulta los artículos de la API y los muestra en tarjetas con su título y un fragmento del contenido. También incluye una estructura compartida con barra de navegación y pie de página.

Para iniciarlo, primero asegúrate de que la API Flask esté ejecutándose. Después, abre una terminal en `app-blog/` y ejecuta:

```powershell
npm install
npm run dev
```

Luego visita `http://localhost:3000`. Mantén la API Flask en ejecución para que el frontend pueda conectarse a ella.
