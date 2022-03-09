import React from "react";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Colors from "../../Colors";

export default ({ text, onClick, wrapperStyle, tileStyle, textStyle }) => {
  return (
    // tile spacer div
    <div
      style={{
        width: "20%",
        maxWidth: 100,
        boxSizing: "border-box",
        height: useMediaQuery("(max-height:600px)") ? 40 : 55,
        minHeight: 40,
        ...(wrapperStyle || {}),
      }}
    >
      {/* tile div */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          // add padding here
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
            fontWeight: 600,
            ...(textStyle || {}),
          }}
          variant="body1"
        >
          {text || ""}
        </Typography>
      </div>
    </div>
  );
};
