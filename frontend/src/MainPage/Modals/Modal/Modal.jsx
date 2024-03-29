import React from "react";

import Modal from "@mui/material/Modal";

import Fade from "@mui/material/Fade";
import ModalPaper from "./ModalPaper";

export default ({ open, onClose, children }) => {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            overflow: "scroll",
          }}
          onClick={(event) => {
            if (event.target == event.currentTarget) onClose(event);
          }}
        >
          <ModalPaper>{children}</ModalPaper>
        </div>
      </Fade>
    </Modal>
  );
};
