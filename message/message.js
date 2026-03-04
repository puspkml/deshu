const startBtn = document.getElementById("startBtn");
const introScreen = document.getElementById("introScreen");
const videoContainer = document.getElementById("videoContainer");
const moveBtn = document.getElementById("moveBtn");

const VIDEO_DURATION = 47000; // 47 seconds

startBtn.addEventListener("click", () => {

    introScreen.style.opacity = "0";

    setTimeout(() => {

        introScreen.style.display = "none";
        videoContainer.style.opacity = "1";

        // start timer AFTER video appears
        setTimeout(() => {
            moveBtn.style.opacity = "1";
        }, VIDEO_DURATION);

    }, 900);

});

moveBtn.addEventListener("click", () => {
    window.location.href = "../cake/cake.html";
});
