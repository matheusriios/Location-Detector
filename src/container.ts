import { Container } from 'inversify';

import { Bootstrap } from 'src/Bootstrap';
import { GeoApplication } from './app/geo/GeoApplication';
import { HttpAdapter } from './infra/adapters/HttpAdapter';
import { KafkaQueue } from './presentations/queue/kafka/KafkaQueue';
import { IpStackService } from './infra/services/ipstack/IpStackService';
import { ValidateEnvironments } from './commons/helpers/ValidateEnvironments';
import { RedisRepository } from './infra/repositories/cache/redis/RedisRepository';
import { IpstackServiceMapper } from './infra/services/ipstack/IpstackServiceMapper';
import { MonitoringLoggerService } from './infra/monitoring/logger/MonitoringLoggerService';
import { ConsumerHelper } from './presentations/queue/kafka/consumers/helper/ConsumerHelper';
import { IpGeolocationConsumer } from './presentations/queue/kafka/consumers/IpGeolocationConsumer';

const container: Container = new Container();

container.bind(Container).toConstantValue(container);

//bootstrap
container.bind(Bootstrap).toSelf();

//commons
container.bind(ValidateEnvironments).toSelf();

//app
container.bind(GeoApplication).toSelf();

//infra
container.bind(HttpAdapter).toSelf();
container.bind(IpStackService).toSelf();
container.bind(RedisRepository).toSelf();
container.bind(IpstackServiceMapper).toSelf();
container.bind(MonitoringLoggerService).toSelf();

//presentations
container.bind(ConsumerHelper).toSelf();
container.bind(IpGeolocationConsumer).toSelf();
container.bind(KafkaQueue).to(KafkaQueue).inSingletonScope();

export { container };
