export class Extension {
  field: string;
  message: string;

  static createInstance(field: string, message: string) {
    const extension = new Extension();

    extension.field = field;
    extension.message = message;

    return extension;
  }
}
