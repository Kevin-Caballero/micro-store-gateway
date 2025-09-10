import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  private readonly logger = new Logger(AuthGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('AuthGuard: Checking access...');

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.warn('AuthGuard: No token found in request headers');
      throw new UnauthorizedException('No token found');
    }
    try {
      const { user, token: newToken } = await firstValueFrom(
        this.client.send({ cmd: 'verify' }, token),
      );

      request['user'] = user;
      request['token'] = newToken;
      this.logger.log('AuthGuard: Token extracted successfully');
      return true;
    } catch (error) {
      this.logger.warn('AuthGuard: Invalid token');
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
