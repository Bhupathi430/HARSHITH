/* ==========================================================================
   HAPPY FRIENDSHIP DAY - HARSHITH RAM
   Mobile-Optimized Butterfly & Bird Canvas Engine + Audio & Card Generator
   ========================================================================== */

(function () {
  'use strict';

  // Canvas & Physics Context Setup
  const canvas = document.getElementById('scene-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    renderECard(); // Re-render card on resize
  });

  // Reduced, elegant default counts for mobile smoothness & clean look
  let butterflyCount = window.innerWidth < 600 ? 12 : 18;
  let birdCount = window.innerWidth < 600 ? 4 : 6;
  let particleCount = window.innerWidth < 600 ? 20 : 30;

  // Color Palettes for Butterflies
  const butterflyPalettes = [
    { main: '#ff85a2', secondary: '#ffd700', wingGlow: '#ff5e97' }, // Pink Gold
    { main: '#00f2fe', secondary: '#4facfe', wingGlow: '#00c6ff' }, // Blue Morpho
    { main: '#ff9a9e', secondary: '#fecfef', wingGlow: '#f368e0' }, // Soft Lavender
    { main: '#38ef7d', secondary: '#11998e', wingGlow: '#00b09b' }, // Emerald Flutter
    { main: '#f6d365', secondary: '#fda085', wingGlow: '#ffb347' }, // Monarch Gold
  ];

  // --------------------------------------------------
  // BUTTERFLY CLASS (Mobile & Desktop 3D Wing Flap)
  // --------------------------------------------------
  class Butterfly {
    constructor(x, y) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;
      const baseScale = window.innerWidth < 600 ? 8 : 11;
      this.size = Math.random() * 6 + baseScale;
      this.palette = butterflyPalettes[Math.floor(Math.random() * butterflyPalettes.length)];
      
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.angle = Math.atan2(this.vy, this.vx);
      
      this.flapSpeed = Math.random() * 0.12 + 0.09;
      this.flapPhase = Math.random() * Math.PI * 2;
      this.flapScaleX = 1;
      
      this.wobbleSpeed = Math.random() * 0.04 + 0.02;
      this.wobblePhase = Math.random() * 10;
    }

    update() {
      this.flapPhase += this.flapSpeed;
      this.flapScaleX = Math.sin(this.flapPhase);

      this.wobblePhase += this.wobbleSpeed;
      this.vx += Math.cos(this.wobblePhase) * 0.12;
      this.vy += Math.sin(this.wobblePhase) * 0.12;

      this.vx *= 0.98;
      this.vy *= 0.98;

      this.x += this.vx;
      this.y += this.vy;

      const targetAngle = Math.atan2(this.vy, this.vx);
      this.angle += (targetAngle - this.angle) * 0.1;

      if (this.x < -40) this.x = width + 40;
      if (this.x > width + 40) this.x = -40;
      if (this.y < -40) this.y = height + 40;
      if (this.y > height + 40) this.y = -40;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI / 2);

      const wingWidth = this.size * Math.abs(this.flapScaleX);
      const wingHeight = this.size * 1.3;

      ctx.shadowBlur = 8;
      ctx.shadowColor = this.palette.wingGlow;

      // Upper Left Wing
      ctx.beginPath();
      ctx.fillStyle = this.palette.main;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -wingWidth * 1.7, -wingHeight * 1.1,
        -wingWidth * 2.0, wingHeight * 0.2,
        0, wingHeight * 0.3
      );
      ctx.fill();

      // Upper Right Wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        wingWidth * 1.7, -wingHeight * 1.1,
        wingWidth * 2.0, wingHeight * 0.2,
        0, wingHeight * 0.3
      );
      ctx.fill();

      // Lower Left Wing
      ctx.beginPath();
      ctx.fillStyle = this.palette.secondary;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -wingWidth * 1.4, wingHeight * 0.4,
        -wingWidth * 1.1, wingHeight * 1.2,
        0, wingHeight * 0.6
      );
      ctx.fill();

      // Lower Right Wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        wingWidth * 1.4, wingHeight * 0.4,
        wingWidth * 1.1, wingHeight * 1.2,
        0, wingHeight * 0.6
      );
      ctx.fill();

      // Body
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#17092c';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.14, this.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // --------------------------------------------------
  // BIRD CLASS
  // --------------------------------------------------
  class Bird {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() < 0.5 ? -80 : width + 80;
      this.y = Math.random() * (height * 0.35) + 40;
      this.speed = Math.random() * 1.5 + 1.2;
      this.dir = this.x < 0 ? 1 : -1;
      this.size = Math.random() * 8 + 12;
      this.wingAngle = 0;
      this.wingSpeed = Math.random() * 0.08 + 0.06;
      this.color = Math.random() < 0.5 ? '#ffffff' : '#ffd700';
    }

    update() {
      this.x += this.speed * this.dir;
      this.y += Math.sin(this.x * 0.005) * 0.4;
      this.wingAngle += this.wingSpeed;

      if ((this.dir === 1 && this.x > width + 100) || (this.dir === -1 && this.x < -100)) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      if (this.dir === -1) ctx.scale(-1, 1);

      const wingY = Math.sin(this.wingAngle) * (this.size * 0.6);

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';

      ctx.beginPath();
      ctx.moveTo(-this.size, wingY);
      ctx.quadraticCurveTo(-this.size * 0.5, -this.size * 0.3, 0, 0);
      ctx.quadraticCurveTo(this.size * 0.5, -this.size * 0.3, this.size, wingY);
      ctx.stroke();

      ctx.restore();
    }
  }

  // --------------------------------------------------
  // SPARKLE PARTICLE CLASS
  // --------------------------------------------------
  class SparkleParticle {
    constructor(x, y) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;
      this.size = Math.random() * 4 + 2;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -Math.random() * 0.8 - 0.2;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.color = Math.random() < 0.6 ? '#ffd700' : '#ff5e97';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= 0.003;

      if (this.opacity <= 0 || this.y < -10) {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.opacity = Math.random() * 0.7 + 0.3;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Instantiating Objects
  const butterflies = [];
  for (let i = 0; i < butterflyCount; i++) butterflies.push(new Butterfly());

  const birds = [];
  for (let i = 0; i < birdCount; i++) birds.push(new Bird());

  const sparkles = [];
  for (let i = 0; i < particleCount; i++) sparkles.push(new SparkleParticle());

  // Interactive Touch/Click Spawner (Spawns 3 gentle butterflies)
  window.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'A') return;

    createRipple(e.clientX, e.clientY);
    
    for (let i = 0; i < 3; i++) {
      const b = new Butterfly(e.clientX, e.clientY);
      b.vx = (Math.random() - 0.5) * 5;
      b.vy = (Math.random() - 0.5) * 5;
      butterflies.push(b);
    }
    if (butterflies.length > 40) butterflies.splice(0, 3);
    playChime();
  });

  function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Main Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    sparkles.forEach((s) => {
      s.update();
      s.draw(ctx);
    });

    birds.forEach((b) => {
      b.update();
      b.draw(ctx);
    });

    butterflies.forEach((bf) => {
      bf.update();
      bf.draw(ctx);
    });

    requestAnimationFrame(animate);
  }

  animate();

  // --------------------------------------------------
  // WEB AUDIO SYNTHESIZER
  // --------------------------------------------------
  let audioCtx = null;
  let isPlayingMusic = false;
  let synthTimer = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playChime() {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const notes = [523.25, 659.25, 783.99, 1046.50];
    const note = notes[Math.floor(Math.random() * notes.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.7);
  }

  function toggleMusic() {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const musicBtn = document.getElementById('music-toggle');

    if (isPlayingMusic) {
      isPlayingMusic = false;
      clearInterval(synthTimer);
      if (musicBtn) musicBtn.innerHTML = '🎵 Play Music';
    } else {
      isPlayingMusic = true;
      if (musicBtn) musicBtn.innerHTML = '🔊 Mute Music';
      startAmbientSynth();
    }
  }

  function startAmbientSynth() {
    const chords = [
      [261.63, 329.63, 392.00],
      [220.00, 261.63, 329.63],
      [174.61, 220.00, 261.63],
      [196.00, 246.94, 293.66],
    ];

    let chordIdx = 0;

    function playChord() {
      if (!isPlayingMusic || !audioCtx) return;
      const currentChord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      currentChord.forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 1);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 3.6);
      });
    }

    playChord();
    synthTimer = setInterval(playChord, 3500);
  }

  const musicBtn = document.getElementById('music-toggle');
  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }

  // --------------------------------------------------
  // SURPRISE GIFT BOX
  // --------------------------------------------------
  const giftBox = document.getElementById('gift-box-btn');

  if (giftBox) {
    giftBox.addEventListener('click', () => {
      playChime();
      for (let i = 0; i < 8; i++) {
        const b = new Butterfly(window.innerWidth / 2, window.innerHeight / 2);
        b.vx = (Math.random() - 0.5) * 8;
        b.vy = (Math.random() - 0.5) * 8;
        butterflies.push(b);
      }
      
      // Inline gentle toast feedback instead of intrusive popup
      const toast = document.createElement('div');
      toast.className = 'gift-toast';
      toast.innerHTML = '🎁 <strong>Happy Friendship Day!</strong> Wishes & blessings released from Harshith Ram ✨';
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 50);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    });
  }

  // --------------------------------------------------
  // STREAMLINED FRIENDSHIP E-CARD GENERATOR
  // --------------------------------------------------
  const ecardCanvas = document.getElementById('ecard-canvas');
  const ecardCtx = ecardCanvas ? ecardCanvas.getContext('2d') : null;

  const friendNameInput = document.getElementById('friend-name');
  const wishSelect = document.getElementById('wish-select');
  const themeSelect = document.getElementById('card-theme');
  const downloadBtn = document.getElementById('download-card-btn');

  function renderECard() {
    if (!ecardCanvas || !ecardCtx) return;

    const width = (ecardCanvas.width = 600);
    const height = (ecardCanvas.height = 400);

    const friendName = (friendNameInput && friendNameInput.value.trim()) || 'Best Friend';
    const message = (wishSelect && wishSelect.value) || 'Happy Friendship Day!';
    const theme = (themeSelect && themeSelect.value) || 'sunset';

    let grad;
    if (theme === 'celestial') {
      grad = ecardCtx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f2027');
      grad.addColorStop(0.5, '#203a43');
      grad.addColorStop(1, '#2c5364');
    } else if (theme === 'emerald') {
      grad = ecardCtx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#11998e');
      grad.addColorStop(1, '#38ef7d');
    } else if (theme === 'rose') {
      grad = ecardCtx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#ff9a9e');
      grad.addColorStop(1, '#fecfef');
    } else {
      grad = ecardCtx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#2b1055');
      grad.addColorStop(0.5, '#75225b');
      grad.addColorStop(1, '#b54558');
    }

    ecardCtx.fillStyle = grad;
    ecardCtx.fillRect(0, 0, width, height);

    ecardCtx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ecardCtx.lineWidth = 6;
    ecardCtx.strokeRect(15, 15, width - 30, height - 30);

    ecardCtx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ecardCtx.fillRect(30, 30, width - 60, height - 60);

    ecardCtx.fillStyle = '#ffd700';
    ecardCtx.font = 'bold 28px "Playfair Display", serif';
    ecardCtx.textAlign = 'center';
    ecardCtx.fillText('HAPPY FRIENDSHIP DAY 🌟', width / 2, 75);

    ecardCtx.fillStyle = '#ffffff';
    ecardCtx.font = 'bold 24px "Outfit", sans-serif';
    ecardCtx.fillText(`Dearest ${friendName},`, width / 2, 125);

    ecardCtx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ecardCtx.font = 'italic 18px "Outfit", sans-serif';

    const words = message.split(' ');
    let line = '';
    let y = 175;
    const maxWidth = 480;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ecardCtx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ecardCtx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += 28;
      } else {
        line = testLine;
      }
    }
    ecardCtx.fillText(line, width / 2, y);

    ecardCtx.fillStyle = '#ffd700';
    ecardCtx.font = 'bold 22px "Dancing Script", cursive';
    ecardCtx.fillText('Warmest Wishes from Harshith Ram ✨', width / 2, height - 55);
  }

  if (friendNameInput) friendNameInput.addEventListener('input', renderECard);
  if (wishSelect) wishSelect.addEventListener('change', renderECard);
  if (themeSelect) themeSelect.addEventListener('change', renderECard);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      renderECard();
      const link = document.createElement('a');
      link.download = `Friendship_Day_Wish_Harshith_Ram.png`;
      link.href = ecardCanvas.toDataURL('image/png');
      link.click();
    });
  }

  renderECard();

  // Control Pills
  const densityPills = document.querySelectorAll('.control-pill');
  densityPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      densityPills.forEach((p) => p.classList.remove('active'));
      e.target.classList.add('active');

      const count = parseInt(e.target.getAttribute('data-butterflies'));
      if (count) {
        butterflies.length = 0;
        for (let i = 0; i < count; i++) butterflies.push(new Butterfly());
      }
    });
  });

})();
