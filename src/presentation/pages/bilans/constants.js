// @ts-check

export const BILANS_CONFIG = {
  moodOptions: [
    { value: 5, label: 'Génial', emotion: 'Joie, gratitude, énergie', emoji: '🟢', color: '#4ade80' },
    { value: 4, label: 'Bien', emotion: 'Calme, satisfaction, sérénité', emoji: '🟢', color: '#86efac' },
    { value: 3, label: 'Neutre', emotion: 'Fatigue légère, routine, "ça va"', emoji: '🟡', color: '#fde047' },
    { value: 2, label: 'Bof', emotion: 'Stress, tristesse, agacement', emoji: '🟠', color: '#fb923c' },
    { value: 1, label: 'Mauvais', emotion: 'Colère, déprime, épuisement', emoji: '🔴', color: '#f87171' }
  ]
};

export const BILANS_MESSAGES = {
  copySuccess: 'Bilan copié dans le presse-papier !',
  copyError: 'Erreur lors de la copie',
  noData: 'Aucune donnée disponible pour cette période'
};
