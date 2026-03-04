const startBtn = document.getElementById("startBtn");
const introScreen = document.getElementById("introScreen");
const videoContainer = document.getElementById("videoContainer");
const moveBtn = document.getElementById("moveBtn");

const VIDEO_DURATION = 547000; // 9min 7sec

startBtn.addEventListener("click", () => {

    introScreen.style.opacity = "0";

    setTimeout(() => {
        introScreen.style.display = "none";
        videoContainer.style.opacity = "1";
    }, 900);

    setTimeout(() => {
        moveBtn.style.opacity = "1";
    }, VIDEO_DURATION);

});

moveBtn.addEventListener("click", () => {
    window.location.href = "../cake/cake.html";
});
