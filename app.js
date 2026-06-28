// ==========================================================================
// CONFIGURATION & DYNAMIC DATA
// ==========================================================================

// Balloon pastel colors
const BALLOON_COLORS = [
    '#ffb7c5', // Sakura Pink
    '#ff8da1', // Rose Pink
    '#80deea', // Sky Blue
    '#c8e6c9', // Mint Green
    '#ffe082', // Pastel Gold
    '#d1c4e9'  // Lavender
];

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
let audioContext = null;
let bgMusicGain = null;
let isPlayingMusic = false;
let isMelodyPlaying = false;
let candleSnuffed = false;
const unwrapAudio = new Audio('PRESENT-GIFT-SOUND.mp3');
unwrapAudio.preload = 'auto';
const bdaySong = new Audio('shinchanbday.mp3');
bdaySong.preload = 'auto';

// ==========================================================================
// BACKGROUND CANVAS: SUNSET CLOUDS, STARS & FLOATING FLOWERS (SAKURA, LAVENDER, ORCHID, SUNFLOWER)
// ==========================================================================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let stars = [];
let petals = [];
let clouds = [];

function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    initBackgroundAssets();
}

function initBackgroundAssets() {
    // 1. Initialize sparkling stars
    stars = [];
    const starCount = Math.floor(bgCanvas.width / 30);
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * (bgCanvas.height / 2),
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.6 + 0.4,
            speed: Math.random() * 0.015 + 0.005,
            dir: Math.random() > 0.5 ? 1 : -1
        });
    }

    // 2. Initialize drifting floral petals (Sakura, Lavender buds, Orchid petals, and Sunflower petals)
    petals = [];
    const petalCount = Math.floor((bgCanvas.width * bgCanvas.height) / 12000);
    
    for (let i = 0; i < petalCount; i++) {
        const rand = Math.random();
        let type = 'sakura';
        if (rand > 0.4 && rand <= 0.65) type = 'lavender';
        else if (rand > 0.65 && rand <= 0.85) type = 'orchid';
        else if (rand > 0.85) type = 'sunflower';

        petals.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height - bgCanvas.height,
            size: type === 'orchid' ? Math.random() * 8 + 6 : (type === 'lavender' ? Math.random() * 4 + 3 : (type === 'sunflower' ? Math.random() * 7 + 5 : Math.random() * 6 + 4)),
            type: type,
            angle: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            speedY: Math.random() * 0.8 + 0.5,
            speedX: Math.random() * 0.4 + 0.1, // Drifts right
            oscillationSpeed: Math.random() * 0.01 + 0.005,
            angleOsc: Math.random() * Math.PI * 2
        });
    }

    // 3. Initialize drifting fluffy anime clouds
    clouds = [
        { x: bgCanvas.width * 0.05, y: bgCanvas.height * 0.25, scale: 1.1, speed: 0.12, opacity: 0.35 },
        { x: bgCanvas.width * 0.45, y: bgCanvas.height * 0.15, scale: 1.5, speed: 0.07, opacity: 0.28 },
        { x: bgCanvas.width * 0.82, y: bgCanvas.height * 0.3, scale: 0.9, speed: 0.18, opacity: 0.4 }
    ];
}

// Draw fluffy cluster cloud
function drawAnimeCloud(ctx, x, y, scale, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = `rgba(255, 225, 230, ${opacity})`;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.arc(20, -10, 22, 0, Math.PI * 2);
    ctx.arc(42, 0, 24, 0, Math.PI * 2);
    ctx.arc(-20, 3, 18, 0, Math.PI * 2);
    ctx.rect(-20, -5, 62, 25);
    ctx.fill();
    ctx.restore();
}

// Draw a beautiful cherry blossom petal path
function drawSakuraPetal(ctx, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -size / 2, -size / 2, -size * 1.4, 0, -size * 1.8);
    ctx.bezierCurveTo(size / 2, -size * 1.4, size / 2, -size / 2, 0, 0);
    ctx.fillStyle = 'rgba(255, 183, 197, 0.65)';
    ctx.fill();
    ctx.restore();
}

// Draw a lavender bud
function drawLavenderBud(ctx, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 1.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(149, 117, 205, 0.6)'; // Lavender purple
    ctx.fill();
    ctx.restore();
}

// Draw a wide orchid petal
function drawOrchidPetal(ctx, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 1.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 240, 243, 0.75)'; // Soft white pink orchid petal
    ctx.fill();
    
    // Core accent stroke
    ctx.strokeStyle = 'rgba(233, 30, 99, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

// Draw a yellow sunflower petal
function drawSunflowerPetal(ctx, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 1.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(253, 216, 53, 0.72)'; // Warm sunny yellow
    ctx.fill();
    
    // Core accent stroke
    ctx.strokeStyle = 'rgba(245, 124, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

function drawSeigaihaPattern(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 163, 177, 0.32)'; // Faded sakura-pink Japanese wave pattern watermark
    ctx.lineWidth = 1.5;
    
    const waveRadius = 40;
    const xStep = waveRadius * 2;
    const yStep = waveRadius / 2;
    
    for (let y = -waveRadius; y < height + waveRadius; y += yStep) {
        const shiftX = (Math.floor(y / yStep) % 2 === 0) ? 0 : waveRadius;
        for (let x = -waveRadius; x < width + waveRadius; x += xStep) {
            for (let r = waveRadius; r > 10; r -= 10) {
                ctx.beginPath();
                ctx.arc(x + shiftX, y, r, 0, Math.PI, true); // Concentric arcs pointing up
                ctx.stroke();
            }
        }
    }
    ctx.restore();
}

