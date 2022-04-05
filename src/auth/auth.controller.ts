import { Body, Controller, Get, Headers, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/authUser.dto';
import { AccessTokenRes, TokensRes } from './dto/tokenRes.credits';
import { ValidationPipe } from './validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 200, type: TokensRes })
  @UsePipes(ValidationPipe)
  @Post('email/signup')
  signup(@Body() signupDto: CreateUserDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({ status: 200, type: TokensRes })
  @UsePipes(ValidationPipe)
  @Post('email/signin')
  signin(@Body() signinDto: AuthUserDto) {
    return this.authService.signin(signinDto);
  }

  @ApiOperation({ summary: 'Проверка авторизации' })
  @ApiResponse({ status: 200, type: TokensRes })
  @UsePipes(ValidationPipe)
  @Get('check')
  check(@Headers('authorization') authHeader: string) {
    return this.authService.check(authHeader);
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({ status: 200, type: AccessTokenRes })
  @UsePipes(ValidationPipe)
  @Get('refresh')
  refresh(@Headers('authorization') authHeader: string) {
    return this.authService.refresh(authHeader);
  }
}
