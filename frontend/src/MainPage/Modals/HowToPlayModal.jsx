import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal/Modal";
import BoardTileRow from "../GameInterface/GameBoard/BoardTileRow";
import BoardTile from "../GameInterface/GameBoard/BoardTile";
import Colors from "../../Colors";

import Typography from "@mui/material/Typography";
import { Button, Divider } from "@mui/material";

export default ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ width: "100%" }}>
        <div style={{ margin: "auto", padding: 15, textAlign: "center" }}>
          <Typography style={{ fontWeight: 600 }} variant="h4" gutterBottom>
            How to Play
          </Typography>
        </div>
      </div>
      <div style={{ width: "100%", padding: "9px 0px" }}>
        <Typography variant="body1" gutterBottom>
          Guess the FACTLE in five tries.
        </Typography>

        <Typography variant="body1" gutterBottom>
          For each guess, rank what you think are the top 5 answers. Hit the
          enter button to submit.
        </Typography>

        <Typography variant="body1" gutterBottom>
          After each guess, the color of the tiles will change to show how close
          your guess was to the real ranking.
        </Typography>
      </div>
      <Divider />
      <div style={{ width: "100%", padding: "9px 0px" }}>
        <Typography variant="h5" style={{ fontWeight: 400 }}>
          Examples
        </Typography>
        <div style={{ padding: "5px 0px" }}>
          <BoardTileRow>
            <BoardTile
              text={1}
              color={Colors.GREEN}
              borderColor={Colors.WHITE}
            />
            {[19, 7, 6, 20].map((n) => {
              return <BoardTile text={n} borderColor={Colors.WHITE} />;
            })}
          </BoardTileRow>
        </div>
        <Typography variant="body1" gutterBottom>
          The number 1 is in the ranking and in the right place.
        </Typography>
        <div style={{ padding: "5px 0px" }}>
          <BoardTileRow>
            <BoardTile text={21} borderColor={Colors.WHITE} />
            <BoardTile
              text={4}
              color={Colors.YELLOW}
              borderColor={Colors.WHITE}
            />
            {[12, 8, 26].map((n) => {
              return <BoardTile text={n} borderColor={Colors.WHITE} />;
            })}
          </BoardTileRow>
        </div>
        <Typography variant="body1" gutterBottom>
          The number 4 is in the ranking but in the wrong place.
        </Typography>
      </div>
      <Divider />
      <div style={{ width: "100%", padding: "9px 0px" }}>
        <Typography variant="body1" gutterBottom>
          A new Factle will be available everyday!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Based on Josh Wardle's game, Wordle.
        </Typography>
      </div>
      <div style={{ width: "100%", padding: "9px 0px" }}>
        <Button
          variant="contained"
          style={{ backgroundColor: Colors.GREEN }}
          onClick={onClose}
        >
          Start Playing
        </Button>
      </div>
    </Modal>
  );
};
