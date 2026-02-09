import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('current_meter_state')
export class CurrentMeterState {
  @PrimaryColumn({ name: 'meter_id' })
  meterId: string;

  @Column({ name: 'last_kwh_ac', type: 'numeric' })
  lastKwhAc: number;

  @Column({ type: 'numeric', nullable: true })
  voltage: number;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
