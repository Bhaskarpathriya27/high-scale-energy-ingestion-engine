import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('performance/:vehicleId')
  async getVehiclePerformance(@Param('vehicleId') vehicleId: string) {
    const meterId = `MTR-${vehicleId.split('-')[1]}`;

    return this.analyticsService.getVehiclePerformance(vehicleId, meterId);
  }
}
