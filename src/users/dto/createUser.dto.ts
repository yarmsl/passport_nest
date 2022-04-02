import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto implements IUser {
  @ApiProperty({
    example: 'Василий',
    description: 'Имя пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly first_name: string;

  @ApiProperty({
    example: 'Пупыркин',
    description: 'Фамилия пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly last_name: string;

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

  @ApiProperty({
    example: '+79993322456',
    description: 'Номер телефона',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly phone: string;
}
