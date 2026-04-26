import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from '../settings.entity';
import { Repository } from 'typeorm';
import { SettingsDto } from '../dtos/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}
  async createSettings(settingsDto: SettingsDto): Promise<Settings> {
    const existing = await this.settingsRepository.findOne({ where: {} });
    if (existing)
      throw new BadRequestException(
        'Settings already exist — use updateSettings instead',
      );

    if (settingsDto.minBookingLength >= settingsDto.maxBookingLength)
      throw new BadRequestException(
        'minBookingLength must be less than maxBookingLength',
      );

    return await this.settingsRepository.save(settingsDto);
  }
  async getSettings(): Promise<Settings> {
    const settings = await this.settingsRepository.findOne({ where: {} });
    if (!settings) throw new NotFoundException('Settings not initialized');
    return settings;
  }

  async updateSettings(settingsDto: SettingsDto): Promise<Settings> {
    const settings = await this.getSettings();

    const newMin = settingsDto.minBookingLength ?? settings.minBookingLength;
    const newMax = settingsDto.maxBookingLength ?? settings.maxBookingLength;
    if (newMin >= newMax)
      throw new BadRequestException(
        'minBookingLength must be less than maxBookingLength',
      );

    await this.settingsRepository.update(settings.id, settingsDto);
    return (await this.settingsRepository.findOneBy({
      id: settings.id,
    })) as Settings;
  }
}
