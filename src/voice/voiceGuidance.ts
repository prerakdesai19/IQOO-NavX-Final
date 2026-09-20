export class VoiceGuidanceEngine {
  private isMuted: boolean = false;
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
    }
  }

  public isVoiceMuted(): boolean {
    return this.isMuted;
  }

  public speak(text: string, priority = false): void {
    if (this.isMuted || !this.synth) return;

    // Deduplicate identical calls within 4 seconds unless high priority
    const now = Date.now();
    if (!priority && text === this.lastSpokenText && now - this.lastSpokenTime < 4000) {
      return;
    }

    if (priority) {
      this.synth.cancel();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick clean voice if available
      const voices = this.synth.getVoices();
      const preferred = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (preferred) {
        utterance.voice = preferred;
      }

      this.synth.speak(utterance);
      this.lastSpokenText = text;
      this.lastSpokenTime = now;
    } catch {
      // Audio fallback
    }
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Voice Command Listener using Web SpeechRecognition
  public startListening(onResult: (transcript: string) => void, onEnd?: () => void): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        onResult(transcript);
      };

      this.recognition.onerror = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.isListening = true;
      this.recognition.start();
      return true;
    } catch {
      this.isListening = false;
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceEngine = new VoiceGuidanceEngine();
