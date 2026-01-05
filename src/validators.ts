import type { BootstrapPayload, BootstrapStep } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateBootstrapPayload(payload: unknown): ValidationResult {
  const errors: string[] = [];
  if (!payload || typeof payload !== 'object') {
    errors.push('payload must be an object');
    return { valid: false, errors };
  }

  const typedPayload = payload as BootstrapPayload;
  const { name, description, primaryAction, steps } = typedPayload;

  if (!name || typeof name !== 'string') {
    errors.push('name is required and must be a string');
  }
  if (!description || typeof description !== 'string') {
    errors.push('description is required and must be a string');
  }
  if (!primaryAction || typeof primaryAction !== 'string') {
    errors.push('primaryAction is required and must be a string');
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    errors.push('steps must be a non-empty array');
  } else {
    steps.forEach((step, index) => {
      const currentStep = step as BootstrapStep | undefined;
      if (!currentStep || typeof currentStep.title !== 'string') {
        errors.push(`steps[${index}].title is required`);
      }
      if (!currentStep || typeof currentStep.detail !== 'string') {
        errors.push(`steps[${index}].detail is required`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}
