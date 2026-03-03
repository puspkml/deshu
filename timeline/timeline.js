document.addEventListener("DOMContentLoaded", function(){

/* =========================
   AUDIO ENGINE
========================= */

const whooshSound = document.getElementById("whooshSound");
const warpSound = document.getElementById("warpSound");
const chimeSound = document.getElementById("chimeSound");
const drumSound = document.getElementById("drumSound");
const funnySound = document.getElementById("funnySound");
const scrollSound = document.getElementById("scrollSound");
const aestheticSound = document.getElementById("aestheticSound");

function playSound(sound, volume = 1){
  if(sound){
    sound.volume = volume;
    sound.currentTime = 0;
    sound.play().catch(()=>{});
  }
}

function stopSound(sound){
  if(sound){
    sound.pause();
    sound.currentTime = 0;
  }
}

/* =========================
   ELEMENTS
========================= */

const startBtn = document.getElementById("startBtn");
const pigSection = document.getElementById("pigSection");
const storyText = document.getElementById("storyText");
const pigImg = document.getElementById("pigImg");
const continueBtn = document.getElementById("continueBtn");
const timelineSection = document.getElementById("timelineSection");
const fadeOverlay = document.getElementById("fadeOverlay");
const whiteFade = document.getElementById("whiteFade");
const docuPanels = document.querySelectorAll(".docu-panel");
const messagesBtn = document.getElementById("messagesBtn");

const canvas = document.getElementById("warpCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =========================
   WARP VARIABLES
========================= */

let stars = [];
let warpSpeed = 0;
let warping = false;
let warpStartTime = 0;
const WARP_DURATION = 14500;

/* =========================
   STAR FIELD
========================= */

function createStars(){
  stars = [];
  for(let i=0;i<900;i++){
    stars.push({
      x: Math.random()*canvas.width - canvas.width/2,
      y: Math.random()*canvas.height - canvas.height/2,
      z: Math.random()*canvas.width
    });
  }
}

function animateWarp(){

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.translate(canvas.width/2, canvas.height/2);

  for(let star of stars){

    star.z -= warpSpeed;
    if(star.z <= 0) star.z = canvas.width;

    const sx = (star.x / star.z) * canvas.width;
    const sy = (star.y / star.z) * canvas.width;
    const size = (1 - star.z / canvas.width) * 6;

    ctx.fillStyle = "white";
    ctx.fillRect(sx, sy, size, size);
  }

  ctx.setTransform(1,0,0,1,0,0);

  if(warping){
    const elapsed = performance.now() - warpStartTime;
    const progress = elapsed / WARP_DURATION;

    if(progress > 0.25 && progress < 0.7){
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "20px Playfair Display";
      ctx.textAlign = "center";
      ctx.fillText(
        "After travelling lightyears of distance...",
        canvas.width * 0.5,
        canvas.height * 0.5
      );
    }

    if(progress < 0.2) warpSpeed += 0.03;
    else if(progress < 0.7) warpSpeed += 0.15;
    else warpSpeed += 0.6;

    if(elapsed >= WARP_DURATION){
      finishWarp();
      return;
    }
  }

  requestAnimationFrame(animateWarp);
}

function startWarp(){

  warpSound.volume = 0;
  warpSound.play();

  let vol = 0;
  const fade = setInterval(()=>{
    if(vol < 0.8){
      vol += 0.03;
      warpSound.volume = vol;
    } else clearInterval(fade);
  },100);

  canvas.style.opacity = 1;
  warping = true;
  warpSpeed = 0.3;
  warpStartTime = performance.now();
  createStars();
  animateWarp();
}

function finishWarp(){

  warping = false;
  whiteFade.classList.add("active");

  setTimeout(()=>{
    stopSound(warpSound);
    playSound(chimeSound,0.8);
  },1200);

  setTimeout(()=>{
    canvas.style.opacity = 0;
    pigSection.scrollIntoView({behavior:"instant"});
  },1200);

  setTimeout(()=>{
    whiteFade.classList.remove("active");
    document.body.style.overflow = "auto";
    startPigStory();
  },1800);
}

/* =========================
   START BUTTON
========================= */

startBtn.addEventListener("click", function(){

  playSound(whooshSound,0.9);

  document.body.style.overflow = "hidden";
  fadeOverlay.classList.add("active");

  setTimeout(()=>{
    fadeOverlay.classList.remove("active");
    startWarp();
  },1500);
});

/* =========================
   PIG STORY
========================= */

function startPigStory(){
  revealPig();
}

function revealPig(){

  const stage = document.querySelector(".white-stage");
  const spotlight = document.getElementById("spotlight");

  stage.classList.add("dark-stage");
  storyText.classList.add("show");

  storyText.innerHTML = "Ladies and gentlemen...";

  setTimeout(()=>{
    storyText.innerHTML = "The moment you've all been waiting for...";
  },2000);

  setTimeout(()=>{
    storyText.innerHTML = "Presenting you the Birthday Girl...";
  },4000);

  /* NEW HUMAN INTERACTION BUTTON */

  setTimeout(()=>{

    const revealBtn = document.createElement("button");
    revealBtn.innerText = "Tap to Reveal";
    revealBtn.className = "primary-btn";
    revealBtn.style.marginTop = "30px";
    storyText.appendChild(document.createElement("br"));
    storyText.appendChild(revealBtn);

    revealBtn.addEventListener("click", ()=>{

      revealBtn.remove();

      /* Drumroll starts immediately from user tap */

      drumSound.currentTime = 4.5;
      drumSound.play();

      const drumDuration = (18 - 4.5) * 1000;

      pigImg.style.opacity = "0";
      spotlight.classList.add("active");

      setTimeout(()=>{

        drumSound.pause();

        setTimeout(()=>{

          pigImg.style.opacity = "1";
          pigImg.classList.add("grand");

          /* Funny sound triggered directly after drum */
          funnySound.currentTime = 0;
          funnySound.play();

        },300);

      }, drumDuration);

    });

  },4500);

  /* After joke */

  setTimeout(()=>{
    storyText.innerHTML = "Just kidding 😭 Relax.";
  }, 4500 + ((18 - 4.5) * 1000) + 2500);

  setTimeout(()=>{
    storyText.innerHTML = "Let's look at the actual Queen of the house.";
    continueBtn.classList.remove("hidden");
  }, 4500 + ((18 - 4.5) * 1000) + 4500);
}
/* =========================
   REVEAL QUEEN
========================= */

continueBtn.addEventListener("click", ()=>{

  playSound(scrollSound,0.8);

  aestheticSound.volume = 0;
  aestheticSound.play();

  let vol = 0;
  const fade = setInterval(()=>{
    if(vol < 0.7){
      vol += 0.03;
      aestheticSound.volume = vol;
    } else clearInterval(fade);
  },100);

  timelineSection.scrollIntoView({behavior:"smooth"});
});

/* =========================
   PANEL OBSERVER
========================= */

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const content = entry.target.querySelector(".docu-content");
      if(content) content.classList.add("show");

      if(entry.target === docuPanels[docuPanels.length - 1]){
        messagesBtn.classList.add("show");
      }
    }
  });
},{threshold:0.6});

docuPanels.forEach(panel=>observer.observe(panel));

/* =========================
   MESSAGES NAVIGATION
========================= */

messagesBtn.addEventListener("click", ()=>{

  let vol = aestheticSound.volume;
  const fadeOut = setInterval(()=>{
    if(vol > 0){
      vol -= 0.05;
      aestheticSound.volume = vol;
    } else {
      clearInterval(fadeOut);
      stopSound(aestheticSound);
    }
  },100);

  playSound(whooshSound,1);

  const flash = document.createElement("div");
  flash.style.position="fixed";
  flash.style.inset="0";
  flash.style.background="black";
  flash.style.zIndex="00000";
  flash.style.opacity="0";
  flash.style.transition="opacity 0.6s ease";
  document.body.appendChild(flash);

  requestAnimationFrame(()=> flash.style.opacity="1");

  setTimeout(()=>{
    window.location.href="../message/message.html";
  },600);

});

});