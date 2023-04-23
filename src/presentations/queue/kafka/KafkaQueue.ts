import { injectable } from 'inversify';
import { Kafka, logLevel } from 'kafkajs';

@injectable()
export class KafkaQueue {
  public client: Kafka;

  constructor() {
    this.initializeKafka();
  }

  private initializeKafka() {
    this.client = new Kafka({
      brokers: [process.env.KAFKA_BROKERS],
      logLevel: logLevel.NOTHING,
    });
  }
}
