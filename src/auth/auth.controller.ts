import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { TokenDecorator, UserDecorator } from './decorators';
import type { User } from './interfaces/user.interface';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    this.logger.log('Registering user', registerDto.email);
    return this.client.send({ cmd: 'register' }, registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    this.logger.log('Logging in user', loginDto.email);
    return this.client.send({ cmd: 'login' }, loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verify(@UserDecorator() user: User, @TokenDecorator() token: string) {
    this.logger.log('Verifying token', token, user);
    return this.client.send({ cmd: 'verify' }, { token });
  }
}
