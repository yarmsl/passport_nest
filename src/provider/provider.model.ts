import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'providers' })
export class Provider extends Model<Provider, IProvider> {
  @ApiProperty({
    example: '777',
    description: 'Id пользователя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_id: string;

  @ApiProperty({
    example: 'ext id',
    description: 'ext id',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ext_id: string;

  @ApiProperty({
    example: 'efd43fvdvf43',
    description: 'Токен',
  })
  @Column({
    type: DataType.STRING(2000),
    allowNull: false,
  })
  token: string;

  @ApiProperty({
    example: 'email',
    description: 'Тип акаунта',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  account_type: string;
}
