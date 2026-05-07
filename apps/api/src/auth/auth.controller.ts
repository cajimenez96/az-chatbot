import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import type { LoginDTO } from '@az-chatbot/types'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto)
  }
}
