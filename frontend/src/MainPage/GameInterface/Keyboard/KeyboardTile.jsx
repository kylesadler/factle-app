import React from "react";
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
  const longText = longestWordLength > 11 || text.length > 25;

  const smallScreen = useMediaQuery("(max-width:522px)");

  let fontSize;
  let padding;
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
          borderRadius: 4,
          padding,
          ...styles,
        }}
        onClick={onClick}
      >
        {/* text */}
        <Typography
          style={{
            textAlign: "center",
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
