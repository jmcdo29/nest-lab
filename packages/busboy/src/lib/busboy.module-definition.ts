import { ConfigurableModuleBuilder } from '@nestjs/common';
import type { BusboyModuleOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<BusboyModuleOptions>().build();
