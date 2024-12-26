import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users";
import { Idea } from "./ideas";
import { Incentives } from "./incentives";

@Entity("submissions")
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ default: false })
  offlineStatus: boolean;
  
  @Column({ default: false })
  syncStatus: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  submittedBy: User; // This is the user who submitted the submission

  @OneToOne(() => Idea)
  @JoinColumn({name: "idea"})
  idea: Idea; // This is the idea that the submission is associated with

  @OneToOne(() => Incentives)
  @JoinColumn()
  incentive: Incentives;
}