import { green, yellow } from "@mui/material/colors";
import { makeAutoObservable } from "mobx";
import { getStatistics, setStatistics } from "./util";

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
  //   GREEN: green[700],
  GREEN: "#6aaa64", // official color
  YELLOW: "#c9b458",
};

/* options is list of 23 strings
     prompt is a string
  */

// assert inputs are correct

// shuffledOptions is array of { text, id }
// ids 1-5 are the answers

class Game {
  constructor({ solution, onComplete }) {
    this.solution = solution;

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

    this.onComplete = onComplete; // ({ win: bool }) => {}

    const today = new Date(Date.now());
    let { lastGame, lastGameDate, wonLastGame, row } = getStatistics();

    if (lastGameDate == today.toDateString()) {
      if (lastGame) this.board = lastGame;
      if (row) this.row = row;
      //   console.log("setting board", typeof this.board);
      this.status = wonLastGame ? GAME_STATUS.WON : GAME_STATUS.LOST;
    }

    makeAutoObservable(this);
  }

  onSelect = (option) => {
    // console.log("selected", option);
    if (this.status != GAME_STATUS.IN_PROGRESS) return;
    const alreadySelected = this.board[this.row].some(({ id }) => {
      return id == option.id;
    });
    if (this.col <= 4 && !alreadySelected) {
      this.board[this.row][this.col] = option;
      this.col++;
    }
  };

  onBackspace = () => {
    // console.log("backspace");
    if (this.col > 0) {
      this.col--;
      this.board[this.row][this.col] = {};
    }
  };

  onEnter = () => {
    // console.log("enter");

    if (this.status != GAME_STATUS.IN_PROGRESS || this.col != 5) return;

    let numCorrect = 0;
    const guess = this.board[this.row];

    // set this.keyboardColors and this.board colors
    for (let i = 0; i < 5; i++) {
      const { id } = guess[i];

      if (id == i) {
        // in correct spot
        this.keyboardColors[id] = COLORS.GREEN;
        this.board[this.row][i].color = COLORS.GREEN;
        numCorrect++;
      } else if (id < 5) {
        // guess was top 5, but not correct spot
        if (this.keyboardColors[id] != COLORS.GREEN) {
          this.keyboardColors[id] = COLORS.YELLOW;
        }
        this.board[this.row][i].color = COLORS.YELLOW;
      } else {
        // not correct
        this.disabledKeys[id] = true;
      }
    }

    if (this.row == 4 || numCorrect == 5) {
      // at end of game
      let stats = getStatistics();

      if (numCorrect == 5) {
        // console.log("win!");
        this.status = GAME_STATUS.WON;
        stats.wonGames = stats.wonGames ? stats.wonGames + 1 : 1;
        stats.wonLastGame = true;

        this.onComplete({ win: true });
      } else if (this.row == 4) {
        // last row
        // console.log("game is over");
        this.onComplete({ win: false });
        this.status = GAME_STATUS.LOST;
        stats.wonLastGame = false;
      }

      stats.row = this.row + 1; //  to correct for adding 1 to row
      stats.totalGames = stats.totalGames ? stats.totalGames + 1 : 1;
      const today = new Date(Date.now());
      stats.lastGameDate = today.toDateString();
      stats.lastGame = this.board;
      setStatistics(stats);
    }

    this.row++;
    this.col = 0;
  };
}

exports.Game = Game;
exports.GAME_STATUS = GAME_STATUS;
exports.COLORS = COLORS;
