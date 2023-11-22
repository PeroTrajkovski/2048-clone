var board;
const scoreValue = document.querySelector("score");
var score = 0;
var rows = 4;
var columns = 4;
var gamePlayable = true;
var gameWonNoPlay = true;
var gameWon = false;
document.getElementById("score").innerText = score;

window.onload = function(){
    setGame();
}
function setGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ]
    for (let i = 0; i < rows; i++){
        for(let j = 0; j < columns; j++){
            let tile = document.createElement('div');
            tile.id = i.toString() + "-" + j.toString();
            let num = board[i][j];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}
function hasEmptyTile(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < columns; j++){
            if(board[i][j] == 0){
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        gamePlayable = false;
        return;
    }
    if(!hasEmptyTile() || gameWon){
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let i = Math.floor(Math.random() * rows);
        let j = Math.floor(Math.random() * columns);
        if (board[i][j] == 0) {
            board[i][j] = 2;
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}
function updateTile(tile, num){
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if(num > 0){
        tile.innerText = num;
        if(num <= 4096){
            tile.classList.add("x" + num.toString());
        }
        else{
            tile.classList.add("x8192");
        }
    }
}
document.addEventListener("keyup", (e) => {
    if(!gamePlayable){
        return alert("You LOST. Restart the game and try again");
    }
    if (!gamePlayable || gameWon) {
        return;
    }
    if(e.code == "ArrowLeft"){
        slideLeft();
        setTwo();
    }
    else if(e.code == "ArrowRight"){
        slideRight();
        setTwo();
    }
    else if(e.code == "ArrowUp"){
        slideUp();
        setTwo();
    }
    else if(e.code == "ArrowDown"){
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;

    if (checkForWin()) {
        gameWon = true;
        alert("Congratulations! You've won!");
    }
})
function filterZero(row){
    return row.filter(num => num != 0);
}

/* MOVING ON PHONE DEVICE */

var touchStartX, touchStartY, touchEndX, touchEndY;

document.getElementById("board").addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.getElementById("board").addEventListener("touchmove", (e) => {
    e.preventDefault();
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
});

document.getElementById("board").addEventListener("touchend", (e) => {
    if (!gamePlayable) {
        return alert("You lost. Restart the game and try again");
    }
    handleSwipe();
});

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const threshold = 50;

    if (!gameWonNoPlay || gameWon) {
        return;
    }

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                slideRight();
            } else {
                slideLeft();
            }
        } else {
            if (dy > 0) {
                slideDown();
            } else {
                slideUp();
            }
        }
        setTwo();
        const gameOverTile = checkForGameOver();
        if (gameOverTile) {
            const { row, col } = gameOverTile;
            
            board[row][col] = 2048;
            const gameOverTileElement = document.getElementById(row.toString() + "-" + col.toString());
            updateTile(gameOverTileElement, 2048);
            gameWon = true;
            gameWonNoPlay = false;
        }
        if (checkForWin()) {
            gameWon = true;
            alert("Congratulations! You've won!");
            gameWonNoPlay = false;
        }
        document.getElementById("score").innerText = score;
    }
}
function checkForGameOver() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (board[i][j] === 2048) {
                return { row: i, col: j };
            }
        }
    }
    return null;
}

/* CHECK FOR WINNING */

function checkForWin() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (board[i][j] === 2048) {
                return true;
            }
        }
    }
    return false;
}

// MOVING 

function slide(row){
    row = filterZero(row);
    for(let i = 0; i < row.length; i++){
        if(row[i] == row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while(row.length < columns){
        row.push(0);
    }
    return row;
}

// GOING LEFT/RIGHT/UP/DOWN

function slideLeft(){
    for(let i = 0; i < rows; i++){
        let row = board[i];
        row = slide(row);
        board[i] = row;
        for(let j = 0; j < columns; j++){
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            let num = board[i][j];
            updateTile(tile, num);
        }
    }
}
function slideRight(){
    for(let i = 0; i < rows; i++){
        let row = board[i];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[i] = row;
        for(let j = 0; j < columns; j++){
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            let num = board[i][j];
            updateTile(tile, num);
        }
    }
}
function slideUp() {
    for (let j = 0; j < columns; j++) {
        let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
        row = slide(row);
        for (let i = 0; i < rows; i++){
            board[i][j] = row[i];
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            let num = board[i][j];
            updateTile(tile, num);
        }
    }
}
function slideDown() {
    for (let j = 0; j < columns; j++) {
        let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let i = 0; i < rows; i++){
            board[i][j] = row[i];
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            let num = board[i][j];
            updateTile(tile, num);
        }
    }
}
function restart(){
    window.parent.location = window.parent.location.href;
}