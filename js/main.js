/**
 * ============================================================================
 * KMKCStats - Controlador Principal de la Aplicación
 * Asignatura: DWEF (Desarrollo Web en Entorno Cliente) - 2DAW
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 KMKCStats iniciado - Clan Wars 2 Analytics');

  // Estado local de la aplicación
  let currentSearchType = 'clans'; // 'clans' | 'players'

  // Elementos DOM
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-form');
  const tabClans = document.getElementById('tab-clans');
  const tabPlayers = document.getElementById('tab-players');
  const quickTags = document.querySelectorAll('.quick-tag-chip');
  const apiConfigForm = document.getElementById('api-config-form');
  const apiTokenInput = document.getElementById('api-token-input');
  const apiProxyInput = document.getElementById('api-proxy-input');
  const apiStatusBadge = document.getElementById('api-status-badge');

  // 1. Cargar estado de la API de Supercell en la interfaz
  const updateApiStatusUI = () => {
    const config = SupercellAPI.getApiConfig();
    if (apiTokenInput) apiTokenInput.value = config.token;
    if (apiProxyInput) apiProxyInput.value = config.proxyUrl;

    if (apiStatusBadge) {
      if (config.hasToken) {
        apiStatusBadge.className = 'badge bg-success text-white';
        apiStatusBadge.innerHTML = '<i class="bi bi-shield-check me-1"></i> API Token Activo';
      } else {
        apiStatusBadge.className = 'badge bg-secondary text-white';
        apiStatusBadge.innerHTML = '<i class="bi bi-database me-1"></i> Modo Mock Data';
      }
    }
  };

  updateApiStatusUI();

  // 2. Manejo de pestañas de búsqueda (Clans vs Players)
  const setSearchType = (type) => {
    currentSearchType = type;

    if (type === 'clans') {
      tabClans.classList.add('active');
      tabPlayers.classList.remove('active');
      searchInput.placeholder = 'Buscar clanes por nombre o tag (ej. #9PJ99 o #2PP)';
    } else {
      tabPlayers.classList.add('active');
      tabClans.classList.remove('active');
      searchInput.placeholder = 'Buscar jugadores por nombre o tag (ej. #98VCGY o #2PP9CL)';
    }

    searchInput.focus();
  };

  if (tabClans) tabClans.addEventListener('click', () => setSearchType('clans'));
  if (tabPlayers) tabPlayers.addEventListener('click', () => setSearchType('players'));

  // 3. Ejecución de la búsqueda
  const executeSearch = async (tag) => {
    if (!tag) return;

    UIRenderer.showLoading();

    try {
      if (currentSearchType === 'clans') {
        const result = await SupercellAPI.getClan(tag);
        if (result.success) {
          UIRenderer.renderClan(result.data);
        }
      } else {
        const result = await SupercellAPI.getPlayer(tag);
        if (result.success) {
          UIRenderer.renderPlayer(result.data);
        }
      }
    } catch (err) {
      console.error('Error durante la búsqueda:', err);
    }
  };

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        executeSearch(query);
      }
    });
  }

  // 4. Clics en sugerencias rápidas de tags (#TAG)
  quickTags.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = chip.dataset.tag;
      const type = chip.dataset.type || 'clans';
      setSearchType(type);
      searchInput.value = tag;
      executeSearch(tag);
    });
  });

  // 5. Clics en la tabla de Leaderboard
  document.addEventListener('click', (e) => {
    const inspectBtn = e.target.closest('.quick-inspect-clan');
    if (inspectBtn) {
      const tag = inspectBtn.dataset.tag;
      setSearchType('clans');
      searchInput.value = tag;
      executeSearch(tag);
    }
  });

  // 6. Guardar configuración de API de Supercell
  if (apiConfigForm) {
    apiConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const token = apiTokenInput.value.trim();
      const proxy = apiProxyInput.value.trim();

      SupercellAPI.saveApiConfig(token, proxy);
      updateApiStatusUI();

      // Cerrar modal de Bootstrap
      const modalEl = document.getElementById('apiConfigModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }

      alert('✅ Configuración de la API guardada correctamente en localStorage.');
    });
  }

  // 7. Cargar Leaderboards y Mazos Meta de inicio
  UIRenderer.renderLeaderboards(SupercellAPI.getTopClans());
  UIRenderer.renderMetaDecks(SupercellAPI.getMetaDecks());
});
