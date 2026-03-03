document.addEventListener("DOMContentLoaded", function () {

  const cake = document.getElementById("cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const TOTAL_CANDLES = 1;
  let candles = [];

  /* =========================
    AUDIO SETUP
  ========================= */

  const ambientSound = new Audio("assets/sounds/ambient.mp3");
  const blowSound = new Audio("assets/sounds/blow.mp3");
  const firecrackerSound = new Audio("assets/sounds/firecracker.mp3");
  const transitionSound = new Audio("assets/sounds/transition.mp3");

  ambientSound.loop = false;
  ambientSound.volume = 0.4;

  document.addEventListener("click", function startAmbientOnce() {
    ambientSound.play();
    document.removeEventListener("click", startAmbientOnce);
  });


  /* =========================
     CREATE SIDE CANDLES
  ========================== */

  function createCandles() {

    const cakeWidth = cake.offsetWidth;
    const cakeHeight = cake.offsetHeight;

    const leftX = cakeWidth * 0.5;

    const topY = cakeHeight * 0.1;
    const bottomY = cakeHeight * 0.0054;

    placeSide(TOTAL_CANDLES, leftX, topY, bottomY, 0);

    updateCount();
  }

  function placeSide(count, xPos, topY, bottomY, tilt) {

    for (let i = 0; i < count; i++) {

      const progress = i / (count - 1);
      const y = topY + progress * (bottomY - topY);

      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = `${xPos}px`;
      candle.style.top = `${y}px`;
      candle.style.transform = `translateX(-50%) rotate(${tilt}deg)`;

      const flame = document.createElement("div");
      flame.className = "flame";

      candle.appendChild(flame);
      cake.appendChild(candle);

      candles.push(candle);
    }
  }

  function updateCount() {
    const active = candles.filter(c => !c.classList.contains("out")).length;
    candleCountDisplay.textContent = active;
  }

  /* =========================
     BUTTON BLOW LOGIC
  ========================== */

  const blowBtn = document.createElement("button");
  blowBtn.textContent = "Blow Candles";
  blowBtn.className = "blow-btn";
  document.body.appendChild(blowBtn);

  blowBtn.addEventListener("click", blowCandles);

  function blowCandles() {
  blowSound.currentTime = 0;
  blowSound.play();
    // Flames lean before going out
    candles.forEach(c => {
      if (!c.classList.contains("out")) {
        c.querySelector(".flame").style.transform =
          "translateX(-50%) rotate(-25deg) scale(1.1)";
      }
    });

    // Gradually extinguish
    let i = candles.length - 1;

    const interval = setInterval(() => {

      if (i < 0) {
        clearInterval(interval);
        celebrate();
        return;
      }

      if (!candles[i].classList.contains("out")) {
        candles[i].classList.add("out");
        createSmoke(candles[i]);
        updateCount();
      }

      i--;

    }, 150);
  }

  /* =========================
     SMOKE EFFECT
  ========================== */

  function createSmoke(candle) {

    const smoke = document.createElement("div");
    smoke.className = "smoke";

    candle.appendChild(smoke);

    setTimeout(() => {
      smoke.remove();
    }, 1500);
  }

  /* =========================
     CELEBRATION
  ========================== */

  function celebrate() {
    fadeToBlack();
    launchFireworks();
    setTimeout(showFinalMessage, 2500);
  }

  function fadeToBlack() {
    transitionSound.currentTime = 0;
    transitionSound.play();

    document.body.style.transition = "background 2s ease";
    document.body.style.background = "black";
  }

  /* =========================
     REALISTIC FIREWORKS
  ========================== */

  function launchFireworks() {
    firecrackerSound.currentTime = 0;
    firecrackerSound.play();

    const particles = [];

    for (let i = 0; i < 250; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 7 + 3,
        radius: Math.random() * 3 + 2,
        color: `hsl(${Math.random()*360},100%,60%)`
      });
    }

    function animate() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.speed *= 0.95;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* =========================
     FINAL MESSAGE
  ========================== */

  function showFinalMessage() {

    const final = document.createElement("div");
    final.className = "final-screen";
    final.innerHTML = `
      <h2>No matter how much we annoy you…</h2>
      <p>We will always be there for you.</p>
      <p>And will always be proud of you.</p>
      <p style="margin-top:20px;">Happy Birthday, Deshu ❤️</p>
    `;

    document.body.appendChild(final);
    setTimeout(() => final.classList.add("show"), 100);
  }

  window.addEventListener("load", createCandles);

});