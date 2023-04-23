import { injectable } from 'inversify';
import winston, { Logform } from 'winston';

import { CreateLoggerInfo } from './interface/CreateLoggerInfo.interface';
import { CreateLoggerError } from './interface/CreateLoggerError.interface';

@injectable()
export class MonitoringLoggerService {
  public info(data: CreateLoggerInfo) {
    this.winstonInstance.log({
      level: 'info',
      message: data.value,
      ...data,
    });
  }

  public error(error: CreateLoggerError) {
    this.winstonInstance.error(error);
  }

  private format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.prettyPrint(),
    winston.format.splat(),
    winston.format.printf((info) => {
      const level = info.level.toUpperCase();
      const { context } = this.getPropsOfMessage(info);

      if (typeof info.message === 'object') {
        delete info.message.context;

        info.message = JSON.stringify(info.message, null, 3);
      }

      info.message = `${level}: ${context} | ${info.timestamp} ${info.level}: ${info.message}`;

      return info.message;
    }),
  );

  private getPropsOfMessage(info: Logform.TransformableInfo) {
    if (info.message.context) {
      return {
        context: info.message.context,
      };
    }

    return { context: info.context };
  }

  private transports = [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(winston.format.json()),
    }),
  ];

  private winstonInstance = winston.createLogger({
    format: this.format,
    levels: {
      error: 0,
      info: 1,
    },
    transports: this.transports,
  });
}
