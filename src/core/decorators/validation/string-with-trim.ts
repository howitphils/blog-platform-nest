import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { Trim } from '../transform/trim';

export const IsStringWithTrim = (maxLength: number, minLength: number = 1) =>
  applyDecorators(IsString(), Trim(), Length(minLength, maxLength));
