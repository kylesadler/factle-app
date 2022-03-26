import React from "react";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import BoardTileRow from "../GameBoard/BoardTileRow";
import { GAME_STATUS, BOARD_TILE_STATUSES } from "../../../Factle";
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

const statusToColor = {};
statusToColor[BOARD_TILE_STATUSES.CORRECT] = Colors.GREEN;
statusToColor[BOARD_TILE_STATUSES.PRESENT] = Colors.YELLOW;
statusToColor[BOARD_TILE_STATUSES.NOT_PRESENT] = Colors.DARK_GRAY;
export default observer(({ game, facts = [] }) => {
  // console.log("board", game.board);
  // console.log("row, col", game.row, game.col);
  // console.log("solution", game.solution);
  return (
    <div>
      <RankingBlock />
      {game.board.map((row) => {
        // row is len 5 array of options
        return (
          <BoardTileRow>
            {row.map(({ text, status, isActive }) => {
              return (
                <BoardTile
                  text={text}
                  color={statusToColor[status]}
                  borderColor={isActive ? Colors.GRAY_BORDER : undefined}
                />
              );
            })}
          </BoardTileRow>
        );
      })}
      {game.status == GAME_STATUS.LOST || game.status == GAME_STATUS.WON ? (
        <BoardTileRow>
          {game.solution.map(({ text }, i) => {
            return (
              <BoardTile
                text={text}
                data={facts[i]}
                color={"rgb(66, 111, 194)"}
              />
            );
          })}
        </BoardTileRow>
      ) : (
        ""
      )}
    </div>
  );
});
