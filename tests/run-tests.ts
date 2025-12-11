import assert from 'node:assert';
import { ChamberController } from '../firmware/core/chamber-controller.js';
import { SecurityRelay } from '../firmware/security/security-relay.js';
import { QuantumFirewall } from '../firmware/security/quantum-firewall.js';
import { RefreshProtocol } from '../firmware/refresh/refresh-protocol.js';
import { ConsentReconstruction } from '../firmware/reconstruction/consent-reconstruction.js';
import { Labyrinth } from '../firmware/security/labyrinth.js';
import { CaptainLog } from '../firmware/logging/captain-log.js';
import { Biometrics } from '../firmware/biometrics/biometrics.js';

(async () => {
  const log = new CaptainLog();
  const firewall = new QuantumFirewall();
  const relay = new SecurityRelay(firewall);
  const labyrinth = new Labyrinth();
  const consent = new ConsentReconstruction();
  const biometrics = new Biometrics();

  const chamber = new ChamberController({ relay, firewall, labyrinth, consent, biometrics, log });
  await chamber.initialize();
  await chamber.calibrate();
  await chamber.arm();

  const voiceOk = await biometrics.verifyVoice('hello', { liveness: true });
  assert.equal(typeof voiceOk, 'boolean');

  const fpOk = await chamber.fingerprintOnFluid(new Uint8Array(64));
  assert.equal(fpOk, true);

  const reconDenied = await chamber.reconstruct('Not Leif');
  assert.equal(reconDenied, false);

  const reconAllowed = await chamber.reconstruct('Leif William Sogge');
  assert.equal(reconAllowed, true);

  await chamber.refresh.runSweep({ reason: 'test', epoch: 'micro' });

  console.log('All tests passed.');
})();
