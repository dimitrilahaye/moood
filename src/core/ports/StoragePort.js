// @ts-check

/**
 * @interface
 * @typedef {Object} StoragePort
 * @property {function({ mood: Mood }): Promise<void>} save - Sauvegarde un mood
 * @property {function({ id: string }): Promise<void>} delete - Supprime un mood par son id
 * @property {function({ id: string, mood: Mood }): Promise<void>} update - Met à jour un mood
 * @property {function(): Promise<Mood[]>} getAll - Récupère tous les moods
 */
