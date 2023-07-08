var board;
var score = 0;
var rows = 4;
var columns = 4;
var highScore;

window.onload = function() {
    setGame();
}





function setGame() {
    getHighScore();

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0] 
    ]

    

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
      return;
    }
  
    let found = false;
    while (!found) {
      // Find random row and column to place a number in
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * columns);
      if (board[r][c] === 0) {
        // Generate either 2, 4, or 8 randomly
        let randomNumber = Math.random();
        let number = randomNumber < 0.7 ? 2 : randomNumber < 0.9 ? 4 : 8;
  
        board[r][c] = number;
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        updateTile(tile, number);
  
        found = true;
      }
    }
  }
  
  

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}

document.addEventListener('keyup', (e) => {
    let previousBoard = JSON.parse(JSON.stringify(board)); // Create a copy of the current board
    
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }

    document.getElementById("score").innerText = score;
    
    let movesAvailable = false;

    // Check if any valid moves are available
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                movesAvailable = true;
                break;
            }
            
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
                movesAvailable = true;
                break;
            }
            
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
                movesAvailable = true;
                break;
            }
        }
        if (movesAvailable) {
            break;
        }
    }
    
    let isGameOver = !movesAvailable && JSON.stringify(board) === JSON.stringify(previousBoard);
    
    if (isGameOver) {
        alert("Game Over");
        // You can also perform additional actions here when the game is over
        updateHighScore();
        resetGame()
    }
});




function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    row = filterZero(row); // Remove zeroes from the row
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
            i++; // Skip the next tile after merging
        }
    }
    row = filterZero(row); // Remove zeroes again
    // Add zeroes to the end of the row
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}



function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
       /*  board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3]; */

        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function resetGame() {
    // Reset the board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0] 
    ];

    // Clear the score
    score = 0;

    // Clear the HTML board representation
    let tiles = document.getElementsByClassName("tile");
    for (let i = tiles.length - 1; i >= 0; i--) {
        tiles[i].remove();
    }

    // Start a new game
    setGame();
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // Store the high score in localStorage
    }
    document.getElementById("highScore").textContent = "High Score: " + highScore;
}

function getHighScore() {
    var storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) {
        highScore = parseInt(storedHighScore);
    }
    else{
        highScore = score;
    }
}

