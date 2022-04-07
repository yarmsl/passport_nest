import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRecoveryPassMail(user: User, access_token: string) {
    const { first_name, last_name, email } = user;
    await this.mailerService.sendMail({
      to: email,
      subject:
        'Cброс пароля для личного кабинета пользователя сервиса seed-x-ceed',
      template: '/recovery',
      context: {
        first_name,
        last_name,
        host: 'http://localhost:5000',
        token: access_token,
        prodUrl: process.env.PROD_URI,
      },
    });
  }
}
