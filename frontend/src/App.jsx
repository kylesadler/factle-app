import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga";
import { Factle } from "./Factle";
import MainPage from "./MainPage/MainPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { getLocalMMDDYYYY } from "../../util";
import { isLocalhost } from "./util";

GOOGLE_ANALYTICS_TAG = undefined;

if (!isLocalhost() && GOOGLE_ANALYTICS_TAG) {
  ReactGA.initialize(GOOGLE_ANALYTICS_TAG);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export default () => {
  const [appData, setAppData] = useState({ problem: {}, config: {} });
  const [isLoaded, setIsLoaded] = useState(false);
  /**
  options is list of 23 strings in order
  prompt is a string

  shuffledOptions is array of { text, id }
  ids 1-5 are the correct answers in order
  */

  useEffect(async () => {
    const appData = require("../../appData.json");
    const todaysDateString = getLocalMMDDYYYY();

    // console.log("todaysDateString");
    // console.log(todaysDateString);
    // console.log(
    //   appData.facles.filter(({ date }) => {
    //     return date == todaysDateString;
    //   })
    // );

    // technically this is the factle and the app config
    const todaysFactle = appData.facles.filter(({ date }) => {
      return date == todaysDateString;
    })[0];

    todaysFactle.problem = todaysFactle.problem || {};
    todaysFactle.config = todaysFactle.config || {};
    setAppData(todaysFactle);
    setIsLoaded(true);
  }, []);

  const {
    date = "",
    problem: { prompt = "", options = [...Array(23).map((i) => "")] },
    config: { popup, bannerText, statisticsPageText, instagamLink },
  } = appData;

  const shuffledOptions = options
    .map((text, index) => {
      return { text, id: index };
    })
    .sort(() => Math.random() - 0.5);

  // console.log("init", { options: shuffledOptions, isLoaded, date });
  const game = new Factle({
    options: shuffledOptions,
    isLoaded,
    date,
  });

  return (
    <ThemeProvider theme={theme}>
      <MainPage
        game={game}
        prompt={prompt}
        options={shuffledOptions}
        bannerText={bannerText}
        statisticsPageText={statisticsPageText}
        popup={popup}
        instagamLink={instagamLink}
      />
    </ThemeProvider>
  );
};
