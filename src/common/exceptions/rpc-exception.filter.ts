import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('RpcExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(`RAW RPC Exception: ${JSON.stringify(exception)}`);
    let status =
      typeof exception.status === 'number'
        ? exception.status
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      exception.response?.message ||
      exception.message ||
      'Internal server error';
    let service = exception.response?.service || 'gateway';

    const response = {
      status,
      message,
      service,
    };

    const ctx = host.switchToHttp();
    const responseHttp = ctx.getResponse<Response>();
    this.logger.error(`RPC Exception: ${JSON.stringify(response)}`);
    responseHttp.status(status).json(response);
  }
}
