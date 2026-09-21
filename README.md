# Modo Nativo

PWA de inventario y catálogo para periféricos de computador. El proyecto implementa un modelo cliente-servidor con Node.js, Express, Tailwind CSS y un CRUD persistente en JSON.

## Requisitos

- Node.js 20.11 o superior
- npm

## Ejecutar

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3001`. El puerto puede cambiarse creando `.env` a partir de `.env.example`.

Comandos adicionales:

```bash
npm run build
npm run start
npm run lint
```

## Estructura

```text
src/
  app.js                 Configuración Express y endpoints
  server.js              Arranque del servidor
  data/items.json        Persistencia del modelo
  data/items.js          Operaciones CRUD
  middlewares/           Validación, 404 y errores
public/
  index.html              Vista de gestión
  catalog.html            Vista de catálogo
  js/services/api.js      Único punto de acceso HTTP
  js/ui/ui.js             Render y estados de interfaz
  sw.js                   Service worker
  manifest.webmanifest    Metadatos instalables
  icons/                  Iconos propios de la aplicación
```

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/items` | Lista todos los productos |
| GET | `/api/items/:id` | Obtiene un producto |
| POST | `/api/items` | Crea un producto validado |
| PUT | `/api/items/:id` | Actualiza un producto validado |
| DELETE | `/api/items/:id` | Elimina un producto |

`GET /api/items` acepta parámetros combinables:

- `q`: busca en `nombre` y `descripcion`, ignorando mayúsculas y tildes.
- `categoria`: filtra por categoría.
- `sort=precio`: ordena el precio de menor a mayor.

Ejemplo: `/api/items?q=raton&categoria=Ratones&sort=precio`.

Los valores permitidos para `categoria` son `Teclados`, `Ratones`, `Audífonos`, `Micrófonos` y `Accesorios`. `precio` debe ser un número mayor o igual a cero y `stock` un entero mayor o igual a cero. Los errores de POST y PUT responden con HTTP 400 y un objeto `errors`.

## PWA y offline

El catálogo cachea la última respuesta de la API y muestra un aviso cuando la aplicación está sin conexión. El shell usa cache-first; las peticiones GET de `/api/` usan network-first. Crear, editar y eliminar muestran `No disponible sin conexión` cuando no hay red.

Para comprobar la instalación, abre DevTools en localhost y revisa Application > Manifest y Application > Service Workers.

## Tema visual

Modo Nativo usa una paleta coral, grafito, menta y amarillo, con Space Grotesk como tipografía. El tema claro u oscuro se guarda en `localStorage` y la primera visita respeta `prefers-color-scheme`.
