# KMKCStats · Portal de Estadísticas de Clan (2DAW - DWEF)

> Portal web de monitorización y análisis para el clan **KMKC** de *Clash Royale*, construido con **Bootstrap 5** y JavaScript Vanilla. Diseñado con una identidad visual premium en modo oscuro, inspirada en CWStats.

---

## 🎯 Descripción del Proyecto

**KMKCStats** es una herramienta web para el seguimiento competitivo del clan KMKC en Clash Royale. La plataforma integra (o integrará vía API de Supercell) datos en tiempo real sobre guerras de clanes, jugadores y mazos.

### Funcionalidades Planificadas

| Módulo | Descripción |
|---|---|
| 🏠 **Inicio** | Portal principal con buscador de jugadores y clanes por Tag |
| ⚔️ **Análisis de Guerra** | Seguimiento de la River Race (Ju–Do): media de puntuaje, mazos jugados/pendientes y clanes rivales |
| 🕵️ **Espionaje** | Trayectoria de guerra de un jugador, hábitos de cartas y horario de juego (UTC +1 Madrid) |
| 🃏 **Creador de Sets** | Generador de 4 mazos de guerra competitivos adaptados al nivel de cartas de la cuenta |
| 🔐 **Autenticación** | Registro e inicio de sesión con email, Discord, Google, GitHub, Twitch y Supercell ID |

---

## 📂 Estructura de Directorios

```text
Proyectos/
├── assets/
│   ├── icons/                   # Iconos SVG o locales
│   └── img/
│       └── KMKCheader.png       # Logo oficial de la cabecera
│
├── js/
│   └── main.js                  # Script principal (inicialización Bootstrap y eventos)
│
├── lib/
│   └── bootstrap-5.3.8-dist/    # Distribución local de Bootstrap 5
│       ├── css/
│       │   └── bootstrap.min.css
│       └── js/
│           └── bootstrap.bundle.min.js   # Incluye Popper.js
│
├── pages/                       # Subpáginas de la plataforma
│   ├── analisis-guerra.html     # Módulo de seguimiento de la River Race
│   ├── auth.html                # Registro e inicio de sesión
│   ├── cover.html               # (Prototipo) Cover Bootstrap de referencia
│   ├── creador-sets.html        # Generador de sets de guerra competitivos
│   └── espionaje.html           # Espionaje de jugadores (horario + hábitos)
│
├── styles/
│   ├── cover.css                # Estilos del template Cover de Bootstrap
│   └── kmkcstats.css            # Hoja de estilos principal de KMKCStats
│
├── .gitignore                   # Archivos excluidos del control de versiones
├── index.html                   # Página de entrada principal (Home)
└── README.md                    # Este archivo
```

---

## 🧰 Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **HTML5** | — | Estructura semántica de las páginas |
| **CSS3 / Vanilla CSS** | — | Variables CSS, glassmorphism, animaciones |
| **JavaScript ES6+** | — | Lógica de cliente, manipulación del DOM |
| **Bootstrap** | 5.3.8 (local) | Sistema de grid, componentes y utilidades |
| **Bootstrap Icons** | 1.11.3 (CDN) | Iconografía vectorial |
| **Google Fonts** | Plus Jakarta Sans · Inter | Tipografía premium |
| **Supercell API** *(pendiente)* | v1 | Datos de jugadores, clanes y cartas en tiempo real |

---

## 🚀 Cómo Empezar

1. **Abrir el proyecto en VS Code:**
   ```
   code .
   ```

2. **Lanzar con Live Server:**
   - Haz clic derecho en `index.html` → *Open with Live Server*
   - O pulsa `Alt+L, Alt+O` con la extensión instalada.

3. **Bootstrap vinculado localmente:**
   - CSS → `lib/bootstrap-5.3.8-dist/css/bootstrap.min.css`
   - JS → `lib/bootstrap-5.3.8-dist/js/bootstrap.bundle.min.js`

4. **Personalización de estilos:**
   - Edita `styles/kmkcstats.css` — contiene todo el sistema de diseño de KMKCStats.
   - Variables globales en `:root` (colores, gradientes, sombras).

---

## 🔐 Autenticación (`pages/auth.html`)

La página de acceso ofrece inicio de sesión con múltiples proveedores:

- **Discord** *(recomendado)* — acceso a la comunidad del clan
- **Google** — cuenta de Google OAuth
- **GitHub** — para perfiles técnicos
- **Twitch** — streamer integrado
- **Supercell ID** *(vinculación automática del Tag de CR)*
- **Email + contraseña** — registro tradicional con Tag de Clash Royale

---

## ⚡ Conexión con la API Oficial de Supercell (Clash Royale)

El proyecto cuenta con integración en vivo con la API oficial de Clash Royale (`https://api.clashroyale.com/v1`).

### ¿Por qué se necesita el proxy local?
1. **Restricción de IP**: Supercell vincula el API Key a tu dirección IP pública (`83.56.26.27`).
2. **Restricción CORS**: Los navegadores web bloquean llamadas directas a `api.clashroyale.com` por motivos de seguridad.

### Cómo activar los datos en vivo:
1. Abre una terminal en la carpeta del proyecto y ejecuta el proxy local (usa Python estándar, sin librerías externas):
   ```bash
   python proxy.py
   ```
2. Abre `index.html` en tu navegador con Live Server.
3. ¡Listo! Al buscar cualquier clan o jugador (ej: clanes como `#QLRYPY89` o jugadores como `#R8CQJ0YV8`), KMKCStats obtendrá las estadísticas, cartas y datos de Clan Wars 2 en tiempo real desde Supercell.
4. Las búsquedas consultan exclusivamente la API oficial de Supercell en vivo a través del proxy local. Si un clan o jugador no existe o el proxy no está encendido, la aplicación informa del error con el detalle correspondiente.

---

## 🎨 Sistema de Diseño

El diseño sigue una paleta oscura premium definida en `styles/kmkcstats.css`:

| Variable | Valor | Uso |
|---|---|---|
| `--kmkc-bg-dark` | `#08090d` | Fondo principal |
| `--kmkc-bg-card` | `#11141d` | Fondo de tarjetas |
| `--kmkc-accent-pink` | `#ff3366` | Color de acción principal |
| `--kmkc-accent-orange` | `#ff7a00` | Color secundario del gradiente |
| `--kmkc-primary-gradient` | `orange → pink` | Gradiente de marca |
| `--kmkc-discord` | `#5865f2` | Color Discord |

---

## 👨‍💻 Autor

**Marcos Astudillo Bermúdez**  
DWEF — Desarrollo Web en Entorno Cliente · 2º DAW

---

*Este proyecto es académico y no tiene afiliación oficial con Supercell ni con Clash Royale.*
