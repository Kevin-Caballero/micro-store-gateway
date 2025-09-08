import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.client.send({ cmd: 'register' }, registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.client.send({ cmd: 'login' }, loginDto);
  }

  @Post('verify')
  verify(@Body('token') token: string) {
    return this.client.send({ cmd: 'verify' }, { token });
  }
}