let lastTime = performance.now();

function renderBackground(timestamp) {
    if (!timestamp) timestamp = performance.now();
    const dt = Math.min((timestamp - lastTime) / 16.666, 3.0); // Normalize to 60 FPS (capped to 3.0 to prevent huge leaps)
    lastTime = timestamp;

    // Cozy cream background fill
    bgCtx.fillStyle = '#fffcf2';
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Draw traditional Japanese Seigaiha wave pattern watermark
    drawSeigaihaPattern(bgCtx, bgCanvas.width, bgCanvas.height);

    // Stars
    stars.forEach(star => {
        star.opacity += star.speed * star.dir * dt;
        if (star.opacity > 1 || star.opacity < 0.2) star.dir *= -1;
        bgCtx.fillStyle = `rgba(255, 163, 177, ${star.opacity * 0.4})`;
        bgCtx.beginPath();
        bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        bgCtx.fill();
    });

    // Clouds
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed * dt;
        if (cloud.x < -150 * cloud.scale) {
            cloud.x = bgCanvas.width + 100;
            cloud.y = Math.random() * (bgCanvas.height * 0.4);
        }
        drawAnimeCloud(bgCtx, cloud.x, cloud.y, cloud.scale, cloud.opacity);
    });

    // Drifting flower petals (Sakura, Lavender, Orchids, Sunflowers)
    petals.forEach(p => {
        p.y += p.speedY * dt;
        p.angleOsc += p.oscillationSpeed * dt;
        p.x += (p.speedX + Math.sin(p.angleOsc) * 0.25) * dt;
        p.angle += p.rotationSpeed * dt;

        if (p.y > bgCanvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * bgCanvas.width;
        }
        if (p.x > bgCanvas.width + 20) {
            p.x = -20;
        }

        if (p.type === 'sakura') {
            drawSakuraPetal(bgCtx, p.x, p.y, p.size, p.angle);
        } else if (p.type === 'lavender') {
            drawLavenderBud(bgCtx, p.x, p.y, p.size, p.angle);
        } else if (p.type === 'orchid') {
            drawOrchidPetal(bgCtx, p.x, p.y, p.size, p.angle);
        } else if (p.type === 'sunflower') {
            drawSunflowerPetal(bgCtx, p.x, p.y, p.size, p.angle);
        }
    });

    // Update cursor-tracking interactive balloons on the unboxing page
    if (typeof updateIntroBalloons === 'function') {
        updateIntroBalloons(dt);
    }

    requestAnimationFrame(renderBackground);
}

window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();
requestAnimationFrame(renderBackground);


// ==========================================================================
// AUDIO SYSTEM (WEB AUDIO API SYNTHESIZER)
// ==========================================================================
function initAudio() {
    if (audioContext) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
}

function playSynthPop() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.type = 'triangle';
    const now = audioContext.currentTime;
    
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
    
    osc.start(now);
    osc.stop(now + 0.16);
    
    // Noise burst
    const bufferSize = audioContext.sampleRate * 0.1;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noiseNode = audioContext.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);
    
    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noiseNode.start(now);
    noiseNode.stop(now + 0.11);
}

function playGiftUnwrapSound() {
    unwrapAudio.currentTime = 0;
    unwrapAudio.play().catch(e => console.log("Failed to play PRESENT-GIFT-SOUND.mp3:", e));
}

function playSynthBlow() {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    const bufferSize = audioContext.sampleRate * 0.25;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = audioContext.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 0.25);
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noiseNode.start(now);
    noiseNode.stop(now + 0.26);
}

function playSynthChime() {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    const notes = [587.33, 739.99, 880.00];
    notes.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gainNode.gain.setValueAtTime(0.1, now + idx * 0.07);
        gainNode.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.07 + 0.15);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.2);
    });
}

function startBgMusic() {
    if (!audioContext) return;
    if (isPlayingMusic) return;
    bgMusicGain = audioContext.createGain();
    bgMusicGain.gain.setValueAtTime(0.04, audioContext.currentTime);
    bgMusicGain.connect(audioContext.destination);
    isPlayingMusic = true;
    playAmbientLoop();
}

