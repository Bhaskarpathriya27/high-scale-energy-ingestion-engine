import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicle_telemetry_history')
@Index(['vehicleId', 'timestamp'])
export class VehicleTelemetryHistory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @Column({ name: 'kwh_delivered_dc', type: 'numeric' })
  kwhDeliveredDc: number;

  @Column()
  soc: number;

  @Column({ name: 'battery_temp', type: 'numeric', nullable: true })
  batteryTemp: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
