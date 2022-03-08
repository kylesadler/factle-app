import React from "react";
import Paper from "@mui/material/Paper";

export default ({ children, styles }) => {
  return (
    <Paper
      style={{
        width: "70%",
        maxWidth: 500,
        margin: "auto",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "gray",
        ...styles,
      }}
    >
      {children}
    </Paper>
  );
};