function playAmbientLoop() {
    if (!isPlayingMusic || isMelodyPlaying) return;
    const now = audioContext.currentTime;
    const chordFrequencies = [
        [174.61, 261.63, 349.23, 440.00], // Fmaj7
        [196.00, 293.66, 392.00, 493.88], // G6
        [164.81, 246.94, 329.63, 392.00], // Em7
        [220.00, 277.18, 329.63, 440.00]  // A7
    ];
    const timePerChord = 4.0;
    const chordIndex = Math.floor(now / timePerChord) % chordFrequencies.length;
    const currentChord = chordFrequencies[chordIndex];
    
    currentChord.forEach(freq => {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        const localGain = audioContext.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(0.03, now + 1.0);
        localGain.gain.setValueAtTime(0.03, now + timePerChord - 1.0);
        localGain.gain.linearRampToValueAtTime(0, now + timePerChord);
        
        osc.connect(localGain);
        localGain.connect(bgMusicGain);
        osc.start(now);
        osc.stop(now + timePerChord);
    });
    
    setTimeout(() => {
        if (isPlayingMusic && !isMelodyPlaying) playAmbientLoop();
    }, timePerChord * 1000 - 100);
}

function stopBgMusic() {
    isPlayingMusic = false;
    if (bgMusicGain) {
        bgMusicGain.disconnect();
        bgMusicGain = null;
    }
}

function playHappyBirthdayMelody() {
    if (!audioContext) return;
    isMelodyPlaying = true;
    
    if (bgMusicGain) {
        bgMusicGain.gain.linearRampToValueAtTime(0.005, audioContext.currentTime + 0.3);
    }
    
    const now = audioContext.currentTime;
    const notes = [
        ['C4', 261.63, 0.4], ['C4', 261.63, 0.2], ['D4', 293.66, 0.6], ['C4', 261.63, 0.6], ['F4', 349.23, 0.6], ['E4', 329.63, 1.2],
        ['C4', 261.63, 0.4], ['C4', 261.63, 0.2], ['D4', 293.66, 0.6], ['C4', 261.63, 0.6], ['G4', 392.00, 0.6], ['F4', 349.23, 1.2],
        ['C4', 261.63, 0.4], ['C4', 261.63, 0.2], ['C5', 523.25, 0.6], ['A4', 440.00, 0.6], ['F4', 349.23, 0.6], ['E4', 329.63, 0.6], ['D4', 293.66, 1.0],
        ['Bb4', 466.16, 0.4], ['Bb4', 466.16, 0.2], ['A4', 440.00, 0.6], ['F4', 349.23, 0.6], ['G4', 392.00, 0.6], ['F4', 349.23, 1.2]
    ];
    
    let timeAccumulator = 0;
    notes.forEach(note => {
        const [name, freq, duration] = note;
        const noteTime = timeAccumulator;
        
        setTimeout(() => {
            if (!audioContext) return;
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioContext.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.16, audioContext.currentTime + 0.04);
            gainNode.gain.setValueAtTime(0.16, audioContext.currentTime + duration - 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + duration);
        }, noteTime * 1000);
        
        timeAccumulator += duration + 0.05;
    });
    
    setTimeout(() => {
        isMelodyPlaying = false;
        if (isPlayingMusic && bgMusicGain) {
            bgMusicGain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 1.0);
            playAmbientLoop();
        }
    }, timeAccumulator * 1000);
}

// Audio Toggle Button
const audioToggleBtn = document.getElementById('audio-toggle');
audioToggleBtn.addEventListener('click', () => {
    initAudio();
    if (isPlayingMusic || !bdaySong.paused) {
        stopBgMusic();
        bdaySong.pause();
        audioToggleBtn.classList.remove('playing');
        audioToggleBtn.querySelector('i').className = "fas fa-volume-mute";
    } else {
        if (candleSnuffed) {
            bdaySong.play().catch(e => console.log("Failed to play bdaySong:", e));
        } else {
            startBgMusic();
        }
        audioToggleBtn.classList.add('playing');
        audioToggleBtn.querySelector('i').className = "fas fa-music";
        playSynthChime();
    }
});


// ==========================================================================
// INTRO SCREEN & PARTY POPPER UNBOXING TRANSITION
// ==========================================================================
const introScreen = document.getElementById('intro-screen');
const giftBoxTrigger = document.getElementById('gift-box-trigger');
const mainContent = document.getElementById('main-content');

giftBoxTrigger.addEventListener('click', () => {
    if (giftBoxTrigger.classList.contains('open')) return;
    
    initAudio();
    playGiftUnwrapSound();
    
    giftBoxTrigger.classList.add('open');
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Spawn party poppers from box center & bottom corners
    createConfettiBurst(width / 2, height / 2, 70); 
    createConfettiBurst(50, height - 50, 45); 
    createConfettiBurst(width - 50, height - 50, 45); 
    
    setTimeout(() => {
        introScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        
        startBgMusic();
        audioToggleBtn.classList.add('playing');
        
        // Show back button
        const giftBackBtn = document.getElementById('gift-back-btn');
        if (giftBackBtn) {
            giftBackBtn.classList.remove('hidden');
        }
        
        setTimeout(() => {
            launchCelebratoryFireworks();
            initBackgroundBalloons();
        }, 800);
        
    }, 1100);
});

