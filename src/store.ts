import type { BootstrapPayload, BootstrapRecord } from './types';

export default class BootstrapStore {
  private readonly items = new Map<string, BootstrapRecord>();
  private counter = 1;

  public list(): BootstrapRecord[] {
    return Array.from(this.items.values());
  }

  public add(payload: BootstrapPayload): BootstrapRecord {
    const id = String(this.counter++);
    const record: BootstrapRecord = {
      id,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    this.items.set(id, record);
    return record;
  }

  public find(id: string): BootstrapRecord | null {
    return this.items.get(id) ?? null;
  }
}
