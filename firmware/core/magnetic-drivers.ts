import { CaptainLog } from '../logging/captain-log.js';

export class MagneticDrivers {
  constructor(private log: CaptainLog) {}

  async calibrateFields() {
    this.log.inscribe('Drivers: calibrateFields start.');
    await delay(50);
    this.log.inscribe('Drivers: calibrateFields done.');
  }

  async calibrateResonance() {
    this.log.inscribe('Drivers: calibrateResonance start.');
    await delay(50);
    this.log.inscribe('Drivers: calibrateResonance done.');
  }

  async renderAcknowledgementWaveform() {
    this.log.inscribe('Drivers: rendering acknowledgement waveform (breath/nod).');
    await delay(20);
  }

  async lockFluid() {
    this.log.inscribe('Drivers: fluid harden-mode engaged (rigid lattice).');
    await delay(10);
  }
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
