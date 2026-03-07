import { Module } from '@nestjs/common';
import { BusboyCoreModule } from './busboy-core.module';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './busboy.module-definition';
import { BUSBOY_OPTIONS } from './files.constants';
import type { BusboyModuleOptions } from './interfaces';

@Module({
  imports: [BusboyCoreModule],
  providers: [
    {
      provide: BUSBOY_OPTIONS,
      useFactory: (options?: BusboyModuleOptions) => ({ ...(options ?? {}) }),
      inject: [{ token: MODULE_OPTIONS_TOKEN, optional: true }],
    },
  ],
  exports: [BUSBOY_OPTIONS],
})
export class BusboyModule extends ConfigurableModuleClass {}