// Back to Gift button click handler
const giftBackBtn = document.getElementById('gift-back-btn');
if (giftBackBtn) {
    giftBackBtn.addEventListener('click', () => {
        giftBackBtn.classList.add('hidden');
        
        // Reset and fade back to intro screen overlay
        if (introScreen) {
            introScreen.classList.remove('fade-out');
        }
        if (giftBoxTrigger) {
            giftBoxTrigger.classList.remove('open');
        }
        if (mainContent) {
            mainContent.classList.add('hidden');
        }
        
        // Stop music and reset toggle state
        stopBgMusic();
        bdaySong.pause();
        bdaySong.currentTime = 0;
        if (audioToggleBtn) {
            audioToggleBtn.classList.remove('playing');
            audioToggleBtn.querySelector('i').className = "fas fa-music";
        }
        
        // Reset candle wish states
        candleSnuffed = false;
        const singleCandle = document.getElementById('single-candle');
        if (singleCandle) {
            singleCandle.classList.remove('snuffed');
        }
        
        // Reset washitsu room scroll lock & surprise envelope section
        const room = document.querySelector('.japanese-washitsu-room');
        if (room) {
            room.classList.remove('scroll-enabled');
            room.classList.add('scroll-locked');
            room.scrollTop = 0;
        }
        const envelopeScene = document.querySelector('.room-envelope-scene');
        if (envelopeScene) {
            envelopeScene.classList.add('surprise-hidden');
        }
        const scrollBtn = document.getElementById('scroll-down-arrow-btn');
        if (scrollBtn) {
            scrollBtn.classList.add('hidden');
        }
        
        // Clear background balloons in dashboard
        if (typeof backgroundBalloons !== 'undefined') {
            backgroundBalloons = [];
        }
        const bgBalloonsContainer = document.getElementById('bg-balloons-container');
        if (bgBalloonsContainer) {
            bgBalloonsContainer.innerHTML = '';
        }
        
        // Re-scatter/re-initialize intro screen balloons
        initIntroBalloons();
    });
}


// ==========================================================================
// CONFETTI, STREAMERS & FIREWORKS CANVAS PHYSICS
// ==========================================================================
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let fireworks = [];

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

class ConfettiParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isStreamer = Math.random() < 0.25;
        this.width = Math.random() * 8 + 4;
        this.height = this.isStreamer ? Math.random() * 24 + 14 : this.width;
        
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 11 + 4;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force - 3;
        
        this.gravity = 0.24;
        this.friction = 0.97;
        this.opacity = 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        
        const colors = ['#ffa3b1', '#ff5c75', '#80deea', '#c8e6c9', '#ffe082', '#d1c4e9'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        if (this.vy > 1.0) {
            this.opacity -= 0.015;
        }
    }
    
    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate((this.rotation * Math.PI) / 180);
        confettiCtx.shadowColor = this.color;
        confettiCtx.shadowBlur = 3;
        confettiCtx.fillStyle = this.color;
        confettiCtx.globalAlpha = this.opacity;
        
        if (this.isStreamer) {
            confettiCtx.fillRect(-2, -this.height / 2, 4, this.height);
        } else {
            confettiCtx.fillRect(-this.width / 2, -this.width / 2, this.width, this.width);
        }
        confettiCtx.restore();
    }
}

class FireworkSpark {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.gravity = 0.12;
        this.friction = 0.98;
        this.opacity = 1;
        this.life = Math.random() * 0.02 + 0.012;
    }
    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.life;
    }
    draw() {
        confettiCtx.beginPath();
        confettiCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        confettiCtx.fillStyle = this.color;
        confettiCtx.shadowColor = this.color;
        confettiCtx.shadowBlur = 6;
        confettiCtx.globalAlpha = this.opacity;
        confettiCtx.fill();
    }
}

class FireworkRocket {
    constructor(startX, startY, targetX, targetY, color) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        
        const dx = targetX - startX;
        const dy = targetY - startY;
        const steps = 30 + Math.random() * 15;
        this.vx = dx / steps;
        this.vy = dy / steps;
        this.trail = [];
        this.exploded = false;
    }
    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();
        this.x += this.vx;
        this.y += this.vy;
        if (this.vy < 0 && this.y <= this.targetY) {
            this.exploded = true;
            this.explode();
        } else if (this.vy >= 0 && this.y >= this.targetY) {
            this.exploded = true;
            this.explode();
        }
    }
    explode() {
        const sparkCount = Math.floor(Math.random() * 30 + 40);
        for (let i = 0; i < sparkCount; i++) {
            confettiParticles.push(new FireworkSpark(this.x, this.y, this.color));
        }
    }
    draw() {
        confettiCtx.beginPath();
        this.trail.forEach((point, idx) => {
            const size = (idx / this.trail.length) * 3;
            confettiCtx.lineTo(point.x, point.y);
            confettiCtx.lineWidth = size;
        });
        confettiCtx.strokeStyle = this.color;
        confettiCtx.shadowColor = this.color;
        confettiCtx.shadowBlur = 8;
        confettiCtx.stroke();
        
        confettiCtx.beginPath();
        confettiCtx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        confettiCtx.fillStyle = '#ffffff';
        confettiCtx.fill();
    }
}

