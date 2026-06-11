# Fotaza

## Descripción

Fotaza es una aplicación web desarrollada como Trabajo Práctico Integrador utilizando Node.js, Express, Sequelize y PostgreSQL.

La plataforma permite a los usuarios compartir fotografías, interactuar mediante comentarios y valoraciones, seguir otros usuarios, organizar contenido en colecciones personales, intercambiar mensajes privados y denunciar contenido inapropiado.

Además, incorpora un sistema de administración para la moderación de publicaciones y comentarios reportados por la comunidad.

---

# Tecnologías utilizadas

* Node.js
* Express
* Sequelize ORM
* PostgreSQL
* Pug
* Bootstrap
* Express Session
* Neon
* Vercel

---

# Arquitectura

El proyecto fue desarrollado siguiendo el patrón MVC (Model - View - Controller).

La estructura se divide en:

* Models: definición de entidades y relaciones mediante Sequelize.
* Views: vistas desarrolladas con Pug.
* Controllers: lógica de negocio.
* Routes: definición de endpoints.
* Middlewares: autenticación, autorización y validaciones.
* Helpers: funciones reutilizables.
* Config: configuración de base de datos y entorno.

Esta organización permite una mejor separación de responsabilidades y facilita el mantenimiento del sistema.

---

# Funcionalidades principales

* Registro e inicio de sesión
* Gestión de perfiles
* Publicaciones con imágenes
* Buscador de publicaciones
* Comentarios
* Valoración de imágenes
* Seguimiento de usuarios
* Colecciones
* Notificaciones
* Conversaciones privadas
* Panel administrador
* Denuncias de imágenes y comentarios
* Persistencia de sesiones
* Sistema de roles

---

# Instalación

## 1. Clonar repositorio

```bash
git clone https://github.com/AntonioAssat/TPIWEBFOTAZA2.git
```

## 2. Ingresar al proyecto

```bash
cd TPIWEBFOTAZA2
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_NAME=fotaza2
DB_USER=postgres
DB_PASSWORD=SU_PASSWORD
DB_HOST=localhost

PORT=3000

SESSION_SECRET=cualquier_texto_secreto
```

El sistema también soporta conexiones mediante `DATABASE_URL` para utilizar Neon como base de datos remota.

## 5. Inicializar base de datos

```bash
npm run db:init
```

Este comando:

* Crea todas las tablas necesarias.
* Configura las relaciones.
* Ejecuta los seeders iniciales.
* Genera usuarios de prueba.

## 6. Ejecutar servidor

```bash
npm start
```

---

# Acceso local

```text
http://localhost:3000
```

---

# Usuarios de prueba tanto para local como para Vercel

## Administrador

Email:

```text
ignacioOrellano@gmail.com
```

Contraseña:

```text
12345678
```

Rol:

```text
admin
```

---

## Usuario normal

Email:

```text
mariano@gmail.com
```

Contraseña:

```text
12345678
```

Rol:

```text
usuario
```

---

# Endpoints principales

## Inicio

GET /

Página principal del sistema.

---

## Autenticación

GET /registro

Muestra formulario de registro.

POST /registro

Registra un nuevo usuario.

GET /login

Muestra formulario de inicio de sesión.

POST /login

Inicia sesión.

GET /logout

Cierra la sesión activa.

---

## Usuarios

GET /perfil/:id

Muestra el perfil de un usuario.

GET /perfil/:id/editar

Formulario de edición de perfil.

POST /perfil/:id/editar

Actualiza datos del perfil.

POST /perfil/:id/follow

Permite seguir usuarios.

---

## Notificaciones

GET /notificaciones

Muestra notificaciones del usuario.

POST /notificaciones/:id/leida

Marca una notificación como leída.

---

## Publicaciones

GET /publicaciones

Listado general de publicaciones.

GET /publicaciones/nueva

Formulario para crear publicación.

POST /publicaciones

Crear publicación.

GET /publicaciones/:id/imagen

Formulario para agregar imagen.

POST /publicaciones/:id/imagen

Agregar imagen a publicación.

GET /publicaciones/:id/editar

Formulario de edición.

POST /publicaciones/:id/editar

Actualizar publicación.

POST /publicaciones/:id/eliminar

Eliminar publicación.

POST /publicaciones/:id/guardar

Guardar publicación en colección.

---

## Comentarios

POST /imagenes/:id/comentario

Agregar comentario.

POST /comentarios/:id/eliminar

Eliminar comentario.

POST /comentarios/:id/denunciar

Denunciar comentario.

---

## Valoraciones

POST /imagenes/:id/valorar

