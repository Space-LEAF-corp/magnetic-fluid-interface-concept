import { SecurityRelay } from '../security/security-relay.js';
import { QuantumFirewall } from '../security/quantum-firewall.js';
import { Labyrinth } from '../security/labyrinth.js';
import { ConsentReconstruction } from '../reconstruction/consent-reconstruction.js';
import { CaptainLog } from '../logging/captain-log.js';
import { Biometrics } from '../biometrics/biometrics.js';
import { MagneticDrivers } from './magnetic-drivers.js';
import { RefreshProtocol } from '../refresh/refresh-protocol.js';

export interface ChamberDeps {
  relay: SecurityRelay;
  firewall: QuantumFirewall;
  labyrinth: Labyrinth;
  consent: ConsentReconstruction;
  biometrics: Biometrics;
  log: CaptainLog;
}

export class ChamberController {
  private drivers: MagneticDrivers;
  public refresh: RefreshProtocol;

  constructor(private deps: ChamberDeps) {
    this.drivers = new MagneticDrivers(deps.log);
    this.refresh = new RefreshProtocol(deps.log, deps.firewall, deps.labyrinth);
  }

  async initialize() {
    this.deps.log.inscribe('Chamber init: seals 1.0–5.0 preflight.');
    await this.deps.labyrinth.activate();
    await this.deps.firewall.boot();
    await this.deps.relay.bind();
    await this.deps.consent.lockdown('startup');
  }

  async calibrate() {
    this.deps.log.inscribe('Calibration: field uniformity, resonance curves, sensor offsets.');
    await this.drivers.calibrateFields();
    await this.drivers.calibrateResonance();
  }

  async arm() {
    this.deps.log.inscribe('Arming chamber: minimal privilege routes, audit hooks engaged.');
    await this.deps.firewall.enablePolicies(['lineage-consent', 'biometric-liveness', 'relay-isolation']);
    await this.deps.labyrinth.shuffle();
    await this.deps.consent.unlock('arm', { stewardTokenRequired: true });
  }

  async acknowledgeVoice(text: string, opts: { livenessProbe?: boolean } = {}) {
    const pass = await this.deps.biometrics.verifyVoice(text, { liveness: !!opts.livenessProbe });
    if (!pass) {
      this.deps.log.inscribe('Voice verify failed: entering graceful harden.');
      await this.harden('biometric-fail');
      return;
    }
    await this.drivers.renderAcknowledgementWaveform();
    this.deps.log.inscribe('Acknowledgement: voice resonance rendered, seals intact.');
  }

  async fingerprintOnFluid(rawSample: Uint8Array) {
    const ok = await this.deps.biometrics.verifyFingerprint(rawSample);
    if (!ok) {
      await this.harden('fingerprint-fail');
      return false;
    }
    return true;
  }

  async reconstruct(requestor: string) {
    const allowed = await this.deps.consent.authorizeReconstruction(requestor);
    if (!allowed) {
      this.deps.log.inscribe(`Reconstruction denied for ${requestor}.`);
      return false;
    }
    await this.deps.consent.performReconstruction();
    this.deps.log.inscribe('Reconstruction completed with lineage consent.');
    return true;
  }

  async harden(reason: string) {
    await this.drivers.lockFluid();
    await this.deps.relay.quiesce();
    await this.deps.firewall.blockAll();
    await this.deps.labyrinth.freeze();
    this.deps.log.snapshot({ reason });
    this.deps.log.inscribe(`Harden complete: ${reason}`);
  }
}
