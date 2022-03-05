import React from "react";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import Tile from "./Tile";
import TileRow from "./TileRow";

const RankingBlock = ({}) => {
  return (
    <div
      style={{
        margin: "auto",
        textAlign: "center",
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 5,
      }}
    >
      {["1st", "2nd", "3rd", "4th", "5th"].map((string) => {
        return (
          <div style={{ width: 100 }}>
            <Typography variant="h4" style={{ fontWeight: 600 }}>
              {string}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default observer(({ game }) => {
  console.log("board", game.board);
  console.log("row, col", game.row, game.col);
  return (
    <div>
      <RankingBlock />
      {game.board.map((row) => {
        // row is len 5 array of options
        return (
          <TileRow>
            {row.map(({ text, color }) => {
              return (
                <Tile
                  text={text}
                  style={{ backgroundColor: color ? color : "black" }}
                />
              );
            })}
          </TileRow>
        );
      })}
    </div>
  );
});
