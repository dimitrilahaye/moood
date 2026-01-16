// @ts-check

import { createMoodsAdapter } from '../../datasource/localstorage/moodsAdapter.js';
import { createMoodsUseCase } from '../../core/usecases/moodsUseCase.js';

/**
 * Compose toutes les dépendances de l'application
 * @returns {{ moodsUseCase: ReturnType<typeof createMoodsUseCase> }}
 */
export function compose() {
  const moodsAdapter = createMoodsAdapter();
  const moodsUseCase = createMoodsUseCase({ storagePort: moodsAdapter });

  return {
    moodsUseCase
  };
}
