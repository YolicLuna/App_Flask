# DevMoon Blog

![Python](https://img.shields.io/badge/Python-Programming-blue.svg)
![Flask](https://img.shields.io/badge/Flask-API-black.svg)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57.svg)
![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)
![Next.js](https://img.shields.io/badge/Next.js-Framework-black.svg)
![Postman](https://img.shields.io/badge/Postman-API%20Testing-FF6C37?logo=postman&logoColor=white)

Aplicación web para publicar, explorar y guardar artículos y proyectos como favoritos. El proyecto integra una API REST desarrollada con Flask y SQLAlchemy, una base de datos SQLite y una interfaz construida con React y Next.js.

---

## Descripción General

DevMoon Blog permite consultar publicaciones, buscar por título o contenido y ver el detalle de cada artículo. Los visitantes pueden crear una cuenta e iniciar sesión para crear publicaciones y administrar su lista personal de favoritos. Al iniciar sesión, la navegación muestra el nombre del usuario; la interfaz también permite eliminar publicaciones y ofrece una vista dedicada para consultar los favoritos.

### Tecnologías Utilizadas

El backend utiliza Python, Flask y Flask-SQLAlchemy para definir la API y gestionar las operaciones de base de datos. SQLite almacena usuarios, artículos y la relación de favoritos. Werkzeug genera y verifica los hashes de contraseñas, y Flask-CORS permite las solicitudes del frontend con credenciales. La interfaz utiliza React, Next.js y TypeScript; sus estilos están implementados con Tailwind CSS, los iconos con Font Awesome y los diálogos de confirmación con SweetAlert2. Postman se utiliza para probar manualmente los endpoints.

### Arquitectura del Proyecto

El backend concentra las rutas y la configuración de Flask en `app.py`. Los modelos de SQLAlchemy están en `Models/`: `User` administra las cuentas y sus publicaciones y favoritos, mientras que `Article` representa las publicaciones y la relación muchos a muchos de favoritos. El frontend Next.js se organiza con páginas para Inicio, registro, inicio de sesión y detalle de artículo, componentes reutilizables, proveedores de contexto para autenticación y artículos, y tipos TypeScript compartidos. El proveedor de autenticación gestiona el registro y el inicio de sesión, consulta la sesión activa y conserva el nombre de usuario para mostrarlo en la navegación.

### Modelos de la Base de Datos

El sistema cuenta con dos entidades principales. `User` almacena el nombre de usuario, correo electrónico único y contraseña hasheada. `Article` almacena título, contenido, URL de imagen, autor y fecha de creación. La tabla de asociación `favorite_articles` relaciona usuarios y artículos para guardar favoritos de forma independiente para cada usuario.

### Seguridad y Autenticación

Las contraseñas se guardan usando las funciones de hash de Werkzeug, no en texto plano. Flask mantiene la sesión del usuario mediante una cookie; el frontend incluye credenciales en las solicitudes que necesitan conservarla. El endpoint `/check-auth` valida que el usuario de la sesión siga existiendo y devuelve su nombre cuando la sesión es válida. El inicio de sesión también devuelve el nombre de usuario, que el frontend muestra en la navegación. El registro crea la cuenta; para obtener una sesión y acceder a las funciones protegidas, inicia sesión después de registrarte. La creación de artículos y las operaciones de favoritos requieren una sesión iniciada. La API está configurada para aceptar solicitudes del frontend en `http://localhost:3000`.

### Flujo de Publicación y Favoritos

Un visitante puede consultar y buscar artículos, abrir su detalle y crear una cuenta desde `/register`. Después de registrarse e iniciar sesión, puede crear una publicación proporcionando título, contenido y URL de imagen. Los artículos se muestran en tarjetas con autor y fecha; desde ellas se puede abrir el detalle o marcar la publicación como favorita. La navegación muestra el nombre del usuario autenticado y permite alternar entre el catálogo y sus favoritos. Al seleccionar eliminar, SweetAlert2 muestra un diálogo de confirmación antes de borrar el artículo y una notificación de éxito después de confirmar.

### Pruebas de la API

El repositorio incluye solicitudes de Postman para probar el registro, el inicio de sesión y las operaciones de artículos y favoritos. Las pruebas se ejecutan manualmente con la API iniciada; no se incluye una suite de pruebas automatizadas.

---

## Requisitos

- Python y `pip`.
- Node.js y `npm`.
- Postman (opcional, para probar la API).

---

## Inicio Rápido

### API

Desde la carpeta raíz del proyecto, crea y activa un entorno virtual, instala las dependencias e inicia Flask:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

La API queda disponible en `http://127.0.0.1:5000`. La base de datos SQLite y sus tablas se crean al iniciar la aplicación.

### Frontend

En otra terminal, instala las dependencias e inicia Next.js:

```powershell
cd app-blog
npm install
npm install @fortawesome/free-regular-svg-icons
npm run dev
```

Abre `http://localhost:3000`. Mantén la API en ejecución para que el frontend pueda cargar y modificar los artículos.

---

## Estructura del Proyecto

```text
App_Flask/
├── app.py                         # Aplicación Flask y endpoints de la API
├── requirements.txt               # Dependencias de Python
├── Models/
│   ├── __init__.py                # Instancia de SQLAlchemy
│   ├── article.py                 # Modelo de artículos y tabla de favoritos
│   └── user.py                    # Modelo de usuarios y contraseñas
├── app-blog/
│   ├── app/
│   │   ├── article/[id]/          # Página de detalle de artículo
│   │   ├── components/             # Tarjetas, navegación, búsqueda y modal
│   │   ├── login/                  # Página de inicio de sesión
│   │   ├── register/               # Página de registro
│   │   ├── layout.tsx              # Layout raíz de Next.js
│   │   └── page.tsx                # Página de inicio
│   ├── context/                    # Estado compartido de autenticación y artículos
│   ├── types/                      # Tipos TypeScript
│   └── package.json                # Dependencias y scripts del frontend
└── postman/
    └── collections/                # Solicitudes de prueba para Auth y Articles
```

---

## Endpoints Disponibles

### Autenticación

| Método | Ruta | Descripción | Sesión requerida |
|--------|------|-------------|------------------|
| POST | `/register` | Crear una cuenta y guardar la contraseña hasheada | No |
| POST | `/login` | Iniciar sesión y devolver el nombre del usuario | No |
| GET | `/check-auth` | Validar la sesión y obtener el nombre del usuario autenticado | No |
| POST | `/logout` | Cerrar la sesión actual | No |

### Artículos

| Método | Ruta | Descripción | Sesión requerida |
|--------|------|-------------|------------------|
| GET | `/articles` | Listar artículos e indicar si son favoritos para la sesión | No |
| POST | `/create-article` | Crear un artículo asociado al usuario autenticado | Sí |
| GET | `/article/<id>` | Obtener un artículo por identificador | No |
| PUT | `/articles/<id>` | Actualizar el título y contenido de un artículo | No |
| DELETE | `/articles/<id>` | Eliminar un artículo | No |

### Favoritos

| Método | Ruta | Descripción | Sesión requerida |
|--------|------|-------------|------------------|
| GET | `/favorites` | Listar los artículos favoritos del usuario | Sí |
| POST | `/favorites/<id>` | Marcar o desmarcar un artículo como favorito | Sí |

Las solicitudes para registrar usuarios y crear artículos usan JSON. Ejemplo del cuerpo de una solicitud de creación:

```json
{
  "title": "Mi artículo",
  "content": "Contenido del artículo.",
  "image_url": "https://ejemplo.com/imagen.jpg"
}
```

Para actualizar un favorito, envía `{"isFavorite": true}` o `{"isFavorite": false}` a `POST /favorites/<id>`.

El registro recibe `username`, `email` y `password`, y devuelve un mensaje de confirmación al crear la cuenta. El inicio de sesión recibe `email` y `password`; cuando las credenciales son válidas, responde con `{"message": "Inicio de sesion exitoso", "username": "nombre"}` y crea la sesión.

`GET /check-auth` responde con `{"authenticated": true, "username": "nombre"}` cuando la sesión pertenece a un usuario válido. Si no hay una sesión válida, responde `{"authenticated": false, "username": ""}` con estado HTTP `200`.

---

## Dependencias Principales

| Dependencia | Propósito |
|-------------|-----------|
| Flask | Framework web para la API |
| Flask-SQLAlchemy | ORM y administración de la base de datos |
| Werkzeug | Hash y verificación de contraseñas |
| Flask-CORS | Solicitudes entre el frontend y la API |
| Next.js | Framework de la aplicación web |
| React | Construcción de la interfaz |
| TypeScript | Tipado estático del frontend |
| Tailwind CSS | Estilos de la interfaz |
| Font Awesome | Iconos de la interfaz |
| SweetAlert2 | Diálogo de confirmación y notificación al eliminar artículos |

---

## Seguridad

Las contraseñas se almacenan como hashes generados por Werkzeug y la autenticación utiliza sesiones de Flask en cookies, no tokens JWT. La creación de artículos y el acceso y modificación de favoritos validan la sesión. Las rutas de actualización y eliminación de artículos actualmente no requieren autenticación en la API.

---

## Pruebas

Para probar la API con Postman:

1. Inicia el backend siguiendo las instrucciones de Inicio Rápido.
2. Usa las solicitudes de `postman/collections/Auth-1` para registrar un usuario e iniciar sesión. La respuesta del login incluye el nombre de usuario.
3. Usa las solicitudes de `postman/collections/Articles` para listar, crear, consultar, actualizar o eliminar artículos y cambiar favoritos.
4. Mantén la sesión de Postman para las solicitudes que requieren autenticación.

La API también se puede probar con `curl` o cualquier cliente HTTP. No hay un comando de pruebas automatizadas configurado en el proyecto.
