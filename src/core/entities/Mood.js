// @ts-check

/**
 * @typedef {Object} Mood
 * @property {string} id - Identifiant unique du mood
 * @property {number} note - Note entre 1 et 5
 * @property {Date} datetime - Date et heure du mood
 */

/**
 * Crée un nouveau mood
 * @param {{ note: number, datetime: Date }} params
 * @returns {Mood}
 */
export function createMood({ note, datetime }) {
  if (note < 1 || note > 5) {
    throw new Error('La note doit être comprise entre 1 et 5');
  }

  return {
    id: `${datetime.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
    note,
    datetime: new Date(datetime.getTime())
  };
}
