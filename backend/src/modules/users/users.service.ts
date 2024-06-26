import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Register
  async create(
    username: string,
    email: string,
    password: string,
    role: string = 'USER',
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(newUser);
  }

  // Find by email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Find by id
  async findById(id_user: number): Promise<User> {
    return this.userRepository.findOne({ where: { id_user } });
  }

  async findByResetPasswordToken(token: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
