import { ChamberController } from './firmware/core/chamber-controller.js';
import { SecurityRelay } from './firmware/security/security-relay.js';
import { QuantumFirewall } from './firmware/security/quantum-firewall.js';
import { RefreshProtocol } from './firmware/refresh/refresh-protocol.js';
import { ConsentReconstruction } from './firmware/reconstruction/consent-reconstruction.js';
import { Labyrinth } from './firmware/security/labyrinth.js';
import { CaptainLog } from './firmware/logging/captain-log.js';
import { Biometrics } from './firmware/biometrics/biometrics.js';

async function main() {
  const log = new CaptainLog();
  log.inscribe('Seal 6.0 init: Integrated validation charter, system bring-up.');

  const firewall = new QuantumFirewall();
  const relay = new SecurityRelay(firewall);
  const labyrinth = new Labyrinth();
  const consent = new ConsentReconstruction();
  const biometrics = new Biometrics();

  const chamber = new ChamberController({ relay, firewall, labyrinth, consent, biometrics, log });

  await chamber.initialize();
  await chamber.calibrate();
  await chamber.arm();

  // Demo run: acknowledgement resonance + refresh sweep
  await chamber.acknowledgeVoice('Hello, QPPI presence.', { livenessProbe: true });
  await chamber.refresh.runSweep({ reason: 'startup', epoch: 'micro' });

  log.inscribe('Bring-up complete. Awaiting lineage-safe commands.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
