import { describe, it, expect, beforeEach } from 'vitest';
import { batteryManager } from './batteryManager';

describe('Battery & Ultra Navigation Manager', () => {
  beforeEach(() => {
    batteryManager.toggleUltraMode(false);
    batteryManager.setSimulatedBatteryLevel(0.8);
  });

  it('automatically triggers Ultra Mode below 15% battery', () => {
    batteryManager.setSimulatedBatteryLevel(0.12);
    const state = batteryManager.getState();
    expect(state.isLowBattery).toBe(true);
    expect(state.isUltraMode).toBe(true);
  });

  it('allows manual toggling of Ultra Mode', () => {
    batteryManager.toggleUltraMode(true);
    expect(batteryManager.getState().isUltraMode).toBe(true);
    batteryManager.toggleUltraMode(false);
    expect(batteryManager.getState().isUltraMode).toBe(false);
  });
});
