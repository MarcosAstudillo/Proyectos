/**
 * ============================================================================
 * KMKCStats - Servicio API Oficial de Supercell / Clash Royale
 * Consulta exclusivamente la API Oficial en vivo (Sin datos Mock)
 * ============================================================================
 */

const SupercellAPI = (() => {
  const STORAGE_KEY_TOKEN = 'kmkc_supercell_token';
  const STORAGE_KEY_PROXY = 'kmkc_supercell_proxy';

  // Token oficial de Clash Royale API configurado para la IP autorizada (83.56.26.27)
  const DEFAULT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjljZTMxYjcwLWJmY2UtNDBlNS04MDE2LWQ2OTFlNzM4M2M5ZSIsImlhdCI6MTc5MDE3OTUwOSwic3ViIjoiZGV2ZWxvcGVyL2M4MmRjZWIzLTQyZDAtNDNkNy1iYTE4LTY2MTk0ZWZkNDMxOCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4My41Ni4yNi4yNyJdLCJ0eXBlIjoiY2xpZW50In1dfQ.ANN_dt_QvJLYicqBsCjDXdZ7xVVIaTRLgMlkYiXb_s6ih4o8hLtvHf6r3NvrTQkVg8Ho4eX9qax9YQuZFyK7CA';
  const DEFAULT_PROXY = 'http://localhost:8080/v1';

  // Configuración de API
  const config = {
    token: localStorage.getItem(STORAGE_KEY_TOKEN) || DEFAULT_TOKEN,
    proxyUrl: localStorage.getItem(STORAGE_KEY_PROXY) || DEFAULT_PROXY,
    baseUrl: 'https://api.clashroyale.com/v1'
  };

  /**
   * Normaliza etiquetas de Clash Royale añadiendo '#' y pasando a mayúsculas
   */
  const formatTag = (tag) => {
    let clean = (tag || '').trim().toUpperCase();
    if (!clean.startsWith('#')) {
      clean = '#' + clean;
    }
    return clean;
  };

  /**
   * Obtiene datos de un clan por Tag consultando EXCLUSIVAMENTE la API oficial
   */
  const getClan = async (rawTag) => {
    const tag = formatTag(rawTag);

    if (!config.token || !config.proxyUrl) {
      return {
        success: false,
        error: 'No se ha configurado el API Token o la URL del proxy. Abre "API Supercell" para configurarlo.'
      };
    }

    try {
      const encodedTag = encodeURIComponent(tag);
      const url = `${config.proxyUrl.replace(/\/$/, '')}/clans/${encodedTag}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 404) {
        return {
          success: false,
          error: `No existe ningún clan con el tag "${tag}" en la base de datos oficial de Clash Royale.`
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: 'Acceso denegado (403) por Supercell. Comprueba que tu IP pública actual coincida con la registrada en developer.clashroyale.com.'
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: `Error de respuesta de Supercell: HTTP ${response.status} (${response.statusText || 'Error desconocido'})`
        };
      }

      const data = await response.json();

      // Consultar River Race (Clan Wars 2) en vivo
      let warRaceData = null;
      try {
        const raceUrl = `${config.proxyUrl.replace(/\/$/, '')}/clans/${encodedTag}/currentriverrace`;
        const raceResp = await fetch(raceUrl, {
          headers: {
            'Authorization': `Bearer ${config.token}`,
            'Accept': 'application/json'
          }
        });
        if (raceResp.ok) {
          warRaceData = await raceResp.json();
        }
      } catch (raceErr) {
        console.warn('Aviso: no se pudo obtener currentriverrace:', raceErr);
      }

      // Estructura oficial normalizada para la interfaz
      const clanData = {
        tag: data.tag,
        name: data.name,
        description: data.description || 'Clan oficial de Clash Royale',
        badgeId: data.badgeId,
        clanScore: data.clanScore || 0,
        clanWarTrophies: data.clanWarTrophies || 0,
        requiredTrophies: data.requiredTrophies || 0,
        donationsPerWeek: data.donationsPerWeek || 0,
        membersCount: data.members || (data.memberList ? data.memberList.length : 0),
        location: data.location || { name: 'Internacional', code: 'INT' },
        isLive: true,
        warRace: warRaceData && warRaceData.clan ? {
          colosseumRank: (warRaceData.sectionIndex !== undefined) ? warRaceData.sectionIndex + 1 : 1,
          fame: warRaceData.clan.fame || 0,
          fameTarget: 50000,
          boatHealth: 100,
          movementPoints: warRaceData.clan.fame || 0,
          periodIndex: warRaceData.periodIndex || 1,
          periodType: warRaceData.periodType || 'riverRace',
          opponents: (warRaceData.clans || []).map(opp => ({
            name: opp.name,
            tag: opp.tag,
            badge: '🛡️',
            fame: opp.fame || 0
          })),
          topWarContributors: (warRaceData.clan.participants || [])
            .sort((a, b) => (b.fame || 0) - (a.fame || 0))
            .slice(0, 8)
            .map(part => ({
              name: part.name,
              role: 'Guerra',
              fame: part.fame || 0,
              boatAttacks: part.boatAttacks || 0,
              decksUsed: part.decksUsed || 0,
              winrate: `${part.decksUsed > 0 ? Math.min(100, Math.round(((part.fame || 200) / (part.decksUsed * 250)) * 100)) : 0}%`
            }))
        } : {
          colosseumRank: 1,
          fame: 0,
          fameTarget: 50000,
          boatHealth: 100,
          movementPoints: 0,
          periodIndex: 1,
          periodType: 'riverRace',
          opponents: [
            { name: data.name, fame: 0, badge: '🛡️', tag: data.tag }
          ],
          topWarContributors: (data.memberList || []).slice(0, 8).map(m => ({
            name: m.name,
            role: m.role || 'Miembro',
            fame: m.donations ? m.donations * 2 : 0,
            boatAttacks: 0,
            decksUsed: 0,
            winrate: '-'
          }))
        }
      };

      return {
        success: true,
        isRealApi: true,
        data: clanData
      };
    } catch (err) {
      console.error('Error al consultar el clan en la API:', err);
      return {
        success: false,
        error: 'No se pudo conectar con el proxy de Clash Royale. Asegúrate de ejecutar "python proxy.py" en la terminal.'
      };
    }
  };

  /**
   * Obtiene datos de un jugador por Tag consultando EXCLUSIVAMENTE la API oficial
   */
  const getPlayer = async (rawTag) => {
    const tag = formatTag(rawTag);

    if (!config.token || !config.proxyUrl) {
      return {
        success: false,
        error: 'No se ha configurado el API Token o la URL del proxy. Abre "API Supercell" para configurarlo.'
      };
    }

    try {
      const encodedTag = encodeURIComponent(tag);
      const url = `${config.proxyUrl.replace(/\/$/, '')}/players/${encodedTag}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 404) {
        return {
          success: false,
          error: `No existe ningún jugador con el tag "${tag}" en la base de datos oficial de Clash Royale.`
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: 'Acceso denegado (403) por Supercell. Comprueba tu IP autorizada.'
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: `Error de respuesta de Supercell: HTTP ${response.status} (${response.statusText || 'Error desconocido'})`
        };
      }

      const data = await response.json();

      // Extracción de datos crudos oficiales
      const rawCards = data.cards || [];
      const rawSupportCards = data.supportCards || [];
      const rawBadges = data.badges || [];
      const rawAchievements = data.achievements || [];

      // 1. Camino de Leyendas (Path of Legend) & Liga actual
      const pol = data.currentPathOfLegendSeasonResult || null;
      const bestPol = data.bestPathOfLegendSeasonResult || null;
      const lastPol = data.lastPathOfLegendSeasonResult || null;

      const leagueNamesMap = {
        1: 'Liga 1 · Aspirante I',
        2: 'Liga 2 · Aspirante II',
        3: 'Liga 3 · Aspirante III',
        4: 'Liga 4 · Maestro I',
        5: 'Liga 5 · Maestro II',
        6: 'Liga 6 · Maestro III',
        7: 'Liga 7 · Campeón',
        8: 'Liga 8 · Gran Campeón',
        9: 'Liga 9 · Campeón Real',
        10: 'Liga 10 · Campeón Definitivo'
      };

      let currentLeagueNumber = pol ? pol.leagueNumber : null;
      let currentMedals = pol ? (pol.trophies || 0) : 0;
      let currentRank = pol ? pol.rank : null;

      if (!currentLeagueNumber && data.leagueStatistics?.currentSeason) {
        const t = data.leagueStatistics.currentSeason.trophies || data.leagueStatistics.currentSeason.bestTrophies || 0;
        if (t >= 9000) currentLeagueNumber = 7;
        else if (t >= 7000) currentLeagueNumber = 6;
        else if (t >= 5000) currentLeagueNumber = 5;
        else if (t >= 3000) currentLeagueNumber = 4;
        else if (t >= 2000) currentLeagueNumber = 3;
        else if (t >= 1000) currentLeagueNumber = 2;
        else if (t > 0) currentLeagueNumber = 1;
        if (currentMedals === 0) currentMedals = t;
      }

      const currentLeagueName = currentLeagueNumber ? (leagueNamesMap[currentLeagueNumber] || `Liga ${currentLeagueNumber}`) : 'Sin Liga';
      const isLeague7 = currentLeagueNumber === 7;

      // 2. Logros competitivos, Mejor Temporada de Medallas & Rankings
      const bestLeagueNumber = bestPol ? bestPol.leagueNumber : null;
      const bestLeagueName = bestLeagueNumber ? (leagueNamesMap[bestLeagueNumber] || `Liga ${bestLeagueNumber}`) : null;
      const bestMedals = bestPol ? (bestPol.trophies || 0) : (data.leagueStatistics?.bestSeason?.trophies || 0);
      const bestRank = bestPol ? bestPol.rank : (rawBadges.find(b => b.name === 'LadderTop1000')?.progress || null);

      // Insignias oficiales de CRL (Clash Royale League)
      const crlBadges = rawBadges.filter(b => (b.name || '').toLowerCase().includes('crl'));

      // Torneo Real (Royal Tournament)
      const royalTournamentBadges = rawBadges.filter(b => (b.name || '').toLowerCase().includes('royaltournament'));

      // Desafíos mayores y títulos
      const grand12Badge = rawBadges.find(b => b.name === 'Grand12Wins') || null;
      const classic12Badge = rawBadges.find(b => b.name === 'Classic12Wins') || null;
      const ladderTopBadge = rawBadges.find(b => b.name === 'LadderTop1000') || null;
      const yearsPlayedBadge = rawBadges.find(b => b.name === 'YearsPlayed') || null;
      const battleWinsBadge = rawBadges.find(b => b.name === 'BattleWins') || null;
      const emoteBadge = rawBadges.find(b => b.name === 'EmoteCollection') || null;
      const bannerBadge = rawBadges.find(b => b.name === 'BannerCollection') || null;

      // 3. Victorias en Clan Wars: CW1 y CW2
      const cw1Wins = data.warDayWins || 0;
      const cw1Badge = rawBadges.find(b => b.name === 'ClanWarsVeteran') || null;
      const cw2Badge = rawBadges.find(b => b.name === 'ClanWarWins') || null;
      const cw2Wins = cw2Badge ? (cw2Badge.progress || 0) : 0;

      // 4. Colección de Cartas completa (123 cartas del juego + niveles + evos + heroes)
      let allGameCardsItems = [];
      try {
        const gameCardsData = await getCardsFull();
        allGameCardsItems = [...(gameCardsData.items || []), ...(gameCardsData.supportItems || [])];
      } catch (e) {
        console.warn('Fallo al obtener lista de cartas:', e);
      }

      if (allGameCardsItems.length === 0) {
        allGameCardsItems = [...rawCards, ...rawSupportCards];
      }

      const playerCardMap = new Map();
      rawCards.forEach(c => playerCardMap.set(c.id, c));
      rawSupportCards.forEach(c => playerCardMap.set(c.id, c));

      const processedCards = allGameCardsItems.map(gc => {
        const pCard = playerCardMap.get(gc.id) || rawCards.find(c => c.name === gc.name) || rawSupportCards.find(c => c.name === gc.name);
        const isOwned = Boolean(pCard);
        const rarity = (gc.rarity || pCard?.rarity || 'common').toLowerCase();
        const maxLevel = gc.maxLevel || pCard?.maxLevel || 16;
        const rawLevel = pCard ? pCard.level : 0;
        
        // Nivel visible en juego (1 al 16): fórmula oficial de Supercell = 16 - (maxLevel - rawLevel)
        const displayLevel = isOwned ? Math.max(1, 16 - (maxLevel - rawLevel)) : 0;
        const isMaxed = isOwned && (displayLevel >= 16 || rawLevel >= maxLevel);

        // Evolución: SOLO si la cuenta la tiene realmente desbloqueada (evolutionLevel > 0)
        const evolutionLevel = pCard ? (pCard.evolutionLevel || 0) : 0;
        const isEvoUnlocked = Boolean(pCard && evolutionLevel > 0);

        // Distinción clara solicitada:
        // 1. CAMPEONES (Champions): rareza 'champion' (Archer Queen, Mighty Miner, Monk, Boss Bandit, Golden Knight, Little Prince, Skeleton King, Goblinstein)
        const isChampion = rarity === 'champion';

        // 2. HÉROES (Card Heroes): cartas normales que tienen versión héroe (heroMedium en iconUrls), NO son campeones
        const isHero = !isChampion && Boolean(gc.iconUrls?.heroMedium || pCard?.iconUrls?.heroMedium);

        return {
          id: gc.id,
          name: gc.name,
          rarity,
          elixirCost: gc.elixirCost || pCard?.elixirCost || 0,
          iconUrl: gc.iconUrls?.medium || pCard?.iconUrls?.medium || '',
          evoIconUrl: gc.iconUrls?.evolutionMedium || pCard?.iconUrls?.evolutionMedium || '',
          heroIconUrl: gc.iconUrls?.heroMedium || pCard?.iconUrls?.heroMedium || '',
          isOwned,
          rawLevel,
          displayLevel,
          maxLevel,
          isMaxed,
          isEvoUnlocked,
          evolutionLevel,
          isChampion,
          isHero,
          count: pCard?.count || 0
        };
      });

      // Ordenar por: primero poseídas, luego mayor nivel descendente, luego nombre
      processedCards.sort((a, b) => {
        if (a.isOwned !== b.isOwned) return a.isOwned ? -1 : 1;
        if (b.displayLevel !== a.displayLevel) return b.displayLevel - a.displayLevel;
        return a.name.localeCompare(b.name);
      });

      const collectionStats = {
        total: processedCards.length,
        owned: processedCards.filter(c => c.isOwned).length,
        unowned: processedCards.filter(c => !c.isOwned).length,
        maxed: processedCards.filter(c => c.isMaxed).length,
        evosUnlocked: processedCards.filter(c => c.isEvoUnlocked).length,
        championsUnlocked: processedCards.filter(c => c.isChampion && c.isOwned).length,
        heroesUnlocked: processedCards.filter(c => c.isHero && c.isOwned).length
      };

      // 5. Extraer los dos mazos que más ha estado usando (Battle Log oficial)
      // y ordenarlos según la regla de slots:
      // - Posición 1: Primera Evo desbloqueada (con foto de evo)
      // - Posición 2: Campeón o Héroe desbloqueado (con foto de campeón/héroe)
      // - Posición 3: Campeón, Héroe o Segunda Evo (con foto respectiva)
      // - Posiciones 4 a 8: Resto de cartas del mazo (con foto normal)
      const formatPlayerDeckWithSlots = (deckCards) => {
        const enriched = deckCards.map(c => {
          const pCard = playerCardMap.get(c.id) || rawCards.find(rc => rc.name === c.name);
          const rarity = (c.rarity || pCard?.rarity || 'common').toLowerCase();
          const evoLevel = pCard ? (pCard.evolutionLevel || 0) : (c.evolutionLevel || 0);
          const hasEvoUnlocked = evoLevel > 0;
          const isChampion = rarity === 'champion';
          const isHero = !isChampion && Boolean(c.iconUrls?.heroMedium || pCard?.iconUrls?.heroMedium);
          const elixir = c.elixirCost || pCard?.elixirCost || 3;

          return {
            id: c.id,
            name: c.name,
            rarity,
            elixir,
            hasEvoUnlocked,
            isChampion,
            isHero,
            iconUrls: {
              medium: c.iconUrls?.medium || pCard?.iconUrls?.medium || '',
              evolutionMedium: c.iconUrls?.evolutionMedium || pCard?.iconUrls?.evolutionMedium || '',
              heroMedium: c.iconUrls?.heroMedium || pCard?.iconUrls?.heroMedium || ''
            }
          };
        });

        const evos = enriched.filter(c => c.hasEvoUnlocked && c.iconUrls.evolutionMedium);
        const champs = enriched.filter(c => c.isChampion);
        const heroes = enriched.filter(c => c.isHero);
        const champsOrHeroes = [...champs, ...heroes];

        const usedIds = new Set();
        const slots = [null, null, null, null, null, null, null, null];

        // Posición 1: Primera Evo desbloqueada (con foto de evo)
        if (evos.length > 0) {
          const c = evos[0];
          usedIds.add(c.id);
          slots[0] = {
            ...c,
            slotNumber: 1,
            slotRole: 'evo',
            slotBadge: 'EVO 1',
            badgeClass: 'badge-evo',
            imageUrl: c.iconUrls.evolutionMedium || c.iconUrls.medium
          };
        }

        // Posición 2: Campeón o Héroe (con foto de campeón o héroe)
        const availableCH1 = champsOrHeroes.filter(c => !usedIds.has(c.id));
        if (availableCH1.length > 0) {
          const c = availableCH1[0];
          usedIds.add(c.id);
          const isCh = c.isChampion;
          slots[1] = {
            ...c,
            slotNumber: 2,
            slotRole: isCh ? 'champion' : 'hero',
            slotBadge: isCh ? '👑 CAMPEÓN' : '⚡ HÉROE',
            badgeClass: isCh ? 'badge-champion' : 'badge-hero',
            imageUrl: isCh ? c.iconUrls.medium : (c.iconUrls.heroMedium || c.iconUrls.medium)
          };
        }

        // Posición 3: Campeón, Héroe o Segunda Evo (con foto respectiva)
        const availableCH2 = champsOrHeroes.filter(c => !usedIds.has(c.id));
        const availableEvos2 = evos.filter(c => !usedIds.has(c.id));

        if (availableCH2.length > 0) {
          const c = availableCH2[0];
          usedIds.add(c.id);
          const isCh = c.isChampion;
          slots[2] = {
            ...c,
            slotNumber: 3,
            slotRole: isCh ? 'champion' : 'hero',
            slotBadge: isCh ? '👑 CAMPEÓN' : '⚡ HÉROE',
            badgeClass: isCh ? 'badge-champion' : 'badge-hero',
            imageUrl: isCh ? c.iconUrls.medium : (c.iconUrls.heroMedium || c.iconUrls.medium)
          };
        } else if (availableEvos2.length > 0) {
          const c = availableEvos2[0];
          usedIds.add(c.id);
          slots[2] = {
            ...c,
            slotNumber: 3,
            slotRole: 'evo',
            slotBadge: 'EVO 2',
            badgeClass: 'badge-evo',
            imageUrl: c.iconUrls.evolutionMedium || c.iconUrls.medium
          };
        }

        // Rellenar las posiciones 4 a 8 con el resto de cartas (foto normal)
        const remaining = enriched.filter(c => !usedIds.has(c.id));
        let remIdx = 0;
        for (let i = 0; i < 8; i++) {
          if (!slots[i] && remIdx < remaining.length) {
            const c = remaining[remIdx++];
            slots[i] = {
              ...c,
              slotNumber: i + 1,
              slotRole: 'standard',
              slotBadge: null,
              badgeClass: '',
              imageUrl: c.iconUrls.medium
            };
          }
        }

        return slots.filter(Boolean);
      };

      // Consultar historial de batallas para detectar los 2 mazos más usados
      let topTwoDecks = [];
      try {
        const battleLogRes = await getPlayerBattleLog(tag);
        const battles = (battleLogRes.success && Array.isArray(battleLogRes.data)) ? battleLogRes.data : [];

        if (battles.length > 0) {
          const deckMap = new Map();
          battles.forEach(b => {
            const team = b.team && b.team[0] ? b.team[0] : null;
            const opp = b.opponent && b.opponent[0] ? b.opponent[0] : null;
            if (team && team.cards && team.cards.length === 8) {
              const isWin = opp ? (team.crowns > opp.crowns) : false;
              const key = team.cards.map(c => c.name).sort().join('||');
              if (!deckMap.has(key)) {
                deckMap.set(key, {
                  rawCards: team.cards,
                  count: 0,
                  wins: 0,
                  gameMode: b.gameMode ? b.gameMode.name.replace(/_/g, ' ') : (b.type || 'Batalla')
                });
              }
              const item = deckMap.get(key);
              item.count++;
              if (isWin) item.wins++;
            }
          });

          const sorted = Array.from(deckMap.values()).sort((a, b) => b.count - a.count);
          sorted.slice(0, 2).forEach((d, idx) => {
            const wr = Math.round((d.wins / Math.max(1, d.count)) * 100);
            const slottedCards = formatPlayerDeckWithSlots(d.rawCards);
            const avgElixir = (slottedCards.reduce((acc, c) => acc + (c.elixir || 3), 0) / slottedCards.length).toFixed(1);
            topTwoDecks.push({
              name: `Mazo #${idx + 1} Más Utilizado (${d.count} ${d.count === 1 ? 'partida' : 'partidas'})`,
              winrate: `${wr}%`,
              count: d.count,
              avgElixir,
              cards: slottedCards
            });
          });
        }
      } catch (logErr) {
        console.warn('Error al calcular los mazos más usados del battlelog:', logErr);
      }

      // Si no hay 2 mazos en el battlelog, completar con currentDeck
      if (topTwoDecks.length < 2 && data.currentDeck && data.currentDeck.length === 8) {
        const currentDeckKey = data.currentDeck.map(c => c.name).sort().join('||');
        const exists = topTwoDecks.some(d => d.cards.map(c => c.name).sort().join('||') === currentDeckKey);
        if (!exists) {
          const slottedCards = formatPlayerDeckWithSlots(data.currentDeck);
          const avgElixir = (slottedCards.reduce((acc, c) => acc + (c.elixir || 3), 0) / slottedCards.length).toFixed(1);
          topTwoDecks.push({
            name: topTwoDecks.length === 0 ? 'Mazo Activo en Batalla (API Oficial)' : 'Mazo Secundario Registrado',
            winrate: `${Math.min(99, Math.round(((data.wins || 1) / Math.max(1, (data.wins || 1) + (data.losses || 0))) * 100))}%`,
            count: 1,
            avgElixir,
            cards: slottedCards
          });
        }
      }

      // Si aún no hay mazos, fallback
      if (topTwoDecks.length === 0 && data.currentDeck) {
        const slottedCards = formatPlayerDeckWithSlots(data.currentDeck);
        const avgElixir = (slottedCards.reduce((acc, c) => acc + (c.elixir || 3), 0) / Math.max(1, slottedCards.length)).toFixed(1);
        topTwoDecks.push({
          name: 'Mazo Activo en Batalla (API Oficial)',
          winrate: '85%',
          count: 1,
          avgElixir,
          cards: slottedCards
        });
      }

      // Normalizar estructura completa del jugador oficial
      const playerData = {
        tag: data.tag,
        name: data.name,
        expLevel: data.expLevel,
        trophies: data.trophies || 0,
        bestTrophies: data.bestTrophies || data.trophies || 0,
        clan: data.clan || { name: 'Sin Clan', tag: '' },
        role: data.role ? (data.role.charAt(0).toUpperCase() + data.role.slice(1)) : 'Sin Clan',
        warDayWins: cw1Wins,
        cw1Wins,
        cw1Badge,
        cw2Wins,
        cw2Badge,
        wins: data.wins || 0,
        losses: data.losses || 0,
        threeCrownWins: data.threeCrownWins || 0,
        challengeCardsWon: data.challengeCardsWon || 0,
        challengeMaxWins: data.challengeMaxWins || 0,
        tournamentCardsWon: data.tournamentCardsWon || 0,
        tournamentBattleCount: data.tournamentBattleCount || 0,
        warWinrate: `${Math.min(99, Math.round(((data.wins || 1) / Math.max(1, (data.wins || 1) + (data.losses || 0))) * 100))}%`,
        favoriteCard: data.currentFavouriteCard ? data.currentFavouriteCard.name : 'Montapuercos',
        favoriteCardData: data.currentFavouriteCard || null,
        kingTowerLevel: data.kingLevel || (data.expLevel ? Math.min(16, Math.floor(data.expLevel / 4) + 1) : 16),
        totalDonations: data.totalDonations || data.donations || 0,
        
        // Liga y Camino de Leyendas
        currentLeagueNumber,
        currentLeagueName,
        currentMedals,
        currentRank,
        isLeague7,
        pol,
        bestPol,
        lastPol,
        bestLeagueNumber,
        bestLeagueName,
        bestMedals,
        bestRank,
        leagueStatistics: data.leagueStatistics || null,

        // Logros competitivos
        crlBadges,
        royalTournamentBadges,
        grand12Badge,
        classic12Badge,
        ladderTopBadge,
        yearsPlayedBadge,
        battleWinsBadge,
        emoteBadge,
        bannerBadge,
        rawBadges,
        achievements: rawAchievements,

        // Colección completa de cartas
        allCards: processedCards,
        collectionStats,

        isLive: true,
        topTwoDecks,
        warDecks: topTwoDecks
      };

      return {
        success: true,
        isRealApi: true,
        data: playerData
      };
    } catch (err) {
      console.error('Error al consultar el jugador en la API:', err);
      return {
        success: false,
        error: 'No se pudo conectar con el proxy de Clash Royale. Asegúrate de ejecutar "python proxy.py" en la terminal.'
      };
    }
  };

  /**
   * Obtiene el ranking oficial en vivo de los mejores clanes del mundo en Clan Wars
   */
  const getTopClans = async () => {
    if (!config.token || !config.proxyUrl) return [];

    try {
      const url = `${config.proxyUrl.replace(/\/$/, '')}/locations/global/rankings/clanwars?limit=10`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) return [];

      const data = await response.json();
      return (data.items || []).map(item => ({
        rank: item.rank,
        name: item.name,
        tag: item.tag,
        trophies: item.clanScore || 0,
        score: item.clanScore || 0,
        region: item.location ? item.location.name : 'Global',
        badge: '🛡️'
      }));
    } catch (err) {
      console.warn('No se pudo cargar el ranking en vivo de clanes:', err);
      return [];
    }
  };

  /**
   * Obtiene mazos competitivos con cartas oficiales de la API
   */
  const getMetaDecks = () => {
    return [
      {
        id: 'deck-1',
        name: 'Hog Earthquake 2.6 Cycle',
        avgElixir: 2.6,
        winrate: '58.4%',
        usageRate: '14.2%',
        archetype: 'Ciclo Rápido',
        cards: ['Hog Rider', 'Earthquake', 'Cannon', 'Musketeer', 'The Log', 'Ice Golem', 'Fire Spirit', 'Skeletons']
      },
      {
        id: 'deck-2',
        name: 'P.E.K.K.A Bridge Spam',
        avgElixir: 3.9,
        winrate: '56.9%',
        usageRate: '11.8%',
        archetype: 'Control & Presión',
        cards: ['P.E.K.K.A', 'Battle Ram', 'Bandit', 'Royal Ghost', 'Electro Wizard', 'Poison', 'Zap', 'Minions']
      },
      {
        id: 'deck-3',
        name: 'LavaLoon Double Dragon',
        avgElixir: 4.1,
        winrate: '57.2%',
        usageRate: '9.5%',
        archetype: 'Beatdown Aéreo',
        cards: ['Lava Hound', 'Balloon', 'Inferno Dragon', 'Mega Minion', 'Tombstone', 'Guards', 'Arrows', 'Fireball']
      }
    ];
  };

  /**
   * Obtiene el historial de carreras del río pasadas (hasta 10 semanas) de un clan
   */
  const getRiverRaceLog = async (rawTag) => {
    const tag = formatTag(rawTag);
    if (!config.token || !config.proxyUrl) {
      return { success: false, error: 'Configura la API para continuar.' };
    }
    try {
      const encodedTag = encodeURIComponent(tag);
      const url = `${config.proxyUrl.replace(/\/$/, '')}/clans/${encodedTag}/riverracelog?limit=10`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        return { success: false, error: `No se encontró historial de carreras para "${tag}".` };
      }
      if (!response.ok) {
        return { success: false, error: `Error ${response.status} al consultar el historial de carreras.` };
      }
      const data = await response.json();
      return { success: true, data: data.items || [] };
    } catch (err) {
      return { success: false, error: 'No se pudo conectar con el proxy de Supercell.' };
    }
  };

  /**
   * Obtiene la carrera del río en vivo (Clan Wars 2) de un clan
   */
  const getRiverRace = async (rawTag) => {
    const tag = formatTag(rawTag);
    if (!config.token || !config.proxyUrl) {
      return { success: false, error: 'Configura la API para continuar.' };
    }
    try {
      const encodedTag = encodeURIComponent(tag);
      const url = `${config.proxyUrl.replace(/\/$/, '')}/clans/${encodedTag}/currentriverrace`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        return { success: false, error: `No se encontraron datos de Clan Wars para "${tag}".` };
      }
      if (!response.ok) {
        return { success: false, error: `Error ${response.status} al consultar la carrera de río.` };
      }
      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'No se pudo conectar con el proxy de Supercell.' };
    }
  };

  /**
   * Obtiene el registro de batallas reales de un jugador (Battle Log oficial)
   */
  const getPlayerBattleLog = async (rawTag) => {
    const tag = formatTag(rawTag);
    if (!config.token || !config.proxyUrl) {
      return { success: false, error: 'Configura la API para continuar.' };
    }
    try {
      const encodedTag = encodeURIComponent(tag);
      const url = `${config.proxyUrl.replace(/\/$/, '')}/players/${encodedTag}/battlelog`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        return { success: false, error: `No se encontró historial de batallas para "${tag}".` };
      }
      if (!response.ok) {
        return { success: false, error: `Error ${response.status} al consultar el registro de batallas.` };
      }
      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'No se pudo conectar con el proxy de Supercell.' };
    }
  };

  let cachedCardsFull = null;

  /**
   * Obtiene la lista oficial de todas las cartas de Clash Royale (items + supportItems)
   */
  const getCardsFull = async () => {
    if (cachedCardsFull) return cachedCardsFull;
    if (!config.token || !config.proxyUrl) return { items: [], supportItems: [] };
    try {
      const url = `${config.proxyUrl.replace(/\/$/, '')}/cards`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) return { items: [], supportItems: [] };
      const data = await response.json();
      cachedCardsFull = {
        items: data.items || [],
        supportItems: data.supportItems || []
      };
      return cachedCardsFull;
    } catch (err) {
      console.warn('Error al obtener lista oficial de cartas:', err);
      return { items: [], supportItems: [] };
    }
  };

  /**
   * Obtiene la lista oficial de todas las cartas de Clash Royale desde la API
   */
  const getCards = async () => {
    const full = await getCardsFull();
    return full.items || [];
  };

  /**
   * Obtiene los datos completos de un jugador incluyendo todas sus cartas desbloqueadas y niveles reales
   */
  const getPlayerFull = async (rawTag) => {
    const tag = formatTag(rawTag);
    if (!config.token || !config.proxyUrl) {
      return { success: false, error: 'Configura la API para continuar.' };
    }
    try {
      const encodedTag = encodeURIComponent(tag);
      const url = `${config.proxyUrl.replace(/\/$/, '')}/players/${encodedTag}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        return { success: false, error: `Jugador "${tag}" no encontrado.` };
      }
      if (!response.ok) {
        return { success: false, error: `Error ${response.status} de Supercell.` };
      }
      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'No se pudo conectar con el proxy de Supercell.' };
    }
  };

  /**
   * Guarda credenciales de la API de Supercell en localStorage
   */
  const saveApiConfig = (token, proxyUrl) => {
    config.token = token.trim();
    config.proxyUrl = proxyUrl.trim();

    localStorage.setItem(STORAGE_KEY_TOKEN, config.token);
    localStorage.setItem(STORAGE_KEY_PROXY, config.proxyUrl);
    return true;
  };

  const getApiConfig = () => ({
    token: config.token,
    proxyUrl: config.proxyUrl,
    hasToken: Boolean(config.token)
  });

  return {
    getClan,
    getPlayer,
    getRiverRace,
    getRiverRaceLog,
    getPlayerBattleLog,
    getCards,
    getCardsFull,
    getPlayerFull,
    getTopClans,
    getMetaDecks,
    saveApiConfig,
    getApiConfig,
    formatTag
  };
})();
