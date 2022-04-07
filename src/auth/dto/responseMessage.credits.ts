import { ApiProperty } from '@nestjs/swagger';

export class responseMessage {
  @ApiProperty({
    example: 'Сообщение',
    description: 'Информация о статусе, успехе или провале запроса',
  })
  refresh_token: string;
}
