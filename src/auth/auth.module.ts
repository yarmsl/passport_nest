import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { ProviderModule } from 'src/provider/provider.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, ProviderModule, JwtModule.register({}), MailModule],
  exports: [AuthService],
})
export class AuthModule {}
