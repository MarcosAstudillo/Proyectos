/**
 * ============================================================================
 * KMKCStats - Modulo de Interfaz de Usuario (UI Renderer)
 * Maneja la inyección de componentes dinámicos en el DOM
 * ============================================================================
 */

const UIRenderer = (() => {
  const resultsContainer = document.getElementById('results-section');
  const resultsContent = document.getElementById('results-content');

  /**
   * Muestra estado de carga en el contenedor de resultados
   */
  const showLoading = () => {
    if (!resultsContainer || !resultsContent) return;
    resultsContainer.classList.remove('d-none');
    resultsContent.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-danger mb-3" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Consultando Supercell API...</span>
        </div>
        <h5 class="fw-bold">Consultando API oficial de Supercell...</h5>
        <p class="text-muted">Obteniendo datos en tiempo real de Clash Royale</p>
      </div>
    `;
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Muestra mensaje de error cuando falla la consulta oficial
   */
  const showError = (message) => {
    if (!resultsContainer || !resultsContent) return;
    resultsContainer.classList.remove('d-none');
    resultsContent.innerHTML = `
      <div class="kmkc-card p-5 text-center my-3">
        <div class="fs-1 text-danger mb-3">
          <i class="bi bi-exclamation-octagon-fill"></i>
        </div>
        <h4 class="fw-bold text-white mb-2">Consulta no completada</h4>
        <p class="text-secondary mx-auto mb-4" style="max-width: 540px; font-size: 0.95rem;">
          ${message}
        </p>
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-outline-secondary px-3" onclick="document.getElementById('results-section').classList.add('d-none')">
            Cerrar
          </button>
          <button class="btn btn-upgrade px-3" data-bs-toggle="modal" data-bs-target="#apiConfigModal">
            <i class="bi bi-gear-fill me-1"></i> Configurar API / Proxy
          </button>
        </div>
      </div>
    `;
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Renderiza los detalles completos de un Clan
   */
  const renderClan = (clan) => {
    if (!resultsContainer || !resultsContent) return;
    resultsContainer.classList.remove('d-none');

    const warRace = clan.warRace || {};
    const percentFame = Math.min(100, Math.round((warRace.fame / (warRace.fameTarget || 50000)) * 100));

    // Generar lista de oponentes en la carrera
    const opponentsHtml = (warRace.opponents || []).map((opp, idx) => `
      <div class="d-flex align-items-center justify-content-between p-2 rounded mb-2 ${opp.tag === clan.tag ? 'bg-primary bg-opacity-10 border border-primary border-opacity-25' : 'bg-dark bg-opacity-50'}">
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-secondary rounded-pill">#${idx + 1}</span>
          <span class="fs-5">${opp.badge || '🛡️'}</span>
          <div>
            <div class="fw-bold text-white text-truncate" style="max-width: 180px;">${opp.name}</div>
            <small class="text-muted font-monospace">${opp.tag}</small>
          </div>
        </div>
        <div class="text-end">
          <div class="fw-bold text-warning">${opp.fame.toLocaleString()} 🎖️</div>
          <small class="text-muted">Medallas</small>
        </div>
      </div>
    `).join('');

    // Generar lista de mejores contribuidores
    const contributorsHtml = (warRace.topWarContributors || []).map(member => `
      <tr>
        <td class="fw-bold text-white">${member.name}</td>
        <td><span class="badge bg-dark border border-secondary text-secondary">${member.role}</span></td>
        <td class="text-warning fw-bold">${member.fame} 🎖️</td>
        <td>${member.boatAttacks} ⚔️</td>
        <td>${member.decksUsed}/16</td>
        <td><span class="text-success fw-bold">${member.winrate}</span></td>
      </tr>
    `).join('');

    resultsContent.innerHTML = `
      <div class="kmkc-card p-4 mb-4">
        <!-- Cabecera del Clan -->
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom border-secondary border-opacity-25 pb-4 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="fs-1 p-3 rounded-circle bg-dark border border-secondary border-opacity-25 shadow">
              🛡️
            </div>
            <div>
              <div class="d-flex align-items-center gap-2">
                <h2 class="fw-bold mb-0 text-white">${clan.name}</h2>
                <span class="badge bg-dark border border-secondary text-info font-monospace">${clan.tag}</span>
                <span class="badge bg-success bg-opacity-75 text-white"><i class="bi bi-broadcast me-1"></i> API Oficial</span>
              </div>
              <p class="text-muted mb-0 mt-1" style="max-width: 580px;">${clan.description || 'Sin descripción'}</p>
            </div>
          </div>
          <div class="text-end">
            <span class="badge bg-danger px-3 py-2 fs-6 rounded-pill">
              🏆 ${clan.clanWarTrophies.toLocaleString()} Copas de Guerra
            </span>
          </div>
        </div>

        <!-- Estadísticas Rápidas -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-white">${clan.membersCount}/50</div>
              <div class="stat-label">Miembros</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-warning">${clan.clanScore.toLocaleString()}</div>
              <div class="stat-label">Puntuación Clan</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-success">${clan.donationsPerWeek.toLocaleString()}</div>
              <div class="stat-label">Donaciones/Semana</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-info">${clan.location ? clan.location.name : 'Global'}</div>
              <div class="stat-label">Región</div>
            </div>
          </div>
        </div>

        <!-- Sección Clan Wars 2 (River Race) -->
        <div class="row g-4">
          <div class="col-lg-6">
            <div class="p-3 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold text-white mb-0">⛵ Carrera de Río (Clan Wars 2)</h5>
                <span class="badge bg-warning text-dark fw-bold">Puesto #${warRace.colosseumRank || 1}</span>
              </div>
              
              <!-- Barra de Medallas -->
              <div class="mb-3">
                <div class="d-flex justify-content-between text-muted small mb-1">
                  <span>Progreso de Medallas</span>
                  <span class="text-white fw-bold">${(warRace.fame || 0).toLocaleString()} / ${(warRace.fameTarget || 50000).toLocaleString()} (${percentFame}%)</span>
                </div>
                <div class="race-progress-bar">
                  <div class="race-progress-fill" style="width: ${percentFame}%"></div>
                </div>
              </div>

              <h6 class="text-secondary small fw-bold text-uppercase mb-2">Clanes en competición esta semana:</h6>
              ${opponentsHtml}
            </div>
          </div>

          <div class="col-lg-6">
            <div class="p-3 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 h-100">
              <h5 class="fw-bold text-white mb-3">⭐ Top Contribuidores de Guerra</h5>
              <div class="table-responsive">
                <table class="table kmkc-table mb-0">
                  <thead>
                    <tr>
                      <th>Jugador</th>
                      <th>Rango</th>
                      <th>Medallas</th>
                      <th>Ataques Barco</th>
                      <th>Mazos</th>
                      <th>Winrate</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${contributorsHtml}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Renderiza los detalles de un Jugador
   */
  const renderPlayer = (player) => {
    if (!resultsContainer || !resultsContent) return;
    resultsContainer.classList.remove('d-none');

    // Mazos de guerra del jugador
    const decksHtml = (player.warDecks || []).map(deck => `
      <div class="col-md-6 mb-3">
        <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-white mb-0">${deck.name}</h6>
            <div class="d-flex gap-2">
              <span class="badge bg-secondary">Elixir: ${deck.avgElixir}</span>
              <span class="badge bg-success">WR: ${deck.winrate}</span>
            </div>
          </div>
          <div class="deck-card-grid">
            ${deck.cards.map(card => `
              <div class="cr-card-item">
                <span class="cr-card-elixir">${card.elixir}</span>
                ${card.imageUrl ? `<img src="${card.imageUrl}" alt="${card.name}" style="height: 48px; width: auto; max-width: 100%; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">` : `<span class="fs-4">${card.icon || '🃏'}</span>`}
                <div class="cr-card-name">${card.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');

    resultsContent.innerHTML = `
      <div class="kmkc-card p-4 mb-4">
        <!-- Cabecera del Jugador -->
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom border-secondary border-opacity-25 pb-4 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="fs-1 p-3 rounded-circle bg-dark border border-secondary border-opacity-25 shadow">
              👑
            </div>
            <div>
              <div class="d-flex align-items-center gap-2">
                <h2 class="fw-bold mb-0 text-white">${player.name}</h2>
                <span class="badge bg-dark border border-secondary text-info font-monospace">${player.tag}</span>
                <span class="badge bg-success bg-opacity-75 text-white"><i class="bi bi-broadcast me-1"></i> API Oficial</span>
              </div>
              <p class="text-muted mb-0 mt-1">
                Clan: <strong class="text-white">${player.clan ? player.clan.name : 'Sin clan'}</strong> (${player.role || 'Miembro'})
              </p>
            </div>
          </div>
          <div class="text-end">
            <span class="badge bg-warning text-dark px-3 py-2 fs-6 rounded-pill fw-bold">
              🏆 ${player.trophies.toLocaleString()} Copas (Máx: ${player.bestTrophies})
            </span>
          </div>
        </div>

        <!-- Estadísticas de Guerra del Jugador -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-white">Nvl ${player.kingTowerLevel || 15}</div>
              <div class="stat-label">Torre del Rey</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-success">${player.warWinrate || '85%'}</div>
              <div class="stat-label">Winrate en Guerra</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-warning">${player.warDayWins.toLocaleString()}</div>
              <div class="stat-label">Victorias en Guerra</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-info">${player.favoriteCard || 'PEKKA'}</div>
              <div class="stat-label">Carta Favorita</div>
            </div>
          </div>
        </div>

        <!-- Mazos de Clan Wars 2 -->
        <div class="mt-4">
          <h5 class="fw-bold text-white mb-3">⚔️ Mazos de Clan Wars 2 Registrados</h5>
          <div class="row">
            ${decksHtml}
          </div>
        </div>
      </div>
    `;

    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Renderiza el ranking de mejores clanes en la sección Leaderboards
   */
  const renderLeaderboards = (clans) => {
    const tableBody = document.getElementById('leaderboard-tbody');
    if (!tableBody) return;

    if (!clans || clans.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-hdd-network text-warning fs-4 d-block mb-1"></i>
            Inicia el proxy local (<code>python proxy.py</code>) para cargar el Ranking Mundial oficial en tiempo real.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = clans.map(clan => `
      <tr>
        <td class="fw-bold">
          <span class="badge ${clan.rank === 1 ? 'bg-warning text-dark' : clan.rank === 2 ? 'bg-light text-dark' : clan.rank === 3 ? 'bg-danger text-white' : 'bg-dark text-secondary'} rounded-pill me-2">
            #${clan.rank}
          </span>
        </td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <span class="fs-5">${clan.badge || '🛡️'}</span>
            <div>
              <strong class="text-white">${clan.name}</strong>
              <small class="d-block text-muted font-monospace">${clan.tag}</small>
            </div>
          </div>
        </td>
        <td class="text-warning fw-bold">${clan.trophies.toLocaleString()} 🏆</td>
        <td>${clan.score.toLocaleString()}</td>
        <td><span class="badge bg-dark border border-secondary">${clan.region}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-light quick-inspect-clan" data-tag="${clan.tag}">
            Ver Estadísticas
          </button>
        </td>
      </tr>
    `).join('');
  };

  /**
   * Renderiza los mazos meta de guerra
   */
  const renderMetaDecks = (decks) => {
    const container = document.getElementById('meta-decks-container');
    if (!container) return;

    container.innerHTML = decks.map(deck => `
      <div class="col-md-4">
        <div class="kmkc-card p-3 h-100">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="fw-bold text-white mb-0">${deck.name}</h6>
              <small class="text-muted">${deck.archetype}</small>
            </div>
            <span class="badge bg-success">${deck.winrate} WR</span>
          </div>

          <div class="p-2 rounded bg-dark bg-opacity-50 mb-3 small d-flex justify-content-between text-muted">
            <span>Coste medio: <strong>${deck.avgElixir}</strong></span>
            <span>Uso en guerra: <strong>${deck.usageRate}</strong></span>
          </div>

          <div class="d-flex flex-wrap gap-1">
            ${deck.cards.map(c => `
              <span class="badge bg-dark border border-secondary text-white py-1 px-2">${c}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  };

  return {
    showLoading,
    showError,
    renderClan,
    renderPlayer,
    renderLeaderboards,
    renderMetaDecks
  };
})();
