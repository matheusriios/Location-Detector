import { injectable } from 'inversify';

@injectable()
export class ValidateEnvironments {
  private variablesEnv = [
    'NODE_PATH',
    'NODE_ENV',
    'KAFKA_BROKERS',
    'KAFKA_USERNAME',
    'KAFKA_PASSWORD',
  ];

  public validate() {
    this.variablesEnv.forEach((env) => {
      const isEnvDefined = env in process.env;
      if (!isEnvDefined) {
        throw new Error(`Env var ${env} IS NOT SET`);
      }
    });
  }
}
