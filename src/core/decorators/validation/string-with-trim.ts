import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../transform/trim';

export const IsStringWithTrim = (maxLength: number) =>
  applyDecorators(IsString(), Trim(), IsNotEmpty(), MaxLength(maxLength));
