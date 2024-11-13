const board: HTMLElement = document.getElementById("board");
let gridColumns: number = Math.floor(board.offsetWidth / 28);
let gridRows: number = Math.floor(board.offsetHeight / 28);

let foundOutput = document.getElementById("found");
let roundOutput = document.getElementById("round");

let activeRound = 1;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let queryRounds = Number(urlParams.get("rounds"));
let queryOddPercentage = urlParams.get("oddPercentage");
let queryNormalEmoji = urlParams.get("normalEmoji");
let queryOddEmoji = urlParams.get("oddEmoji");

let rounds = queryRounds || Number(prompt("How many rounds (1 - 3)?"));

rounds = Number(rounds);

while (rounds <= 0 || rounds > 3 || isNaN(rounds)) {
    rounds = Number(prompt("How many rounds (1 - 3)?"));
}

let oddPercentage = Number(queryOddPercentage) || Number(prompt("What % of emojis should be different?"));

while (oddPercentage <= 0 || oddPercentage > 100 || isNaN(oddPercentage)) {
    oddPercentage = Number(queryOddPercentage) || Number(prompt("What % of emojis should be different?"));
}

let normalEmoji = queryNormalEmoji || prompt("What should be the normal emoji?");

while (normalEmoji == '' || normalEmoji.length > 1) {
    normalEmoji = queryNormalEmoji || prompt("What should be the normal emoji?");
}

let oddEmoji = queryOddEmoji || prompt("What should be the odd emoji?");

while (oddEmoji == '' || oddEmoji.length > 1) {
    oddEmoji = queryOddEmoji || prompt("What should be the odd emoji?");
}

let numOfOddEmojis = Math.round((oddPercentage / 100) * (gridColumns * gridRows)) || 1;
let numOfFoundEmojis = 0;

foundOutput.innerText = `Found ${numOfFoundEmojis} / ${ numOfOddEmojis}`;
roundOutput.innerText = `Round ${activeRound} / ${ rounds}`;

board.style.gridTemplateColumns = "repeat("+gridColumns+","+" 1fr)";

board.style.gridTemplateRows = "repeat("+gridRows+","+" 1fr)";

for (let i = 0; i < gridColumns * gridRows; i++) {
    board.innerHTML += "<div class='cell'></div>";
}

let cells: NodeListOf<HTMLElement> = document.querySelectorAll(".cell");

cells.forEach(cell => {
    cell.innerText = normalEmoji;
});

let random = Math.floor(Math.random()*cells.length);

const setCheckedCells = (e)=>{
    e.target.classList.remove("odd");
    e.target.removeEventListener('click', setCheckedCells);
    e.target.innerText  = "✅";
    numOfFoundEmojis++;
    foundOutput.innerText = `Found ${numOfFoundEmojis} / ${ numOfOddEmojis}`;
}

const setOddcells = (index: number)=>{
    if (cells[index].classList.contains("odd")) {
        random = Math.floor(Math.random()*cells.length);
        setOddcells(random);
    }
    else{
        cells[index].innerText = oddEmoji;
        cells[index].classList.add("odd");
        cells[index].addEventListener('click', setCheckedCells);
    }
}

for (let i = 0; i < numOfOddEmojis; i++) {
    setOddcells(random);
}

const fillBoard = ()=>{
    gridColumns = Math.floor(board.offsetWidth / 28);
    gridRows = Math.floor(board.offsetHeight / 28);
    numOfOddEmojis = Math.round((oddPercentage / 100) * (gridColumns * gridRows)) || 1;
    numOfFoundEmojis = 0;
    board.style.gridTemplateColumns = "repeat("+gridColumns+","+" 1fr)";
    board.style.gridTemplateRows = "repeat("+gridRows+","+" 1fr)";

    board.innerHTML = "";

    for (let i = 0; i < gridColumns * gridRows; i++) {
        board.innerHTML += "<div class='cell'></div>";
    }

    cells= document.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.innerText = normalEmoji;
    });

    for (let i = 0; i < numOfOddEmojis; i++) {
        random = Math.floor(Math.random()*cells.length);
        setOddcells(random)
    }
}

let boardHeight = board.offsetHeight;
let boardWidth = board.offsetWidth;

const gameInterval = setInterval(()=>{
    if (numOfFoundEmojis == numOfOddEmojis) {
        if (activeRound < rounds) {
            activeRound++;
            numOfFoundEmojis = 0;
            foundOutput.innerText = `Found ${numOfFoundEmojis} / ${ numOfOddEmojis}`;
            roundOutput.innerText = `Round ${activeRound} / ${ rounds}`;
            fillBoard();
        }
        else{
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
}, 500)

//confetti
const colors = ["#f56143", "#a1d59c", "#5abafd", "#fbb924", "#7e81a4", "#fac4b9"];
const totalConfetti = window.innerWidth;

const createConfetti = () => {
  const wrapper: HTMLElement = document.getElementById("wrapper");

  for (let i = 0; i < totalConfetti; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    const size = Math.random() * 10;
    confetti.style.width = size + "px";
    confetti.style.height = (size * 0.4) + "px";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.floor(Math.random() * 100) + "%";
    confetti.style.top = Math.floor(Math.random() * 20) + "%";
    confetti.style.opacity = (Math.random() * 0.5 + 0.5).toString();
    confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";

    confetti.style.animation = `drop ${4 + Math.random() * 3}s ${Math.random()}s infinite`;

    wrapper.appendChild(confetti);
  }
}