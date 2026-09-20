import { BatteryState } from '../types';

export class BatteryManager {
  private level: number = 0.85; // 85% by default
  private isCharging: boolean = false;
  private isUltraMode: boolean = false;
  private listeners: Array<(state: BatteryState) => void> = [];

  constructor() {
    this.initBatteryApi();
  }

  private async initBatteryApi() {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        const battery: any = await (navigator as any).getBattery();
        this.level = battery.level;
        this.isCharging = battery.charging;

        battery.addEventListener('levelchange', () => {
          this.level = battery.level;
          this.checkAutoUltraMode();
          this.notify();
        });

        battery.addEventListener('chargingchange', () => {
          this.isCharging = battery.charging;
          this.notify();
        });

        this.checkAutoUltraMode();
        this.notify();
      } catch {
        // Fall back to internal simulation
      }
    }
  }

  public subscribe(cb: (state: BatteryState) => void): () => void {
    this.listeners.push(cb);
    cb(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const state = this.getState();
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  public getState(): BatteryState {
    const isLowBattery = this.level <= 0.20 && !this.isCharging;
    return {
      level: this.level,
      isCharging: this.isCharging,
      isLowBattery,
      isUltraMode: this.isUltraMode,
      powerSavingPercentage: this.isUltraMode ? 74 : 0,
    };
  }

  public setSimulatedBatteryLevel(level: number) {
    this.level = Math.max(0.01, Math.min(1.0, level));
    this.checkAutoUltraMode();
    this.notify();
  }

  public toggleUltraMode(enabled?: boolean) {
    if (enabled !== undefined) {
      this.isUltraMode = enabled;
    } else {
      this.isUltraMode = !this.isUltraMode;
    }
    this.notify();
  }

  private checkAutoUltraMode() {
    // If battery drops below 15% and not charging, auto-trigger Ultra Navigation Mode
    if (this.level <= 0.15 && !this.isCharging && !this.isUltraMode) {
      this.isUltraMode = true;
    }
  }
}

export const batteryManager = new BatteryManager();
