import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload) {    
    return await this.jwtService.signAsync(payload);
  }
}