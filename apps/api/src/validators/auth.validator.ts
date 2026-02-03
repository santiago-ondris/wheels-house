import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenData } from 'src/dto/user.dto';

// Validates token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // This extracts the token from the "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // After the token is validated, this method is called
  async validate(payload: TokenData) {
    if (!payload.userId) {
      throw new UnauthorizedException('Invalid token payload: missing userId');
    }
    // Whatever you return here becomes available in req.user
    return payload;
  }
}

// Decorator for controllers, overrides handleRequest method to ensure that an
// unauthorized exception is thrown when receiving an invalid token.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      // Forcefully throw a standard UnauthorizedException 
      // from the current project's scope.
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

// Strategy for validating refresh tokens
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
    });
  }

  async validate(payload: TokenData & { tokenType?: string }) {
    // Verify this is actually a refresh token
    if (payload.tokenType !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    if (!payload.userId) {
      throw new UnauthorizedException('Invalid token payload: missing userId');
    }
    return payload;
  }
}

// Guard para el endpoint de refresh token
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired refresh token');
    }
    return user;
  }
}

// Permite que la peticion sea anonima
// Si el token es valido, req.user sera poblado; de lo contrario req.user sera undefined
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    // Si no hay token en el header, permitir acceso anónimo directo
    if (!token) {
      return true;
    }

    // Si hay token, dejar que Passport lo valide
    // Si es inválido/expirado, lanzará excepción (401), lo cual es correcto
    // para que el frontend sepa que tiene que refrescar
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info) {
    // Si hay error (token inválido/expirado) y llegamos acá, NO lanzamos excepción
    // Simplemente retornamos null para tratarla como request anónima
    if (err || !user) {
      return null;
    }
    return user;
  }
}