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
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: TokenData & { tokenType?: string }) {
    // Verify this is actually a refresh token
    if (payload.tokenType !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
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
    try {
      // Intentar autenticar
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (err) {
      // Si falla la autenticación, permitir continuar sin usuario
      console.log('OptionalJwtAuthGuard: no auth (allowing anonymous access)');
      return true;
    }
  }

  handleRequest(err, user, info) {
    // No lanza error si el usuario no esta autenticado
    // Solo retorna el usuario (que sera null si no esta autenticado)
    return user || null;
  }
}