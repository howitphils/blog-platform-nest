import { Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';

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
