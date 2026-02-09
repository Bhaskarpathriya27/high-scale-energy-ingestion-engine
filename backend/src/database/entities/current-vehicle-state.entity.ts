import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('current_vehicle_state')
export class CurrentVehicleState {
  @PrimaryColumn({ name: 'vehicle_id' })
  vehicleId: string;

  @Column()
  soc: number;

  @Column({ name: 'last_kwh_dc', type: 'numeric' })
  lastKwhDc: number;

  @Column({ name: 'avg_battery_temp', type: 'numeric', nullable: true })
  avgBatteryTemp: number;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
