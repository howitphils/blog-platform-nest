import { SetMetadata } from '@nestjs/common';
import { appSettings } from '../../../../../app.settings';

export const Public = () => SetMetadata(appSettings.IS_PUBLIC_KEY, true);
