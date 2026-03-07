import type { ModuleMetadata, Type } from '@nestjs/common';
import type { BusboyOptions } from './busboy-options.interface';

export type BusboyModuleOptions = BusboyOptions;

export interface BusboyOptionsFactory {
  createBusboyOptions(): Promise<BusboyModuleOptions> | BusboyModuleOptions;
}

export interface BusboyModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<BusboyOptionsFactory>;
  useClass?: Type<BusboyOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<BusboyModuleOptions> | BusboyModuleOptions;
  inject?: any[];
}
