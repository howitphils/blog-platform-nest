import { Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { DomainExceptionCodes } from '../../exceptions/domain-exception.codes';
import { DomainException } from '../../exceptions/domain-exception';
@Injectable()
export class IsValidObjectId implements PipeTransform {
  transform(value: string) {
    if (!isMongoId(value)) {
      throw new DomainException(
        'Invalid id format',
        DomainExceptionCodes.BadRequest,
      );
    }
    return value;
  }
}
