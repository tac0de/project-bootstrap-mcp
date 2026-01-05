function validateBootstrapPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    errors.push('payload must be an object');
    return { valid: false, errors };
  }

  const { name, description, primaryAction, steps } = payload;
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
      if (!step || typeof step.title !== 'string') {
        errors.push(`steps[${index}].title is required`);
      }
      if (!step || typeof step.detail !== 'string') {
        errors.push(`steps[${index}].detail is required`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateBootstrapPayload };
