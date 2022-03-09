import { makeAutoObservable } from "mobx";
import { getStatistics, setStatistics } from "./statistics";
import Colors from "./Colors";

const GAME_STATUS = {
  IN_PROGRESS: "in progress",
  WON: "won",
  LOST: "lost",
};

const BOARD_TILE_STATUSES = {
  CORRECT: "correct",
  PRESENT: "present",
  NOT_PRESENT: "not present",
};

// an option is {text, id}

const gameStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  winningStreak: 0,
  maxWinningStreak: 0,
};

/* options is list of 23 strings
     prompt is a string
  */

// assert inputs are correct

// shuffledOptions is array of { text, id }
// ids 1-5 are the answers

class Factle {
  constructor({ solution, onComplete }) {
    // this.options = options; // array of 23 strings in order

    this.solution = solution;

    // 5 x 5 array of guesses (options) on gameboard. only current row can be modified
    this.board = [...Array(5).keys()].map(() => {
      return [...Array(5).keys()].map(() => {
        return {
          // set by frontend
          id: undefined,
          text: undefined,

          // visual state
          status: undefined,
          isActive: false,
        };
      });
    });

    this.keyboardColors = {}; // object [option id] => Colors
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
      this.board[this.row][this.col].isActive = true;
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
        this.keyboardColors[id] = Colors.GREEN;
        this.board[this.row][i].status = BOARD_TILE_STATUSES.CORRECT;
        numCorrect++;
      } else if (id < 5) {
        // guess was top 5, but not correct spot
        if (this.keyboardColors[id] != Colors.GREEN) {
          this.keyboardColors[id] = Colors.YELLOW;
        }
        this.board[this.row][i].status = BOARD_TILE_STATUSES.PRESENT;
      } else {
        // not correct
        this.board[this.row][i].status = BOARD_TILE_STATUSES.NOT_PRESENT;
        this.keyboardColors[id] = Colors.GRAY;
      }

      delete this.board[this.row][i].isActive;
    }

    if (this.row == 4 || numCorrect == 5) {
      // at end of game
      let stats = getStatistics();
      stats.wonGames = stats.wonGames ? stats.wonGames : 0;

      if (numCorrect == 5) {
        // console.log("win!");
        this.status = GAME_STATUS.WON;
        stats.wonGames++;
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

exports.Factle = Factle;
exports.GAME_STATUS = GAME_STATUS;
exports.BOARD_TILE_STATUSES = BOARD_TILE_STATUSES;
