document.addEventListener("DOMContentLoaded", () => {

  document.body.classList.add("loaded");

  const target = new Date("March 2, 2026 15:03:00").getTime();

  const entryScreen = document.getElementById("entryScreen");
  const enterBtn = document.getElementById("enterBtn");
  const timerEl = document.getElementById("timer");

  const bangSound = document.getElementById("bangSound");
  const beepSound = document.getElementById("beepSound");
  const tickSound = document.getElementById("tickSound");
  const fireworksSound = document.getElementById("fireworksSound");
  const transitionSound = document.getElementById("transitionSound");

  const flash = document.getElementById("flash");
  const dramaticText = document.getElementById("dramaticText");
  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");
  const creamFade = document.getElementById("creamFade");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  let previousSecond = null;
  let countdownStarted = false;
  let sequenceStarted = false;

  /* =========================
     BUTTON CLICK → UNLOCK + START
  ========================= */

  enterBtn.addEventListener("click", async () => {

    if (countdownStarted) return;
    countdownStarted = true;

    const sounds = [bangSound, beepSound, tickSound, fireworksSound, transitionSound];

    for (let s of sounds) {
      try {
        s.muted = true;
        await s.play();
        s.pause();
        s.currentTime = 0;
        s.muted = false;
      } catch {}
    }

    entryScreen.style.display = "none";
    timerEl.style.display = "block";

    startCountdown();
  });

  /* =========================
     COUNTDOWN
  ========================= */

  function startCountdown() {

    const interval = setInterval(() => {

      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        timerEl.innerHTML = "00:00:00";
        clearInterval(interval);

        if (!sequenceStarted) {
          sequenceStarted = true;
          startFinalSequence();
        }
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);

      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      timerEl.innerHTML =
        `${String(h).padStart(2,'0')}:`+
        `${String(m).padStart(2,'0')}:`+
        `${String(s).padStart(2,'0')}`;

      if (totalSeconds <= 10 && totalSeconds > 0) {
        if (previousSecond !== totalSeconds) {
          previousSecond = totalSeconds;
          const tickClone = tickSound.cloneNode(true);
          tickClone.play().catch(()=>{});
        }
      }

    }, 100);
  }

  /* =========================
     FINAL SEQUENCE
  ========================= */

  function startFinalSequence() {

    beepSound.play().catch(()=>{});

    setTimeout(() => {

      timerEl.style.display = "none";

      flash.classList.add("flash-active");
      bangSound.play().catch(()=>{});

      setTimeout(() => {
        flash.classList.remove("flash-active");
        runTextSequence();
      }, 600);

    }, 400);
  }

  /* =========================
     TEXT SEQUENCE
  ========================= */

  function runTextSequence() {

    dramaticText.innerHTML = "";
    dramaticText.classList.remove("show-text");

    const texts = [
      "19 years ago...",
      "on this day...",
      "the whole world held breath...",
      "for the arrival of the chosen one",
      "the one?"
    ];

    let index = 0;

    function nextText() {

      if (index >= texts.length) {
        setTimeout(grandFinale, 800);
        return;
      }

      dramaticText.innerHTML = texts[index];
      dramaticText.classList.add("show-text");

      setTimeout(() => {
        dramaticText.classList.remove("show-text");
        index++;
        setTimeout(nextText, 800);
      }, 2500);
    }

    nextText();
  }

  /* =========================
     GRAND FINALE
  ========================= */

  function grandFinale() {
    

    dramaticText.innerHTML = "THE ONE!!!";
    dramaticText.classList.add("show-text");

    setTimeout(() => {

      fireworksSound.play().catch(()=>{});

      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          createFirework(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.7
          );
        }, i * 250);
      }

      setTimeout(() => {

        transitionSound.play().catch(()=>{});
        creamFade.classList.add("cream-show");

        setTimeout(() => {
          window.location.href = "timeline/timeline.html";
        }, 2000);

      }, 5000);

    }, 2000);
  }

  /* =========================
     FIREWORK ENGINE
  ========================= */

  function createFirework(x, y) {
    for (let i = 0; i < 80; i++) {
      particles.push({
        x,
        y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 5 + 2,
        radius: Math.random() * 3 + 1,
        alpha: 1
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.02;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, ${Math.random()*200}, 0, ${p.alpha})`;
      ctx.fill();

      if (p.alpha <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(animate);
  }

  animate();

});