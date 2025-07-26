import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

export class IsValidObjectId implements PipeTransform {
  transform(value: string) {
    if (!isMongoId(value)) {
      throw new BadRequestException('Invalid id format');
    }
    return value;
  }
}