function spawnRocketFirework(side) {
    const width = confettiCanvas.width;
    const height = confettiCanvas.height;
    const startX = side === 'left' ? Math.random() * 80 + 30 : width - Math.random() * 80 - 30;
    const startY = height - 20;
    const targetX = side === 'left' ? width * 0.25 + (Math.random() - 0.5) * 80 : width * 0.75 + (Math.random() - 0.5) * 80;
    const targetY = height * 0.2 + Math.random() * (height * 0.2);
    
    const colors = ['#ff8da1', '#ffe082', '#80deea', '#d1c4e9', '#ff3366', '#ffffff'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    fireworks.push(new FireworkRocket(startX, startY, targetX, targetY, chosenColor));
}

function launchCelebratoryFireworks() {
    spawnRocketFirework('left');
    spawnRocketFirework('right');
    let fired = 0;
    const interval = setInterval(() => {
        spawnRocketFirework(Math.random() > 0.5 ? 'left' : 'right');
        fired++;
        if (fired >= 5) clearInterval(interval);
    }, 450);
}

function createConfettiBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
        confettiParticles.push(new ConfettiParticle(x, y));
    }
}

function updateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.update();
        if (fw.exploded) fireworks.splice(i, 1);
        else fw.draw();
    }
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];
        p.update();
        if (p.opacity <= 0 || p.y > confettiCanvas.height) {
            confettiParticles.splice(i, 1);
        } else {
            p.draw();
        }
    }
    requestAnimationFrame(updateConfetti);
}
requestAnimationFrame(updateConfetti);

// Screen clicks launch rockets
window.addEventListener('click', (e) => {
    if (mainContent.classList.contains('hidden')) return;
    if (e.target.closest('.card') || e.target.closest('button')) return;
    spawnRocketFirework(e.clientX < window.innerWidth / 2 ? 'left' : 'right');
});


// ==========================================================================
// ACT 1: SINGLE-CANDLE BIRTHDAY CAKE
// ==========================================================================
const singleCandle = document.getElementById('single-candle');
const cakeWrapper = document.getElementById('interactive-cake-wrapper');

singleCandle.addEventListener('click', () => {
    if (candleSnuffed) return;
    
    candleSnuffed = true;
    playSynthBlow();
    singleCandle.classList.add('snuffed');
    
    cakeWrapper.classList.remove('bounce-cake');
    void cakeWrapper.offsetWidth;
    cakeWrapper.classList.add('bounce-cake');
    
    const rect = singleCandle.getBoundingClientRect();
    createConfettiBurst(rect.left + rect.width / 2, rect.top, 10);
    
    triggerCakeSuccess();
});

function triggerCakeSuccess() {
    // 1. Stop background ambient loop and play the local HBD song MP3
    stopBgMusic();
    bdaySong.currentTime = 0;
    bdaySong.play().catch(e => console.log("Failed to play shinchanbday.mp3:", e));
    
    // Sync music toggle button
    if (audioToggleBtn) {
        audioToggleBtn.classList.add('playing');
        audioToggleBtn.querySelector('i').className = "fas fa-music";
    }

    launchCelebratoryFireworks();
    
    // Reveal the scroll down button immediately so she can click to navigate
    const scrollBtn = document.getElementById('scroll-down-arrow-btn');
    if (scrollBtn) {
        scrollBtn.classList.remove('hidden');
    }
    
    // 2. Reveal the hidden surprise envelope below the cake and enable room scrolling
    //    (but DON'T auto-scroll — the user will click the bouncing down arrow)
    setTimeout(() => {
        const envelopeScene = document.querySelector('.room-envelope-scene');
        if (envelopeScene) {
            envelopeScene.classList.remove('surprise-hidden');
        }
        
        const room = document.querySelector('.japanese-washitsu-room');
        if (room) {
            room.classList.remove('scroll-locked');
            room.classList.add('scroll-enabled');
        }
    }, 1500);
}


// ==========================================================================
// BACKGROUND INTERACTIVE BALLOONS RUNNER (HEART, STAR, OVAL)
// ==========================================================================
const balloonBgLayer = document.getElementById('balloon-bg-layer');
let backgroundBalloons = [];

