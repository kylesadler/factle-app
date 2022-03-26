import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import GameBoard from "./GameBoard/GameBoard";
import Keyboard from "./Keyboard/Keyboard";
import { Link } from "@mui/material";

const PromptBlock = ({ prompt, sourceText, sourceLink, facts }) => {
  return (
    <div>
      <div style={{ margin: "auto", textAlign: "center", padding: "25px 0px" }}>
        <Typography variant="h4" component="div">
          {prompt}
        </Typography>
        {sourceLink && sourceText ? (
          <Link
            href={sourceLink}
            underline="always"
            target="_blank"
            rel="noopener"
            color={"#FFF"}
          >
            <Typography variant="body" component="div">
              {sourceText}
            </Typography>
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const VerticlePadding = () => {
  return <div style={{ minHeight: 10, maxHeight: 20, height: "3vh" }}></div>;
};

export default observer(
  ({ options, prompt, game, sourceText, sourceLink, facts }) => {
    // component of entire factle game board and keyboard
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          maxWidth: "500px",
          width: "95%",
        }}
      >
        <PromptBlock
          prompt={prompt}
          sourceText={sourceText}
          sourceLink={sourceLink}
          facts={facts}
        />
        <GameBoard game={game} />
        <VerticlePadding />
        <Keyboard
          options={options}
          game={game}
          onSelect={(option) => {
            game.onSelect(option);
          }}
          onBackspace={() => {
            game.onBackspace();
          }}
          onEnter={async () => {
            await game.onEnter();
          }}
        />
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <img
            onClick={() => {
              window.open("https://twitter.com/pipedream_labs");
            }}
            style={{ height: 20, cursor: "pointer" }}
            src="dropbyPD.jpeg"
            alt="A drop by Pipedream Lab"
          />
        </div>
        <VerticlePadding />
      </div>
    );
  }
);
