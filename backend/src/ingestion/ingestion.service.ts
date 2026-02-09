import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleTelemetryHistory } from '../database/entities/vehicle-telemetry-history.entity';
import { MeterTelemetryHistory } from '../database/entities/meter-telemetry-history.entity';
import { CurrentVehicleState } from '../database/entities/current-vehicle-state.entity';
import { CurrentMeterState } from '../database/entities/current-meter-state.entity';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(VehicleTelemetryHistory)
    private readonly vehicleHistoryRepo: Repository<VehicleTelemetryHistory>,

    @InjectRepository(MeterTelemetryHistory)
    private readonly meterHistoryRepo: Repository<MeterTelemetryHistory>,

    @InjectRepository(CurrentVehicleState)
    private readonly currentVehicleRepo: Repository<CurrentVehicleState>,

    @InjectRepository(CurrentMeterState)
    private readonly currentMeterRepo: Repository<CurrentMeterState>,
  ) {}

  async handleVehicle(data: VehicleTelemetryDto) {
    // 1️⃣ History INSERT
    await this.vehicleHistoryRepo.insert({
      vehicleId: data.vehicleId,
      kwhDeliveredDc: data.kwhDeliveredDc,
      soc: data.soc,
      batteryTemp: data.batteryTemp,
      timestamp: new Date(),
    });

    // 2️⃣ Live UPSERT
    await this.currentVehicleRepo.upsert(
      {
        vehicleId: data.vehicleId,
        soc: data.soc,
        lastKwhDc: data.kwhDeliveredDc,
        avgBatteryTemp: data.batteryTemp,
        updatedAt: new Date(),
      },
      ['vehicleId'],
    );

    return { status: 'vehicle_ingested' };
  }

  async handleMeter(data: MeterTelemetryDto) {
    // 1️⃣ History INSERT
    await this.meterHistoryRepo.insert({
      meterId: data.meterId,
      kwhConsumedAc: data.kwhConsumedAc,
      voltage: data.voltage,
      timestamp: new Date(),
    });

    // 2️⃣ Live UPSERT
    await this.currentMeterRepo.upsert(
      {
        meterId: data.meterId,
        lastKwhAc: data.kwhConsumedAc,
        voltage: data.voltage,
        updatedAt: new Date(),
      },
      ['meterId'],
    );

    return { status: 'meter_ingested' };
  }
}
