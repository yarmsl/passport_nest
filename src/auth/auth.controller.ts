import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/authUser.dto';
import { TokenRes } from './dto/tokenRes.credits';
import { ValidationPipe } from './validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 200, type: TokenRes })
  @UsePipes(ValidationPipe)
  @Post('email/signup')
  signup(@Body() signupDto: CreateUserDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({ status: 200, type: TokenRes })
  @UsePipes(ValidationPipe)
  @Post('email/signin')
  signin(@Body() signinDto: AuthUserDto) {
    return this.authService.signin(signinDto);
  }
}