function spawnBackgroundBalloon() {
    if (mainContent.classList.contains('hidden')) return;
    
    const shapes = ['oval', 'heart', 'star'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * 50 + 75;
    const startX = Math.random() * (window.innerWidth - size - 50) + 25;
    const speed = Math.random() * 0.8 + 0.4;
    const driftRange = Math.random() * 3.5 + 1.5;
    const driftSpeed = Math.random() * 0.012 + 0.007;
    let angle = Math.random() * Math.PI * 2;
    
    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.2}px`;
    balloon.style.left = `${startX}px`;
    balloon.style.bottom = `-${size * 2.2}px`;
    
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    
    let svgPath = '';
    if (shape === 'oval') {
        svgPath = `
            <ellipse cx="50" cy="50" rx="35" ry="46" fill="${color}" />
            <path d="M50,96 L47,101 L53,101 Z" fill="${color}" />
            <line x1="50" y1="101" x2="50" y2="120" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" />
            <ellipse cx="32" cy="30" rx="6" ry="10" fill="rgba(255,255,255,0.3)" transform="rotate(-15, 32, 30)" />
        `;
    } else if (shape === 'heart') {
        svgPath = `
            <path d="M50,30 C50,30 36,10 21,21 C6,32 21,65 50,96 C79,65 94,32 79,21 C64,10 50,30 50,30 Z" fill="${color}" />
            <path d="M50,96 L47,101 L53,101 Z" fill="${color}" />
            <line x1="50" y1="101" x2="50" y2="120" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" />
            <path d="M30,28 C26,28 24,32 24,38" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linecap="round" fill="none" />
        `;
    } else if (shape === 'star') {
        svgPath = `
            <polygon points="50,10 63,36 92,36 69,52 77,78 50,62 23,78 31,52 8,36 37,36" fill="${color}" />
            <path d="M50,62 L47,98 L53,98 Z" fill="${color}" />
            <line x1="50" y1="98" x2="50" y2="120" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" />
            <circle cx="40" cy="35" r="4" fill="rgba(255,255,255,0.35)" />
        `;
    }
    
    balloon.innerHTML = `
        <svg viewBox="0 0 100 120" class="floating-balloon-svg">
            ${svgPath}
        </svg>
    `;
    
    balloonBgLayer.appendChild(balloon);
    
    const bState = {
        element: balloon,
        x: startX,
        y: -size * 2.2,
        speed: speed,
        driftRange: driftRange,
        driftSpeed: driftSpeed,
        angle: angle,
        width: size
    };
    
    balloon.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        popBackgroundBalloon(bState);
    });
    
    backgroundBalloons.push(bState);
}

function popBackgroundBalloon(bState) {
    const idx = backgroundBalloons.indexOf(bState);
    if (idx === -1) return;
    
    playSynthPop();
    
    const el = bState.element;
    const rect = el.getBoundingClientRect();
    createConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
    
    el.remove();
    backgroundBalloons.splice(idx, 1);
    
    setTimeout(spawnBackgroundBalloon, 1200);
}

function runBackgroundBalloonsLoop() {
    const screenHeight = window.innerHeight;
    
    for (let i = backgroundBalloons.length - 1; i >= 0; i--) {
        const b = backgroundBalloons[i];
        b.y += b.speed;
        b.element.style.bottom = `${b.y}px`;
        
        b.angle += b.driftSpeed;
        const currentX = b.x + Math.sin(b.angle) * b.driftRange * 4.5;
        b.element.style.left = `${currentX}px`;
        
        if (b.y > screenHeight + 80) {
            b.element.remove();
            backgroundBalloons.splice(i, 1);
            spawnBackgroundBalloon();
        }
    }
    
    if (backgroundBalloons.length < 5 && !mainContent.classList.contains('hidden')) {
        spawnBackgroundBalloon();
    }
    
    requestAnimationFrame(runBackgroundBalloonsLoop);
}

function initBackgroundBalloons() {
    for (let i = 0; i < 5; i++) {
        setTimeout(spawnBackgroundBalloon, i * 1600);
    }
    runBackgroundBalloonsLoop();
}


// Act 1 scroll button listener
const scrollDownArrowBtn = document.getElementById('scroll-down-arrow-btn');
if (scrollDownArrowBtn) {
    scrollDownArrowBtn.addEventListener('click', () => {
        const room = document.querySelector('.japanese-washitsu-room');
        if (room) {
            room.scrollTo({ top: room.clientHeight, behavior: 'smooth' });
        }
    });
}

// ==========================================================================
// ACT 2: SCRAPBOOK ENVELOPE SURPRISE (SLIDING CARD)
// ==========================================================================
const envelopeTrigger = document.getElementById('envelope-trigger');

envelopeTrigger.addEventListener('click', () => {
    const wrapper = envelopeTrigger.parentElement;
    initAudio();
    playSynthChime();
    wrapper.classList.toggle('open');
    if (wrapper.classList.contains('open')) {
        const rect = envelopeTrigger.getBoundingClientRect();
        spawnHeartDrifters(rect.left + rect.width / 2, rect.top);
    }
});

function spawnHeartDrifters(x, y) {
    const symbols = ['❤️', '💖', '🌸', '✨'];
    let count = 0;
    const interval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = `${x + (Math.random() - 0.5) * 80}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, 1600);
        count++;
        if (count >= 12) clearInterval(interval);
    }, 150);
}

// ==========================================================================
// INTERACTIVE VIEWPORT BALLOONS (BOUNCING & CENTER ZONE AVOIDANCE PHYSICS)
// ==========================================================================
let introBalloons = [];
let cursorX = -1000;
let cursorY = -1000;

// Track global cursor coordinates
window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});
window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
        cursorX = e.touches[0].clientX;
        cursorY = e.touches[0].clientY;
    }
});
window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
        cursorX = e.touches[0].clientX;
        cursorY = e.touches[0].clientY;
    }
});
window.addEventListener('touchend', () => {
    cursorX = -1000;
    cursorY = -1000;
});
window.addEventListener('touchcancel', () => {
    cursorX = -1000;
    cursorY = -1000;
});
window.addEventListener('mouseleave', () => {
    cursorX = -1000;
    cursorY = -1000;
});

