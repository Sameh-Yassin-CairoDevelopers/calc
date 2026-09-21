let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playClickSound(type: 'number' | 'operator' | 'function' | 'equals' | 'action'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    
    // Different frequencies for crisp tactile distinctions
    let freq = 600;
    let duration = 0.03;
    let volume = 0.04;

    if (type === 'equals') {
      freq = 880;
      duration = 0.06;
      volume = 0.07;
    } else if (type === 'operator') {
      freq = 720;
      duration = 0.04;
      volume = 0.05;
    } else if (type === 'action') {
      freq = 420;
      duration = 0.035;
      volume = 0.04;
    } else if (type === 'function') {
      freq = 680;
      duration = 0.03;
      volume = 0.04;
    }

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + duration);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Graceful silent fallback if Web Audio is blocked or unsupported
  }
}
