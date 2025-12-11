export class Labyrinth {
  private routeSeed = Math.random();
  private frozen = false;

  async activate() { this.routeSeed = Math.random(); }
  async shuffle() { if (!this.frozen) this.routeSeed = Math.random(); }
  async freeze() { this.frozen = true; }

  routeFor(subsystem: string) {
    // Simulated unpredictable routing
    const hash = Math.abs(hashStr(subsystem + this.routeSeed.toString()));
    return (hash % 7) + 1; // 7 decoy+real routes
  }
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}
