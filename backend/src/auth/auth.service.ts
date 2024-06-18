import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as crypto from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
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
    this.sendConfirmationEmail(email, username);
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
      access_token: this.jwtService.sign(payload, { expiresIn: '2h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
      data: {
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  private async sendConfirmationEmail(email: string, username: string) {
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
      text: `Thank you ${username} for registering!`,
    };

    await transporter.sendMail(mailOptions);
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPassword.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await this.userService.save(user);

    const resetUrl = `http://yourapp.com/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    const mailOptions = {
      from: this.configService.get('EMAIL_USER'),
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPassword: ResetPasswordDto) {
    const user = await this.userService.findByResetPasswordToken(
      resetPassword.token,
    );
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException(
        'Password reset token is invalid or expired. Please try again',
      );
    }
    user.password = await bcrypt.hash(resetPassword.password, 10);
    user.resetPasswordExpires = null;
    user.resetPasswordToken = null;
    await this.userService.save(user);
    return { message: 'Password has been reset' };
  }

  async updateUser(
    id_user: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update only the provided fields
    // Update only the provided fields
    const updatedUser = { ...user };

    if (updateUserDto.username) {
      updatedUser.username = updateUserDto.username;
    }
    if (updateUserDto.address) {
      updatedUser.address = updateUserDto.address;
    }
    if (updateUserDto.gender) {
      updatedUser.gender = updateUserDto.gender;
    }
    if (updateUserDto.birthday) {
      // Convert birthday string to Date
      updatedUser.birthday = new Date(updateUserDto.birthday);
    }

    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }
}
