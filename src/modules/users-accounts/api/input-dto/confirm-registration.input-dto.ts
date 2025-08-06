import { IsStringWithTrim } from '../../../../core/decorators/validation/string-with-trim';

export class ConfirmRegistrationInputDto {
  @IsStringWithTrim(100)
  code: string;
}
