import EventEmitter from 'events';
import { inject } from 'inversify';
import { Consumer } from 'kafkajs';

import { KafkaQueue } from '../KafkaQueue';
import { ConsumerHelper } from './helper/ConsumerHelper';
import { GeoApplication } from 'src/app/geo/GeoApplication';
import { GetGeolocationByIpProps } from 'src/commons/interfaces/GetGeolocationByIpProps';
import { MonitoringLoggerService } from 'src/infra/monitoring/logger/MonitoringLoggerService';

export class IpGeolocationConsumer extends EventEmitter {
  private consumer: Consumer;
  private topic = process.env.KAFKA_TOPIC_IP_GEOLOCATION;

  constructor(
    @inject(KafkaQueue)
    private readonly kafkaQueue: KafkaQueue,
    @inject(ConsumerHelper)
    private readonly consumerHelper: ConsumerHelper,
    @inject(GeoApplication)
    private readonly geoApplication: GeoApplication,
    @inject(MonitoringLoggerService)
    private readonly monitoringLoggerService: MonitoringLoggerService,
  ) {
    super();

    this.consumer = this.kafkaQueue.client.consumer({
      groupId: process.env.KAFKA_IP_GEOLOCATION_CONSUMER_GROUP_ID,
    });
  }

  public async run() {
    await this.consumer.connect();

    await this.consumer.subscribe({
      topic: this.topic,
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const getGeolocationByIpProps =
            this.consumerHelper.parseMessageNotification<GetGeolocationByIpProps>(
              message,
            );

          this.monitoringLoggerService.info({
            context: `RECEIVED MESSAGE ON ${IpGeolocationConsumer.name}`,
            value: JSON.stringify(getGeolocationByIpProps),
          });

          const getGeolocationByIpResponse =
            await this.geoApplication.getGeolocationByIp(
              getGeolocationByIpProps,
            );

          this.monitoringLoggerService.info({
            context: 'Call to #getGeolocationByIp',
            value: JSON.stringify(getGeolocationByIpResponse),
          });

          getGeolocationByIpResponse.hasError
            ? this.emit(
                `ERROR:${getGeolocationByIpResponse.clientIpCacheKey}`,
                getGeolocationByIpResponse.errorMessage,
              )
            : this.emit(
                `SUCCESS:${getGeolocationByIpResponse.clientIpCacheKey}`,
                {
                  ...getGeolocationByIpProps,
                  ...getGeolocationByIpResponse.geolocation,
                },
              );
        } catch (error) {
          this.monitoringLoggerService.error({
            error,
            context: IpGeolocationConsumer.name,
          });
          this.emit('ERROR', error);
        }
      },
    });
  }

  public async disconnect() {
    await this.consumer.disconnect();
  }
}
