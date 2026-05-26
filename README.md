# Fotaza2

Aplicación web desarrollada con Node.js, Express, Sequelize y PostgreSQL.
Permite publicar imágenes, comentarlas, valorarlas, seguir usuarios y gestionar colecciones.

---

# Tecnologías utilizadas

- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- Pug
- Bootstrap
- Express Session

---

# Funcionalidades principales

- Registro e inicio de sesión
- Publicaciones con imágenes
- Buscador de publicaciones
- Comentarios
- Valoración de imágenes
- Seguimiento de usuarios
- Colecciones
- Notificaciones
- Conversaciones privadas
- Panel administrador
- Denuncias de imágenes y comentarios

---

# Instalación

## 1. Clonar repositorio

```bash
git clone https://github.com/AntonioAssat/TPIWEBFOTAZA2.git
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar variables de entorno

Crear archivo `.env` utilizando `.env.example`

## 4. Inicializar base de datos

```bash
npm run db:init
```

## 5. Ejecutar servidor

```bash
npm start
```

---

# Acceso local

```text
http://localhost:3000
```
---

# Usuarios de prueba

## Administrador

Email:
```text
turcotomas280302@gmail.com
```

Password:
```text
123456
```

Rol:
```text
admin
```

---

## Usuario normal

Email:
```text
esteban@gmail.com
```

Password:
```text
1234
```

Rol:
```text
usuario
```

---

# Endpoints principales

## Autenticación

### Registro usuario

```http
POST /registro
```

Permite registrar un nuevo usuario.

---

### Login

```http
POST /login
```

Permite iniciar sesión.

---

### Logout

```http
GET /logout
```

Cierra la sesión del usuario.

---

# Publicaciones

### Ver publicaciones

```http
GET /publicaciones
```

Muestra todas las publicaciones.

---

### Crear publicación

```http
POST /publicaciones
```

Crea una nueva publicación.

---

### Editar publicación

```http
POST /publicaciones/:id/editar
```

Permite editar una publicación propia.

---

### Eliminar publicación

```http
POST /publicaciones/:id/eliminar
```

Elimina una publicación.

---

# Comentarios

### Agregar comentario

```http
POST /imagenes/:id/comentario
```

Agrega un comentario a una imagen.

---

### Eliminar comentario

```http
POST /comentarios/:id/eliminar
```

Elimina un comentario.

---

# Valoraciones

### Valorar imagen

```http
POST /imagenes/:id/valorar
```

Permite valorar imágenes.

---

# Usuarios

### Ver perfil

```http
GET /perfil/:id
```

Muestra el perfil de un usuario.

---

### Seguir usuario

```http
POST /perfil/:id/follow
```

Permite seguir usuarios.

---

# Administración

### Ver denuncias

```http
GET /admin/denuncias
```

Muestra denuncias realizadas por usuarios.

---

### Aprobar imagen

```http
POST /admin/imagenes/:id/aprobar
```

Aprueba una imagen denunciada.

---

### Eliminar imagen

```http
POST /admin/imagenes/:id/eliminar
```

Elimina una imagen denunciada.

---

# Problemas encontrados durante el desarrollo

## Relaciones entre modelos

Uno de los principales problemas fue la correcta definición de relaciones entre modelos utilizando Sequelize ORM.  

Se trabajó con relaciones:

- One To Many
- Many To Many
- Relaciones autorreferenciadas

Se solucionó organizando correctamente los modelos y sus asociaciones.

---

## Validaciones de formularios

Inicialmente las validaciones se realizaban únicamente desde el backend utilizando `res.send()`.  

Posteriormente se mejoró la arquitectura implementando:

- Helpers reutilizables
- Validaciones frontend
- Validaciones backend
- Alertas Bootstrap dinámicas

Esto permitió mejorar la experiencia de usuario y mantener una arquitectura más limpia.

---

## Manejo de errores

En etapas iniciales varios errores eran enviados directamente como texto plano.  

Luego se reorganizó el manejo de errores utilizando:

- Página de error personalizada
- Query params para alertas
- Mensajes dinámicos en vistas Pug

---

## Inicialización de base de datos

Al comienzo la base de datos se inicializaba automáticamente desde `app.js` utilizando `sequelize.sync()`.

Posteriormente se implementó un script independiente:

```bash
npm run db:init
```

Esto permitió separar la inicialización de la base de datos del inicio del servidor, siguiendo mejores prácticas.

---

## Organización MVC

Durante el desarrollo se reorganizó el proyecto aplicando arquitectura MVC:

- Models
- Views
- Controllers
- Middlewares
- Helpers
- Routes

Esto permitió una mejor separación de responsabilidades y mayor mantenimiento del código.
---

# Estructura del proyecto

El proyecto utiliza arquitectura MVC:

- `models/`
  Modelos Sequelize y relaciones.

- `controllers/`
  Lógica principal de la aplicación.

- `routes/`
  Definición de endpoints y rutas.

- `views/`
  Vistas Pug renderizadas por Express.

- `middlewares/`
  Middlewares de autenticación, autorización y validaciones.

- `helpers/`
  Funciones reutilizables de validación.

- `config/`
  Configuración de Sequelize y conexión a base de datos.

---

# Base de datos

El proyecto incluye una copia de seguridad SQL con información de prueba:

- Usuarios
- Publicaciones
- Comentarios
- Valoraciones
- Roles
- Datos auxiliares

La copia de seguridad debe restaurarse en PostgreSQL antes de ejecutar la aplicación.