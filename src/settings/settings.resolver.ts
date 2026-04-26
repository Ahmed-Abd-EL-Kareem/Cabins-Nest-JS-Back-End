import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SettingsService } from './provider/settings.service';
import { UseGuards } from '@nestjs/common';
import { Settings } from './settings.entity';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { SettingsDto } from './dtos/settings.dto';

@Resolver()
export class SettingsResolver {
  constructor(
    /**
     * Inject SettingsService
     */
    private readonly settingsService: SettingsService,
  ) {}

  @Query(() => Settings)
  async getSettings(): Promise<Settings> {
    return this.settingsService.getSettings();
  }

  // 🔒 admin only — initialize settings for the first time
  @Mutation(() => Settings)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createSettings(
    @Args('settingsInput') settingsDto: SettingsDto,
  ): Promise<Settings> {
    return this.settingsService.createSettings(settingsDto);
  }

  // 🔒 admin only — update existing settings
  @Mutation(() => Settings)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSettings(
    @Args('settingsInput') settingsDto: SettingsDto,
  ): Promise<Settings> {
    return this.settingsService.updateSettings(settingsDto);
  }
}
