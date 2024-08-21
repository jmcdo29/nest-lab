import type { ValidationIssue } from '@typeschema/core';

export interface ValidationPipeOptions {
  exceptionFactory?: (issues: ValidationIssue[]) => Error;
}
