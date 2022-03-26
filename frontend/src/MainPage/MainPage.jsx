import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import Header from "./Header";
import GameInterface from "./GameInterface/GameInterface";
import StatisticsModal from "./Modals/StatisticsModal";
import HowToPlayModal from "./Modals/HowToPlayModal";
import CustomModal from "./Modals/CustomModal";

export default observer(
  ({
    game,
    prompt,
    options,
    bannerText,
    statisticsPageText,
    popup,
    instagamLink,
    sourceText,
    sourceLink,
    facts,
  }) => {
    // prompt is a string
    // options is array of { text, id } where ids 1-5 are correct answers in order
    const [helpOpen, setHelpOpen] = useState(false);
    const [statsOpen, setStatsOpen] = useState(false);
    const [customOpen, setCustomOpen] = useState(false);

    if (game)
      game.onComplete = ({ win }) => {
        setTimeout(() => {
          setStatsOpen(true);
        }, 1100);
      };

    useEffect(() => {
      if (popup?.headerText) {
        setCustomOpen(true);
      }
    }, [popup]);

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
          bannerText={bannerText}
        />
        <GameInterface
          options={options}
          prompt={prompt}
          game={game}
          sourceText={sourceText}
          sourceLink={sourceLink}
          facts={facts}
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
          prompt={prompt}
          open={statsOpen}
          onClose={() => {
            // console.log("closing stats");
            setStatsOpen(false);
          }}
          statisticsPageText={statisticsPageText}
          instagamLink={instagamLink}
        />
        <CustomModal
          open={customOpen}
          onClose={() => {
            // console.log("closing stats");
            setCustomOpen(false);
          }}
          popup={popup || {}}
        />
      </div>
    );
  }
);
