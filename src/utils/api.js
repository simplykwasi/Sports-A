// API utilities for fetching football data
export const api = {
  // Mock API functions - replace with real API calls later
  async getTodaysMatches() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const { mockMatches } = await import('./mockData.js');
    return mockMatches;
  },

  async getTopValueBets() {
    const { topValueBets } = await import('./mockData.js');
    return topValueBets;
  },

  async getMatchDetails(matchId) {
    const { mockMatches } = await import('./mockData.js');
    return mockMatches.find(match => match.id === matchId);
  }
};