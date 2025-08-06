import { IsEmail } from 'class-validator';

export class EmailConfirmationCodeResending {
  @IsEmail()
  email: string;
}
