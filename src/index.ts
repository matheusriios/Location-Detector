import 'reflect-metadata';

import { container } from 'src/container';
import { Bootstrap } from 'src/Bootstrap';

const application = container.get(Bootstrap);

application.start();
