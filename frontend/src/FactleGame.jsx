import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import GameBoard from "./GameBoard";
import Keyboard from "./Keyboard";

const PromptBlock = ({ prompt }) => {
  return (
    <div>
      <div style={{ margin: "auto", textAlign: "center", padding: "25px 0px" }}>
        <Typography variant="h4" component="div">
          {prompt}
        </Typography>
      </div>
    </div>
  );
};

const VerticlePadding = () => {
  return <div style={{ minHeight: 10, maxHeight: 20, height: "3vh" }}></div>;
};

export default observer(({ options, prompt, game }) => {
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
      <PromptBlock prompt={prompt} />
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
        onEnter={() => {
          game.onEnter();
        }}
      />
      <VerticlePadding />
    </div>
  );
});