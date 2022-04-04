import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class AuthUserDto implements Pick<IUser, 'email' | 'password'> {
  @ApiProperty({
    example: 'vasya_vseh_porvu@mail.ru',
    description: 'Почтовый ящик',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некоректный email' })
  readonly email: string;

  @ApiProperty({
    example: 'Пароль',
    description: 'Пароль',
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 100, { message: 'Не менее 8 символов' })
  readonly password: string;
}
