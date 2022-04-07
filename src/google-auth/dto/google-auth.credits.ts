import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthCredits {
  @ApiProperty({
    example: 'vasya_vseh_porvu@gmail.com',
    description: 'Почтовый ящик',
  })
  readonly email: string;

  @ApiProperty({
    example: 'Василий',
    description: 'Имя пользователя',
  })
  readonly firstName: string;

  @ApiProperty({
    example: 'Пупыркин',
    description: 'Фамилия пользователя',
  })
  readonly lastName: string;

  @ApiProperty({
    example: 'https://lh3.googleusercontent.com/a-/...',
    description: 'Ссылка на гугл аву',
  })
  readonly picture: string;

  @ApiProperty({
    example: 'ya29.A0ARrdaM9Spyz2MtQZGtb_Yl...',
    description: 'Токен гугла',
  })
  readonly access_token: string;
}
