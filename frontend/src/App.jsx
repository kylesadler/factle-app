import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Header from "./Header";
import FactleGame from "./FactleGame";
import { Game, GAME_STATUS, COLORS } from "./Game";
import TileRow from "./TileRow";
import Tile from "./Tile";
import { getStatistics } from "./util";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import { Button, Divider } from "@mui/material";

const problem = {
  prompt: "Top 5 Most Followed People on Instagram",
  options: [
    "Nicki Minaj",
    "Beyonce",
    "Zendaya",
    "Kyle Sadler",
    "Jerry Seinfeld",
    ...[...Array(18).keys()].map((_, id) => {
      return `Wrong Option ${id}`;
    }),
  ], // top 5 are in order
};

// console.log("problem", problem);

const GAME_STATUS = {
  IN_PROGRESS: "in progress",
  WON: "won",
  LOST: "lost",
};

const gameStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  winningStreak: 0,
  maxWinningStreak: 0,
};

let theme = createTheme({
  typography: {
    // fontFamily: "Hepta Slab", // needs to be bold
    fontFamily:
      "nyt-karnakcondensed, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande",
    h1: { color: "white" },
    h2: { color: "white" },
    h3: {
      color: "white",
      fontWeight: 700,
    },
    h4: { color: "white" },
    h5: { color: "white" },
    h6: { color: "white" },
    body: { color: "white" },
    body1: { color: "white" },

    button: {
      textTransform: "none",
    },
  },
});

theme = responsiveFontSizes(theme);

const PipedropsTag = () => {};

const ModalPaper = ({ children, styles }) => {
  return (
    <Paper
      style={{
        width: "70%",
        maxWidth: 500,
        margin: "auto",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "gray",
        ...styles,
      }}
    >
      {children}
    </Paper>
  );
};

const HowToPlayModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalPaper>
        <div style={{ width: "100%" }}>
          <div style={{ margin: "auto", padding: 15, textAlign: "center" }}>
            <Typography style={{ fontWeight: 600 }} variant="h4" gutterBottom>
              How to Play
            </Typography>
          </div>
        </div>
        <div style={{ width: "100%", padding: "9px 0px" }}>
          <Typography variant="body1" gutterBottom>
            Guess the FACTLE in five tries.
          </Typography>

          <Typography variant="body1" gutterBottom>
            For each guess, rank what you think are the top 5 answers. Hit the
            enter button to submit.
          </Typography>

          <Typography variant="body1" gutterBottom>
            After each guess, the color of the tiles will change to show how
            close your guess was to the real ranking.
          </Typography>
        </div>
        <Divider />
        <div style={{ width: "100%", padding: "9px 0px" }}>
          <Typography variant="h5" style={{ fontWeight: 400 }}>
            Examples
          </Typography>
          <div style={{ padding: "5px 0px" }}>
            <TileRow>
              <Tile text={1} style={{ backgroundColor: COLORS.GREEN }} />
              {[19, 7, 6, 20].map((n) => {
                return <Tile text={n} />;
              })}
            </TileRow>
          </div>
          <Typography variant="body1" gutterBottom>
            The number 1 is in the ranking and in the right place.
          </Typography>
          <div style={{ padding: "5px 0px" }}>
            <TileRow>
              <Tile text={21} />
              <Tile text={4} style={{ backgroundColor: COLORS.YELLOW }} />
              {[12, 8, 26].map((n) => {
                return <Tile text={n} />;
              })}
            </TileRow>
          </div>
          <Typography variant="body1" gutterBottom>
            The number 4 is in the ranking but in the wrong place.
          </Typography>
        </div>
        <Divider />
        <div style={{ width: "100%", padding: "9px 0px" }}>
          <Typography variant="body1" gutterBottom>
            A new Factle will be available everyday!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Based on Jonathon Wardle's game, Wordle.
          </Typography>
        </div>
        <div style={{ width: "100%", padding: "9px 0px" }}>
          <Button
            variant="contained"
            style={{ backgroundColor: COLORS.GREEN }}
            onClick={onClose}
          >
            Start Playing
          </Button>
        </div>
      </ModalPaper>
    </Modal>
  );
};

const getTimeToMidnight = () => {
  const today = new Date(Date.now());
  return { hours: 23 - today.getHours(), mintues: 59 - today.getMinutes() };
};

