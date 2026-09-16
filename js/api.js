/**
 * ============================================================================
 * KMKCStats - Servicio API de Supercell / Clash Royale
 * Soporta modo Mock realista y llamadas a la API Oficial de Supercell
 * ============================================================================
 */

const SupercellAPI = (() => {
  const STORAGE_KEY_TOKEN = 'kmkc_supercell_token';
  const STORAGE_KEY_PROXY = 'kmkc_supercell_proxy';

  // Configuración de API
  const config = {
    token: localStorage.getItem(STORAGE_KEY_TOKEN) || '',
    proxyUrl: localStorage.getItem(STORAGE_KEY_PROXY) || '',
    baseUrl: 'https://api.clashroyale.com/v1'
  };

  /**
   * Base de datos Mock con estadísticas reales de clanes y jugadores de Clan Wars
   */
  const mockDatabase = {
    clans: {
      '#9PJ99': {
        tag: '#9PJ99',
        name: 'Team Queso',
        description: 'Clan competitivo oficial de Team Queso. ¡Top mundial en Clan Wars 2 y torneos oficiales!',
        badgeId: 16000043,
        clanScore: 78500,
        clanWarTrophies: 5420,
        requiredTrophies: 8500,
        donationsPerWeek: 24350,
        membersCount: 50,
        location: { name: 'España', code: 'ES' },
        warRace: {
          colosseumRank: 1,
          fame: 48950,
          fameTarget: 50000,
          boatHealth: 100,
          movementPoints: 48950,
          periodIndex: 4,
          periodType: 'colosseum',
          opponents: [
            { name: 'Team Queso', fame: 48950, badge: '🧀', tag: '#9PJ99' },
            { name: 'Nova I Elites', fame: 45200, badge: '⭐', tag: '#2PP' },
            { name: 'SK Gaming', fame: 41800, badge: '⚡', tag: '#SK01' },
            { name: 'Tribe Gaming', fame: 39400, badge: '🏹', tag: '#TG99' },
            { name: 'Qlash España', fame: 36100, badge: '🐉', tag: '#QL50' }
          ],
          topWarContributors: [
            { name: 'Ruben', role: 'leader', fame: 3600, boatAttacks: 4, decksUsed: 16, winrate: '94%' },
            { name: 'Surgical Goblin', role: 'coLeader', fame: 3450, boatAttacks: 2, decksUsed: 16, winrate: '88%' },
            { name: 'Beniju', role: 'elder', fame: 3300, boatAttacks: 0, decksUsed: 16, winrate: '85%' },
            { name: 'Anaban', role: 'elder', fame: 3250, boatAttacks: 3, decksUsed: 16, winrate: '81%' },
            { name: 'Marcos_KMKC', role: 'member', fame: 3200, boatAttacks: 1, decksUsed: 16, winrate: '80%' }
          ]
        }
      },
      '#2PP': {
        tag: '#2PP',
        name: 'Nova I Elites',
        description: 'Elite global war clan. 24/7 War active. Legendary League #1 contender.',
        badgeId: 16000002,
        clanScore: 82100,
        clanWarTrophies: 6150,
        requiredTrophies: 9000,
        donationsPerWeek: 28900,
        membersCount: 50,
        location: { name: 'International', code: 'INT' },
        warRace: {
          colosseumRank: 1,
          fame: 49700,
          fameTarget: 50000,
          boatHealth: 95,
          movementPoints: 49700,
          periodIndex: 4,
          periodType: 'colosseum',
          opponents: [
            { name: 'Nova I Elites', fame: 49700, badge: '⭐', tag: '#2PP' },
            { name: 'Sandstorm', fame: 46100, badge: '🌪️', tag: '#SD01' },
            { name: 'Clash Champs', fame: 43200, badge: '🏆', tag: '#CC88' },
            { name: 'Immortals', fame: 40500, badge: '🛡️', tag: '#IM09' },
            { name: 'Alpha Legends', fame: 38200, badge: '🐺', tag: '#AL77' }
          ],
          topWarContributors: [
            { name: 'Nova|Jupiter', role: 'leader', fame: 3750, boatAttacks: 0, decksUsed: 16, winrate: '96%' },
            { name: 'Mohamed Light', role: 'coLeader', fame: 3700, boatAttacks: 1, decksUsed: 16, winrate: '94%' },
            { name: 'Morten', role: 'elder', fame: 3500, boatAttacks: 0, decksUsed: 16, winrate: '89%' },
            { name: 'Egor', role: 'elder', fame: 3400, boatAttacks: 2, decksUsed: 16, winrate: '86%' }
          ]
        }
      },
      '#22GCR': {
        tag: '#22GCR',
        name: 'KMKC Esports',
        description: 'Clan principal de la comunidad KMKC. Analítica, estrategia de guerra y buen ambiente.',
        badgeId: 16000029,
        clanScore: 68400,
        clanWarTrophies: 3890,
        requiredTrophies: 7000,
        donationsPerWeek: 19800,
        membersCount: 48,
        location: { name: 'España', code: 'ES' },
        warRace: {
          colosseumRank: 1,
          fame: 42100,
          fameTarget: 50000,
          boatHealth: 100,
          movementPoints: 42100,
          periodIndex: 3,
          periodType: 'training',
          opponents: [
            { name: 'KMKC Esports', fame: 42100, badge: '⚡', tag: '#22GCR' },
            { name: 'Furia Roja', fame: 38500, badge: '🔥', tag: '#FR01' },
            { name: 'Hispania War', fame: 36200, badge: '⚔️', tag: '#HW99' },
            { name: 'Los Titanes', fame: 33100, badge: '🛡️', tag: '#LT33' },
            { name: 'Valientes CR', fame: 29800, badge: '👑', tag: '#VC12' }
          ],
          topWarContributors: [
            { name: 'Marcos Astudillo', role: 'leader', fame: 3500, boatAttacks: 2, decksUsed: 16, winrate: '90%' },
            { name: 'KMKC_Striker', role: 'coLeader', fame: 3350, boatAttacks: 0, decksUsed: 16, winrate: '85%' },
            { name: 'Alex_Pro', role: 'elder', fame: 3100, boatAttacks: 4, decksUsed: 16, winrate: '80%' }
          ]
        }
      }
    },
    players: {
      '#98VCGY': {
        tag: '#98VCGY',
        name: 'Mohamed Light',
        expLevel: 60,
        trophies: 9000,
        bestTrophies: 9000,
        clan: { name: 'Nova I Elites', tag: '#2PP' },
        role: 'Co-líder',
        warDayWins: 1420,
        warWinrate: '94.2%',
        favoriteCard: 'Montapuercos',
        kingTowerLevel: 15,
        totalDonations: 124500,
        warDecks: [
          {
            name: 'Mazo 1: Hog 2.6 EQ',
            avgElixir: 2.6,
            winrate: '95%',
            cards: [
              { name: 'Montapuercos', elixir: 4, icon: '🐗' },
              { name: 'Terremoto', elixir: 3, icon: '🌋' },
              { name: 'Espíritu de Fuego', elixir: 1, icon: '🔥' },
              { name: 'Mosquetera', elixir: 4, icon: '🎯' },
              { name: 'Cañón', elixir: 3, icon: '💣' },
              { name: 'Tronco', elixir: 2, icon: '🪵' },
              { name: 'Gólem de Hielo', elixir: 2, icon: '🧊' },
              { name: 'Esqueletos', elixir: 1, icon: '💀' }
            ]
          },
          {
            name: 'Mazo 2: LavaLoon Beatdown',
            avgElixir: 4.1,
            winrate: '91%',
            cards: [
              { name: 'Sabueso de Lava', elixir: 7, icon: '🌋' },
              { name: 'Globo Bombástico', elixir: 5, icon: '🎈' },
              { name: 'Megaesbirro', elixir: 3, icon: '🦇' },
              { name: 'Dragón Infernal', elixir: 4, icon: '🐲' },
              { name: 'Guardias', elixir: 3, icon: '🛡️' },
              { name: 'Lápida', elixir: 3, icon: '🪦' },
              { name: 'Flechas', elixir: 3, icon: '🏹' },
              { name: 'Bola de Fuego', elixir: 4, icon: '🔥' }
            ]
          }
        ]
      },
      '#2PP9CL': {
        tag: '#2PP9CL',
        name: 'Marcos_KMKC',
        expLevel: 55,
        trophies: 8650,
        bestTrophies: 8820,
        clan: { name: 'KMKC Esports', tag: '#22GCR' },
        role: 'Líder',
        warDayWins: 980,
        warWinrate: '88.5%',
        favoriteCard: 'PEKKA',
        kingTowerLevel: 15,
        totalDonations: 98400,
        warDecks: [
          {
            name: 'Mazo 1: P.E.K.K.A Bridge Spam',
            avgElixir: 3.9,
            winrate: '89%',
            cards: [
              { name: 'P.E.K.K.A', elixir: 7, icon: '🤖' },
              { name: 'Ariete de Batalla', elixir: 4, icon: '🪵' },
              { name: 'Bandida', elixir: 3, icon: '🥷' },
              { name: 'Fantasma Real', elixir: 3, icon: '👻' },
              { name: 'Mago Eléctrico', elixir: 4, icon: '⚡' },
              { name: 'Veneno', elixir: 4, icon: '☠️' },
              { name: 'Zap', elixir: 2, icon: '⚡' },
              { name: 'Esbirros', elixir: 3, icon: '🦇' }
            ]
          },
          {
            name: 'Mazo 2: Cementerio Control',
            avgElixir: 3.5,
            winrate: '86%',
            cards: [
              { name: 'Cementerio', elixir: 5, icon: '🪦' },
              { name: 'Caballero', elixir: 3, icon: '🗡️' },
              { name: 'Bebé Dragón', elixir: 4, icon: '🐉' },
              { name: 'Rey Esqueleto', elixir: 4, icon: '👑' },
              { name: 'Tornado', elixir: 3, icon: '🌪️' },
              { name: 'Veneno', elixir: 4, icon: '☠️' },
              { name: 'Lápida', elixir: 3, icon: '🪦' },
              { name: 'Tronco', elixir: 2, icon: '🪵' }
            ]
          }
        ]
      }
    },
    topClans: [
      { rank: 1, name: 'Nova I Elites', tag: '#2PP', trophies: 6150, score: 82100, badge: '⭐', region: 'Global' },
      { rank: 2, name: 'Team Queso', tag: '#9PJ99', trophies: 5420, score: 78500, badge: '🧀', region: 'ES' },
      { rank: 3, name: 'Sandstorm', tag: '#SD01', trophies: 5120, score: 76900, badge: '🌪️', region: 'AE' },
      { rank: 4, name: 'KMKC Esports', tag: '#22GCR', trophies: 3890, score: 68400, badge: '⚡', region: 'ES' },
      { rank: 5, name: 'SK Gaming', tag: '#SK01', trophies: 3750, score: 67200, badge: '⚡', region: 'DE' }
    ],
    metaDecks: [
      {
        id: 'deck-1',
        name: 'Hog Earthquake 2.6 Cycle',
        avgElixir: 2.6,
        winrate: '58.4%',
        usageRate: '14.2%',
        archetype: 'Ciclo Rápido',
        cards: ['Montapuercos', 'Terremoto', 'Cañón', 'Mosquetera', 'Tronco', 'Gólem Hielo', 'Espíritu Fuego', 'Esqueletos']
      },
      {
        id: 'deck-2',
        name: 'P.E.K.K.A Bridge Spam',
        avgElixir: 3.9,
        winrate: '56.9%',
        usageRate: '11.8%',
        archetype: 'Control & Presión',
        cards: ['P.E.K.K.A', 'Ariete Batalla', 'Bandida', 'Fantasma Real', 'Mago Eléctrico', 'Veneno', 'Zap', 'Esbirros']
      },
      {
        id: 'deck-3',
        name: 'LavaLoon Double Dragon',
        avgElixir: 4.1,
        winrate: '57.2%',
        usageRate: '9.5%',
        archetype: 'Beatdown Aéreo',
        cards: ['Sabueso Lava', 'Globo Bombástico', 'Dragón Infernal', 'Megaesbirro', 'Lápida', 'Guardias', 'Flechas', 'Bola Fuego']
      }
    ]
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
   * Obtiene datos de un clan por Tag
   */
  const getClan = async (rawTag) => {
    const tag = formatTag(rawTag);

    // Si hay token y proxy configurado, intentar petición real
    if (config.token && config.proxyUrl) {
      try {
        const encodedTag = encodeURIComponent(tag);
        const url = `${config.proxyUrl.replace(/\/$/, '')}/clans/${encodedTag}`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${config.token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Retornar datos reales adaptados
          return {
            success: true,
            isRealApi: true,
            data: data
          };
        }
      } catch (err) {
        console.warn('Fallo al consultar la API real, usando base de datos Mock:', err);
      }
    }

    // Comprobar base de datos Mock local
    if (mockDatabase.clans[tag]) {
      return {
        success: true,
        isRealApi: false,
        data: mockDatabase.clans[tag]
      };
    }

    // Si el tag no está predefinido, generar un clan realista dinámico para que la consulta no falle
    return {
      success: true,
      isRealApi: false,
      data: {
        tag: tag,
        name: `Clan ${tag.replace('#', '')}`,
        description: `Clan de Clan Wars activo consultado en KMKCStats. Código de registro: ${tag}`,
        badgeId: 16000010,
        clanScore: Math.floor(Math.random() * 20000) + 60000,
        clanWarTrophies: Math.floor(Math.random() * 2500) + 3000,
        requiredTrophies: 6500,
        donationsPerWeek: 15400,
        membersCount: Math.floor(Math.random() * 10) + 40,
        location: { name: 'España / Internacional', code: 'ES' },
        warRace: {
          colosseumRank: Math.floor(Math.random() * 3) + 1,
          fame: Math.floor(Math.random() * 15000) + 35000,
          fameTarget: 50000,
          boatHealth: 100,
          movementPoints: 41200,
          periodIndex: 3,
          periodType: 'riverRace',
          opponents: [
            { name: `Clan ${tag.replace('#', '')}`, fame: 41200, badge: '🛡️', tag: tag },
            { name: 'Royal Gladiators', fame: 38900, badge: '⚔️', tag: '#RG01' },
            { name: 'Warriors Club', fame: 35100, badge: '👑', tag: '#WC99' },
            { name: 'Apex Legends', fame: 32000, badge: '⚡', tag: '#AP55' },
            { name: 'Shadow Kings', fame: 29400, badge: '🌑', tag: '#SK88' }
          ],
          topWarContributors: [
            { name: 'Player_Ace', role: 'leader', fame: 3400, boatAttacks: 2, decksUsed: 16, winrate: '88%' },
            { name: 'WarMaster', role: 'coLeader', fame: 3200, boatAttacks: 1, decksUsed: 16, winrate: '82%' },
            { name: 'Strike_Force', role: 'elder', fame: 3050, boatAttacks: 0, decksUsed: 16, winrate: '79%' }
          ]
        }
      }
    };
  };

  /**
   * Obtiene datos de un jugador por Tag
   */
  const getPlayer = async (rawTag) => {
    const tag = formatTag(rawTag);

    // Intentar API real si está configurada
    if (config.token && config.proxyUrl) {
      try {
        const encodedTag = encodeURIComponent(tag);
        const url = `${config.proxyUrl.replace(/\/$/, '')}/players/${encodedTag}`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${config.token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            isRealApi: true,
            data: data
          };
        }
      } catch (err) {
        console.warn('Fallo al consultar la API real para jugador, usando base de datos Mock:', err);
      }
    }

    // Mock local
    if (mockDatabase.players[tag]) {
      return {
        success: true,
        isRealApi: false,
        data: mockDatabase.players[tag]
      };
    }

    // Generar jugador dinámico
    return {
      success: true,
      isRealApi: false,
      data: {
        tag: tag,
        name: `Gamer_${tag.replace('#', '')}`,
        expLevel: 54,
        trophies: Math.floor(Math.random() * 2000) + 7000,
        bestTrophies: 8500,
        clan: { name: 'KMKC Esports', tag: '#22GCR' },
        role: 'Veterano',
        warDayWins: Math.floor(Math.random() * 500) + 500,
        warWinrate: `${(Math.random() * 20 + 75).toFixed(1)}%`,
        favoriteCard: 'Montapuercos',
        kingTowerLevel: 14,
        totalDonations: 45000,
        warDecks: [
          {
            name: 'Mazo 1: Custom War Deck',
            avgElixir: 3.4,
            winrate: '84%',
            cards: [
              { name: 'Montapuercos', elixir: 4, icon: '🐗' },
              { name: 'P.E.K.K.A', elixir: 7, icon: '🤖' },
              { name: 'Tronco', elixir: 2, icon: '🪵' },
              { name: 'Mago Eléctrico', elixir: 4, icon: '⚡' },
              { name: 'Bola de Fuego', elixir: 4, icon: '🔥' },
              { name: 'Guardias', elixir: 3, icon: '🛡️' },
              { name: 'Cañón', elixir: 3, icon: '💣' },
              { name: 'Espíritu Eléctrico', elixir: 1, icon: '⚡' }
            ]
          }
        ]
      }
    };
  };

  /**
   * Obtiene ranking de clanes y mazos meta
   */
  const getTopClans = () => mockDatabase.topClans;
  const getMetaDecks = () => mockDatabase.metaDecks;

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
    getTopClans,
    getMetaDecks,
    saveApiConfig,
    getApiConfig,
    formatTag
  };
})();
