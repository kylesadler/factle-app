import React from "react";
import Tile from "../Tile";
import Colors from "../../../Colors";

export default ({ text, color, borderColor, data }) => {
  return (
    <Tile
      text={text}
      data={data}
      wrapperStyle={{ padding: "0px 3px" }}
      textStyle={data ? { fontSize: "12px" } : undefined}
      tileStyle={{
        border: "2px solid " + Colors.DARK_GRAY,
        borderColor: borderColor || color || Colors.DARK_GRAY,
        backgroundColor: color || Colors.BACKGROUND_GRAY,
        justifyContent: data ? "space-evenly" : "center",
      }}
    />
  );
};
