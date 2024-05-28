import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    this.sendConfirmationEmail(email);
    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id_user, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async sendConfirmationEmail(email: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    const mailOptions = {
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Welcome to Our App!',
      text: 'Thank you for registering!',
    };

    await transporter.sendMail(mailOptions);
  }
}