function initIntroBalloons() {
    const container = document.getElementById('intro-balloons-container');
    if (!container) return;
    container.innerHTML = '';
    introBalloons = [];

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768;
    const headerBottom = isMobile ? 160 : 240; // matches CSS header height
    const centerX = w / 2;
    const cardHalfWidth = isMobile ? 140 : 170;
    const cardTop = isMobile ? 340 : 390;

    // Fewer and smaller balloons on mobile for better performance and fit
    const balloonCount = isMobile ? 16 : 30;
    const sizeMin = isMobile ? 50 : 100;
    const sizeRange = isMobile ? 20 : 36;

    const colors = ['#ffb7c5', '#ffe082', '#80deea', '#d1c4e9', '#c8e6c9', '#ff8da1', '#a7ffeb', '#fff9c4', '#ffcc80', '#e1bee7'];
    const shapes = ['oval', 'star'];
    const configs = [];

    for (let i = 0; i < balloonCount; i++) {
        const color = colors[i % colors.length];
        const shape = shapes[i % shapes.length];
        const size = sizeMin + Math.floor(Math.random() * sizeRange);
        
        // Scatter horizontally across the full screen width
        const startX = w * 0.05 + Math.random() * (w * 0.9 - size);
        
        // Scatter vertically below the header divider line
        let startY = (headerBottom + 20) + Math.random() * (h - headerBottom - size * 1.25 - 40);
        
        // If starting coordinate overlaps with the bottom card, push it up under the text
        const bx = startX + size / 2;
        const by = startY + size * 0.6;
        if (by > cardTop && bx > centerX - cardHalfWidth && bx < centerX + cardHalfWidth) {
            startY = headerBottom + 15 + Math.random() * 110;
        }

        configs.push({ color, shape, size, x: startX, y: startY });
    }

    configs.forEach((config) => {
        const balloon = document.createElement('div');
        balloon.className = 'intro-balloon';
        balloon.style.width = `${config.size}px`;
        balloon.style.height = `${config.size * 1.25}px`;
        balloon.style.left = `${config.x}px`;
        balloon.style.top = `${config.y}px`;

        let svgContent = '';
        if (config.shape === 'oval') {
            svgContent = `
                <ellipse cx="50" cy="50" rx="35" ry="46" fill="${config.color}" />
                <path d="M50,96 L47,101 L53,101 Z" fill="${config.color}" />
                <path class="string-path" d="M50,101 Q50,113 50,125" stroke="rgba(0,0,0,0.12)" stroke-width="1.5" fill="none" />
                <ellipse cx="32" cy="30" rx="6" ry="10" fill="rgba(255,255,255,0.35)" transform="rotate(-15, 32, 30)" />
            `;
        } else if (config.shape === 'star') {
            svgContent = `
                <polygon points="50,10 63,36 92,36 69,52 77,78 50,62 23,78 31,52 8,36 37,36" fill="${config.color}" />
                <path d="M50,62 L47,98 L53,98 Z" fill="${config.color}" />
                <path class="string-path" d="M50,98 Q50,111 50,125" stroke="rgba(0,0,0,0.12)" stroke-width="1.5" fill="none" />
                <circle cx="40" cy="35" r="4" fill="rgba(255,255,255,0.35)" />
            `;
        }

        balloon.innerHTML = `
            <svg viewBox="0 0 100 130" style="width:100%; height:100%;">
                ${svgContent}
            </svg>
        `;

        container.appendChild(balloon);

        introBalloons.push({
            element: balloon,
            size: config.size,
            shape: config.shape,
            x: config.x,
            y: config.y,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4 - 0.1,
            swing: 0,
            targetSwing: 0,
            wavePhase: Math.random() * Math.PI * 2
        });
    });
}

