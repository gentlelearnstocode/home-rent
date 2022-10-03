import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';

import styles from './styles';

const InstructionModal = (props) => {
  const { open, message, onClose, toggleModal, firstButtonLabel, secondButtonLabel } = props;

  return (
    <div>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={styles.instructionModalBox}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {message}
          </Typography>
          <div className="flex flex-row space-x-10 absolute bottom-4">
            <Button variant="contained" color="primary" onClick={() => toggleModal(false)}>
              {firstButtonLabel}
            </Button>
            <Button variant="contained" color="error" onClick={() => onClose()}>
              {secondButtonLabel}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

InstructionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  firstButtonLabel: PropTypes.string,
  secondButtonLabel: PropTypes.string
};

export default InstructionModal;
