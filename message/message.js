const startBtn = document.getElementById("startBtn");
const introScreen = document.getElementById("introScreen");
const messageVideo = document.getElementById("messageVideo");
const moveBtn = document.getElementById("moveBtn");

startBtn.addEventListener("click", () => {

    introScreen.style.opacity = "0";

    setTimeout(() => {
        introScreen.style.display = "none";
        messageVideo.style.opacity = "1";
        messageVideo.play();
    }, 1200);

});

messageVideo.onended = () => {
    moveBtn.style.opacity = "1";
};

moveBtn.addEventListener("click", () => {
    window.location.href = "../cake/cake.html";
});
