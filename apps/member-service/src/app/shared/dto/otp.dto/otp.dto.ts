import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OtpDto {
  @IsDefined()
  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;

  constructor(email: string, otp: string) {
    this.email = email;
    this.otp = otp;
  }
}
