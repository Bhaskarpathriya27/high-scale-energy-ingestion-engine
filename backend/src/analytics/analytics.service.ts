/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleTelemetryHistory } from '../database/entities/vehicle-telemetry-history.entity';
import { MeterTelemetryHistory } from '../database/entities/meter-telemetry-history.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleTelemetryHistory)
    private readonly vehicleHistoryRepo: Repository<VehicleTelemetryHistory>,

    @InjectRepository(MeterTelemetryHistory)
    private readonly meterHistoryRepo: Repository<MeterTelemetryHistory>,
  ) {}

  async getVehiclePerformance(vehicleId: string, meterId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const vehicleAgg = await this.vehicleHistoryRepo
      .createQueryBuilder('v')
      .select('SUM(v.kwhDeliveredDc)', 'total_dc')
      .addSelect('AVG(v.batteryTemp)', 'avg_temp')
      .where('v.vehicleId = :vehicleId', { vehicleId })
      .andWhere('v.timestamp >= :since', { since })
      .getRawOne<{
        total_dc: string | null;
        avg_temp: string | null;
      }>();

    const meterAgg = await this.meterHistoryRepo
      .createQueryBuilder('m')
      .select('SUM(m.kwhConsumedAc)', 'total_ac')
      .where('m.meterId = :meterId', { meterId })
      .andWhere('m.timestamp >= :since', { since })
      .getRawOne<{
        total_ac: string | null;
      }>();

    const totalDc = vehicleAgg?.total_dc ? Number(vehicleAgg.total_dc) : null;

    const totalAc = meterAgg?.total_ac ? Number(meterAgg.total_ac) : null;

    const efficiency = totalDc && totalAc ? totalDc / totalAc : null;

    return {
      totalAc,
      totalDc,
      efficiency,
      avgBatteryTemp: vehicleAgg?.avg_temp ? Number(vehicleAgg.avg_temp) : null,
    };
  }
}