function updateIntroBalloons(dt) {
    if (typeof dt === 'undefined') dt = 1.0;
    const screenOverlay = document.getElementById('intro-screen');
    if (!screenOverlay || screenOverlay.classList.contains('fade-out')) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768;
    const centerX = w / 2;
    const margin = 10;
    const headerBottom = isMobile ? 160 : 240;
    const cardHalfWidth = isMobile ? 140 : 170;
    const cardTop = isMobile ? 340 : 390;

    // Mutual balloon-to-balloon soft repulsion & instant separation displacement to prevent overlap/clumping
    for (let i = 0; i < introBalloons.length; i++) {
        const b1 = introBalloons[i];
        const b1x = b1.x + b1.size / 2;
        const b1y = b1.y + b1.size * 0.6;
        for (let j = i + 1; j < introBalloons.length; j++) {
            const b2 = introBalloons[j];
            const b2x = b2.x + b2.size / 2;
            const b2y = b2.y + b2.size * 0.6;

            const dx = b2x - b1x;
            const dy = b2y - b1y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Minimum distance between balloon centers (roughly their average size)
            const minDist = (b1.size + b2.size) * 0.54;

            if (dist < minDist && dist > 0) {
                const overlap = minDist - dist;
                const angle = Math.atan2(dy, dx);
                
                // 1. Instant soft positional displacement to force them apart (prevents static overlaps!)
                const adjustX = Math.cos(angle) * overlap * 0.5;
                const adjustY = Math.sin(angle) * overlap * 0.5;
                b1.x -= adjustX;
                b1.y -= adjustY;
                b2.x += adjustX;
                b2.y += adjustY;

                // 2. Slow-motion velocity bounce/slide
                const pushX = Math.cos(angle) * overlap * 0.05 * dt;
                const pushY = Math.sin(angle) * overlap * 0.05 * dt;
                b1.vx -= pushX;
                b1.vy -= pushY;
                b2.vx += pushX;
                b2.vy += pushY;
            }
        }
    }

    introBalloons.forEach(b => {
        // Continuous slow float drift (random walk force)
        b.vx += (Math.random() - 0.5) * 0.04 * dt;
        b.vy += (Math.random() - 0.5) * 0.04 * dt;

        // Friction / air resistance
        b.vx *= Math.pow(0.98, dt);
        b.vy *= Math.pow(0.98, dt);

        const bx = b.x + b.size / 2;
        const by = b.y + b.size * 0.6;

        // 1. Repel strictly from the gift box card rectangular area at the bottom center
        if (by > cardTop && bx > centerX - cardHalfWidth && bx < centerX + cardHalfWidth) {
            // Push left/right out of card bounds
            if (bx < centerX) {
                b.vx -= 0.2 * dt; // push left
            } else {
                b.vx += 0.2 * dt; // push right
            }
            // Push up if colliding with the top edge of the card
            if (by < cardTop + 45) {
                b.vy -= 0.15 * dt;
            }
        }

        // 2. Repel from mouse cursor
        if (cursorX !== -1000 && cursorY !== -1000) {
            const bx = b.x + b.size / 2;
            const by = b.y + b.size * 0.6;
            const dx = bx - cursorX;
            const dy = by - cursorY;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 180) {
                const force = (180 - dist) / 180;
                const angle = Math.atan2(dy, dx);
                
                b.vx += Math.cos(angle) * force * 0.7 * dt;
                b.vy += Math.sin(angle) * force * 0.7 * dt;
                b.targetSwing = b.vx * 15;
            } else {
                b.targetSwing = 0;
            }
        } else {
            b.targetSwing = 0;
        }

        // Clamp speed
        const speed = Math.sqrt(b.vx*b.vx + b.vy*b.vy);
        if (speed > 1.4) {
            b.vx = (b.vx / speed) * 1.4;
            b.vy = (b.vy / speed) * 1.4;
        }
        if (speed < 0.15 && speed > 0) {
            b.vx = (b.vx / speed) * 0.15;
            b.vy = (b.vy / speed) * 0.15;
        }

        // Apply velocities
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Bounce off screen limits
        const balloonWidth = b.size;
        const balloonHeight = b.size * 1.25;

        if (b.x < margin) {
            b.x = margin;
            b.vx = Math.abs(b.vx) * 0.8;
        } else if (b.x > w - balloonWidth - margin) {
            b.x = w - balloonWidth - margin;
            b.vx = -Math.abs(b.vx) * 0.8;
        }

        // Top ceiling bounce
        if (b.y < headerBottom + 10) {
            b.y = headerBottom + 10;
            b.vy = Math.abs(b.vy) * 0.8; // bounce down
        } else if (b.y > h - balloonHeight - margin) {
            b.y = h - balloonHeight - margin;
            b.vy = -Math.abs(b.vy) * 0.8; // bounce up
        }

        // Apply swing angle spring dampening
        b.swing += (b.targetSwing - b.swing) * 0.08 * dt;

        // Animate wavy string based on velocity and float phase
        b.wavePhase += (0.08 + speed * 0.1) * dt;
        const path = b.element.querySelector('.string-path');
        if (path) {
            const startY = b.shape === 'oval' ? 101 : 98;
            const midY = startY + (125 - startY) / 2;
            const intensity = 3.5 + speed * 15;
            const waveX = Math.sin(b.wavePhase) * intensity;
            path.setAttribute('d', `M50,${startY} Q${50 + waveX},${midY} 50,125`);
        }

        // Position update
        b.element.style.left = `${b.x}px`;
        b.element.style.top = `${b.y}px`;
        b.element.style.transform = `rotate(${b.swing}deg)`;
    });
}

// Call on startup
document.addEventListener('DOMContentLoaded', () => {
    initIntroBalloons();
});

let lastResizeWidth = window.innerWidth;
window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768;

    // If crossing the mobile/desktop threshold, re-init balloons with new sizes
    const wasMobile = lastResizeWidth < 768;
    if (isMobile !== wasMobile) {
        lastResizeWidth = w;
        initIntroBalloons();
        return;
    }
    lastResizeWidth = w;

    const headerBottom = isMobile ? 160 : 240;
    const centerX = w / 2;
    const cardHalfWidth = isMobile ? 140 : 170;
    const cardTop = isMobile ? 340 : 390;
    const margin = 10;

    introBalloons.forEach((b) => {
        b.x = Math.max(margin, Math.min(w - b.size - margin, b.x));
        b.y = Math.max(headerBottom + 10, Math.min(h - b.size * 1.25 - margin, b.y));
        
        // Avoid getting stuck in the card on resize
        const bx = b.x + b.size / 2;
        const by = b.y + b.size * 0.6;
        if (by > cardTop && bx > centerX - cardHalfWidth && bx < centerX + cardHalfWidth) {
            b.y = headerBottom + 15 + Math.random() * 110;
        }
    });
});
