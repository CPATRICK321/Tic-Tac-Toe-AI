x = true;
p1Array = []; //will store human moves
p2Array = []; //will store bot moves
let p2Move = 0; //declares the variable for the bots move
let humMatched = 0;
allSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //available squares
let alphaAvail = 0;
let values = [0, 0, 0, 0, 0, 0, 0]; //minimax will modify this
let gameOver = false;

winningNums = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

function minimax(availables, p2, p1, depth, isMaximizing) {
  if (CheckWin(p2)) {
    return 10 * (depth + 1);
  } else if (CheckWin(p1)) {
    return -10;
  } else if (depth === 0) {
    return 0;
  } else {
    if (isMaximizing) {
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
  humMatched = 0;
  let toBeChanged = []; //array will contain ids of the boxes that will be changed
  for (let i = 0; i < winningNums.length; i++) {
    for (let j = 0; j < array.length; j++) {
      for (let k = 0; k < winningNums[i].length; k++) {
        if (array[j] === winningNums[i][k]) {
          humMatched++;
          toBeChanged.push(array[j]);
        }
        if (humMatched == 3) {
          if (forColor) {//When Checkwin is not used in minimax, it will change Shiba's winning squares
            ChangeColor(toBeChanged, "green");
            return true;
          } else {
            return true;
          }
        }
      }
    }
    toBeChanged = [];
    humMatched = 0;
  }

  humMatched = 0;
  return false;
}

function removeElement(array, elem) {//used for removing moves from allSquared
  let index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function BotMove() {
  CheckTie();
  if (!gameOver) {
    alphaAvail = allSquares.length;
    values = new Array(allSquares.length);
    minimax(allSquares, p2Array, p1Array, allSquares.length, true); //minimax will change the values array to output each path's value

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

function HumanMove(yo) {
  if (!gameOver) {
    //only make moves when the game isn't over
    if (allSquares.includes(parseInt(yo.id))) {
      //no taking invalid squares!
      removeElement(allSquares, parseInt(yo.id));
      x ? (yo.innerHTML = "x") : (yo.innerHTML = "o");
      p1Array.push(parseInt(yo.id));

      BotMove();
    }
    CheckTie();
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
