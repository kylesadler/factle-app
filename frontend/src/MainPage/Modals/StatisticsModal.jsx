import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal/Modal";
import { GAME_STATUS, BOARD_TILE_STATUSES } from "../../Factle";
import { getStatistics } from "../../statistics";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { Button, Divider } from "@mui/material";
import Colors from "../../Colors";
import {
  getTimeToMidnight,
  formatPercent,
  copyToClipboard,
  formatPercent1Decimal,
} from "./util";
import useMediaQuery from "@mui/material/useMediaQuery";

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

const CenteredText = ({ children }) => {
  return (
    <Centered>
      <Typography variant="body1">{children}</Typography>
    </Centered>
  );
};

const SectionBlock = ({ children, topBottomPadding = "15px" }) => {
  return (
    <div style={{ width: "100%", padding: `${topBottomPadding} 0px` }}>
      {children}
    </div>
  );
};

const EMOJIS = {
  YELLOW: "🐱",
  GREEN: "🐸",
  BLACK: "⬛",
};
const getShareString = ({ game, prompt, rowPercentile }) => {
  return {
    title: `factle.app ${game.row}/5`,
    prompt,
    emojisLines: game.board
      .map((row, i) => {
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
      })
      .slice(0, game.row),
    percentileText:
      !isNaN(rowPercentile) && rowPercentile != null
        ? `Top ${formatPercent1Decimal(rowPercentile)}`
        : undefined,
  };
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

const StatBlock = ({ label, value }) => {
  const wideScreen = useMediaQuery("(min-width:410px)");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "space-between",
        padding: `0px ${wideScreen ? 10 : 5}px`,
      }}
    >
      <Centered>
        <Typography variant={"h3"}>
          {value != undefined && value != null ? value : "-"}
        </Typography>
      </Centered>
      <Centered>
        <Typography
          style={{
            fontSize: wideScreen ? "1rem" : "0.9rem",
          }}
          variant={"body1"}
        >
          {label}
        </Typography>
      </Centered>
    </div>
  );
};

const WinningStats = ({ wonGames, totalGames, currentStreak }) => {
  // return (
  //   <CenteredText>
  //     {`You've won ${wonGames} out of ${totalGames}. That's ${formatPercent(
  //       wonGames / totalGames
  //     )}.`}
  //   </CenteredText>
  // );

  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <StatBlock label={"Games"} value={totalGames} />
      <StatBlock label={"Wins"} value={formatPercent(wonGames / totalGames)} />
      <StatBlock
        label={"Streak 🔥"}
        value={currentStreak != 0 ? currentStreak : "-"}
      />
    </div>
  );
};

