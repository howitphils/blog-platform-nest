import { IsEmail, IsString } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IsStringWithTrim } from '../../../../core/decorators/validation/string-with-trim';
import {
  loginConstraints,
  passwordConstraints,
} from '../../domain/user.entity';

// Нужен будет для описаний параметров domain и application слоев (будет расширен методами)
export class CreateUserInputDto implements CreateUserDto {
  @IsStringWithTrim(loginConstraints.maxLength, loginConstraints.minLength)
  login: string;

  @IsStringWithTrim(
    passwordConstraints.maxLength,
    passwordConstraints.minLength,
  )
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}
