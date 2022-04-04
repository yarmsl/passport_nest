import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProviderDto } from './dto/provider.dto';
import { Provider } from './provider.model';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(Provider) private providerRepository: typeof Provider,
  ) {}
  async createProvider(dto: ProviderDto) {
    return await this.providerRepository.create(dto);
  }
}
