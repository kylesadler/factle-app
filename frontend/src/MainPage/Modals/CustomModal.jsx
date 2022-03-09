import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal/Modal";
import BoardTileRow from "../GameInterface/GameBoard/BoardTileRow";
import BoardTile from "../GameInterface/GameBoard/BoardTile";
import Colors from "../../Colors";

import Typography from "@mui/material/Typography";
import { Button, Divider } from "@mui/material";

export default ({ open, onClose, popup }) => {
  const { headerText, messageText, callToActionText, link, buttonColor } =
    popup;
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ width: "100%" }}>
        <div style={{ margin: "auto", padding: 15, textAlign: "center" }}>
          <Typography style={{ fontWeight: 600 }} variant="h4" gutterBottom>
            {headerText}
          </Typography>
        </div>
      </div>
      <div style={{ width: "100%", padding: "9px 0px" }}>
        <Typography variant="body1" gutterBottom>
          {messageText}
        </Typography>
      </div>
      <div
        style={{
          width: "100%",
          padding: "9px 0px",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <div>
          <Button
            variant="contained"
            style={{ backgroundColor: buttonColor || Colors.GREEN }}
            onClick={(event) => {
              event.stopPropagation();
              window.open(link);
            }}
          >
            {callToActionText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
