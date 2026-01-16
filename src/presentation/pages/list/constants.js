// @ts-check

export const LIST_CONFIG = {
  moodOptions: [
    { value: 5, label: 'Génial', emotion: 'Joie, gratitude, énergie', emoji: '🟢', color: '#4ade80' },
    { value: 4, label: 'Bien', emotion: 'Calme, satisfaction, sérénité', emoji: '🟢', color: '#86efac' },
    { value: 3, label: 'Neutre', emotion: 'Fatigue légère, routine, "ça va"', emoji: '🟡', color: '#fde047' },
    { value: 2, label: 'Bof', emotion: 'Stress, tristesse, agacement', emoji: '🟠', color: '#fb923c' },
    { value: 1, label: 'Mauvais', emotion: 'Colère, déprime, épuisement', emoji: '🔴', color: '#f87171' }
  ]
};

export const LIST_MESSAGES = {
  noMoods: 'Aucun mood enregistré',
  deleteSuccess: 'Mood supprimé avec succès',
  updateSuccess: 'Mood mis à jour avec succès',
  deleteError: 'Erreur lors de la suppression',
  updateError: 'Erreur lors de la mise à jour'
};
