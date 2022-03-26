import React from "react";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Colors from "../../Colors";

export default ({
  text = "",
  onClick,
  wrapperStyle,
  tileStyle,
  textStyle,
  data,
}) => {
  // data is statistic displayed under the text

  const longestWordLength = Math.max(
    ...text.split(" ").map((word) => word.length)
  );
  const longText = longestWordLength > 11 || text.length > 25;

  // console.log("longText", text, longText);
  // console.log("longestWordLength", text, text.split(" "), longestWordLength);

  const smallScreen = useMediaQuery("(max-width:522px)");

  var fontSize;
  if (longText) {
    if (smallScreen) {
      fontSize = "11px";
    } else {
      fontSize = "12px";
    }
  } else {
    if (smallScreen) {
      fontSize = "0.8rem";
    } else {
      fontSize = "1rem";
    }
  }

  return (
    // tile spacer div
    <div
      style={{
        width: "20%",
        maxWidth: 100,
        boxSizing: "border-box",
        height: useMediaQuery("(max-height:700px)") ? 40 : 55,
        minHeight: 40,
        ...(wrapperStyle || {}),
      }}
    >
      {/* tile div */}
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          // add padding here
          padding: 1,
          ...(tileStyle || {}),
        }}
        onClick={onClick}
      >
        {/* text */}
        <Typography
          style={{
            textAlign: "center",
            // width: "90%",
            lineHeight: 1,
            color: Colors.WHITE,
            fontSize,
            fontWeight: 600,
            ...(textStyle || {}),
          }}
          variant="body1"
        >
          {text}
        </Typography>

        {data ? (
          <Typography
            style={{
              textAlign: "center",
              // width: "90%",
              lineHeight: 1,
              color: Colors.WHITE,
              fontSize: "12px",
              fontWeight: 600,
              // ...(textStyle || {}),
            }}
            variant="body1"
          >
            {data}
          </Typography>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
