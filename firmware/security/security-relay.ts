import { QuantumFirewall } from './quantum-firewall.js';

export class SecurityRelay {
  private bound = false;
  constructor(private firewall: QuantumFirewall) {}

  async bind() { this.bound = true; }
  async quiesce() { this.bound = false; }

  async transmit(packet: { channel: string; payload: unknown; meta?: { trust: number; consent: boolean } }) {
    if (!this.bound) return false;
    const ok = this.firewall.evaluate({ type: 'actuation', consent: packet.meta?.consent, trust: packet.meta?.trust });
    return ok;
  }
}
