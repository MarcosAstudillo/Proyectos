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
        apiStatusBadge.innerHTML = '<i class="bi bi-shield-check me-1"></i> API Oficial Conectada';
      } else {
        apiStatusBadge.className = 'badge bg-warning text-dark';
        apiStatusBadge.innerHTML = '<i class="bi bi-exclamation-triangle me-1"></i> Falta Token API';
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
      searchInput.placeholder = 'Buscar clan por Tag oficial (ej. #L9VRJ o #QLRYPY89)';
    } else {
      tabPlayers.classList.add('active');
      tabClans.classList.remove('active');
      searchInput.placeholder = 'Buscar jugador por Tag oficial (ej. #Y0VVRUVPC o #R8CQJ0YV8)';
    }

    searchInput.focus();
  };

  if (tabClans) tabClans.addEventListener('click', () => setSearchType('clans'));
  if (tabPlayers) tabPlayers.addEventListener('click', () => setSearchType('players'));

  // 3. Ejecución de la búsqueda (100% API Oficial en vivo)
  const executeSearch = async (tag) => {
    if (!tag) return;

    UIRenderer.showLoading();

    try {
      if (currentSearchType === 'clans') {
        const result = await SupercellAPI.getClan(tag);
        if (result.success && result.data) {
          UIRenderer.renderClan(result.data);
        } else {
          UIRenderer.showError(result.error || 'No se encontró el clan en la API oficial de Supercell.');
        }
      } else {
        const result = await SupercellAPI.getPlayer(tag);
        if (result.success && result.data) {
          UIRenderer.renderPlayer(result.data);
        } else {
          UIRenderer.showError(result.error || 'No se encontró el jugador en la API oficial de Supercell.');
        }
      }
    } catch (err) {
      console.error('Error durante la búsqueda:', err);
      UIRenderer.showError('Error de conexión al consultar la API de Supercell: ' + err.message);
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

  // 4. Clics en sugerencias rápidas de tags oficiales (#TAG)
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

      // Recargar Leaderboards con la nueva configuración
      SupercellAPI.getTopClans().then(clans => {
        UIRenderer.renderLeaderboards(clans);
      });

      alert('✅ Configuración de la API guardada correctamente.');
    });
  }

  // 7. Cargar Leaderboards y Mazos Meta de inicio
  SupercellAPI.getTopClans().then(clans => {
    UIRenderer.renderLeaderboards(clans);
  });
  UIRenderer.renderMetaDecks(SupercellAPI.getMetaDecks());
});
