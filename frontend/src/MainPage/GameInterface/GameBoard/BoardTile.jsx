import React from "react";
import Tile from "../Tile";
import Colors from "../../../Colors";

export default ({ text, color, borderColor = "#3a3a3c" }) => {
  return (
    <Tile
      text={text}
      wrapperStyle={{ padding: "0px 3px" }}
      tileStyle={{
        border: "2px solid #3a3a3c",
        borderColor,
        backgroundColor: color || Colors.BACKGROUND_GRAY,
      }}
      textStyle={{
        color: Colors.WHITE,
      }}
    />
  );
};
