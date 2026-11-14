// ==========================================
// 부산ON 월드 (BUSAN ON WORLD) 웹 오디오 신디사이저 엔진
// 외부 사운드 파일 없이 순수 Web Audio API로
// 밝고 화사한 부산 시정 판타지 BGM 및 시민 인터랙션 SFX 합성
// ==========================================

class BusanAudioEngine {
  constructor() {
    this.ctx = null;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
    this.volume = 0.35;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    console.log("[BusanAudio] 오디오 엔진 초기화 완료");
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // ======================================================
  // 1. 밝고 청량한 부산 시정 판타지 BGM (Acoustic Chime & Synth)
  // G장조(G Major) 기반 희망찬 멜로디 루프
  // ======================================================
  toggleBgm() {
    this.ensureContext();
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.playBgm();
      return true;
    }
  }

  playBgm() {
    this.ensureContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // G Major Pentatonic: G4, A4, B4, D5, E5, G5
    const melody = [
      { f: 392.00, d: 0.4 }, // G4
      { f: 440.00, d: 0.4 }, // A4
      { f: 493.88, d: 0.4 }, // B4
      { f: 587.33, d: 0.8 }, // D5
      { f: 659.25, d: 0.4 }, // E5
      { f: 587.33, d: 0.4 }, // D5
      { f: 493.88, d: 0.8 }, // B4

      { f: 587.33, d: 0.4 }, // D5
      { f: 659.25, d: 0.4 }, // E5
      { f: 783.99, d: 0.8 }, // G5
      { f: 659.25, d: 0.4 }, // E5
      { f: 587.33, d: 0.4 }, // D5
      { f: 392.00, d: 1.2 }  // G4
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const note = melody[noteIdx];
      this.synthesizeSoftChime(note.f, note.d * 0.9);
      noteIdx = (noteIdx + 1) % melody.length;
      this.bgmTimer = setTimeout(playNext, note.d * 1000);
    };

    playNext();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  synthesizeSoftChime(freq, duration) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // 따뜻한 하모닉스 배음
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 0.5, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    subOsc.connect(subGain);
    gain.connect(this.masterGain);
    subGain.connect(this.masterGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
  }

  // ======================================================
  // 2. 사운드 이펙트 (SFX)
  // ======================================================

  // (1) 민원 번호표 발급 / 안내 딩동 벨
  playDingDong() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 솔(G5: 783.99Hz) -> 미(E5: 659.25Hz) 차임
    [ {f: 783.99, t: 0}, {f: 659.25, t: 0.28} ].forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.001, now + n.t);
      gain.gain.linearRampToValueAtTime(0.3, now + n.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + n.t);
      osc.stop(now + n.t + 0.65);
    });
  }

  // (2) 스탬프 획득 찰칵 & 반짝음
  playStampSound() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 쿵(도장 찍는 타격감)
    const bufSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.3, now);
    nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    noise.connect(nGain);
    nGain.connect(this.masterGain);
    noise.start(now);

    // 반짝 빛나는 소리 (C6 -> E6 -> G6)
    [1046.50, 1318.51, 1567.98].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + 0.05 + idx * 0.08);
      g.gain.setValueAtTime(0.001, now + 0.05 + idx * 0.08);
      g.gain.linearRampToValueAtTime(0.2, now + 0.06 + idx * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.08);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + 0.05 + idx * 0.08);
      osc.stop(now + 0.45 + idx * 0.08);
    });
  }

  // (3) 시민 발언대 확성기 효과음
  playMegaphoneSound() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 삐익 마이크 피드백 + 에코
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // (4) 시민 탐험가 레벨업 팡파르
  playLevelUp() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const fanfare = [
      { f: 523.25, t: 0.0, d: 0.12 }, // C5
      { f: 659.25, t: 0.12, d: 0.12 }, // E5
      { f: 783.99, t: 0.24, d: 0.12 }, // G5
      { f: 1046.50, t: 0.36, d: 0.45 }  // C6
    ];

    fanfare.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.001, now + n.t);
      gain.gain.linearRampToValueAtTime(0.35, now + n.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    });
  }

  // (5) 분수대 물줄기 상쾌한 사운드
  playFountainSplash() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }
}

// 싱글톤 글로벌 인스턴스
window.busanAudio = new BusanAudioEngine();
