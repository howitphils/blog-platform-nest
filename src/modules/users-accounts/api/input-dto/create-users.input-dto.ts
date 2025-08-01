import { IsEmail, IsString } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IsStringWithTrim } from '../../../../core/decorators/validation/string-with-trim';

const userLoginMaxLength = 10;

const userPassMinLength = 6;
const userPassMaxLength = 20;

// Нужен будет для описаний параметров domain и application слоев (будет расширен методами)
export class CreateUserInputDto implements CreateUserDto {
  @IsStringWithTrim(userLoginMaxLength)
  login: string;

  @IsStringWithTrim(userPassMaxLength, userPassMinLength)
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}
