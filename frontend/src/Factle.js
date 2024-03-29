import { makeAutoObservable } from "mobx";
import { getStatistics, setStatistics } from "./statistics";
import Colors from "./Colors";
import "animate.css";
import { sendGameResults, getRowPercentiles } from "./apiService";

const GAME_STATUS = {
  IN_PROGRESS: "in progress",
  WON: "won",
  LOADING: "loading",
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

const animateCSS = (
  element,
  animation,
  duration = "1.0s",
  prefix = "animate__"
) => {
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);
    node.style.setProperty("--animate-duration", duration);

    // keep element from fading out
    node.style.setProperty("visibility", "visible", "important");
    node.style.setProperty("opacity", 1, "important");

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });
};

/* options is list of 23 strings
     prompt is a string
  */

// assert inputs are correct

// shuffledOptions is array of { text, id }
// ids 1-5 are the answers

class Factle {
  constructor({
    options,
    onComplete,
    isLoaded,
    date,
    onPercentileLoaded = () => {},
  }) {
    this.solution = [...options]
      .sort((a, b) => {
        return a.id - b.id;
      })
      .slice(0, 5);
    this.options = options; // array of { id, text }
    this.isLoaded = isLoaded;
    this.date = date;

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
    this.status =
      this.isLoaded === false ? GAME_STATUS.LOADING : GAME_STATUS.IN_PROGRESS;

    this.onComplete = onComplete; // ({ win: bool }) => {}
    this.onPercentileLoaded = onPercentileLoaded; // () => {}

    const today = new Date(Date.now());
    let { lastGame, lastGameDate, wonLastGame, row } = getStatistics();

    if (lastGameDate == today.toDateString()) {
      if (lastGame) this.board = lastGame;
      if (row) this.row = row;
      this.status = wonLastGame ? GAME_STATUS.WON : GAME_STATUS.LOST;
    }

    makeAutoObservable(this);
  }

  onSelect = (option) => {
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
    if (this.col > 0) {
      this.col--;
      this.board[this.row][this.col] = {};
    }
  };

  onEnter = async () => {
    if (this.status != GAME_STATUS.IN_PROGRESS) return;

    const currentRow = `#root > div:first-child > div:nth-child(2) > div:nth-child(2) > div:nth-child(${
      this.row + 2
    })`;

    if (this.col != 5) {
      // shake current row
      animateCSS(currentRow, "headShake");
      return;
    }

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

    // don't need to await
    animateCSS(currentRow, "flipInY", "1.3s");

    if (this.row == 4 || numCorrect == 5) {
      // at end of game
      const stats = getStatistics();
      stats.totalGames = stats.totalGames ? stats.totalGames + 1 : 1;
      stats.wonGames = stats.wonGames ? stats.wonGames : 0;
      stats.currentStreak = stats.currentStreak ? stats.currentStreak : 0;

      if (numCorrect == 5) {
        this.status = GAME_STATUS.WON;
        stats.wonGames++;
        stats.currentStreak++;
        stats.wonLastGame = true;
      } else {
        // last row
        this.status = GAME_STATUS.LOST;
        stats.wonLastGame = false;
      }

      this.onComplete({ win: stats.wonLastGame });

      stats.row = this.row + 1; //  to correct for adding 1 to row
      const today = new Date(Date.now());
      stats.lastGameDate = today.toDateString();
      stats.lastGame = this.board;
      setStatistics(stats);

      // 0-4 for win, 5 for loss
      const endingRow = stats.wonLastGame ? this.row : this.row + 1;

      stats.rowPercentile = undefined;
      this.updateRowPercentile(endingRow); // update rowPercentile async

      sendGameResults({
        date: this.date,
        board: this.getResultsBoard(),
        row: endingRow,
        win: stats.wonLastGame,
        options: this.getGuessedOptions(),
      });
    }

    this.row++;
    this.col = 0;
  };

  updateRowPercentile = async (row) => {
    const stats = getStatistics();
    // array length 6
    // percentiles[i] is percentile of ending game at row i
    // i = 5 is for losing the game
    const percentiles = await getRowPercentiles({ date: this.date });
    stats.rowPercentile = percentiles[row];
    setStatistics(stats);
    if (this.onPercentileLoaded) this.onPercentileLoaded(stats);
  };

  getGuessedOptions = () => {
    // assume ids of options are indeces

    const output = {};

    this.options.forEach(({ id }) => {
      output[id] = false;
    });

    this.board.forEach((row) => {
      row.forEach(({ id }) => {
        if (!isNaN(id) && id != null) {
          output[id] = true;
        }
      });
    });

    return output;
  };

  getResultsBoard = () => {
    const output = {};

    [...Array(5)].forEach((__, i) => {
      [...Array(5)].forEach((_, j) => {
        const key = `${i}${j}`; // zero indexed row, col
        output[key] =
          this.board[i][j].status == BOARD_TILE_STATUSES.CORRECT ? 1 : 0;
      });
    });

    return output;
  };
}

exports.Factle = Factle;
exports.GAME_STATUS = GAME_STATUS;
exports.BOARD_TILE_STATUSES = BOARD_TILE_STATUSES;
