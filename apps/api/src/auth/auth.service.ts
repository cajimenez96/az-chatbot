import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import type { LoginDTO, AuthResponse } from '@az-chatbot/types'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const email = this.config.get('ADMIN_EMAIL')
    const hash = this.config.get('ADMIN_PASSWORD')

    if (dto.email !== email) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    // In production, store a bcrypt hash in env. For MVP, plain comparison.
    const valid = dto.password === hash || (await bcrypt.compare(dto.password, hash ?? ''))
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const payload = { sub: 'admin', email }
    const accessToken = this.jwtService.sign(payload)

    return { accessToken, expiresIn: 60 * 60 * 24 * 7 }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token)
    } catch {
      throw new UnauthorizedException('Token inválido')
    }
  }
}
