import test from 'node:test';
import assert from 'node:assert';
import BootstrapStore from '../src/store';
import { validateBootstrapPayload } from '../src/validators';

test('BootstrapStore should add and list records', () => {
  const store = new BootstrapStore();
  const payload = {
    name: 'bootstrap-a',
    description: 'test',
    primaryAction: 'deploy',
    steps: [{ title: 'step1', detail: 'run' }],
  };

  const record = store.add(payload);
  assert.strictEqual(record.name, payload.name);
  assert.strictEqual(record.id, '1');
  const items = store.list();
  assert.strictEqual(items.length, 1);
  assert.strictEqual(store.find('1'), record);
});

test('BootstrapStore returns null for missing id', () => {
  const store = new BootstrapStore();
  assert.strictEqual(store.find('missing'), null);
});

test('validateBootstrapPayload rejects invalid data', () => {
  const result = validateBootstrapPayload({});
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.length >= 1);
});

test('validateBootstrapPayload accepts valid payload', () => {
  const result = validateBootstrapPayload({
    name: 'valid',
    description: 'desc',
    primaryAction: 'run',
    steps: [{ title: 't', detail: 'd' }],
  });
  assert.strictEqual(result.valid, true);
});
