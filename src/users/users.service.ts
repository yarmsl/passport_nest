import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare, hash } from 'bcryptjs';
import { AuthUserDto } from 'src/auth/dto/authUser.dto';
import { apiPostWithToken } from 'src/configuration/fetch.conf';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    return await this.userRepository.create(dto);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async hashPassword(pass: string) {
    return await hash(pass, 10);
  }

  async hashedPassDto(dto: CreateUserDto): Promise<CreateUserDto> {
    const hashedPass = await this.hashPassword(dto.password);
    return { ...dto, password: hashedPass };
  }

  async validateUser(dto: AuthUserDto) {
    const user = await this.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Некоректный email или пароль',
      });
    }
    const passEquals = await compare(dto.password, user.password);
    if (passEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некоректный email или пароль',
    });
  }

  async signupOnDataServer(access_token: string) {
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
