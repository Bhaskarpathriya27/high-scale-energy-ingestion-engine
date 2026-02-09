import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('meter_telemetry_history')
@Index(['meterId', 'timestamp'])
export class MeterTelemetryHistory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'meter_id' })
  meterId: string;

  @Column({ name: 'kwh_consumed_ac', type: 'numeric' })
  kwhConsumedAc: number;

  @Column({ type: 'numeric', nullable: true })
  voltage: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
