import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class IsValidObjectId implements PipeTransform {
  transform(value: string) {
    if (!isMongoId(value)) {
      throw new BadRequestException('Invalid id format');
    }
    return value;
  }
}
