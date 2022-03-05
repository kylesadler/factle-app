import { green, yellow } from "@mui/material/colors";
import { makeAutoObservable } from "mobx";

const GAME_STATUS = {
  IN_PROGRESS: "in progress",
  WON: "won",
  LOST: "lost",
};

// an option is {text, id}

const gameStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  winningStreak: 0,
  maxWinningStreak: 0,
};

const COLORS = {
  GREEN: green[700],
  YELLOW: yellow[700],
};

/* options is list of 23 strings
     prompt is a string
  */

// assert inputs are correct

// shuffledOptions is array of { text, id }
// ids 1-5 are the answers

class Game {
  constructor() {
    // 5 x 5 array of guesses (options) on gameboard. only current row can be modified
    this.board = [...Array(5).keys()].map(() => {
      return [...Array(5).keys()].map(() => {
        return {
          // set by frontend
          id: undefined,
          text: undefined,

          // visual state
          color: undefined,
        };
      });
    });

    this.keyboardColors = {}; // object [option id] => COLORS
    this.disabledKeys = {}; // object [option id] => bool
    this.row = 0;
    this.col = 0;
    this.status = GAME_STATUS.IN_PROGRESS;

    makeAutoObservable(this);
  }

  onSelect = (option) => {
    console.log("selected", option);
    const alreadySelected = this.board[this.row].some(({ id }) => {
      return id == option.id;
    });
    if (this.col <= 4 && !alreadySelected) {
      this.board[this.row][this.col] = option;
      this.col++;
    }
  };

  onBackspace = () => {
    console.log("backspace");
    if (this.col > 0) {
      this.col--;
      this.board[this.row][this.col] = {};
    }
  };

  onEnter = () => {
    console.log("enter");

    if (this.col != 5) return;

    let numCorrect = 0;
    const guess = this.board[this.row];
    console.log(guess);

    // set this.keyboardColors and this.board colors
    for (let i = 0; i < 5; i++) {
      const { id } = guess[i];

      if (id == i) {
        // in correct spot
        this.keyboardColors[id] = COLORS.GREEN;
        this.board[this.row][i].color = COLORS.green;
        numCorrect++;
      } else if (id < 5) {
        // guess was top 5, but not correct spot
        if (this.keyboardColors[id] != COLORS.GREEN) {
          this.keyboardColors[id] = COLORS.YELLOW;
        }
        this.board[this.row][i].color = COLORS.yellow;
      } else {
        // not correct
        this.disabledKeys[id] = true;
      }
    }

    if (numCorrect == 5) {
      console.log("win!");
      this.status = GAME_STATUS.WON;
    } else if (this.row == 4) {
      // last row
      console.log("game is over");
      this.status = GAME_STATUS.LOST;
    }
    this.row++;
    this.col = 0;
  };
}

exports.Game = Game;
exports.GAME_STATUS = GAME_STATUS;
