import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from "typeorm";
import { Incentives } from "./incentives";
import { Role } from "./enum";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  region: string;

  @Column({ type: "enum", enum: Role, default: Role.EMPLOYEE })
  role: Role;

  @Column()
  encryptedPassword: string;

  @Column({ nullable: true })
  points: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Incentives, (incentives) => incentives.recipient)
  @JoinTable()
  incentives?: Incentives[]; 
}