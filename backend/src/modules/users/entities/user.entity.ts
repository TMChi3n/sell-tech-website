import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({ unique: true })
  email: string;
  @Column({ default: 'USER' })
  role: string;
  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, default: 'empty' })
  gender: string;

  @Column({ nullable: true, type: 'date' })
  birthday: Date;
}
