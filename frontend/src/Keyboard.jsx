import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Tile from "./Tile";
import TileRow from "./TileRow";

const KeyboardTile = ({
  text,
  onClick,
  disabled = false,
  styles = {},
  textStyle = {},
}) => {
  return (
    <div style={{ padding: 3, width: "20%", maxWidth: "100px" }}>
      <Tile
        text={text}
        onClick={onClick}
        style={{
          borderRadius: 5,
          backgroundColor: "rgba(110, 110, 110, 1)",
          width: "100%",
          height: "100%",

          ...styles,
          ...(disabled ? { backgroundColor: "rgb(58, 58, 59)" } : {}),
        }}
        textStyle={{
          ...textStyle,
          ...(disabled ? { color: "rgb(110, 110, 110)" } : {}),
        }}
      />
    </div>
  );
};

export default observer(({ options, game, onSelect, onBackspace, onEnter }) => {
  // "Keyboard" of option buttons

  const rows = [
    // probably better way to do this
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
                  //   styles={{
                  //     ...(i == 0 && j == 0 ? { borderTopLeftRadius: 17 } : {}),
                  //     ...(i == 0 && j == 4 ? { borderTopRightRadius: 17 } : {}),
                  //   }}
                  styles={
                    game.keyboardColors[option.id]
                      ? { backgroundColor: game.keyboardColors[option.id] }
                      : {}
                  }
                  disabled={game.disabledKeys[option.id]}
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
              disabled={game.disabledKeys[option.id]}
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
