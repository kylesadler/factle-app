import React from "react";

import Modal from "@mui/material/Modal";
// import ModalUnstyled from "@mui/base/ModalUnstyled";

import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";

export default ({ open, onClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      //   BackdropComponent={Backdrop}
      //   BackdropProps={{
      //     timeout: 500,
      //   }}
    >
      <Fade in={open}>
        <div
          style={{ height: "100vh", width: "100vw", display: "flex" }}
          onClick={onClose}
        >
          {children}
        </div>
      </Fade>
    </Modal>
  );
};
