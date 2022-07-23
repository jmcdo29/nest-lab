import { ConfigurableModuleBuilder } from '@nestjs/common';
import { MulterModuleOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<MulterModuleOptions>().build();
