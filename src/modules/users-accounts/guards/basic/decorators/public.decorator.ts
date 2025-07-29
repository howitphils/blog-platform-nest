import { appConfig } from 'src/app.config';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(appConfig.IS_PUBLIC_KEY, true);
