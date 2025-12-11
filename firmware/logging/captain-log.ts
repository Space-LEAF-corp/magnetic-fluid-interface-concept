import { randomUUID } from 'uuid';

export class CaptainLog {
  inscribe(entry: string) {
    const stamp = new Date().toISOString();
    console.log(`[CaptainLog ${stamp}] ${entry}`);
  }

  snapshot(ctx: { reason: string }) {
    const id = randomUUID();
    console.log(`[CaptainLog Snapshot ${id}] reason=${ctx.reason}`);
  }
}
