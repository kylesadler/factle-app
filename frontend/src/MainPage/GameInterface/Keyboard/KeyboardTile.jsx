import React, { useState, useEffect } from "react";
import Tile from "../Tile";
import Colors from "../../../Colors";
import { Button, Typography, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";

const ColorButton = styled(Button)(({ theme }) => ({
  color: Colors.DARK_GRAY,
  backgroundColor: Colors.LIGHT_GRAY,
  "&:hover": {
    backgroundColor: Colors.INCORRECT_GRAY,
  },
}));

export default ({ text = "", onClick, styles = {}, textStyle = {} }) => {
  const longestWordLength = Math.max(
    ...text.split(" ").map((word) => word.length)
  );
  const longText = longestWordLength > 11 || text.length > 30;

  // console.log("longText", text, longText);
  // console.log("longestWordLength", text, text.split(" "), longestWordLength);

  const smallScreen = useMediaQuery("(max-width:522px)");

  var fontSize;
  var padding;
  if (longText) {
    if (smallScreen) {
      fontSize = "11px";
      padding = 0;
    } else {
      fontSize = "12px";
      padding = 5;
    }
  } else {
    if (smallScreen) {
      fontSize = "0.7rem";
      padding = 5;
    } else {
      fontSize = "0.8rem";
      padding = "5px 10px";
    }
  }

  return (
    <div
      style={{
        width: "20%",
        maxWidth: 100,
        boxSizing: "border-box",
        height: useMediaQuery("(max-height:600px)") ? 40 : 55,
        minHeight: 40,
        padding: 3,
      }}
    >
      {/* tile div */}
      <ColorButton
        disableRipple
        variant="contained"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",

          // add padding here
          borderRadius: 4,
          // backgroundColor: Colors.LIGHT_GRAY,

          padding,
          ...styles,
        }}
        onClick={onClick}
      >
        {/* text */}
        <Typography
          style={{
            textAlign: "center",
            // width: "90%",
            color: Colors.WHITE,
            fontWeight: 600,
            fontSize,
            lineHeight: 1,
            ...(styles.backgroundColor == Colors.DARK_GRAY
              ? { color: Colors.INCORRECT_GRAY }
              : {}),
            ...textStyle,
          }}
          variant="body1"
        >
          {text || ""}
        </Typography>
      </ColorButton>
    </div>
  );
};
