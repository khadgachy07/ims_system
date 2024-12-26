import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users";

@Entity("incentives")
export class Incentives {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  points: number;

  @ManyToMany(() => User, (user) => user.incentives)
  recipient: User[];

  @CreateDateColumn()
  dateAwarded: Date;
}
 