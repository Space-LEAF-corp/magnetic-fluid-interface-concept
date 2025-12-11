export class QuantumFirewall {
  private policies = new Set<string>();
  private state: 'booting' | 'enabled' | 'blocked' = 'booting';

  async boot() { this.state = 'enabled'; }
  async enablePolicies(list: string[]) { list.forEach(p => this.policies.add(p)); }
  async blockAll() { this.state = 'blocked'; this.policies.clear(); }

  evaluate(signal: { type: string; consent?: boolean; trust?: number }) {
    if (this.state !== 'enabled') return false;
    if (signal.type === 'actuation' && !signal.consent) return false;
    if ((signal.trust ?? 0) < 0.6) return false;
    return true;
  }
}
