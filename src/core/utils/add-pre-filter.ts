import { Schema } from 'mongoose';

export const addPreFilter = (schema: Schema, pathToDeletedAt: string) => {
  schema.pre('find', function () {
    this.where({ [pathToDeletedAt]: null });
  });

  schema.pre('findOne', function () {
    this.where({ [pathToDeletedAt]: null });
  });
};
