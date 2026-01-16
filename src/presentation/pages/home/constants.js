// @ts-check

export const HOME_CONFIG = {
  moodOptions: [
    { value: 5, label: 'Génial', emotion: 'Joie, gratitude, énergie', emoji: '🟢', color: '#4ade80' },
    { value: 4, label: 'Bien', emotion: 'Calme, satisfaction, sérénité', emoji: '🟢', color: '#86efac' },
    { value: 3, label: 'Neutre', emotion: 'Fatigue légère, routine, "ça va"', emoji: '🟡', color: '#fde047' },
    { value: 2, label: 'Bof', emotion: 'Stress, tristesse, agacement', emoji: '🟠', color: '#fb923c' },
    { value: 1, label: 'Mauvais', emotion: 'Colère, déprime, épuisement', emoji: '🔴', color: '#f87171' }
  ]
};

export const HOME_MESSAGES = {
  success: 'Mood enregistré avec succès !',
  error: 'Erreur lors de l\'enregistrement du mood'
};
