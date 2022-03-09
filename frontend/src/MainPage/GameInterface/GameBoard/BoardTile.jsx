import React from "react";
import Tile from "../Tile";
import Colors from "../../../Colors";

export default ({ text, color, borderColor }) => {
  return (
    <Tile
      text={text}
      wrapperStyle={{ padding: "0px 3px" }}
      tileStyle={{
        border: "2px solid " + Colors.DARK_GRAY,
        borderColor: borderColor || color || Colors.DARK_GRAY,
        backgroundColor: color || Colors.BACKGROUND_GRAY,
      }}
    />
  );
};
