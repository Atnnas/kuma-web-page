# 🥋 Agent Skills Directory — Kuma Dojo CR

Este directorio alberga las **Skills de IA** procedimentales integradas desde el ecosistema abierto [skills.sh](https://www.skills.sh/) para dotar a agentes de desarrollo (Antigravity, Cursor, Claude Code, Copilot) de estándares arquitectónicos, guías de diseño y buenas prácticas especializadas.

---

## 📁 Estructura del Directorio

```text
.agents/
├── README.md               # Documentación y catálogo de habilidades del proyecto
└── skills/                 # Directorio de habilidades procedimentales (SKILL.md)
    ├── copywriting/        # Copywriting persuasivo para programas y productos
    ├── diagnosing-bugs/    # Diagnóstico sistemático de errores y regresiones
    ├── domain-modeling/    # Modelado de dominio y terminología marcial
    ├── emil-design-eng/    # Filosofía de ingeniería y pulido UI (Emil Kowalski)
    ├── find-skills/        # Buscador dinámico de habilidades en skills.sh
    ├── frontend-design/    # Directrices de diseño visual distintivo y de alta gama
    ├── improve-codebase-architecture/ # Auditoría de modularidad y arquitectura limpia
    ├── mobile-native/      # Ergonomía táctil nativa y optimizaciones móviles
    ├── review-animations/  # Revisión de físicas y curvas en Framer Motion
    ├── schema/             # Marcado JSON-LD Schema.org para SEO local
    ├── seo-audit/          # Auditoría técnica de posicionamiento y Core Web Vitals
    ├── tdd/                # Test-Driven Development para lógica de gamificación
    ├── vercel-composition-patterns/ # Patrones de composición React 19 / Next.js
    ├── vercel-react-best-practices/ # Rendimiento óptimo en Server & Client Components
    └── web-design-guidelines/       # Accesibilidad WCAG y guías de interfaz web
```

---

## 🗂️ Catálogo de Habilidades Instaladas

### 1. Rendimiento y Arquitectura Web (Next.js 16 / React 19)
* **`vercel-react-best-practices`** *(Vercel Labs)*: Elimina cascadas (`waterfalls`), optimiza bundles, streaming SSR y previene re-renders innecesarios.
* **`vercel-composition-patterns`** *(Vercel Labs)*: Patrones escalables para componentes compuestos, Server Actions y límites de Suspense.
* **`improve-codebase-architecture`** *(Matt Pocock)*: Análisis y diseño de módulos profundos (*deep modules*) con interfaces limpias.

### 2. Diseño Visual, Animación y Experiencia de Usuario
* **`frontend-design`** *(Anthropic)*: Estándares para interfaces con identidad única, tipografía cuidada y estética que evita componentes genéricos.
* **`review-animations`** *(Emil Kowalski)*: Craft bar para animaciones con Framer Motion (resortes/springs, interrupciones y rendimiento a 60fps).
* **`emil-design-eng`** *(Emil Kowalski)*: Micro-interacciones sutiles, densidad visual y detalles invisibles de diseño de producto.
* **`mobile-native`** *(Emil Kowalski)*: Experiencia móvil tipo app nativa (evitar flash al tocar, safe areas / notch, gestos y estados hover pegajosos).
* **`web-design-guidelines`** *(Vercel Labs)*: Cumplimiento de accesibilidad web (WCAG AA), contrastes y estándares UI de Vercel.

### 3. Calidad y Metodología de Desarrollo
* **`tdd`** *(Matt Pocock)*: Desarrollo guiado por pruebas (Red-Green-Refactor) para el motor de XP, rachas y lecciones didácticas.
* **`diagnosing-bugs`** *(Matt Pocock)*: Ciclo riguroso para depurar fallos complejos de hidratación o estados interactivos.
* **`domain-modeling`** *(Matt Pocock)*: Mapeo de términos de dominio (Kyu, Dan, Bunkai, Kata, Kumite, WKF) y reglas del dojo.

### 4. SEO, Crecimiento y Marketing Local (Costa Rica)
* **`seo-audit`** *(Corey Haines)*: Diagnóstico de indexabilidad, metaetiquetas, velocidad y Core Web Vitals.
* **`schema`** *(Corey Haines)*: Marcado enriquecido Schema.org (`SportsClub`, `LocalBusiness`, `FAQPage`) para visibilidad en Google Search.
* **`copywriting`** *(Corey Haines)*: Textos educativos y persuasivos para programas de Karate, campamentos y membresías.

### 5. Meta-Habilidades
* **`find-skills`** *(Vercel Labs)*: Búsqueda e incorporación ágil de nuevas skills directamente desde el registro.

---

## 🚀 Comandos de Gestión

```bash
# Listar habilidades instaladas
npm run skills:list

# Actualizar habilidades a sus versiones más recientes
npm run skills:update

# Instalar una nueva habilidad de skills.sh
npx skills add <owner/repo/skill-name> -a antigravity --copy -y
```

El archivo `skills-lock.json` en la raíz del repositorio asegura la reproducibilidad y rastreo de versiones de cada habilidad instalada.
