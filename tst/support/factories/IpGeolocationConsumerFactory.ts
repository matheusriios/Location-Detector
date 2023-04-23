import { Factory } from './factory';
import { container } from 'src/container';
import { GeoApplication } from 'src/app/geo/GeoApplication';
import { KafkaQueue } from 'src/presentations/queue/kafka/KafkaQueue';
import { MonitoringLoggerService } from 'src/infra/monitoring/logger/MonitoringLoggerService';
import { ConsumerHelper } from 'src/presentations/queue/kafka/consumers/helper/ConsumerHelper';
import { IpGeolocationConsumer } from 'src/presentations/queue/kafka/consumers/IpGeolocationConsumer';

export class IpGeolocationConsumerFactory
  implements Factory<IpGeolocationConsumer>
{
  create(): IpGeolocationConsumer {
    const kafkaQueue = container.get(KafkaQueue);
    const geoApplication = container.get(GeoApplication);
    const monitoringLoggerService = container.get(MonitoringLoggerService);
    const consumerHelper = new ConsumerHelper();

    return new IpGeolocationConsumer(
      kafkaQueue,
      consumerHelper,
      geoApplication,
      monitoringLoggerService,
    );
  }
}
