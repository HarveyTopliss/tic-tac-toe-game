'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalBtn = document.querySelector('.modal-btn');
const modalBoxX = document.querySelector('.checkboxX');
const modalBoxO = document.querySelector('.checkboxO');
const board = document.querySelector('#game-board');

//////////////////////////////////////////////////////////////////////////////////////////////
let plaSymbol,
  pcSymbol,
  emptyCell,
  player,
  currentGrid,
  move,
  movePool,
  chosenCell,
  calcMove,
  gameOngoing = false;

//////////////////////////////////////////////////////////////////////////////////////////////

const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];
currentGrid = grid.slice();

const gridX = {
  gridScore: {
    row: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ],
    column: [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ],
    diagonal: [
      [0, 4, 8],
      [2, 4, 6],
    ],
  },
};

//////////////////////////////////////////////////////////////////////////////////////////////

const firstChoice = function () {
  movePool = [0, 2, 4, 6, 8];
  move = movePool[Math.floor(Math.random() * movePool.length)];
  chosenCell = document.getElementById(`cell${move}`);
  chosenCell.innerText = pcSymbol;
};

const nextChoice = function () {
  move = currentGrid[Math.floor(Math.random() * currentGrid.length)];
  document.getElementById(`cell${move}`).innerText = pcSymbol;
  chosenCell = document.getElementById(`cell${move}`);
  chosenCell.innerText = pcSymbol;
};

const pcTurn = function () {
  [...emptyCell] = document.querySelectorAll('.cell-empty');
  if (gameOngoing && player === pcSymbol) {
    if (emptyCell.length === 9) {
      firstChoice();
    } else if (emptyCell.length < 9) {
      nextChoice();
    }

    currentGrid.splice(currentGrid.indexOf(move), 1);
    chosenCell.classList.remove('cell-empty');
    chosenCell.classList.add('cell-chosen');
    endGame();
    player = plaSymbol;
  } else return;
};

const objectValues = function (object) {
  return Object.values(object);
};
const gridValues = objectValues(gridX.gridScore);

let line;

const endGame = function () {
  [...emptyCell] = document.querySelectorAll('.cell-empty');
  for (let i = 0; i < gridValues.length; i++) {
    for (let j = 0; j < gridValues[i].length; j++) {
      line = [];
      gridValues[i][j].forEach(e => {
        line.push(document.getElementById(`cell${e}`).innerText);

        if (
          emptyCell.length == 0 ||
          line.toString() ===
            new Array(plaSymbol, plaSymbol, plaSymbol).toString() ||
          line.toString() === new Array(pcSymbol, pcSymbol, pcSymbol).toString()
        ) {
          gameOngoing = false;
          for (let k = 0; k < gridValues[i][j].length; k++) {
            setInterval(function () {
              document
                .getElementById(`cell${gridValues[i][j][k]}`)
                .classList.toggle('cell-win');
            }, 300);
            setTimeout(function () {
              window.location.reload();
            }, 5000);
          }
          if (emptyCell.length == 0) {
            modal.innerHTML = `<h1>It Is A Draw!</h1>`;
          } else {
            modal.innerHTML = `<h1>The ${
              player === plaSymbol ? 'Player' : 'Computer'
            } Is The Winner!</h1>`;
          }
          setTimeout(function () {
            overlay.classList.remove('hidden');
            modal.classList.remove('hidden');
          }, 1500);
        }
      });
    }
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

modal.addEventListener('click', function (e) {
  if (e.target === modalBtn) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    plaSymbol = modalBoxX.checked === true ? 'X' : 'O';
    pcSymbol = plaSymbol === 'X' ? 'O' : 'X';
    gameOngoing = true;
    player = 'X';
    pcTurn();
  }

  if (e.target === modalBoxO || e.target === modalBoxX) {
    e.target == modalBoxO
      ? (modalBoxX.checked = false)
      : (modalBoxO.checked = false);
  }
});

board.addEventListener('click', function (e) {
  [...emptyCell] = document.querySelectorAll('.cell-empty');
  if (emptyCell.includes(e.target) && player === plaSymbol) {
    e.target.classList.remove('cell-empty');
    e.target.classList.add('cell-chosen');
    e.target.innerText = plaSymbol;
    calcMove = function () {
      const result = e.target.id.split('').pop();
      return Number(result);
    };
    move = calcMove();
    currentGrid.splice(currentGrid.indexOf(move), 1);
  } else return;
  endGame();
  player = pcSymbol;
  pcTurn();
});
