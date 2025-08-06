import { IsStringWithTrim } from '../../../../core/decorators/validation/string-with-trim';
import { passwordConstraints } from '../../domain/user.entity';

export class LoginUserInputDto {
  @IsStringWithTrim(30)
  loginOrEmail: string;

  @IsStringWithTrim(passwordConstraints.maxLength)
  password: string;
}
