// @ts-check

import { compose } from './presentation/compose/compose.js';
import { createRouter } from './presentation/router.js';

const deps = compose();
createRouter({ deps });
