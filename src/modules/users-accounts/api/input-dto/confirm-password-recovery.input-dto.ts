import { IsStringWithTrim } from 'src/core/decorators/validation/string-with-trim';
import { passwordConstraints } from '../../domain/user.entity';

export class ConfirmPasswordRecoveryInputDto {
  @IsStringWithTrim(
    passwordConstraints.maxLength,
    passwordConstraints.minLength,
  )
  newPassword: string;

  @IsStringWithTrim(100)
  recoveryCode: string;
}
