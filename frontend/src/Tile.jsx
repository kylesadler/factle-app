import React from "react";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

export default ({ text, onClick, style, textStyle }) => {
  return (
    <div
      style={{
        width: "20%",
        maxWidth: 100,
        height: useMediaQuery("(max-height:600px)") ? 40 : 55,
        minHeight: 40,
        border: "1px solid white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // paddingBottom: 2,
        ...(style || {}),
      }}
      onClick={onClick}
    >
      <Typography
        style={{
          textAlign: "center",
          color: "white",
          width: "90%",
          ...(textStyle || {}),
        }}
        variant="body1"
      >
        {text || ""}
      </Typography>
    </div>
  );
};
