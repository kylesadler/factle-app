import React from "react";
import { observer } from "mobx-react-lite";
import TileRow from "../TileRow";
import KeyboardTile from "./KeyboardTile";

export default observer(({ options, game, onSelect, onBackspace, onEnter }) => {
  // "Keyboard" of option buttons

  const rows = [
    options.slice(0, 5),
    options.slice(5, 10),
    options.slice(10, 15),
    options.slice(15, 20),
  ];

  const lastRow = options.slice(20);

  return (
    <div>
      {rows.map((row, i) => {
        return (
          <TileRow>
            {row.map((option, j) => {
              return (
                <KeyboardTile
                  text={option.text}
                  onClick={() => {
                    onSelect(option);
                  }}
                  styles={
                    game.keyboardColors[option.id]
                      ? { backgroundColor: game.keyboardColors[option.id] }
                      : {}
                  }
                />
              );
            })}
          </TileRow>
        );
      })}
      <TileRow>
        <KeyboardTile
          text={"ENTER"}
          onClick={onEnter}
          styles={{ borderBottomLeftRadius: 17 }}
          textStyle={{ fontSize: "1rem" }}
        />
        {lastRow.map((option) => {
          return (
            <KeyboardTile
              text={option.text}
              onClick={() => {
                onSelect(option);
              }}
              styles={
                game.keyboardColors[option.id]
                  ? { backgroundColor: game.keyboardColors[option.id] }
                  : {}
              }
            />
          );
        })}
        <KeyboardTile
          text={"⌫"}
          onClick={onBackspace}
          styles={{ borderBottomRightRadius: 17 }}
          textStyle={{ fontSize: 25 }}
        />
      </TileRow>
    </div>
  );
});