const EmojiCard = ({ game, prompt, rowPercentile, win }) => {
  const ref = useRef(null);
  const { title, emojisLines, percentileText } = getShareString({
    game,
    prompt,
    rowPercentile,
  });

  // console.log("rowPercentile", rowPercentile);
  // console.log("percentileText", percentileText);
  // console.log("win", win);

  const percentile = win && percentileText ? percentileText : "";

  const shareText = `${title}\n${prompt}\n${emojisLines.join(
    "\n"
  )}\n\n${percentile}`;

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
            {emojisLines.map((line) => {
              return (
                <Typography style={{ lineHeight: 1 }} variant="body1">
                  {line}
                </Typography>
              );
            })}
            {win && percentileText ? (
              <React.Fragment>
                <Typography
                  style={{ lineHeight: 1, paddingTop: 15 }}
                  variant="body1"
                  gutterBottom
                >
                  {percentile}
                </Typography>
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
        </div>
      </Paper>
      <div style={{ margin: "auto", textAlign: "center", paddingTop: 15 }}>
        <Button
          variant="contained"
          style={{ backgroundColor: Colors.TWITTER_COLOR }}
          onClick={(event) => {
            copyToClipboard(`${title}\n${prompt}\n` + emojisLines.join("\n"));
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURI(shareText)}`
            );
          }}
        >
          Tweet
        </Button>
        <div style={{ display: "inline", paddingRight: 10 }}></div>
        <Button
          ref={ref}
          variant="contained"
          style={{ backgroundColor: Colors.GREEN }}
          onClick={(event) => {
            event.stopPropagation();
            copyToClipboard(shareText);
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

const ButtonSection = ({ onClose, instagamLink }) => {
  const wideScreen = useMediaQuery("(min-width:440px)");

  return (
    // <React.Fragment>
    <Centered>
      {/* updates, follow us */}
      {/* <CenteredText>Follow us on</CenteredText> */}
      <div
        style={{
          display: "flex",
          padding: "5px, 0px",
          width: "100%",
          flexDirection: wideScreen ? "row" : "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Button
          variant="contained"
          style={{ backgroundColor: Colors.TWITTER_COLOR }}
          onClick={() => {
            window.open("https://twitter.com/pipedream_labs");
          }}
        >
          Twitter
        </Button>*/}
        <SeeAnswerButton link={instagamLink} />
        <div style={{ width: 10, height: 10 }}></div>
        <FeedbackButton />
      </div>
    </Centered>
  );
};

const SeeAnswerButton = ({ link }) => {
  return (
    <IconButton
      label={"See Today's Answers"}
      icon={<LightbulbOutlinedIcon />}
      color={
        "-webkit-linear-gradient(left, rgb(238, 179, 90) 0%, rgb(224, 69, 106) 50%, rgb(148, 45, 178) 100%)"
      }
      onClick={() => {
        window.open(link || "https://www.instagram.com/factle.app/");
      }}
    />
  );
};

const FeedbackButton = () => {
  return (
    <IconButton
      label={"Give us Feedback"}
      icon={<CampaignOutlinedIcon />}
      color={Colors.GREEN}
      onClick={() => {
        window.open("https://www.instagram.com/factle.app/");
      }}
    />
  );
};

const IconButton = ({ label, icon, onClick, color }) => {
  return (
    <Button
      variant="contained"
      style={{ background: color, width: 218, height: "100%" }}
      onClick={onClick}
      endIcon={icon}
    >
      <Typography style={{ fontWeight: 600, width: "100%" }}>
        {label}
      </Typography>
    </Button>
  );
};

export default observer(
  ({ open, onClose, game, prompt, statisticsPageText, instagamLink }) => {
    const wideScreen = useMediaQuery("(min-width:640px)");

    // force state to update when Factle loads rowPercentile
    // TODO this is hacky
    const [p, setP] = useState(undefined);
    game.onPercentileLoaded = ({ rowPercentile }) => {
      setP(p + 1);
    };

    const timeDifference = getTimeToMidnight();

    // TODO this won't update
    const { wonGames, totalGames, currentStreak, rowPercentile } =
      getStatistics();

    // console.log("wonGames", "totalGames", "currentStreak", "rowPercentile");
    // console.log(wonGames, totalGames, currentStreak, rowPercentile);

    return (
      <Modal open={open} onClose={onClose}>
        <Header />

        {!isNaN(wonGames) && !isNaN(totalGames) ? (
          <SectionBlock>
            <WinningStats
              wonGames={wonGames}
              totalGames={totalGames}
              currentStreak={currentStreak}
            />
          </SectionBlock>
        ) : (
          ""
        )}

        {game.status != GAME_STATUS.IN_PROGRESS ? (
          <SectionBlock>
            <EmojiCard
              game={game}
              prompt={prompt}
              rowPercentile={rowPercentile}
              win={
                currentStreak != undefined &&
                currentStreak != null &&
                currentStreak > 0
              }
            />
          </SectionBlock>
        ) : (
          ""
        )}

        {statisticsPageText ? (
          <SectionBlock>
            <CenteredText>{statisticsPageText}</CenteredText>
          </SectionBlock>
        ) : (
          ""
        )}

        <SectionBlock>
          <Centered>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography style={{ textAlign: "center" }} variant="body1">
                {`Next Factle in ${timeDifference.hours} hours and ${timeDifference.mintues} minutes!`}
              </Typography>
            </div>
          </Centered>
        </SectionBlock>

        {wideScreen ? <SectionBlock topBottomPadding="10px" /> : ""}

        <SectionBlock topBottomPadding="15px">
          <ButtonSection instagamLink={instagamLink} />
        </SectionBlock>
      </Modal>
    );
  }
);
