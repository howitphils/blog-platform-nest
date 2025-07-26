import { Transform, TransformFnParams } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }: TransformFnParams): any =>
    typeof value === 'string' ? value.trim() : value,
  );
