import { injectable } from 'inversify';
import { KafkaMessage } from 'kafkajs';

@injectable()
export class ConsumerHelper {
  public parseMessageNotification<T>(message: KafkaMessage): T {
    return JSON.parse(message.value.toString());
  }
}
