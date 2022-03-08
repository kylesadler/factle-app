import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal/Modal";
import { GAME_STATUS } from "../../Factle";
import { getStatistics } from "../../statistics";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { Button, Divider } from "@mui/material";
import Colors from "../../Colors";

const getTimeToMidnight = () => {
  const today = new Date(Date.now());
  return { hours: 23 - today.getHours(), mintues: 59 - today.getMinutes() };
};

const EMOJIS = {
  YELLOW: "🐱",
  GREEN: "🐸",
  BLACK: "⬛",
};
const getShareString = ({ game, prompt }) => {
  return {
    title: `factle.app ${game.row}/5`,
    prompt,
    emojisLines: game.board.map((row, i) => {
      return i < game.row
        ? row
            .map(({ color }) => {
              if (color == Colors.YELLOW) {
                return EMOJIS.YELLOW;
              } else if (color == Colors.GREEN) {
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

const copyToClipboard = (string) => {
  if (navigator.clipboard) navigator.clipboard.writeText(string);
};

const formatPercent = (num) => {
  return `${Math.round(num * 100)}%`;
};

export default observer(({ open, onClose, game, prompt }) => {
  const ref = useRef(null);
  const timeDifference = getTimeToMidnight();

  // this technically includes prompt, but it's already declared in this scope
  const { title, emojisLines } = getShareString({ game, prompt });

  const { wonGames, totalGames } = getStatistics();
  const ratio = wonGames / totalGames;

  return (
    <Modal open={open} onClose={onClose}>
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
            {`You've won ${wonGames} out of ${totalGames}. That's ${formatPercent(
              ratio
            )}.`}
          </Typography>
        </div>
      ) : (
        ""
      )}
      {game.status != GAME_STATUS.IN_PROGRESS ? (
        <div style={{ width: "100%", padding: "9px 0px" }}>
          <Paper
            style={{
              width: "50%",
              minWidth: 200,
              maxWidth: 300,
              padding: "15px 0px",
              margin: "auto",
              backgroundColor: "black",
              background:
                "linear-gradient(to right, #eea849, #f46b45)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
            }}
          >
            <div
              style={{
                margin: "auto",
                width: "48%",
                minWidth: 180,
                maxWidth: 280,
                textAlign: "center",
              }}
            >
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
          </Paper>

          <div style={{ margin: "auto", textAlign: "center", paddingTop: 10 }}>
            <Button
              ref={ref}
              variant="contained"
              style={{ backgroundColor: Colors.GREEN }}
              onClick={(event) => {
                event.stopPropagation();
                copyToClipboard(
                  `${title}\n${prompt}\n` + emojisLines.join("\n")
                );
                ref.current.innerHTML = "Copied!";
                ref.current.style.backgroundColor = "#eea849";

                setTimeout(() => {
                  ref.current.innerHTML = "Share";
                  ref.current.style.backgroundColor = Colors.GREEN;
                }, 1000);
              }}
            >
              Share
            </Button>
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
            style={{ backgroundColor: Colors.TWITTER_COLOR }}
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
    </Modal>
  );
});
