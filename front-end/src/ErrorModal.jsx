import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: 4,
  outline: 0,
};

export const ErrorModal = ({ message, show, setShow }) => {
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  return (
    <div>
      <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Error
          </Typography>
          <Typography sx={{ mt: 2 }}>{message}</Typography>
        </Box>
      </Modal>
    </div>
  );
};
