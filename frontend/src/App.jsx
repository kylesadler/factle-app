import React, { useState, useEffect, useRef } from "react";
import { Factle } from "./Factle";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { observer } from "mobx-react-lite";

import MainPage from "./MainPage/MainPage";

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

// this is the data that can change
const config = {
  problem: {
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
  },
};

const { problem } = config;

/**
  options is list of 23 strings in order
  prompt is a string

  shuffledOptions is array of { text, id }
  ids 1-5 are the correct answers in order
 */

const shuffledOptions = problem.options
  .map((text, index) => {
    return { text, id: index };
  })
  .sort(() => Math.random() - 0.5);

export default () => {
  const game = new Factle({
    solution: problem.options.slice(0, 5),
  });

  return (
    <ThemeProvider theme={theme}>
      <MainPage game={game} prompt={problem.prompt} options={shuffledOptions} />
    </ThemeProvider>
  );
};
