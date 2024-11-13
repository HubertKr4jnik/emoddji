var board = document.getElementById("board");
var gridColumns = Math.floor(board.offsetWidth / 28);
var gridRows = Math.floor(board.offsetHeight / 28);
var foundOutput = document.getElementById("found");
var roundOutput = document.getElementById("round");
var activeRound = 1;
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var queryRounds = Number(urlParams.get("rounds"));
var queryOddPercentage = urlParams.get("oddPercentage");
var queryNormalEmoji = urlParams.get("normalEmoji");
var queryOddEmoji = urlParams.get("oddEmoji");
var rounds = queryRounds || Number(prompt("How many rounds (1 - 3)?"));
rounds = Number(rounds);
while (rounds <= 0 || rounds > 3 || isNaN(rounds)) {
    rounds = Number(prompt("How many rounds (1 - 3)?"));
}
var oddPercentage = Number(queryOddPercentage) || Number(prompt("What % of emojis should be different?"));
while (oddPercentage <= 0 || oddPercentage > 100 || isNaN(oddPercentage)) {
    oddPercentage = Number(queryOddPercentage) || Number(prompt("What % of emojis should be different?"));
}
var normalEmoji = queryNormalEmoji || prompt("What should be the normal emoji?");
while (normalEmoji == '' || normalEmoji.length > 1) {
    normalEmoji = queryNormalEmoji || prompt("What should be the normal emoji?");
}
var oddEmoji = queryOddEmoji || prompt("What should be the odd emoji?");
while (oddEmoji == '' || oddEmoji.length > 1) {
    oddEmoji = queryOddEmoji || prompt("What should be the odd emoji?");
}
var numOfOddEmojis = Math.round((oddPercentage / 100) * (gridColumns * gridRows)) || 1;
var numOfFoundEmojis = 0;
foundOutput.innerText = "Found ".concat(numOfFoundEmojis, " / ").concat(numOfOddEmojis);
roundOutput.innerText = "Round ".concat(activeRound, " / ").concat(rounds);
board.style.gridTemplateColumns = "repeat(" + gridColumns + "," + " 1fr)";
board.style.gridTemplateRows = "repeat(" + gridRows + "," + " 1fr)";
for (var i = 0; i < gridColumns * gridRows; i++) {
    board.innerHTML += "<div class='cell'></div>";
}
var cells = document.querySelectorAll(".cell");
cells.forEach(function (cell) {
    cell.innerText = normalEmoji;
});
var random = Math.floor(Math.random() * cells.length);
var setCheckedCells = function (e) {
    e.target.classList.remove("odd");
    e.target.removeEventListener('click', setCheckedCells);
    e.target.innerText = "✅";
    numOfFoundEmojis++;
    foundOutput.innerText = "Found ".concat(numOfFoundEmojis, " / ").concat(numOfOddEmojis);
};
var setOddcells = function (index) {
    if (cells[index].classList.contains("odd")) {
        random = Math.floor(Math.random() * cells.length);
        setOddcells(random);
    }
    else {
        cells[index].innerText = oddEmoji;
        cells[index].classList.add("odd");
        cells[index].addEventListener('click', setCheckedCells);
    }
};
for (var i = 0; i < numOfOddEmojis; i++) {
    setOddcells(random);
}
var fillBoard = function () {
    gridColumns = Math.floor(board.offsetWidth / 28);
    gridRows = Math.floor(board.offsetHeight / 28);
    numOfOddEmojis = Math.round((oddPercentage / 100) * (gridColumns * gridRows)) || 1;
    numOfFoundEmojis = 0;
    board.style.gridTemplateColumns = "repeat(" + gridColumns + "," + " 1fr)";
    board.style.gridTemplateRows = "repeat(" + gridRows + "," + " 1fr)";
    board.innerHTML = "";
    for (var i = 0; i < gridColumns * gridRows; i++) {
        board.innerHTML += "<div class='cell'></div>";
    }
    cells = document.querySelectorAll(".cell");
    cells.forEach(function (cell) {
        cell.innerText = normalEmoji;
    });
    for (var i = 0; i < numOfOddEmojis; i++) {
        random = Math.floor(Math.random() * cells.length);
        setOddcells(random);
    }
};
var boardHeight = board.offsetHeight;
var boardWidth = board.offsetWidth;
var gameInterval = setInterval(function () {
    if (numOfFoundEmojis == numOfOddEmojis) {
        if (activeRound < rounds) {
            activeRound++;
            numOfFoundEmojis = 0;
            foundOutput.innerText = "Found ".concat(numOfFoundEmojis, " / ").concat(numOfOddEmojis);
            roundOutput.innerText = "Round ".concat(activeRound, " / ").concat(rounds);
            fillBoard();
        }
        else {
            clearInterval(gameInterval);
            board.innerHTML = "";
            document.getElementById("overlay").style.display = "initial";
            document.getElementById("popup").style.display = "initial";
            document.getElementById("board-wrapper").style.opacity = "0";
            document.getElementById("wrapper").style.display = "flex";
        }
    }
    if (board.offsetHeight != boardHeight || boardWidth != board.offsetWidth) {
        window.location.reload();
    }
}, 500);
//confetti
var colors = ["#f56143", "#a1d59c", "#5abafd", "#fbb924", "#7e81a4", "#fac4b9"];
var totalConfetti = window.innerWidth;
var createConfetti = function () {
    var wrapper = document.getElementById("wrapper");
    for (var i = 0; i < totalConfetti; i++) {
        var confetti = document.createElement("div");
        confetti.classList.add("confetti");
        var size = Math.random() * 10;
        confetti.style.width = size + "px";
        confetti.style.height = (size * 0.4) + "px";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.floor(Math.random() * 100) + "%";
        confetti.style.top = Math.floor(Math.random() * 20) + "%";
        confetti.style.opacity = (Math.random() * 0.5 + 0.5).toString();
        confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
        confetti.style.animation = "drop ".concat(4 + Math.random() * 3, "s ").concat(Math.random(), "s infinite");
        wrapper.appendChild(confetti);
    }
};
