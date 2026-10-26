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
   * Renderiza los detalles completos de un Jugador
   */
  const renderPlayer = (player) => {
    if (!resultsContainer || !resultsContent) return;
    resultsContainer.classList.remove('d-none');

    // 1. Los 2 mazos más utilizados por el jugador (con Posición 1: Evo 1, Posición 2: Campeón/Héroe, Posición 3: Campeón/Héroe/Evo 2...)
    const decksToRender = (player.topTwoDecks && player.topTwoDecks.length > 0) ? player.topTwoDecks : (player.warDecks || []);

    const decksHtml = decksToRender.map((deck, dIdx) => `
      <div class="col-12 mb-4">
        <div class="p-3 p-md-4 rounded-4 bg-dark bg-opacity-75 border border-secondary border-opacity-25 shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 border-bottom border-secondary border-opacity-25 pb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="badge ${dIdx === 0 ? 'bg-danger' : 'bg-primary'} fw-bold px-3 py-1">
                ${dIdx === 0 ? '🔥 Mazo #1 Más Usado' : '⚡ Mazo #2 Más Usado'}
              </span>
              <h5 class="fw-bold text-white mb-0">${deck.name}</h5>
            </div>
            <div class="d-flex gap-2">
              <span class="badge bg-dark border border-secondary text-info">Coste Medio: ${deck.avgElixir || '3.5'} 💧</span>
              <span class="badge bg-success bg-opacity-75 text-white">WR: ${deck.winrate || '60%'}</span>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center text-muted small mb-3 px-1">
            <span>
              <i class="bi bi-diagram-3-fill text-warning me-1"></i>
              <strong>Distribución por slots:</strong> Posición 1 = Primera Evo · Posición 2 = Campeón / Héroe · Posición 3 = Segunda Evo / Campeón / Héroe · Posiciones 4 a 8 = Resto del mazo
            </span>
          </div>

          <!-- Cuadrícula de 8 cartas con slots ordenados -->
          <div class="row g-2 g-md-3">
            ${(deck.cards || []).map((card, idx) => {
              const posNum = idx + 1;
              const isSlotEvo = card.slotRole === 'evo';
              const isSlotChamp = card.slotRole === 'champion';
              const isSlotHero = card.slotRole === 'hero';

              let slotClass = 'cr-deck-slot-item';
              if (isSlotEvo) slotClass += ' slot-evo';
              else if (isSlotChamp) slotClass += ' slot-champion';
              else if (isSlotHero) slotClass += ' slot-hero';

              let badgeHtml = '';
              if (card.slotBadge) {
                badgeHtml = `<span class="slot-pos-badge ${card.badgeClass || ''}">${card.slotBadge}</span>`;
              }

              return `
                <div class="col-6 col-sm-4 col-md-3">
                  <div class="${slotClass}">
                    <span class="slot-order-number">${posNum}</span>
                    ${badgeHtml}
                    <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; width: 100%; padding: 0.5rem 0;">
                      <img src="${card.imageUrl || card.iconUrls?.medium}" alt="${card.name}" style="height: 110px; max-height: 125px; width: auto; max-width: 95%; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.65));">
                    </div>
                    <div class="d-flex justify-content-between align-items-center w-100 px-1 mt-1">
                      <span class="badge text-white" style="font-size: 0.65rem; background-color: #a824db;">💧 ${card.elixir || 3}</span>
                      <strong class="text-white text-truncate" style="font-size: 0.72rem; max-width: 75px;" title="${card.name}">${card.name}</strong>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `).join('');

    // 2. Insignias de CRL (Clash Royale League)
    const crlBadgesHtml = (player.crlBadges && player.crlBadges.length > 0) ? player.crlBadges.map(b => {
      const is20Wins = b.name.includes('20Wins');
      const year = b.name.replace(/[^0-9]/g, '') || '';
      const title = is20Wins ? `Desafío 20 Victorias CRL ${year}` : (b.name.includes('Spectator') ? `Espectador CRL ${year}` : b.name);
      const iconSrc = b.iconUrls?.large || b.iconUrls?.medium || '';
      return `
        <div class="col-sm-6 col-lg-4 mb-2">
          <div class="achievement-tile h-100">
            <div class="achievement-tile-icon" style="background: rgba(0, 163, 255, 0.1); border-color: rgba(0, 163, 255, 0.3);">
              ${iconSrc ? `<img src="${iconSrc}" alt="${b.name}" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerText='🔱';">` : '🔱'}
            </div>
            <div>
              <strong class="text-white d-block small">${title}</strong>
              <small class="text-info">${is20Wins ? `⭐ ${b.progress} / 20 Victorias` : `Insignia Oficial Obtenida`}</small>
            </div>
          </div>
        </div>
      `;
    }).join('') : `
      <div class="col-12">
        <p class="text-muted small mb-0">Sin insignias de CRL registradas en esta cuenta.</p>
      </div>
    `;

    // 3. Torneo Real (Royal Tournament)
    const royalBadgesHtml = (player.royalTournamentBadges && player.royalTournamentBadges.length > 0) ? player.royalTournamentBadges.map(b => {
      const iconSrc = b.iconUrls?.large || b.iconUrls?.medium || '';
      const isRank = b.name.includes('Rank');
      return `
        <div class="col-sm-6 mb-2">
          <div class="achievement-tile h-100">
            <div class="achievement-tile-icon" style="background: rgba(255, 193, 7, 0.1); border-color: rgba(255, 193, 7, 0.3);">
              ${iconSrc ? `<img src="${iconSrc}" alt="${b.name}" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerText='${isRank ? '🥇' : '🏰'}';">` : (isRank ? '🥇' : '🏰')}
            </div>
            <div>
              <strong class="text-white d-block small">${isRank ? 'Torneo Real - Clasificación Élite' : 'Torneo Real - Completado'}</strong>
              <small class="text-warning">Nivel ${b.level || 1} · Progreso: ${b.progress || 1}</small>
            </div>
          </div>
        </div>
      `;
    }).join('') : `
      <div class="col-12">
        <p class="text-muted small mb-0">Participación en Torneos Reales: ${(player.tournamentCardsWon || 0).toLocaleString()} cartas ganadas.</p>
      </div>
    `;

    // 4. Otras clasificaciones competitivas (Grand Challenge, Classic, Ladder, Antigüedad)
    const otherClassifications = [];
    if (player.grand12Badge) {
      otherClassifications.push({
        title: 'Gran Desafío (12 Victorias)',
        desc: `${player.grand12Badge.progress} veces completado con 12 victorias`,
        icon: player.grand12Badge.iconUrls?.large || null,
        emoji: '🏆',
        color: '#ff007a'
      });
    }
    if (player.classic12Badge) {
      otherClassifications.push({
        title: 'Desafío Clásico (12 Victorias)',
        desc: `${player.classic12Badge.progress} veces completado`,
        icon: player.classic12Badge.iconUrls?.large || null,
        emoji: '⚔️',
        color: '#00d2ff'
      });
    }
    if (player.ladderTopBadge) {
      otherClassifications.push({
        title: 'Top 1000 en Escalera (Ladder)',
        desc: `Alcanzado Top 1000 Mundial (#${player.ladderTopBadge.progress})`,
        icon: player.ladderTopBadge.iconUrls?.large || null,
        emoji: '🌍',
        color: '#ffd700'
      });
    }
    if (player.yearsPlayedBadge) {
      const years = Math.floor((player.yearsPlayedBadge.progress || 365) / 365);
      otherClassifications.push({
        title: 'Antigüedad de la Cuenta',
        desc: `${years} Años jugando Clash Royale`,
        icon: player.yearsPlayedBadge.iconUrls?.large || null,
        emoji: '⏳',
        color: '#22c55e'
      });
    }
    if (player.battleWinsBadge) {
      otherClassifications.push({
        title: 'Victorias en Batalla',
        desc: `${player.battleWinsBadge.progress.toLocaleString()} victorias oficiales`,
        icon: player.battleWinsBadge.iconUrls?.large || null,
        emoji: '👑',
        color: '#a855f7'
      });
    }

    const otherClassHtml = otherClassifications.map(item => `
      <div class="col-sm-6 col-lg-4 mb-2">
        <div class="achievement-tile h-100">
          <div class="achievement-tile-icon" style="background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.15);">
            ${item.icon ? `<img src="${item.icon}" alt="${item.title}" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerText='${item.emoji}';">` : item.emoji}
          </div>
          <div>
            <strong class="text-white d-block small">${item.title}</strong>
            <small class="text-secondary">${item.desc}</small>
          </div>
        </div>
      </div>
    `).join('');

    // 5. Estadísticas de Colección de Cartas
    const collStats = player.collectionStats || {
      total: (player.allCards || []).length,
      owned: (player.allCards || []).filter(c => c.isOwned).length,
      unowned: (player.allCards || []).filter(c => !c.isOwned).length,
      maxed: (player.allCards || []).filter(c => c.isMaxed).length,
      evoAvailable: (player.allCards || []).filter(c => c.hasEvoAvailable).length,
      evoUnlocked: (player.allCards || []).filter(c => c.isEvoUnlocked).length,
      heroes: (player.allCards || []).filter(c => c.isHero).length
    };
    const collPct = collStats.total > 0 ? Math.round((collStats.owned / collStats.total) * 100) : 0;

    // Guardar referencia en memoria para filtros instantáneos
    window._currentPlayerCards = player.allCards || [];

    // Inyectar HTML maestro
    resultsContent.innerHTML = `
      <div class="kmkc-card p-4 mb-4">

        <!-- =====================================================================
             1. CABECERA DEL JUGADOR & LIGA
             ===================================================================== -->
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom border-secondary border-opacity-25 pb-4 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="fs-1 p-3 rounded-circle bg-dark border ${player.isLeague7 ? 'border-danger shadow-lg' : 'border-secondary border-opacity-25 shadow'} text-center" style="width: 72px; height: 72px; display: flex; align-items: center; justify-content: center;">
              ${player.isLeague7 ? '👑' : '🛡️'}
            </div>
            <div>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <h2 class="fw-bold mb-0 text-white">${player.name}</h2>
                <span class="badge bg-dark border border-secondary text-info font-monospace">${player.tag}</span>
                <span class="badge bg-success bg-opacity-75 text-white"><i class="bi bi-broadcast me-1"></i> API Oficial</span>
              </div>
              <p class="text-muted mb-0 mt-1">
                Clan: <strong class="text-white">${player.clan ? player.clan.name : 'Sin clan'}</strong> (${player.role || 'Miembro'})
              </p>
              <!-- Liga Actual -->
              <div class="mt-2">
                <span class="badge-league-hero ${player.isLeague7 ? 'league-7' : 'league-other'}">
                  <i class="bi ${player.isLeague7 ? 'bi-gem text-warning' : 'bi-shield-shaded text-info'}"></i>
                  ${player.currentLeagueName}
                </span>
                ${!player.isLeague7 && player.currentMedals > 0 ? `
                  <span class="badge bg-dark border border-secondary text-warning ms-1">
                    🏅 ${player.currentMedals.toLocaleString()} Medallas
                  </span>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="text-end">
            <span class="badge bg-warning text-dark px-3 py-2 fs-6 rounded-pill fw-bold">
              🏆 ${player.trophies.toLocaleString()} Copas (Máx: ${player.bestTrophies.toLocaleString()})
            </span>
          </div>
        </div>

        <!-- =====================================================================
             2. SPOTLIGHT LIGA 7 Y MEDALLAS EN VIVO (Requisito Específico)
             ===================================================================== -->
        ${player.isLeague7 ? `
          <div class="medals-hero-spotlight p-3 p-md-4 rounded-4 mb-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div class="d-flex align-items-center gap-3">
                <div class="medals-icon-glow">🏅</div>
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <span class="badge bg-danger bg-opacity-80 text-white fw-bold px-2 py-1">
                      <i class="bi bi-trophy-fill me-1"></i> Jugador en Liga 7
                    </span>
                    <span class="badge bg-dark border border-purple text-white">Camino de Leyendas Oficial</span>
                  </div>
                  <h3 class="fw-bold text-white mb-0" style="font-size: 2.3rem; letter-spacing: -0.5px;">
                    <span style="background: linear-gradient(135deg, #c77dff, #ff007a); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                      ${player.currentMedals.toLocaleString()}
                    </span>
                    <span class="fs-4 text-white ms-1">Medallas</span>
                  </h3>
                  <small class="text-muted">Puntuación de medallas oficial alcanzada en la temporada actual de Supercell</small>
                </div>
              </div>
              <div class="text-end">
                ${player.currentRank ? `
                  <div class="badge bg-warning text-dark fs-5 px-3 py-2 fw-bold rounded-pill shadow">
                    👑 Top #${player.currentRank.toLocaleString()} Mundial
                  </div>
                  <small class="d-block text-muted mt-1">Posición oficial en la tabla global</small>
                ` : `
                  <span class="badge bg-dark border border-secondary text-info px-3 py-2 fs-6">
                    <i class="bi bi-shield-check text-success me-1"></i> Rango Campeón (Liga 7) Activo
                  </span>
                `}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- =====================================================================
             3. ESTADÍSTICAS RÁPIDAS DEL JUGADOR
             ===================================================================== -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-white">Nvl ${player.kingTowerLevel || 16}</div>
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
              <div class="stat-value text-warning">${player.wins.toLocaleString()}</div>
              <div class="stat-label">Victorias en Batalla</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-box">
              <div class="stat-value text-info">${player.favoriteCard || 'Montapuercos'}</div>
              <div class="stat-label">Carta Favorita</div>
            </div>
          </div>
        </div>

        <!-- =====================================================================
             4. SECCIÓN VICTORIAS EN GUERRA: CW1 vs CW2 (Requisito Específico)
             ===================================================================== -->
        <div class="mb-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <h5 class="fw-bold text-white mb-0">⚔️ Rendimiento en Clan Wars (CW1 y CW2)</h5>
            <span class="badge bg-dark border border-secondary text-muted">Supercell Official</span>
          </div>

          <div class="row g-3">
            <!-- Clan Wars 1 -->
            <div class="col-md-6">
              <div class="cw-compare-card cw1-border">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1 mb-1">
                      🛡️ Clan Wars 1 (Original)
                    </span>
                    <h3 class="fw-bold text-white mt-1 mb-0">${player.cw1Wins.toLocaleString()}</h3>
                    <small class="text-muted">Victorias en Día de Guerra (War Day Wins)</small>
                  </div>
                  <div class="fs-1 text-warning">⚔️</div>
                </div>
                <div class="p-2 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25 mt-3 small text-muted">
                  <i class="bi bi-info-circle text-warning me-1"></i>
                  ${player.cw1Badge ? `Insignia de Veterano de CW1: Nivel ${player.cw1Badge.level || 1} (${player.cw1Badge.progress} victorias registradas)` : 'Registro histórico de victorias en el formato original de Clan Wars 1.'}
                </div>
              </div>
            </div>

            <!-- Clan Wars 2 (River Race) -->
            <div class="col-md-6">
              <div class="cw-compare-card cw2-border">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-1 mb-1">
                      🌊 Clan Wars 2 (River Race)
                    </span>
                    <h3 class="fw-bold text-white mt-1 mb-0">${player.cw2Wins.toLocaleString()}</h3>
                    <small class="text-muted">Victorias Oficiales en Carrera de Río (Insignia Supercell)</small>
                  </div>
                  <div class="fs-1 text-info">
                    ${player.cw2Badge?.iconUrls?.large ? `<img src="${player.cw2Badge.iconUrls.large}" alt="CW2" style="width: 48px; height: 48px; object-fit: contain;">` : '⛵'}
                  </div>
                </div>

                ${player.cw2Badge ? `
                  <div class="mt-3">
                    <div class="d-flex justify-content-between text-muted small mb-1">
                      <span>Insignia ClanWarWins: Nivel ${player.cw2Badge.level || 1} / ${player.cw2Badge.maxLevel || 8}</span>
                      <strong class="text-white">${player.cw2Badge.progress.toLocaleString()} ${player.cw2Badge.target ? `/ ${player.cw2Badge.target.toLocaleString()}` : ''}</strong>
                    </div>
                    ${player.cw2Badge.target ? `
                      <div class="progress" style="height: 6px;">
                        <div class="progress-bar bg-info" style="width: ${Math.min(100, Math.round((player.cw2Badge.progress / player.cw2Badge.target) * 100))}%;"></div>
                      </div>
                    ` : ''}
                  </div>
                ` : `
                  <div class="p-2 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25 mt-3 small text-muted">
                    No cuenta con insignia activa de victorias en CW2.
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================================
             5. SECCIÓN LOGROS DE LA CUENTA (Mejor temporada, Top, CRL, Torneo Real)
             ===================================================================== -->
        <div class="mb-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <h5 class="fw-bold text-white mb-0">🏆 Logros de la Cuenta & Clasificaciones</h5>
            <span class="badge bg-dark border border-secondary text-info">Marcas Históricas</span>
          </div>

          <!-- Récords de Medallas y Top -->
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <div class="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-25 h-100">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="fs-4">🥇</span>
                  <div>
                    <span class="text-muted small text-uppercase fw-bold">Mejor Temporada de Medallas</span>
                    <h4 class="fw-bold text-white mb-0">
                      ${player.bestMedals > 0 ? `${player.bestMedals.toLocaleString()} Medallas` : 'Sin registro de medallas'}
                    </h4>
                  </div>
                </div>
                <small class="text-info">
                  ${player.bestLeagueName ? `Alcanzado en ${player.bestLeagueName}` : 'Récord histórico de Camino de Leyendas'}
                </small>
              </div>
            </div>

            <div class="col-md-6">
              <div class="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-25 h-100">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="fs-4">👑</span>
                  <div>
                    <span class="text-muted small text-uppercase fw-bold">Mejor Top Mundial</span>
                    <h4 class="fw-bold text-white mb-0">
                      ${player.bestRank ? `Top #${player.bestRank.toLocaleString()} Global` : 'Top Mundial No Registrado'}
                    </h4>
                  </div>
                </div>
                <small class="text-warning">
                  ${player.bestRank ? 'Posición oficial en el Salón de la Fama mundial' : 'Sigue compitiendo en Camino de Leyendas para alcanzar el Top'}
                </small>
              </div>
            </div>
          </div>

          <!-- Insignias de CRL (Clash Royale League) -->
          <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-3">
            <h6 class="fw-bold text-white mb-2">
              <i class="bi bi-trophy-fill text-warning me-1"></i> Insignias de CRL (Clash Royale League)
            </h6>
            <div class="row g-2">
              ${crlBadgesHtml}
            </div>
          </div>

          <!-- Torneo Real (Royal Tournament) y Grandes Desafíos -->
          <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
            <h6 class="fw-bold text-white mb-2">
              <i class="bi bi-award-fill text-danger me-1"></i> Torneo Real y Clasificaciones Especiales
            </h6>
            <div class="row g-2 mb-2">
              ${royalBadgesHtml}
            </div>
            ${otherClassHtml ? `
              <div class="row g-2 mt-2 pt-2 border-top border-secondary border-opacity-25">
                ${otherClassHtml}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- =====================================================================
             6. MAZO ACTUAL EN BATALLA
             ===================================================================== -->
        <div class="mb-4">
          <h5 class="fw-bold text-white mb-3">⚔️ Mazo Actual en Batalla (API Oficial)</h5>
          <div class="row">
            ${decksHtml}
          </div>
        </div>

        <!-- =====================================================================
             7. COLECCIÓN COMPLETA DE CARTAS (Todas las cartas, Niveles, Evos y Héroes)
             ===================================================================== -->
        <div class="mt-4 pt-3 border-top border-secondary border-opacity-25">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h5 class="fw-bold text-white mb-1">
                🎴 Colección Completa de Cartas
              </h5>
              <p class="text-muted small mb-0">
                Listado oficial de todas las cartas del juego: consulta las que tienes, sus niveles reales, evoluciones disponibles y héroes.
              </p>
            </div>
            <div class="text-end">
              <span class="badge bg-primary px-3 py-2 fs-6 rounded-pill fw-bold">
                ${collStats.owned} / ${collStats.total} Cartas (${collPct}%)
              </span>
            </div>
          </div>

          <!-- Métricas Resumen de la Colección -->
          <div class="row g-2 mb-3">
            <div class="col-6 col-sm-3">
              <div class="p-2 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25 text-center">
                <div class="fw-bold text-warning fs-5">${collStats.maxed}</div>
                <small class="text-muted">Nivel Máx (16)</small>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="p-2 rounded bg-dark bg-opacity-50 border border-info border-opacity-25 text-center">
                <div class="fw-bold text-info fs-5">${collStats.evoUnlocked} / ${collStats.evoAvailable}</div>
                <small class="text-muted">Evoluciones (Evos)</small>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="p-2 rounded bg-dark bg-opacity-50 border border-warning border-opacity-25 text-center">
                <div class="fw-bold text-warning fs-5">${collStats.heroes}</div>
                <small class="text-muted">Héroes / Campeones</small>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="p-2 rounded bg-dark bg-opacity-50 border border-danger border-opacity-25 text-center">
                <div class="fw-bold text-danger fs-5">${collStats.unowned}</div>
                <small class="text-muted">Sin Desbloquear</small>
              </div>
            </div>
          </div>

          <!-- Filtros y Buscador de Cartas -->
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div class="d-flex flex-wrap gap-2" id="collection-filter-chips">
              <button class="collection-filter-chip active" data-filter="all">Todas (${collStats.total})</button>
              <button class="collection-filter-chip" data-filter="owned">✅ Desbloqueadas (${collStats.owned})</button>
              <button class="collection-filter-chip" data-filter="maxed">⭐ Nvl Máx 16 (${collStats.maxed})</button>
              <button class="collection-filter-chip" data-filter="evo">🔵 Con Evo (${collStats.evoAvailable})</button>
              <button class="collection-filter-chip" data-filter="hero">👑 Héroes / Campeones (${collStats.heroes})</button>
              <button class="collection-filter-chip" data-filter="unowned">🔒 No Obtenidas (${collStats.unowned})</button>
            </div>

            <div style="min-width: 200px; max-width: 280px; width: 100%;">
              <input type="text" id="card-search-input" class="form-control form-control-sm kmkc-input" placeholder="🔍 Buscar carta por nombre...">
            </div>
          </div>

          <!-- Leyenda de Cartas -->
          <div class="d-flex flex-wrap gap-3 small text-muted mb-3">
            <span><span class="badge bg-primary me-1">Nvl X</span> Nivel en juego</span>
            <span><span class="badge me-1" style="background: linear-gradient(135deg, #a824db, #ff007a); color: #fff;">MAX</span> Nivel Élite 16</span>
            <span><span class="badge me-1" style="background: #00d2ff; color: #000;">EVO</span> Evolución</span>
            <span><span class="badge me-1" style="background: #ffd700; color: #000;">👑 HÉROE</span> Héroe / Campeón</span>
          </div>

          <!-- Cuadrícula Dinámica de Cartas -->
          <div id="player-collection-grid" class="cr-full-collection-grid">
            <!-- Rellenado por renderCardsGrid -->
          </div>
        </div>

      </div>
    `;

    // 6. Función de Renderizado Dinámico de Cartas
    const collectionGrid = document.getElementById('player-collection-grid');
    const filterChips = document.querySelectorAll('.collection-filter-chip');
    const cardSearchInput = document.getElementById('card-search-input');

    let currentCardFilter = 'all';
    let currentCardSearch = '';

    const updateCardsGrid = () => {
      if (!collectionGrid) return;
      const all = window._currentPlayerCards || [];

      const filtered = all.filter(c => {
        // Filtro por categoría
        if (currentCardFilter === 'owned' && !c.isOwned) return false;
        if (currentCardFilter === 'unowned' && c.isOwned) return false;
        if (currentCardFilter === 'maxed' && (!c.isOwned || !c.isMaxed)) return false;
        if (currentCardFilter === 'evo' && !c.hasEvoAvailable) return false;
        if (currentCardFilter === 'hero' && !c.isHero) return false;

        // Filtro por texto de búsqueda
        if (currentCardSearch) {
          const q = currentCardSearch.toLowerCase();
          if (!c.name.toLowerCase().includes(q)) return false;
        }

        return true;
      });

      if (filtered.length === 0) {
        collectionGrid.innerHTML = `
          <div class="text-center py-5 text-muted" style="grid-column: 1 / -1;">
            <i class="bi bi-funnel fs-3 d-block mb-2"></i>
            No se encontraron cartas con los filtros seleccionados.
          </div>
        `;
        return;
      }

      collectionGrid.innerHTML = filtered.map(card => {
        const isOwned = card.isOwned;
        const isMaxed = card.isMaxed;
        const displayLvl = card.displayLevel;
        const isHero = card.isHero;
        const hasEvo = card.hasEvoAvailable;
        const isEvoUnlocked = card.isEvoUnlocked;

        let cardClasses = 'cr-card-full';
        if (!isOwned) cardClasses += ' unowned';
        if (isMaxed) cardClasses += ' is-maxed';
        if (hasEvo) cardClasses += ' is-evo';
        if (isHero) cardClasses += ' is-hero';

        // Badge de Nivel
        let levelBadgeHtml = '';
        if (isOwned) {
          if (isMaxed) {
            levelBadgeHtml = `<span class="cr-card-full-level lvl-max">MAX</span>`;
          } else {
            levelBadgeHtml = `<span class="cr-card-full-level lvl-standard">Nvl ${displayLvl}</span>`;
          }
        }

        // Badge de Tipo (Evo / Hero)
        let typeBadgeHtml = '';
        if (isHero) {
          typeBadgeHtml = `<span class="cr-card-full-badge badge-hero">👑 HÉROE</span>`;
        } else if (hasEvo) {
          if (isEvoUnlocked) {
            typeBadgeHtml = `<span class="cr-card-full-badge badge-evo">✨ EVO</span>`;
          } else {
            typeBadgeHtml = `<span class="cr-card-full-badge badge-evo-avail">EVO</span>`;
          }
        }

        // Icono de candado si no está desbloqueada
        const lockHtml = !isOwned ? `<div class="cr-card-full-lock">🔒</div>` : '';

        // Elixir drop
        const elixirHtml = card.elixirCost > 0 ? `<span class="cr-card-full-elixir">${card.elixirCost}</span>` : '';

        return `
          <div class="${cardClasses}" title="${card.name} ${isOwned ? `(Nvl ${displayLvl})` : '(No desbloqueada)'}">
            ${typeBadgeHtml}
            ${levelBadgeHtml}
            ${lockHtml}
            <img src="${card.iconUrl || card.evoIconUrl || card.heroIconUrl}" alt="${card.name}" loading="lazy">
            <div class="cr-card-full-name">${card.name}</div>
            ${elixirHtml}
          </div>
        `;
      }).join('');
    };

    // Listeners de los chips de filtro
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCardFilter = chip.dataset.filter || 'all';
        updateCardsGrid();
      });
    });

    // Listener del buscador de cartas
    if (cardSearchInput) {
      cardSearchInput.addEventListener('input', (e) => {
        currentCardSearch = (e.target.value || '').trim();
        updateCardsGrid();
      });
    }

    // Render inicial de la colección de cartas
    updateCardsGrid();

    // Scroll suave hacia los resultados
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
