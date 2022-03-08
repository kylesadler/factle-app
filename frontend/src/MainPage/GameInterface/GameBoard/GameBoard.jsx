import React from "react";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import BoardTileRow from "../GameBoard/BoardTileRow";
import { GAME_STATUS } from "../../../Factle";
import Colors from "../../../Colors";
import BoardTile from "./BoardTile";

const RankingBlock = () => {
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
  //   console.log("board", game.board);
  //   console.log("row, col", game.row, game.col);
  //   console.log("solution", game.solution);
  return (
    <div>
      <RankingBlock />
      {game.board.map((row) => {
        // row is len 5 array of options
        return (
          <BoardTileRow>
            {row.map(({ text, color }) => {
              return <BoardTile text={text} color={color} />;
            })}
          </BoardTileRow>
        );
      })}
      {game.status == GAME_STATUS.LOST ? (
        <BoardTileRow>
          {game.solution.map((text) => {
            return <BoardTile text={text} color={Colors.GREEN} />;
          })}
        </BoardTileRow>
      ) : (
        ""
      )}
    </div>
  );
});
