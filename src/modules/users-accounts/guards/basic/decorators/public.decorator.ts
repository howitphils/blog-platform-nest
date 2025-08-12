import { SetMetadata } from '@nestjs/common';
import { appConfig } from '../../../../../app.settings';

export const Public = () => SetMetadata(appConfig.IS_PUBLIC_KEY, true);
