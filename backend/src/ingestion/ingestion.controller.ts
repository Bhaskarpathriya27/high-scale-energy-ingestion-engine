import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';

@Controller('v1/ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  ingest(@Body() payload: any) {
    if (payload.meterId) {
      return this.ingestionService.handleMeter(payload as MeterTelemetryDto);
    }

    if (payload.vehicleId) {
      return this.ingestionService.handleVehicle(payload as VehicleTelemetryDto);
    }

    return { message: 'Invalid telemetry payload' };
  }
}
