import { ValidationIssue } from '@decs/typeschema';

export interface ValidationPipeOptions {
  exceptionFactory?: (issues: ValidationIssue[]) => Error;
}
