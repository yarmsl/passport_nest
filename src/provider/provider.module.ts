import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Provider } from './provider.model';
import { ProviderService } from './provider.service';

@Module({
  providers: [ProviderService],
  imports: [SequelizeModule.forFeature([Provider])],
  exports: [ProviderService],
})
export class ProviderModule {}
