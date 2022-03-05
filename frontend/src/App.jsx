import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Header from "./Header";
import FactleGame from "./FactleGame";
import { Game } from "./Game";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

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

console.log("problem", problem);

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
  },
});

theme = responsiveFontSizes(theme);

const PipedropsTag = () => {};

const HowToPlayModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        style={{
          width: "60%",
          margin: "auto",
          padding: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div>
          <Typography variant="h4">How to Play</Typography>
        </div>
        <div>
          <Typography variant="body1">
            Guess the FACTLE in five tries. For each guess, rank what you think
            are the top 5 answers. Hit the enter button to submit. After each
            guess, the color of the tiles will change to show how close your
            guess was to the real ranking.
          </Typography>
        </div>
        <div>
          <Typography variant="h5">Examples</Typography>
          <Typography variant="body1">examples here:</Typography>
        </div>
      </Paper>
    </Modal>
  );
};
const StatisticsModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        style={{
          width: "60%",
          margin: "auto",
          padding: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div>
          <Typography variant="h4">STats</Typography>
        </div>
      </Paper>
    </Modal>
  );
};

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

export default () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const game = new Game();

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header
          onHelpClick={() => {
            setHelpOpen(true);
            console.log("opening help");
          }}
          onStatsClick={() => {
            setStatsOpen(true);
            console.log("opening stats");
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
            console.log("closing help");
            setHelpOpen(false);
          }}
        />
        <StatisticsModal
          open={statsOpen}
          onClose={() => {
            console.log("closing stats");
            setStatsOpen(false);
          }}
        />
      </ThemeProvider>
    </div>
  );
};
