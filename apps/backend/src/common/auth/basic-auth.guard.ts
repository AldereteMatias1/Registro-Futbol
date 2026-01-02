import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method?.toUpperCase();

    if (!method || !WRITE_METHODS.has(method)) {
      return true;
    }

    const header = request.headers['authorization'];
    if (!header || !header.startsWith('Basic ')) {
      throw new UnauthorizedException('Credenciales requeridas');
    }

    const encoded = header.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const [user, pass] = decoded.split(':');

    const expectedUser = this.configService.get<string>('ADMIN_USER');
    const expectedPass = this.configService.get<string>('ADMIN_PASS');

    if (!expectedUser || !expectedPass || user !== expectedUser || pass !== expectedPass) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return true;
  }
}