Valorar imagen.

---

## Denuncias

POST /imagenes/:id/denunciar

Denunciar imagen.

---

## Intereses

POST /imagenes/:id/interes

Registrar interés sobre una imagen.

---

## Comentarios habilitados

POST /imagenes/:id/cerrar-comentarios

Cerrar comentarios.

POST /imagenes/:id/abrir-comentarios

Abrir comentarios.

---

## Feed

GET /feed

Publicaciones de usuarios seguidos.

---

## Colecciones

GET /colecciones

Listado de colecciones.

GET /colecciones/:id

Ver colección específica.

POST /colecciones

Crear colección.

---

## Conversaciones

GET /conversaciones

Listado de conversaciones.

GET /conversaciones/:id

Abrir conversación.

POST /conversaciones/:id/mensaje

Enviar mensaje.

---

## Administración

GET /admin/denuncias

Ver denuncias pendientes.

GET /admin/historial

Ver historial administrativo.

POST /admin/imagenes/:id/aprobar

Aprobar imagen denunciada.

POST /admin/imagenes/:id/eliminar

Eliminar imagen denunciada.




---
# Seeders

El proyecto incorpora seeders ejecutados automáticamente mediante:

npm run db:init

Los seeders generan usuarios de prueba para facilitar la evaluación del sistema.

Administrador:

Email:
[ignacioOrellano@gmail.com](mailto:ignacioOrellano@gmail.com)

Contraseña:
12345678

Usuario:

Email:
[mariano@gmail.com](mailto:mariano@gmail.com)

Contraseña:
12345678

Los seeders no duplican registros existentes al ejecutarse nuevamente.

# Control de versiones

El proyecto fue gestionado utilizando Git y GitHub.

Se utilizó una rama principal:

* main

Y ramas auxiliares para el desarrollo de funcionalidades y documentación:

* feature-documentacion

Las modificaciones fueron integradas posteriormente mediante merge hacia la rama principal, manteniendo una versión estable del proyecto para su entrega.

# Base de Datos

La inicialización de la base de datos se realiza mediante:

```bash
npm run db:init
```

Este proceso:

* Crea todas las tablas necesarias.
* Configura las relaciones entre entidades.
* Ejecuta los seeders iniciales.
* Genera usuarios de prueba.

Además, se incluye una copia de seguridad SQL con datos de ejemplo para realizar pruebas más completas del sistema.

---

# Deploy

El proyecto fue desplegado utilizando:

* Backend: Vercel
* Base de Datos: Neon PostgreSQL

URL del deploy:

https://tpiwebfotaza-2.vercel.app/

Usuarios de prueba

## Administrador

Email:

```text
ignacioOrellano@gmail.com
```

Contraseña:

```text
12345678
```

Rol:

```text
admin
```

---

## Usuario normal

Email:

```text
mariano@gmail.com
```

Contraseña:

```text
12345678
```

Rol:

```text
usuario
```

---

# Problemas encontrados durante el desarrollo

## Relaciones entre modelos

Uno de los principales desafíos fue la correcta definición de relaciones entre modelos utilizando Sequelize ORM.

Se trabajó con:

* One To Many
* Many To Many
* Relaciones autorreferenciadas

La solución consistió en reorganizar las asociaciones y centralizar correctamente las relaciones entre modelos.

---

## Validaciones

Inicialmente las validaciones se realizaban únicamente desde el backend.

Posteriormente se implementaron:

* Validaciones frontend
* Validaciones backend
* Helpers reutilizables
* Alertas dinámicas

Esto permitió mejorar la experiencia de usuario y la robustez del sistema.

---

## Manejo de errores

Se implementó:

* Página personalizada de errores
* Mensajes dinámicos
* Manejo centralizado de excepciones
* Redirecciones controladas

---

## Persistencia de sesiones

Durante el despliegue en Vercel se detectaron problemas de persistencia utilizando MemoryStore.

La solución fue implementar SequelizeStore con PostgreSQL, permitiendo mantener las sesiones entre solicitudes y garantizando compatibilidad con entornos serverless.

---

## Inicialización de base de datos

Inicialmente la creación de tablas se realizaba desde la aplicación principal.

Posteriormente se implementó:

```bash
npm run db:init
```

permitiendo separar la inicialización de la base de datos del inicio del servidor y ejecutar automáticamente los seeders de prueba.

---

# Estructura del proyecto

El proyecto utiliza arquitectura MVC:

* models/
* controllers/
* routes/
* views/
* middlewares/
* helpers/
* config/
* scripts/

---

# Creador

* Antonio Assat

