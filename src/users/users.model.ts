import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User, IUser> {
  @ApiProperty({
    example: 'Василий',
    description: 'Имя пользователя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @ApiProperty({
    example: 'Пупыркин',
    description: 'Фамилия пользователя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

  @ApiProperty({
    example: 'vasya_vseh_porvu@mail.ru',
    description: 'Почтовый ящик',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({
    example: 'vasya_nagibator@mail.ru',
    description: 'Старый почтовый ящик',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  old_email: string;

  @ApiProperty({
    example: 'vasya_1337@mail.ru',
    description: 'Новый почтовый ящик',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  new_email: string;

  @ApiProperty({
    example: '/avatar.jpg',
    description: 'Путь к фотке',
  })
  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  photo: string;

  @ApiProperty({
    example: 'Пароль',
    description: 'Пароль',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({
    example: '+79993322456',
    description: 'Номер телефона',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @ApiProperty({
    example: 'true',
    description: 'Подтверждён ли аккаунт',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  confirmed: boolean;
}
