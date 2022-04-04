import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const { access_token, refresh_token } = await this.generateTokens(user);
    await this.providerService.createProvider({
      user_id: user.id,
      ext_id: user.id,
      token: refresh_token,
      account_type: 'email',
    });
    await this.signupOnDataServer(access_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async signin(signinDto: AuthUserDto) {
    const user = await this.userService.validateUser(signinDto);
    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const { id, first_name, last_name, photo, email, phone } = user;
    const access_token = await this.jwtService.signAsync(
      { id, first_name, last_name, photo, email, phone, account_type: 'email' },
      {
        expiresIn: '1h',
        secret: process.env.JWT_ACCESS_SECRET,
      },
    );
    const refresh_token = await this.jwtService.signAsync(
      { access_token },
      {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );
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
}
