import { EventEmitter } from 'stream';
import { decorate, inject, injectable } from 'inversify';

import { ValidateEnvironments } from './commons/helpers/ValidateEnvironments';
import { MonitoringLoggerService } from './infra/monitoring/logger/MonitoringLoggerService';
import { IpGeolocationConsumer } from './presentations/queue/kafka/consumers/IpGeolocationConsumer';

decorate(injectable(), EventEmitter);

@injectable()
export class Bootstrap {
  constructor(
    @inject(ValidateEnvironments)
    private readonly validateEnvironments: ValidateEnvironments,
    @inject(IpGeolocationConsumer)
    private readonly ipGeolocationConsumer: IpGeolocationConsumer,
    @inject(MonitoringLoggerService)
    private readonly monitoringLoggerService: MonitoringLoggerService,
  ) {}

  public async start(): Promise<void> {
    this.validateEnvironments.validate();

    await this.ipGeolocationConsumer.run();

    this.monitoringLoggerService.info({
      context: Bootstrap.name,
      value: `Hi! I'm Up`,
    });
  }
}
