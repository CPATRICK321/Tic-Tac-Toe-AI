x = true; //true when it's the human's turn
p1Array = []; //will store human moves
p2Array = []; //will store bot moves
let p2Move = 0; //declares the variable for the bots move
allSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //available squares
let alphaAvail = 0;
let values = [0, 0, 0, 0, 0, 0, 0]; //minimax will modify this
let gameOver = false;

var idToCoord = {
  1: [0, 0],
  2: [0, 1],
  3: [0, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
  7: [2, 0],
  8: [2, 1],
  9: [2, 2],
}

//game starts when human clicks a square
function HumanMove(square) {
  if (!gameOver) {
    //only make moves when the game isn't over
    if (allSquares.includes(parseInt(square.id))) {
      //no taking invalid squares!
      removeElement(allSquares, parseInt(square.id));
      x ? (square.innerHTML = "x") : (square.innerHTML = "o");
      p1Array.push(parseInt(square.id));
      // winDataStructureUpdate(square.id);
      BotMove();
    }
    CheckTie();
  }
}

function winDataStructureUpdate(id){
  var coord = idToCoord[id];

  //update the col
  cols[coord[1]] += (x ? 1 : -1);
  //update the row
  rows[coord[0]] += (x ? 1 : -1);
  //update the diag(s)
  if (coord[0] == coord[1]){
    //top left to bottom right
    diagonal1 += (x ? 1 : -1);
  }
  if(coord[0]+coord[1] == 2){
    diagonal2 += (x ? 1 : -1);
  }
}

function BotMove() {
  CheckTie();
  if (!gameOver) {
    alphaAvail = allSquares.length;
    values = new Array(allSquares.length);
    minimax(allSquares, p2Array, p1Array, allSquares.length, true); //minimax will change the values array to output each path's value
    
    //could later change p2Move to not be first best move only to vary gameplay
    p2Move = allSquares[values.indexOf(Math.max(...values))]; //the first occurence of the highest value is the best move

    if (allSquares.includes(p2Move)) {
      removeElement(allSquares, p2Move);
      x
        ? (document.getElementById(p2Move.toString()).innerHTML = "o")
        : (document.getElementById(p2Move.toString()).innerHTML = "x");
      p2Array.push(p2Move);

      if (CheckWin(p2Array, true)) {
        gameOver = true;
        document.getElementById("curPlayer").innerHTML = "Shiba Wins";
      }
    } else {
      BotMove();
    }
  }
}


function minimax(availables, p2, p1, depth, isMaximizing) {
  if (CheckWin(p2, false)) {
    return 10 * (depth + 1); // "* (depth + 1)" gives higher value to quick wins. if removed shiba will still win
  } else if (CheckWin(p1, false)) {
    return -10;
  } else if (depth === 0) {
    return 0;
  } else {
    if (isMaximizing) { //isMaximizing=true means minimax is looking for shiba's best move (it's shiba's turn in tree)
      maxEval = -Infinity;
      for (let i = 0; i < availables.length; i++) {
        maxEval = Math.max(
          maxEval,
          minimax(
            availables
              .slice(0, i)
              .concat(availables.slice(i + 1, availables.length)),
            p2.slice(0).concat(availables[i]),
            p1,
            depth - 1,
            false
          )
        );
        if (depth == alphaAvail) {
          values[i] = maxEval;
        }
      }
      return maxEval;
    }
    if (!isMaximizing) {
      minEval = Infinity;
      for (let i = 0; i < availables.length; i++) {
        minEval = Math.min(
          minEval,
          minimax(
            availables
              .slice(0, i)
              .concat(availables.slice(i + 1, availables.length)),
            p2,
            p1.slice(0).concat(availables[i]),
            depth - 1,
            true
          )
        );
      }
      return minEval;
    }
  }
}

function CheckWin(array, forColor) {
  //winning states - one value will be three when a player wins
  rows = [0, 0, 0]
  cols = [0, 0, 0]
  diagonal1 = 0
  diagonal2 = 0

  for(let i = 0; i < array.length; i++){
    var coord = idToCoord[array[i].toString()];
    //update the col
    cols[coord[1]] += 1;
    //update the row
    rows[coord[0]] += 1;
    //update the diag(s)
    if (coord[0] == coord[1]){
      //top left to bottom right
      diagonal1 += 1;
    }
    if(coord[0]+coord[1] == 2){
      diagonal2 += 1;
    }
  }

  for (let i = 0; i < cols.length; i++){
    if (cols[i] == 3){
      if(forColor){
        ChangeColor([i+1, i+4, i+7], "green")
      }
      return true;
    }
  }
  for (let i = 0; i < rows.length; i++){
    if (rows[i] == 3){
      if(forColor){
        ChangeColor([1+(i*3), 2+(i*3), 3+(i*3)], "green")
      }
      return true;
    }
  }
  if (diagonal1 == 3){
    if(forColor){
      ChangeColor([1, 5, 9], "green")
    }
    return true;
  }
  if (diagonal2 == 3){
    if(forColor){
      ChangeColor([3, 5, 7], "green")
    }
    return true;
  }
  return false
}

function removeElement(array, elem) {//used for removing moves from allSquared
  let index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function Reset() {
  //resets player values and changes Xs and Os
  p1Array = [];
  p2Array = [];
  allSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  ChangeColor(allSquares, "#a60a27");
  for (let i = 1; i < 10; i++) {
    document.getElementById(i.toString()).innerHTML = "";
  }
  x = !x;
  gameOver = false;
  if (!x) {
    document.getElementById("curPlayer").innerHTML = "You are Os";
    BotMove();
  } else {
    document.getElementById("curPlayer").innerHTML = "You are Xs";
  }
}

function CheckTie() {
  if (allSquares.length === 0) {
    gameOver = true;
    document.getElementById("curPlayer").innerHTML = "Tie";
  }
}

function ChangeColor(arr, color) {
  for (let i = 0; i < arr.length; i++) {
    document.getElementById(arr[i].toString()).style.backgroundColor = color;
  }
}
