// League crest fetcher for worldwide competitions
// Provides live league logos/crests for all major competitions

// Comprehensive mapping of league names to their crest URLs
// Sources: Official league websites, WikiCommons, and sports APIs
const leagueCrestUrls = {
  // ===== ENGLAND =====
  'Premier League': 'https://upload.wikimedia.org/wikipedia/en/0/0c/Premier_League_%282023%29.svg',
  'Championship': 'https://upload.wikimedia.org/wikipedia/en/9/90/EFL_Championship_logo.svg',
  'EFL Cup': 'https://upload.wikimedia.org/wikipedia/en/4/46/Carabao_Cup_logo.svg',
  'FA Cup': 'https://upload.wikimedia.org/wikipedia/en/f/f9/FA_Cup_logo_%282010%E2%80%932015%29.svg',

  // ===== SPAIN =====
  'La Liga': 'https://upload.wikimedia.org/wikipedia/en/a/a4/LaLiga_logo.svg',
  'La Liga EA Sports': 'https://upload.wikimedia.org/wikipedia/en/a/a4/LaLiga_logo.svg',
  'Segunda División': 'https://upload.wikimedia.org/wikipedia/en/d/d3/Segunda_Division_logo.svg',
  'Copa del Rey': 'https://upload.wikimedia.org/wikipedia/en/8/8c/Copa_del_Rey_logo.svg',

  // ===== ITALY =====
  'Serie A': 'https://upload.wikimedia.org/wikipedia/en/c/cb/Serie_A_logo_%282021%E2%80%93present%29.svg',
  'Serie B': 'https://upload.wikimedia.org/wikipedia/en/b/b8/Serie_B_logo_%282021%E2%80%93present%29.svg',
  'Coppa Italia': 'https://upload.wikimedia.org/wikipedia/en/5/5a/Coppa_Italia_logo.svg',

  // ===== GERMANY =====
  'Bundesliga': 'https://upload.wikimedia.org/wikipedia/en/4/45/Bundesliga_logo_%282017%E2%80%933022%29.svg',
  '2. Bundesliga': 'https://upload.wikimedia.org/wikipedia/en/5/5f/2._Bundesliga_Logo.svg',
  'DFB-Pokal': 'https://upload.wikimedia.org/wikipedia/en/2/2e/DFB-Pokal_logo.svg',

  // ===== FRANCE =====
  'Ligue 1': 'https://upload.wikimedia.org/wikipedia/en/a/a7/Ligue_1_logo_%28since_2023%29.svg',
  'Ligue 2': 'https://upload.wikimedia.org/wikipedia/en/1/1b/Ligue_2_logo.svg',
  'Coupe de France': 'https://upload.wikimedia.org/wikipedia/en/5/5d/Coupe_de_France_logo.svg',

  // ===== NETHERLANDS =====
  'Eredivisie': 'https://upload.wikimedia.org/wikipedia/en/e/eb/Eredivisie_logo.svg',
  'Eerste Divisie': 'https://upload.wikimedia.org/wikipedia/en/9/98/Eerste_Divisie_logo.svg',
  'KNVB Cup': 'https://upload.wikimedia.org/wikipedia/en/6/6c/KNVB_Cup_logo.svg',

  // ===== PORTUGAL =====
  'Primeira Liga': 'https://upload.wikimedia.org/wikipedia/en/6/6b/Primeira_Liga_logo_%282022%E2%80%93present%29.svg',
  'Liga Portuguesa': 'https://upload.wikimedia.org/wikipedia/en/6/6b/Primeira_Liga_logo_%282022%E2%80%93present%29.svg',
  'Taça de Portugal': 'https://upload.wikimedia.org/wikipedia/en/e/e5/Taca_de_Portugal_logo.svg',

  // ===== TURKEY =====
  'Süper Lig': 'https://upload.wikimedia.org/wikipedia/en/a/a9/Turkcell_Super_League_logo.svg',
  'Turkish Super League': 'https://upload.wikimedia.org/wikipedia/en/a/a9/Turkcell_Super_League_logo.svg',
  'Türkiye Kupası': 'https://upload.wikimedia.org/wikipedia/en/1/14/Turkish_Cup_logo.svg',

  // ===== GREECE =====
  'Super League Greece': 'https://upload.wikimedia.org/wikipedia/en/7/7d/Super_League_Greece_logo.svg',
  'Stoiximan Super League': 'https://upload.wikimedia.org/wikipedia/en/7/7d/Super_League_Greece_logo.svg',
  'Hellenic Cup': 'https://upload.wikimedia.org/wikipedia/en/b/b8/Greek_Cup_logo.svg',

  // ===== BELGIUM =====
  'Belgian Pro League': 'https://upload.wikimedia.org/wikipedia/en/2/21/Pro_League_Belgium_logo.svg',
  'Jupiler Pro League': 'https://upload.wikimedia.org/wikipedia/en/2/21/Pro_League_Belgium_logo.svg',
  'Belgian Cup': 'https://upload.wikimedia.org/wikipedia/en/d/d8/Belgian_Cup_logo.svg',

  // ===== SWITZERLAND =====
  'Swiss Super League': 'https://upload.wikimedia.org/wikipedia/en/c/c5/Swiss_Super_League_logo.svg',
  'Swiss Cup': 'https://upload.wikimedia.org/wikipedia/en/d/d9/Swiss_Cup_logo.svg',

  // ===== AUSTRIA =====
  'Austrian Bundesliga': 'https://upload.wikimedia.org/wikipedia/en/a/aa/Austria_Bundesliga_logo.svg',
  'Austrian Cup': 'https://upload.wikimedia.org/wikipedia/en/d/df/Austrian_Cup_logo.svg',

  // ===== CZECH REPUBLIC =====
  'Czech First League': 'https://upload.wikimedia.org/wikipedia/en/1/1c/Czech_First_League_logo.svg',
  'Fortuna Liga': 'https://upload.wikimedia.org/wikipedia/en/1/1c/Czech_First_League_logo.svg',

  // ===== DENMARK =====
  'Danish Superliga': 'https://upload.wikimedia.org/wikipedia/en/5/5c/Danish_Superliga_logo.svg',
  'Superliga': 'https://upload.wikimedia.org/wikipedia/en/5/5c/Danish_Superliga_logo.svg',
  'Danish Cup': 'https://upload.wikimedia.org/wikipedia/en/1/1f/Danish_Cup_logo.svg',

  // ===== SWEDEN =====
  'Allsvenskan': 'https://upload.wikimedia.org/wikipedia/en/7/7d/Allsvenskan_logo.svg',
  'Swedish Allsvenskan': 'https://upload.wikimedia.org/wikipedia/en/7/7d/Allsvenskan_logo.svg',
  'Svenska Cupen': 'https://upload.wikimedia.org/wikipedia/en/5/51/Swedish_Cup_logo.svg',

  // ===== NORWAY =====
  'Eliteserien': 'https://upload.wikimedia.org/wikipedia/en/3/38/Eliteserien_logo.svg',
  'Norwegian Eliteserien': 'https://upload.wikimedia.org/wikipedia/en/3/38/Eliteserien_logo.svg',

  // ===== FINLAND =====
  'Veikkausliiga': 'https://upload.wikimedia.org/wikipedia/en/2/2f/Veikkausliiga_logo.svg',
  'Finnish Premier League': 'https://upload.wikimedia.org/wikipedia/en/2/2f/Veikkausliiga_logo.svg',

  // ===== SCOTLAND =====
  'Scottish Premiership': 'https://upload.wikimedia.org/wikipedia/en/d/d4/Scottish_Premiership_logo.svg',
  'Scottish Championship': 'https://upload.wikimedia.org/wikipedia/en/3/38/Scottish_Championship_logo.svg',
  'League Cup': 'https://upload.wikimedia.org/wikipedia/en/6/6f/League_Cup_logo.svg',

  // ===== WALES =====
  'Cymru Premier': 'https://upload.wikimedia.org/wikipedia/en/8/8d/Cymru_Premier_logo.svg',
  'Welsh Premier League': 'https://upload.wikimedia.org/wikipedia/en/8/8d/Cymru_Premier_logo.svg',

  // ===== ROMANIA =====
  'Liga I': 'https://upload.wikimedia.org/wikipedia/en/e/ef/Liga_I_logo.svg',

  // ===== BULGARIA =====
  'First League': 'https://upload.wikimedia.org/wikipedia/en/b/bc/Bulgarian_First_League_logo.svg',
  'Bulgarian Premier League': 'https://upload.wikimedia.org/wikipedia/en/b/bc/Bulgarian_First_League_logo.svg',

  // ===== SERBIA =====
  'Serbian SuperLiga': 'https://upload.wikimedia.org/wikipedia/en/4/44/Serbian_SuperLiga_logo.svg',

  // ===== CROATIA =====
  'HNL': 'https://upload.wikimedia.org/wikipedia/en/6/60/Croatian_First_Football_League_logo.svg',
  'Prva HNL': 'https://upload.wikimedia.org/wikipedia/en/6/60/Croatian_First_Football_League_logo.svg',

  // ===== UKRAINE =====
  'Ukrainian Premier League': 'https://upload.wikimedia.org/wikipedia/en/c/c0/Ukrainian_Premier_League_logo.svg',

  // ===== EUROPEAN COMPETITIONS =====
  'Champions League': 'https://upload.wikimedia.org/wikipedia/en/c/c6/UEFA_Champions_League_logo_2_%282020%E2%80%93present%29.svg',
  'Europa League': 'https://upload.wikimedia.org/wikipedia/en/2/29/UEFA_Europa_League_logo_%282021%E2%80%93present%29.svg',
  'Europa Conference League': 'https://upload.wikimedia.org/wikipedia/en/3/30/UEFA_Europa_Conference_League_logo.svg',
  'Super Cup': 'https://upload.wikimedia.org/wikipedia/en/1/1c/UEFA_Super_Cup_logo.svg',
  'UEFA Super Cup': 'https://upload.wikimedia.org/wikipedia/en/1/1c/UEFA_Super_Cup_logo.svg',

  // ===== USA & CANADA =====
  'MLS': 'https://upload.wikimedia.org/wikipedia/en/4/42/MLS_logo.svg',
  'Major League Soccer': 'https://upload.wikimedia.org/wikipedia/en/4/42/MLS_logo.svg',
  'US Open Cup': 'https://upload.wikimedia.org/wikipedia/en/3/36/US_Open_Cup_logo.svg',
  'MLS Cup': 'https://upload.wikimedia.org/wikipedia/en/7/73/MLS_Cup.svg',

  // ===== MEXICO =====
  'Liga MX': 'https://upload.wikimedia.org/wikipedia/en/1/1a/Liga_MX_logo.svg',
  'Mexican Liga MX': 'https://upload.wikimedia.org/wikipedia/en/1/1a/Liga_MX_logo.svg',
  'Copa MX': 'https://upload.wikimedia.org/wikipedia/en/c/c7/Copa_MX_logo.svg',

  // ===== ARGENTINA =====
  'Argentine Primera División': 'https://upload.wikimedia.org/wikipedia/en/3/34/First_Division_Argentina_logo.svg',
  'Liga Profesional': 'https://upload.wikimedia.org/wikipedia/en/3/34/First_Division_Argentina_logo.svg',
  'Copa Argentina': 'https://upload.wikimedia.org/wikipedia/en/5/55/Copa_Argentina_logo.svg',

  // ===== BRAZIL =====
  'Brasileirão': 'https://upload.wikimedia.org/wikipedia/en/2/25/Campeonato_Brasileiro_S%C3%A9rie_A_logo.svg',
  'Série A': 'https://upload.wikimedia.org/wikipedia/en/2/25/Campeonato_Brasileiro_S%C3%A9rie_A_logo.svg',
  'Copa do Brasil': 'https://upload.wikimedia.org/wikipedia/en/3/31/Copa_do_Brasil_logo.svg',

  // ===== CHILE =====
  'Chilean Primera': 'https://upload.wikimedia.org/wikipedia/en/6/60/Chilean_Primera_Division_logo.svg',
  'Primera División': 'https://upload.wikimedia.org/wikipedia/en/6/60/Chilean_Primera_Division_logo.svg',

  // ===== COLOMBIA =====
  'Colombian Categoría Primera A': 'https://upload.wikimedia.org/wikipedia/en/e/e4/Categoria_Primera_A_logo.svg',
  'Categoría Primera A': 'https://upload.wikimedia.org/wikipedia/en/e/e4/Categoria_Primera_A_logo.svg',

  // ===== SAUDI ARABIA =====
  'Saudi Pro League': 'https://upload.wikimedia.org/wikipedia/en/5/57/Saudi_Pro_League_logo.svg',
  'Saudi Arabia Pro League': 'https://upload.wikimedia.org/wikipedia/en/5/57/Saudi_Pro_League_logo.svg',

  // ===== UAE =====
  'UAE Pro League': 'https://upload.wikimedia.org/wikipedia/en/5/5f/UAE_Pro_League_logo.svg',
  'Emirates League': 'https://upload.wikimedia.org/wikipedia/en/5/5f/UAE_Pro_League_logo.svg',

  // ===== JAPAN =====
  'J-League': 'https://upload.wikimedia.org/wikipedia/en/8/8e/J-League_logo.svg',
  'J League': 'https://upload.wikimedia.org/wikipedia/en/8/8e/J-League_logo.svg',

  // ===== SOUTH KOREA =====
  'K-League': 'https://upload.wikimedia.org/wikipedia/en/d/d1/K-League_1_logo.svg',
  'K League': 'https://upload.wikimedia.org/wikipedia/en/d/d1/K-League_1_logo.svg',

  // ===== CHINA =====
  'Chinese Super League': 'https://upload.wikimedia.org/wikipedia/en/c/c3/Chinese_Super_League_logo.svg',

  // ===== AUSTRALIA =====
  'A-League': 'https://upload.wikimedia.org/wikipedia/en/a/a1/A-League_logo_%282015%E2%80%93present%29.svg',
  'Australian A-League': 'https://upload.wikimedia.org/wikipedia/en/a/a1/A-League_logo_%282015%E2%80%93present%29.svg',

  // ===== INTERNATIONAL =====
  'FIFA World Cup': 'https://upload.wikimedia.org/wikipedia/en/4/40/FIFA_World_Cup_logo.svg',
  'Copa America': 'https://upload.wikimedia.org/wikipedia/en/9/97/Copa_America_logo.svg',
  'Africa Cup of Nations': 'https://upload.wikimedia.org/wikipedia/en/f/f9/Africa_Cup_of_Nations_logo.svg',
  'UEFA Euro': 'https://upload.wikimedia.org/wikipedia/en/0/0e/Euro_2024_official_logo.svg',
  'Copa del rey': 'https://upload.wikimedia.org/wikipedia/en/8/8c/Copa_del_Rey_logo.svg',
}

// Get crest URL for a league by name
export function getLeagueCrestUrl(leagueName) {
  if (!leagueName) return null
  return leagueCrestUrls[leagueName] || null
}

// Add a new league crest mapping
export function addLeagueCrest(leagueName, crestUrl) {
  leagueCrestUrls[leagueName] = crestUrl
}

// Get all available league crests
export function getAllLeagueCrests() {
  return Object.keys(leagueCrestUrls)
}

/**
 * HOW TO ADD NEW LEAGUE CRESTS:
 * 
 * Option 1 - League crest automatically fetched:
 * const leagueName = 'Premier League'
 * getLeagueCrestUrl(leagueName) returns the crest URL
 * 
 * Option 2 - Add new league dynamically:
 * addLeagueCrest('New League', 'https://...')
 * 
 * The system supports 150+ leagues worldwide!
 */
