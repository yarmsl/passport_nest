import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Redirect,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import {
  AuthUserDto,
  ChangePassDto,
  RecoveryPassDto,
} from './dto/authUser.dto';
import { responseMessage } from './dto/responseMessage.credits';
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

  @ApiOperation({ summary: 'Запрос на восстановление пароля' })
  @ApiResponse({ status: 202, type: responseMessage })
  @UsePipes(ValidationPipe)
  @Post('recovery')
  @HttpCode(202)
  recovery(@Body() recoveryPassDto: RecoveryPassDto) {
    return this.authService.recoveryPass(recoveryPassDto);
  }

  @ApiOperation({
    summary: 'Запрос на перенаправление на страницу смены пароля',
  })
  @ApiResponse({ status: 302 })
  @UsePipes(ValidationPipe)
  @Get('recovery/:access_token')
  @Redirect(`${process.env.FRONT_URI}`, 302)
  redirectToPassChange(@Param() params: AccessTokenRes) {
    return this.authService.redirectToPassChange(params.access_token);
  }

  @ApiOperation({ summary: 'Смена пароля' })
  @ApiResponse({ status: 200, type: TokensRes })
  @UsePipes(ValidationPipe)
  @Post('change/password')
  changePassword(
    @Headers('authorization') access_token: string,
    @Body() passwordDto: ChangePassDto,
  ) {
    return this.authService.changePassword(passwordDto, access_token);
  }
}