const EMOJIS = {
  YELLOW: "🐱",
  GREEN: "🐸",
  BLACK: "⬛",
};
const getShareString = (game) => {
  return {
    title: `factle.app ${game.row}/5`,
    prompt: problem.prompt,
    emojisLines: game.board.map((row, i) => {
      return i < game.row
        ? row
            .map(({ color }) => {
              if (color == COLORS.YELLOW) {
                return EMOJIS.YELLOW;
              } else if (color == COLORS.GREEN) {
                return EMOJIS.GREEN;
              } else {
                return EMOJIS.BLACK;
              }
            })
            .join("")
        : "";
    }),
  };
};

const formatPercent = (num) => {
  return `${Math.round(num * 100)}%`;
};

const twitterColor = "rgb(48, 155, 240)";
const StatisticsModal = observer(({ open, onClose, game }) => {
  const timeDifference = getTimeToMidnight();
  const { title, emojisLines, prompt } = getShareString(game);

  const { wonGames, totalGames } = getStatistics();
  const ratio = wonGames / totalGames;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalPaper>
        <div style={{ width: "100%" }}>
          <div
            style={{
              margin: "auto",
              padding: 15,
              paddingBottom: 0,
              textAlign: "center",
            }}
          >
            <Typography style={{ fontWeight: 600 }} variant="h4" gutterBottom>
              Statistics
            </Typography>
          </div>
        </div>
        {!isNaN(wonGames) && !isNaN(totalGames) ? (
          <div style={{ width: "100%", padding: "9px 0px" }}>
            <Typography variant="body1" gutterBottom>
              {`You've won ${wonGames} out of ${totalGames}` +
                (ratio > 0.5
                  ? `. That's ${formatPercent(ratio)} !`
                  : ` (${formatPercent(ratio)})`)}
            </Typography>
          </div>
        ) : (
          ""
        )}
        {game.status != GAME_STATUS.IN_PROGRESS ? (
          <div style={{ width: "100%", padding: "9px 0px" }}>
            <div style={{ margin: "auto", textAlign: "center" }}>
              <Typography
                style={{ lineHeight: 1 }}
                variant="body1"
                gutterBottom
              >
                {title}
              </Typography>
              <Typography
                style={{ lineHeight: 1 }}
                variant="body1"
                gutterBottom
              >
                {prompt}
              </Typography>
            </div>
            <div style={{ margin: "auto", textAlign: "center" }}>
              {emojisLines.map((line) => {
                return (
                  <Typography style={{ lineHeight: 1 }} variant="body1">
                    {line}
                  </Typography>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
        <div style={{ width: "100%", padding: "9px 0px" }}>
          <Typography variant="body1" gutterBottom>
            Next Factle in {timeDifference.hours} hours and{" "}
            {timeDifference.mintues} minutes!
          </Typography>
        </div>
        <div style={{ width: "100%", padding: "9px 0px" }}>
          {/* updates, follow us */}
          <Typography variant="body1" gutterBottom>
            Follow me on
          </Typography>
          <div style={{ display: "flex", padding: "5px, 0px" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: twitterColor }}
              onClick={onClose}
            >
              Twitter
            </Button>
            <div style={{ width: 10 }}></div>
            <Button
              variant="contained"
              style={{
                background:
                  "-webkit-linear-gradient(left, rgb(238, 179, 90) 0%, rgb(224, 69, 106) 50%, rgb(148, 45, 178) 100%)",
              }}
              onClick={onClose}
            >
              Instagram
            </Button>
          </div>
        </div>
      </ModalPaper>
    </Modal>
  );
});

/* options is list of 23 strings
     prompt is a string
  */

// assert inputs are correct

// shuffledOptions is array of { text, id }
// ids 1-5 are the answers

const shuffledOptions = problem.options
  .map((text, index) => {
    return { text, id: index };
  })
  .sort(() => Math.random() - 0.5);

const AppWithoutGame = observer(({ game }) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  game.onComplete = ({ win }) => {
    setTimeout(() => {
      setStatsOpen(true);
    }, 1100);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header
          onHelpClick={() => {
            setHelpOpen(true);
            // console.log("opening help");
          }}
          onStatsClick={() => {
            setStatsOpen(true);
            // console.log("opening stats");
          }}
        />
        <FactleGame
          options={shuffledOptions}
          prompt={problem.prompt}
          game={game}
        />
        <HowToPlayModal
          open={helpOpen}
          onClose={() => {
            // console.log("closing help");
            setHelpOpen(false);
          }}
        />
        <StatisticsModal
          game={game}
          open={statsOpen}
          onClose={() => {
            // console.log("closing stats");
            setStatsOpen(false);
          }}
        />
      </ThemeProvider>
    </div>
  );
});

export default () => {
  const game = new Game({
    solution: problem.options.slice(0, 5),
  });

  return <AppWithoutGame game={game} />;
};
