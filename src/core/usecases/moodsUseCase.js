// @ts-check

/**
 * @typedef {import('../entities/Mood.js').Mood} Mood
 * @typedef {import('../ports/StoragePort.js').StoragePort} StoragePort
 */

/**
 * @param {{ storagePort: StoragePort }} params
 * @returns {{
 *   create: (params: { note: number, datetime: Date }) => Promise<Mood>,
 *   delete: (params: { id: string }) => Promise<void>,
 *   update: (params: { id: string, note: number, datetime: Date }) => Promise<Mood>,
 *   getAll: () => Promise<Mood[]>,
 *   getByDate: (params: { date: Date }) => Promise<Mood[]>,
 *   getByWeek: (params: { weekStart: Date }) => Promise<Mood[]>,
 *   getByMonth: (params: { monthStart: Date }) => Promise<Mood[]>
 * }}
 */
export function createMoodsUseCase({ storagePort }) {
  return {
    /**
     * Crée un nouveau mood
     * @param {{ note: number, datetime: Date }} params
     * @returns {Promise<Mood>}
     */
    async create({ note, datetime }) {
      // @ts-ignore
      const { createMood } = await import('../entities/Mood.js');
      const mood = createMood({ note, datetime });
      await storagePort.save({ mood });
      return mood;
    },

    /**
     * Supprime un mood
     * @param {{ id: string }} params
     * @returns {Promise<void>}
     */
    async delete({ id }) {
      await storagePort.delete({ id });
    },

    /**
     * Met à jour un mood
     * @param {{ id: string, note: number, datetime: Date }} params
     * @returns {Promise<Mood>}
     */
    async update({ id, note, datetime }) {
      // @ts-ignore
      const { createMood } = await import('../entities/Mood.js');
      const mood = createMood({ note, datetime });
      const updatedMood = { ...mood, id };
      await storagePort.update({ id, mood: updatedMood });
      return updatedMood;
    },

    /**
     * Récupère tous les moods
     * @returns {Promise<Mood[]>}
     */
    async getAll() {
      return await storagePort.getAll();
    },

    /**
     * Récupère les moods d'une date donnée
     * @param {{ date: Date }} params
     * @returns {Promise<Mood[]>}
     */
    async getByDate({ date }) {
      const allMoods = await storagePort.getAll();
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      return allMoods.filter(mood => {
        const moodDate = new Date(mood.datetime);
        return moodDate >= targetDate && moodDate < nextDay;
      });
    },

    /**
     * Récupère les moods d'une semaine (du lundi au dimanche)
     * @param {{ weekStart: Date }} params
     * @returns {Promise<Mood[]>}
     */
    async getByWeek({ weekStart }) {
      const allMoods = await storagePort.getAll();
      const start = new Date(weekStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);

      return allMoods.filter(mood => {
        const moodDate = new Date(mood.datetime);
        return moodDate >= start && moodDate < end;
      });
    },

    /**
     * Récupère les moods d'un mois
     * @param {{ monthStart: Date }} params
     * @returns {Promise<Mood[]>}
     */
    async getByMonth({ monthStart }) {
      const allMoods = await storagePort.getAll();
      const start = new Date(monthStart);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      return allMoods.filter(mood => {
        const moodDate = new Date(mood.datetime);
        return moodDate >= start && moodDate < end;
      });
    }
  };
}
