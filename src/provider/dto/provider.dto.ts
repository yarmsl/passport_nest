import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProviderDto implements IProvider {
  @ApiProperty({
    example: '777',
    description: 'Id пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly user_id: string;

  @ApiProperty({
    example: 'ext id',
    description: 'ext id',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly ext_id: string;

  @ApiProperty({
    example: 'efd43fvdvf43',
    description: 'Токен',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly token: string;

  @ApiProperty({
    example: 'email',
    description: 'Тип акаунта',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly account_type: string;
}
