# Proyecto Web con Bootstrap 5 (2DAW - DWEF)

Plantilla y estructura de directorios estándar y profesional para desarrollo web en entorno cliente utilizando **Bootstrap 5**.

---

## 📂 Estructura de Directorios

```text
Proyectos/
├── assets/                  # Recursos estáticos del sitio
│   ├── icons/               # Iconos SVG o locales
│   └── img/                 # Imágenes del proyecto
├── js/                      # Lógica de JavaScript del cliente
│   └── main.js              # Script principal (inicialización y eventos)
├── lib/                     # Librerías externas
│   └── bootstrap-5.3.8-dist/# Distribución local de Bootstrap (CSS y JS)
├── pages/                   # Páginas secundarias del sitio (ej. contacto, nosotros)
├── styles/                  # Hojas de estilo CSS propias
│   └── style.css            # Estilos personalizados y variables CSS
├── .gitignore               # Archivos omitidos en control de versiones
├── index.html               # Página de entrada principal
└── README.md                # Documentación del proyecto
```

---

## 🚀 Cómo Empezar

1. **Abrir el proyecto:**
   - Abre la carpeta en VS Code u otro editor.
   - Usa la extensión **Live Server** (clic derecho en `index.html` > *Open with Live Server*) o abre directamente [index.html](file:///c:/Users/astum/OneDrive/Desktop/2DAW/DWEF/Proyectos/index.html) en tu navegador.

2. **Librería Bootstrap 5:**
   - Ya está vinculada de manera local desde `lib/bootstrap-5.3.8-dist/`:
     - CSS: `lib/bootstrap-5.3.8-dist/css/bootstrap.min.css`
     - JS: `lib/bootstrap-5.3.8-dist/js/bootstrap.bundle.min.js` (incluye Popper.js)

3. **Personalización:**
   - Edita `styles/style.css` para sobreescribir o añadir reglas CSS personalizadas.
   - Añade tu código JavaScript interactivo en `js/main.js`.
   - Guarda imágenes en `assets/img/`.
