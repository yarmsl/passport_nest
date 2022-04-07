import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class RecoveryPassDto implements Pick<IUser, 'email'> {
  @ApiProperty({
    example: 'vasya_vseh_porvu@mail.ru',
    description: 'Почтовый ящик',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некоректный email' })
  readonly email: string;
}

export class ChangePassDto implements Pick<IUser, 'password'> {
  @ApiProperty({
    example: 'Пароль',
    description: 'Пароль',
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 100, { message: 'Не менее 8 символов' })
  readonly password: string;
}
export class AuthUserDto
  extends RecoveryPassDto
  implements Pick<IUser, 'email' | 'password'>
{
  @ApiProperty({
    example: 'Пароль',
    description: 'Пароль',
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 100, { message: 'Не менее 8 символов' })
  readonly password: string;
}
