import { IsEmail, IsString, Length } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';
import { Transform } from 'class-transformer';

const userLoginMaxLength = 10;
const userLoginMinLength = 3;

const userPassMaxLength = 20;
const userPassMinLength = 6;

const Trim = () =>
  Transform((params): any =>
    typeof params.value === 'string' ? params.value.trim() : params.value,
  );

// Нужен будет для описаний параметров domain и application слоев (будет расширен методами)
export class CreateUserInputDto implements CreateUserDto {
  @IsString()
  @Length(userLoginMinLength, userLoginMaxLength)
  @Trim()
  login: string;

  @IsString()
  @Length(userPassMinLength, userPassMaxLength)
  @Trim()
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}
