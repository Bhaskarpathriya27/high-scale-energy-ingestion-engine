import { DataSource } from 'typeorm';
import { VehicleTelemetryHistory } from '../database/entities/vehicle-telemetry-history.entity';
import { MeterTelemetryHistory } from '../database/entities/meter-telemetry-history.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [VehicleTelemetryHistory, MeterTelemetryHistory],
});

async function seed() {
  await AppDataSource.initialize();

  const vehicleRepo = AppDataSource.getRepository(VehicleTelemetryHistory);
  const meterRepo = AppDataSource.getRepository(MeterTelemetryHistory);

  const rows = 1000;
  const now = Date.now();

  const vehicleData: Partial<VehicleTelemetryHistory>[] = [];
  const meterData: Partial<MeterTelemetryHistory>[] = [];

  for (let i = 0; i < rows; i++) {
    const timestamp = new Date(now - i * 60_000);

    vehicleData.push({
      vehicleId: 'EV-101',
      kwhDeliveredDc: 10 + Math.random() * 5,
      soc: 50 + Math.floor(Math.random() * 50),
      batteryTemp: 30 + Math.random() * 10,
      timestamp,
    });

    meterData.push({
      meterId: 'MTR-101',
      kwhConsumedAc: 12 + Math.random() * 5,
      voltage: 220 + Math.random() * 10,
      timestamp,
    });
  }

  await vehicleRepo.insert(vehicleData);
  await meterRepo.insert(meterData);

  console.log(`Seeded ${rows} rows successfully`);
  process.exit(0);
}

seed();
