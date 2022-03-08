import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import Header from "./Header";
import GameInterface from "./GameInterface/GameInterface";
import StatisticsModal from "./Modals/StatisticsModal";
import HowToPlayModal from "./Modals/HowToPlayModal";

export default observer(({ game, prompt, options }) => {
  // prompt is a string
  // options is array of { text, id } where ids 1-5 are correct answers in order
  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  game.onComplete = ({ win }) => {
    setTimeout(() => {
      setStatsOpen(true);
    }, 1100);
  };

  return (
    <div>
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
      <GameInterface options={options} prompt={prompt} game={game} />
      <HowToPlayModal
        open={helpOpen}
        onClose={() => {
          // console.log("closing help");
          setHelpOpen(false);
        }}
      />
      <StatisticsModal
        game={game}
        prompt={prompt}
        open={statsOpen}
        onClose={() => {
          // console.log("closing stats");
          setStatsOpen(false);
        }}
      />
    </div>
  );
});
