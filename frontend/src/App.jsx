import React, { useState, useEffect, useRef } from "react";
import { Factle } from "./Factle";
import MainPage from "./MainPage/MainPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { getAppData } from "./apiService";
// const appData = require("./appData.json");
import { getCentralTimeDate } from "../../util";

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
    const todaysDateString = getCentralTimeDate();

    console.log("todaysDateString");
    console.log(todaysDateString);
    console.log(
      appData.facles.filter(({ date }) => {
        return date == todaysDateString;
      })
    );

    // technically this is the factle and the app config
    const todaysFactle = appData.facles.filter(({ date }) => {
      return date == todaysDateString;
    })[0];

    todaysFactle.problem = todaysFactle.problem || {};
    todaysFactle.config = todaysFactle.config || {};
    // const appData = await getAppData();
    setAppData(todaysFactle);
    setIsLoaded(true);
  }, []);

  const {
    problem: {
      prompt = "",
      options = [...Array(23).map((i) => "")],
      date = "",
    },
    config: { popup, bannerText, statisticsPageText },
  } = appData;

  const shuffledOptions = options
    .map((text, index) => {
      return { text, id: index };
    })
    .sort(() => Math.random() - 0.5);

  const game = new Factle({
    solution: options.slice(0, 5),
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
      />
    </ThemeProvider>
  );
};
