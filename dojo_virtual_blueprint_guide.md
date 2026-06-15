# Plano de Arquitectura (Blueprint) del Dojo Virtual

Tienes toda la razón. Si en el otro proyecto vas a utilizar estilos visuales, colores, layouts de dashboard o librerías de diseño distintas (como CSS puro, CSS Modules, Tailwind con otra configuración, Material UI, Chakra, etc.), copiar y pegar el componente HTML gigante de 2,000 líneas causaría mucho trabajo de refactorización y depuración.

Para resolver esto, he creado un **Blueprint Técnico (Plano modular)** del motor del Dojo Virtual. Este diseño desacopla las operaciones críticas (matemáticas de pose, carga dinámica de MediaPipe e hilos de sincronización WebRTC/API) del diseño visual de la interfaz.

Puedes descargar el paquete completo con el blueprint aquí:
👉 **[Descargar dojo-virtual-blueprint.zip](file:///C:/Users/david/.gemini/antigravity-ide/brain/06b5267e-1d00-4e10-8652-78302c916dd9/dojo-virtual-blueprint.zip)**

---

## Estructura del Blueprint

Al descomprimir el archivo, verás una estructura de archivos limpia y modular:

```
dojo-virtual-blueprint/
├── utils/
│   └── dojoMath.ts          # Funciones matemáticas puras (cálculo de ángulos,
│                            # normalización de silueta, dibujo sobre canvas HTML5)
├── hooks/
│   ├── useDojoMediaPipe.ts  # Hook de React para carga dinámica del CDN de MediaPipe
│   │                        # y administración de la cámara
│   └── useDojoWebRTC.ts     # Hook de React para control de sockets PeerJS (WebRTC)
│                            # y bucle de polling HTTP alternativo
├── db/
│   └── schema.json          # Definición de esquema para colecciones/tablas (Rooms/Presets)
├── api/
│   └── api-spec.md          # Especificación formal de contratos de endpoints (JSON payloads)
└── README.md                # Guía técnica de integración y ejemplo básico de ensamblado
```

---

## ¿Cómo Funciona la Integración del Blueprint?

El diseño modular te permite ensamblar tu propia interfaz de usuario con tu propio estilo CSS. El flujo de datos en React se gestiona de la siguiente manera:

1. **Carga y Activación de Cámara (useDojoMediaPipe)**:
   - El hook se encarga de descargar las librerías oficiales de MediaPipe desde un CDN global para no inflar tu paquete inicial.
   - Te provee una función `startPoseTracking(videoElement, callback)` que enciende la webcam, procesa cada frame con el modelo de inteligencia artificial de pose, y llama a tu callback con las coordenadas `x, y, z` de cada articulación.

2. **Cálculos y Dibujo en Pantalla (dojoMath)**:
   - En tu callback, usas las funciones de `dojoMath.ts` para evaluar los ángulos corporales.
   - Utilizas `drawGhostSkeleton(ctx, ...)` para pintar la silueta guía (el "fantasma" azul o dorado) adaptada y escalada al tamaño y posición del alumno mediante `normalizeReferenceLandmarks`.
   - Utilizas `drawActiveSkeleton(ctx, ...)` para dibujar el esqueleto del alumno en tiempo real. Aquí puedes pasarle como argumentos **cualquier color hexadecimal o RGBA** que defina la paleta de tu nuevo proyecto (por ejemplo, verde para articulaciones alineadas, gris o rojo para desalineadas).
   - Utilizas `drawCenterOfGravity(ctx, ...)` para graficar la plomada de equilibrio corporal.

3. **Bucle de Conexión en Red (useDojoWebRTC)**:
   - Gestiona el ciclo de vida de la conexión WebRTC PeerJS para transmitir las coordenadas JSON y el flujo de vídeo entre el alumno y el sensei directamente entre navegadores.
   - Si un cortafuegos bloquea la conexión P2P, el hook ejecuta automáticamente peticiones AJAX cortas hacia `/api/dojo/sync` para sincronizar los estados.

4. **Persistencia (db y api)**:
   - En el backend del nuevo proyecto, puedes implementar los controladores con la base de datos que desees (MongoDB, PostgreSQL con Prisma, Supabase, Firebase) siguiendo las firmas de payload detalladas en `api-spec.md` y las propiedades del modelo descritas en `schema.json`.

---

## Ventajas de Usar este Blueprint en Tu Nuevo Proyecto

- **Independencia Estética**: Cero clases Tailwind o estilos CSS quemados. Eres libre de usar tu propio sistema de temas (oscuro/claro), componentes UI y layout de cuadrícula.
- **Portabilidad de Framework**: Aunque los hooks están escritos para React (compatibles con Next.js, Remix, Vite), el archivo de utilidades matemáticas `dojoMath.ts` es **Typescript puro** y puede usarse incluso en frameworks como Vue, Angular o Svelte.
- **Rendimiento Óptimo**: La inicialización y apagado de flujos WebRTC y bucles de renderizado de la cámara están completamente encapsulados en los hooks para evitar fugas de memoria o colisiones de eventos.
- **Desacoplamiento de Base de Datos**: Al definir las llamadas mediante contratos API HTTP genéricos, no dependes de esquemas de Mongoose ni NextAuth en caso de que decidas migrar a otras soluciones de backend.
