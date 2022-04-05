import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { apiPostWithToken } from 'src/configuration/fetch.conf';
import { ProviderService } from 'src/provider/provider.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { AuthUserDto } from './dto/authUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private providerService: ProviderService,
    private jwtService: JwtService,
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
    // await this.signupOnDataServer(access_token);
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
      const { access_token } = await this.validateToken(authHeader, 'refresh');
      const userData = this.jwtService.decode(access_token);
      if (typeof userData !== 'string' && 'email' in userData) {
        const user = await this.userService.getUserByEmail(userData.email);
        return await this.generateTokens(user, 'email');
      } else {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }

  async refresh(authHeader: string) {
    try {
      const { email } = await this.validateToken(authHeader, 'access');
      const user = await this.userService.getUserByEmail(email);
      const access_token = await this.generateAccessToken(user, 'email');
      return { access_token };
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }

  private async generateAccessToken(user: User, account_type: string) {
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

  private async generateTokens(user: User, account_type: string) {
    const access_token = await this.generateAccessToken(user, account_type);
    const refresh_token = await this.generateRefreshToken(access_token);
    return {
      access_token,
      refresh_token,
    };
  }

  private async signupOnDataServer(access_token: string) {
    try {
      await apiPostWithToken(process.env.SIGNUP_LINK, {}, access_token);
    } catch (e) {
      throw new HttpException(
        'Ошибка регистрации пользователя на втором инстансе',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async validateToken(authHeader: string, tokenType: tokenType) {
    try {
      const token = this.bearerToken(authHeader);
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
}
