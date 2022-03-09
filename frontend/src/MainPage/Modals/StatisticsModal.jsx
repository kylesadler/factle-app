import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal/Modal";
import { GAME_STATUS, BOARD_TILE_STATUSES } from "../../Factle";
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
            .map(({ status }) => {
              if (status == BOARD_TILE_STATUSES.PRESENT) {
                return EMOJIS.YELLOW;
              } else if (status == BOARD_TILE_STATUSES.CORRECT) {
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

const Header = () => {
  return (
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
  );
};

const WinningStats = ({ wonGames, totalGames }) => {
  const ratio = wonGames / totalGames;

  return (
    <CenteredText>
      {`You've won ${wonGames} out of ${totalGames}. That's ${formatPercent(
        ratio
      )}.`}
    </CenteredText>
  );
};

const SectionBlock = ({ children }) => {
  return <div style={{ width: "100%", padding: "9px 0px" }}>{children}</div>;
};

const EmojiCard = ({ game, prompt }) => {
  const ref = useRef(null);
  const { title, emojisLines } = getShareString({ game, prompt });

  return (
    <React.Fragment>
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
            <Typography style={{ lineHeight: 1 }} variant="body1" gutterBottom>
              {title}
            </Typography>
            <Typography style={{ lineHeight: 1 }} variant="body1" gutterBottom>
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
            copyToClipboard(`${title}\n${prompt}\n` + emojisLines.join("\n"));
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
    </React.Fragment>
  );
};

const CenteredText = ({ children }) => {
  return (
    <Centered>
      <Typography variant="body1">{children}</Typography>
    </Centered>
  );
};

const Centered = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

const FollowUs = ({ onClose }) => {
  return (
    // <React.Fragment>
    <Centered>
      {/* updates, follow us */}
      {/* <CenteredText>Follow us on</CenteredText> */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography style={{ paddingRight: 10 }} variant="body1">
          Follow us on
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
    </Centered>
  );
};

export default observer(({ open, onClose, game, prompt }) => {
  const timeDifference = getTimeToMidnight();

  const { wonGames, totalGames } = getStatistics();

  console.log("wonGames", "totalGames");
  console.log(wonGames, totalGames);

  return (
    <Modal open={open} onClose={onClose}>
      <Header />
      {!isNaN(wonGames) && !isNaN(totalGames) ? (
        <SectionBlock>
          <WinningStats wonGames={wonGames} totalGames={totalGames} />
        </SectionBlock>
      ) : (
        ""
      )}
      {game.status != GAME_STATUS.IN_PROGRESS ? (
        <SectionBlock>
          <EmojiCard game={game} prompt={prompt} />
        </SectionBlock>
      ) : (
        ""
      )}
      <SectionBlock>
        <CenteredText>
          {`Next Factle in ${timeDifference.hours} hours and ${timeDifference.mintues} minutes!`}
        </CenteredText>
      </SectionBlock>
      <SectionBlock>
        <FollowUs />
      </SectionBlock>
    </Modal>
  );
});
