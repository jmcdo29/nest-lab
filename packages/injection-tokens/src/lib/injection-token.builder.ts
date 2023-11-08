import {
  ClassProvider,
  FactoryProvider,
  Inject,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
  ValueProvider,
} from '@nestjs/common';

interface BuiltInjectionToken<T> {
  provideFactory: (
    injected: (...args: unknown[]) => T,
    inject?: Array<InjectionToken | OptionalFactoryDependency>
  ) => FactoryProvider<T>;
  provideClass: (injected: Type<T>) => ClassProvider<T>;
  provideValue: (injected: T) => ValueProvider<T>;
  InjectToken: () => PropertyDecorator & ParameterDecorator;
  getToken: () => InjectionToken;
  type: T;
}

export class InjectionTokenBuilder<T> {
  private token!: InjectionToken;
  private type!: T;

  setInjectionToken(token: InjectionToken): this {
    if (typeof token === 'string') {
      this.token = Symbol(token);
    } else {
      this.token = token;
    }
    return this;
  }

  build(): BuiltInjectionToken<T> {
    return {
      InjectToken: () => Inject(this.token),
      provideFactory: (
        injected: (...args: unknown[]) => T,
        inject: Array<InjectionToken | OptionalFactoryDependency> = []
      ) => ({
        provide: this.token,
        useFactory: injected,
        inject,
      }),
      provideClass: (injected: Type<T>) => ({
        provide: this.token,
        useClass: injected,
      }),
      provideValue: (injected: T) => ({
        provide: this.token,
        useValue: injected,
      }),
      type: this.type,
      getToken: () => this.token,
    };
  }
}
