// @ts-check

/**
 * @typedef {import('../../../core/entities/Mood.js').Mood} Mood
 * @typedef {import('../../../core/ports/StoragePort.js').StoragePort} StoragePort
 */

const STORAGE_KEY = 'moood_moods';

/**
 * @returns {StoragePort}
 */
export function createMoodsAdapter() {
  /**
   * @param {{ mood: Mood }} params
   * @returns {Promise<void>}
   */
  async function save({ mood }) {
    const moods = getAllMoods();
    moods.push(mood);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
  }

  /**
   * @param {{ id: string }} params
   * @returns {Promise<void>}
   */
  async function deleteById({ id }) {
    const moods = getAllMoods();
    const filtered = moods.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * @param {{ id: string, mood: Mood }} params
   * @returns {Promise<void>}
   */
  async function update({ id, mood }) {
    const moods = getAllMoods();
    const index = moods.findIndex(m => m.id === id);
    if (index !== -1) {
      moods[index] = mood;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
    }
  }

  /**
   * @returns {Promise<Mood[]>}
   */
  async function getAll() {
    return getAllMoods();
  }

  /**
   * @returns {Mood[]}
   */
  function getAllMoods() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const moods = JSON.parse(stored);
      return moods.map(mood => ({
        ...mood,
        datetime: new Date(mood.datetime)
      }));
    } catch {
      return [];
    }
  }

  return {
    save,
    delete: deleteById,
    update,
    getAll
  };
}
