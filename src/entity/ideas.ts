import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,

} from "typeorm";
import { User } from "./users";
import { Status } from "./enum";

@Entity("ideas")
export class Idea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ default: 0 })
  votes: number;

  @ManyToOne(() => User)
  submittedBy: User;

  @ManyToMany(() => User)
  @JoinTable({name:"voters"})
  votedBy: User[];
}
