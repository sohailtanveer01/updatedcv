import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Basics } from 'schema';
import { User } from '@/users/entities/user.entity';

import { Resume } from '@/resume/entities/resume.entity';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stripeId: string;

//   @ManyToOne(() => User, (user) => user.resumes, {
//     eager: true,
//     cascade: true,
//     onDelete: 'CASCADE',
//   })
  user: User;

  @Column({ type: 'jsonb', default: {} })
  basics: Basics;


  
  @CreateDateColumn()
  createdAt: Date;
  


  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
