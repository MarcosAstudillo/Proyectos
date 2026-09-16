/**
 * ============================================================================
 * ARCHIVO PRINCIPAL DE JAVASCRIPT
 * Asignatura: DWEF (Desarrollo Web en Entorno Cliente) - 2DAW
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Proyecto web iniciado correctamente.');
  console.log('✅ JavaScript y Bootstrap cargados.');

  // Inicializar todos los Tooltips de Bootstrap en la página
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Inicializar todos los Popovers de Bootstrap en la página
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

  // Ejemplo de interacción dinámica con el botón de bienvenida
  const welcomeBtn = document.getElementById('welcome-btn');
  if (welcomeBtn) {
    welcomeBtn.addEventListener('click', () => {
      alert('¡Todo configurado y funcionando correctamente! Listo para programar tu proyecto en 2DAW.');
    });
  }
});
