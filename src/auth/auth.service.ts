import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ProviderService } from 'src/provider/provider.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import {
  AuthUserDto,
  ChangePassDto,
  RecoveryPassDto,
} from './dto/authUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private providerService: ProviderService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(signupDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(signupDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userDto = await this.userService.hashedPassDto(signupDto);
    const user = await this.userService.createUser(userDto);
    const { access_token, refresh_token } = await this.generateTokens(
      user,
      'email',
    );
    await this.providerService.createProvider({
      user_id: user.id,
      ext_id: user.id,
      token: refresh_token,
      account_type: 'email',
    });
    // await this.userService.signupOnDataServer(access_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async signin(signinDto: AuthUserDto) {
    const user = await this.userService.validateUser(signinDto);
    return await this.generateTokens(user, 'email');
  }

  async check(authHeader: string) {
    try {
      const token = this.bearerToken(authHeader);
      const { access_token } = await this.validateToken(token, 'refresh');
      const email = this.getEmailFromAccessToken(access_token);
      const user = await this.userService.getUserByEmail(email);
      return await this.generateTokens(user, 'email');
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }

  async refresh(authHeader: string) {
    try {
      const token = this.bearerToken(authHeader);
      const email = this.getEmailFromAccessToken(token);
      const user = await this.userService.getUserByEmail(email);
      const access_token = await this.generateAccessToken(user, 'email');
      return { access_token };
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }

  async recoveryPass(recoveryPassDto: RecoveryPassDto) {
    const user = await this.userService.getUserByEmail(recoveryPassDto.email);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    const access_token = await this.generateAccessToken(user, 'email');
    try {
      await this.mailService.sendRecoveryPassMail(user, access_token);
      return { message: 'Проверьте вашу почту' };
    } catch (e) {
      throw new HttpException(
        'Ошибка отправки email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async redirectToPassChange(access_token: string) {
    try {
      const { email } = await this.validateToken(access_token, 'access');
      const user = await this.userService.getUserByEmail(email);
      const token = await this.generateAccessToken(user, 'email');
      return {
        url: `${process.env.FRONT_URI}/new_password/${token}`,
        statusCode: 302,
      };
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Время действия запроса истекло',
      });
    }
  }

  async changePassword(passDto: ChangePassDto, access_token: string) {
    try {
      const token = this.bearerToken(access_token);
      const { email } = await this.validateToken(token, 'access');
      const user = await this.userService.getUserByEmail(email);
      user.password = await this.userService.hashPassword(passDto.password);
      await user.save();
      return await this.generateTokens(user, 'email');
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Время действия запроса истекло',
      });
    }
  }

  async generateTokens(user: User, account_type: string) {
    const access_token = await this.generateAccessToken(user, account_type);
    const refresh_token = await this.generateRefreshToken(access_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async generateAccessToken(user: User, account_type: string) {
    try {
      const { id, first_name, last_name, photo, email, phone } = user;
      return await this.jwtService.signAsync(
        {
          id,
          first_name,
          last_name,
          photo,
          email,
          phone,
          account_type,
        },
        {
          expiresIn: '1h',
          secret: process.env.JWT_ACCESS_SECRET,
        },
      );
    } catch (e) {
      throw new HttpException(
        'Ошибка генерации токена доступа',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async generateRefreshToken(access_token: string) {
    try {
      return await this.jwtService.signAsync(
        { access_token },
        {
          expiresIn: '30d',
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
    } catch (e) {
      throw new HttpException(
        'Ошибка генерации токена обновления',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async validateToken(token: string, tokenType: tokenType) {
    try {
      const verified = await this.jwtService.verifyAsync(token, {
        secret:
          tokenType === 'access'
            ? process.env.JWT_ACCESS_SECRET
            : process.env.JWT_REFRESH_SECRET,
      });
      return verified;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }

  private bearerToken(authHeader: string): string {
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
    return token;
  }

  private getEmailFromAccessToken(access_token: string): string {
    const userData = this.jwtService.decode(access_token);
    if (typeof userData !== 'string' && 'email' in userData) {
      return userData.email;
    } else {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }
}
