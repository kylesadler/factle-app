import React, { useState, useEffect } from "react";
import Tile from "../Tile";
import Colors from "../../../Colors";

export default ({
  text,
  onClick,
  disabled = false,
  styles = {},
  textStyle = {},
}) => {
  return (
    <Tile
      text={text}
      onClick={onClick}
      wrapperStyle={{ padding: 3 }}
      tileStyle={{
        borderRadius: 5,
        backgroundColor: disabled ? Colors.GRAY : Colors.LIGHT_GRAY,
        ...styles,
      }}
      textStyle={{
        // color: disabled ? Colors.BLACK : Colors.WHITE,
        ...textStyle,
      }}
    />
  );
};
